/* global getComputedStyle */

import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import Radium from 'radium'
import AppStore from '../stores/AppStore'
import LoadingScreen from './LoadingScreen.react'
import componentWidthMixin from 'react-component-width-mixin'
import TransitionHook from '../mixins/TransitionHook'
import ConnectToStores from '../mixins/ConnectToStores'
import CallbackManager from '../utils/CallbackManager'
const callbackManager = CallbackManager()
import SizingVars from '../constants/SizingVars'
import u from '../helpers/unit'
import BT from '../constants/BaseTypeStyles'
import Color from 'color'
import Colors from '../constants/ThemeColors'
import AnimationConstants from '../constants/AnimationConstants'
import whichTransitionEvent from '../helpers/whichTransitionEvent'

import Button from './Button.react'
import PrevNext from './PrevNextButtons.react'
import ResponsiveImageImport from './ResponsiveImage.react'
const ResponsiveImage = Radium(ResponsiveImageImport)

let ComponentRef
// let isTransitioning = false

function noop() {}

function addRemoveListener(el, callback = noop) {
  function listener() {
    el.removeEventListener(whichTransitionEvent(), listener)
    callback(el)
  }
  el.addEventListener(whichTransitionEvent(), listener)
}

let lastRequestionState
function updateQuestionState(targetState, callback = noop) {
  if (!ComponentRef) return
  let el

  if (targetState === 'answer-stage-2' &&
      lastRequestionState !== 'answer-stage-1') {
    return
  }

  lastRequestionState = targetState

  ComponentRef.setState({
    questionStateTarget: targetState
  })

  if (targetState === 'ready' ||
      targetState === 'complete') {
    el = ReactDOM.findDOMNode(ComponentRef.refs.imgsWrapper)
  }
  else if (targetState === 'question' ||
           targetState === 'answer-stage-1' ||
           targetState === 'answer-stage-2') {
    el = ReactDOM.findDOMNode(ComponentRef.refs.imgWrapper)
  }

  function onTransitionComplete() {
    ComponentRef.setState({
      questionStateCurrent: targetState
    })
    if (targetState === 'answer-stage-1') {
      updateQuestionState('answer-stage-2', callback)
    }
    else {
      callback(el, targetState)
    }
  }

  if (el) {
    addRemoveListener(el, () => {
      onTransitionComplete()
    })
  }
  else {
    onTransitionComplete()
  }
}

function getState(props, that) {
  var state = that ? that.state : {}
  var _roundId = parseInt(props.roundId, 10) - 1
  var _questionId = props.questionId
  if (_questionId !== 'e') _questionId = parseInt(_questionId, 10) - 1

  const round = AppStore.getRound(_roundId)
  const question = AppStore.getQuestion(_roundId, _questionId)
  const dataReady = AppStore.isDataReady()
  const roundId = round ? round.roundId : null
  const questionId = question ? question.questionId : null

  return {
    round,
    question,
    dataReady,
    roundId,
    questionId,
    questionStateCurrent: state.questionStateCurrent || 'load',
    questionStateTarget: state.questionStateTarget || 'load'
  }
}

function transitionHook(call) {
  if (ComponentRef.state.questionStateCurrent !== 'complete') {
    // isTransitioning = true
    updateQuestionState('complete', () => {
      // isTransitioning = false
      call.resolve()
    })
  }
  else {
    call.resolve()
  }
}

function resetQuestionState() {
  updateQuestionState('load')
  setTimeout(() => {
    updateQuestionState('ready')
  }, 1)
}

var Question = Radium(React.createClass({

  propTypes: {
    roundId: PropTypes.string,
    questionId: PropTypes.string,
    initialComponentWidth: PropTypes.number
  },

  contextTypes: {
    router: PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {
      initialComponentWidth: null
    }
  },

  mixins: [
    ConnectToStores([AppStore], getState),
    componentWidthMixin,
    TransitionHook(transitionHook)
  ],

  componentWillMount() {
    ComponentRef = this
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.roundId !== nextProps.roundId ||
        this.props.questionId !== nextProps.questionId) {
      this.setState({
        imgsReady: false
      })
      callbackManager.reset()
      resetQuestionState()
    }
  },

  _handleImgLoaded(ref) {
    callbackManager.register(ref)
    return (imgComponent) => {
      callbackManager.complete(ref, (refs) => {
        this.setState({
          imgsReady: true
        })
      })
    }
  },

  _getSaveComponentHeight() {
    var component = ReactDOM.findDOMNode(this.refs.component)
    if (!getComputedStyle) return
    var height = parseFloat(getComputedStyle(component).height)
    if (height !== this.state.componentHeight) {
      this.setState({
        componentHeight: height
      })
    }
  },

  componentDidMount() {
    this._getSaveComponentHeight()
    updateQuestionState('ready')
    addEventListener('keydown', this._onKeyPress)
  },

  componentWillUnmount() {
    removeEventListener('keydown', this._onKeyPress)
  },

  componentWillUpdate(nextProps, nextState) {},

  componentDidUpdate() {
    this._getSaveComponentHeight()
  },

  _goto(state) {
    return () => {
      updateQuestionState(state)
    }
  },

  _advanceState() {
    const currentState = this.state.questionStateTarget

    if (currentState === 'ready') {
      updateQuestionState('question')
    }
    if (currentState === 'question') {
      updateQuestionState('answer-stage-1')
    }
    if (currentState === 'answer-stage-1' || currentState === 'answer-stage-2') {
      this._gotoNextQuestion()
    }
  },

  _gotoPrevQuestion() {
    if (this.state.questionId === 'e') {
      console.log('go to prev round')
    }
    else if (this.state.questionId === 0) {
      let path = AppStore.getQuestionPath(this.state.roundId, 'e')
      this.context.router.push(path)
    }
    else {
      let path = AppStore.getQuestionPath(this.state.roundId, this.state.questionId - 1)
      if (path) {
        this.context.router.push(path.pathname)
      }
    }
  },

  _gotoNextQuestion() {
    if (this.state.questionId === 'e') {
      let path = AppStore.getQuestionPath(this.state.roundId, 0)
      this.context.router.push(path)
    }
    else {
      let path = AppStore.getQuestionPath(this.state.roundId, this.state.questionId + 1)
      if (path) {
        this.context.router.push(path.pathname)
      }
      else {
        let path = AppStore.getRoundPath(this.state.roundId + 1)
        if (path) {
          this.context.router.push(path.pathname)
        }
      }
    }
  },

  _onKeyPress(e) {
    if (e.which === 32) {
      this._advanceState()
    }
    if (e.which === 37) {
      this._gotoPrevQuestion()
    }
    if (e.which === 39) {
      this._gotoNextQuestion()
    }
  }, 

  /**
   * Render the App component.
   * @return {object}
   */
  render() {
    if (!this.state.dataReady) return <LoadingScreen/>
    if (!this.state.question) return <div>Question not found</div>

    // Styling.
    var styles = {
      base: {
        width: '100%',
        height: '100%'
      },
      imgsWrapper: {
        width: '100%',
        height: '100%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: `all ${AnimationConstants.medLong} ${AnimationConstants.easing}`
      },
      imgWrapper: {
        base: {
          width: '50%',
          paddingBottom: `calc(50% - ${u(SizingVars.unit * 0.75)})`,
          position: 'relative',
          boxShadow: `1px 1px 1px 0 ${Color(Colors.primary).clearer(0.7).rgbString()}`,
          transition: `all ${AnimationConstants.medLong} ${AnimationConstants.easing}`
        },
        a: {
          marginRight: u(SizingVars.unit * 0.75)
        },
        b: {
          marginLeft: u(SizingVars.unit * 0.75)
        }
      },
      imgWrapperInner: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.secondary
      },
      img: {
        base: {
          position: 'absolute',
          width: `calc(100% - ${u(SizingVars.unit)})`,
          height: `calc(100% - ${u(SizingVars.unit)})`,
          top: u(SizingVars.unit / 2),
          left: u(SizingVars.unit / 2),
          transition: `all ${AnimationConstants.long} ${AnimationConstants.easing}`
        },
        a: {
          opacity: 0
        },
        b: {
          opacity: 0
        },
        mix: {
          opacity: 0
        },
        logo: {
          backgroundImage: 'url(/imgs/Logo-inner.svg)',
          backgroundSize: '75%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
      },
      responsiveImgComponent: {},
      label: [
        BT.p,
        {
          position: 'absolute',
          bottom: u(-SizingVars.unit * 2),
          marginBottom: 0,
          width: '100%',
          display: 'block',
          textAlign: 'center',
          opacity: 0,
          transition: `all ${AnimationConstants.long} ${AnimationConstants.easing}`
        }
      ],
      bracket: {
        base: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 10,
          transition: `all ${AnimationConstants.medLong} ${AnimationConstants.easing}`
        },
        left: {
          left: -1
        },
        right: {
          right: -1
        },
        base__inner: {
          width: '20%',
          height: '100%',
          position: 'absolute',
          borderTop: `${u(SizingVars.unit / 2)} solid ${Colors.primary}`,
          borderBottom: `${u(SizingVars.unit / 2)} solid ${Colors.primary}`
        },
        left__inner: {
          left: 0,
          borderLeft: `${u(SizingVars.unit * 0.75)} solid ${Colors.primary}`
        },
        right__inner: {
          right: 0,
          borderRight: `${u(SizingVars.unit * 0.75)} solid ${Colors.primary}`
        }
      },
      infoWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 200
      },
      buttonsWrapper: {
        position: 'absolute',
        width: '100%',
        bottom: u(-SizingVars.unit * 3.5),
        left: 0,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'space-between'
      },
      prevNext: {
        display: 'inline-block',
        marginRight: u(SizingVars.unit / 2)
      },
      stateButtonsWrapper: {
        marginLeft: 'auto'
      },
      button: {
        display: 'inline-block',
        marginRight: u(SizingVars.unit / 2)
      }
    }

    // Dynamically adjust styles.
    if (this.state.componentWidth && this.state.componentHeight) {
      let componentAspect = this.state.componentHeight / this.state.componentWidth
      let requiredAspect = 0.5
      if (componentAspect <= requiredAspect) {
        styles.imgsWrapper.width = `${componentAspect / requiredAspect * 100}%`
      }
    }

    switch (this.state.questionStateTarget) {
      case 'load':
        styles.imgsWrapper.transform = window.innerWidth ? `translateX(-${window.innerWidth}px)` : 'translateX(-200%)'
        styles.imgsWrapper.transition = 'none'
        styles.imgWrapper.a.transform = `translateX(calc(50% + ${u(SizingVars.unit * 0.75)}))`
        styles.imgWrapper.b.transform = `translateX(calc(-50% - ${u(SizingVars.unit * 0.75)}))`
        break

      case 'ready':
        styles.imgWrapper.a.transform = `translateX(calc(50% + ${u(SizingVars.unit * 0.75)}))`
        styles.imgWrapper.b.transform = `translateX(calc(-50% - ${u(SizingVars.unit * 0.75)}))`
        break

      case 'question':
        styles.imgWrapper.a.transform = `translateX(calc(50% + ${u(SizingVars.unit * 0.75)}))`
        styles.imgWrapper.b.transform = `translateX(calc(-50% - ${u(SizingVars.unit * 0.75)}))`
        styles.img.mix.opacity = 1
        break

      case 'answer-stage-1':
        styles.img.mix.opacity = 1
        styles.bracket.left.transform = `translateX(calc(-100% - ${u(SizingVars.unit * 1.5)}))`
        break

      case 'answer-stage-2':
        styles.img.mix.opacity = 1
        styles.img.a.opacity = 1
        styles.img.b.opacity = 1
        styles.label.push({
          opacity: 1
        })
        styles.bracket.left.transform = `translateX(calc(-100% - ${u(SizingVars.unit * 1.5)}))`
        break

      case 'complete':
        styles.imgsWrapper.transform = window.innerWidth ? `translateX(${window.innerWidth}px)` : 'translateX(-200%)'
        styles.imgWrapper.a.transform = `translateX(calc(50% + ${u(SizingVars.unit * 0.75)}))`
        styles.imgWrapper.b.transform = `translateX(calc(-50% - ${u(SizingVars.unit * 0.75)}))`
        break

      default:
        break
    }

    // Create prevNext buttons.
    let prevNext
    if (this.state.questionId === 'e') {
      let path = AppStore.getQuestionPath(this.state.roundId, 0)
      prevNext = (
        <div>
          <Button style={styles.prevNext} to={AppStore.getRoundPath(this.state.roundId)}>back</Button>
          <Button style={styles.prevNext} to={path}>start round</Button>
        </div>
      )
    }
    else {
      prevNext = <PrevNext style={styles.prevNext}/>
    }

    // Create image components.
    var imgs = {}
    const imgLabels = Object.keys(this.state.question.imgs)
    imgLabels.forEach((label) => {
      let img = this.state.question.imgs[label]
      let imgProps = {
        srcs: img.srcs,
        aspectRatio: img.aspectRatio,
        onLoad: this._handleImgLoaded(label),
        style: styles.responsiveImgComponent
      }
      imgs[label] = (
        <div style={[styles.img.base, styles.img[label]]}>
          <ResponsiveImage {...imgProps} className={label}/>
        </div>
      )
    })

    return (
      <div className={this.constructor.displayName} style={styles.base} ref='component'>
        <div style={styles.infoWrapper}/>

        <div style={styles.imgsWrapper} ref='imgsWrapper'>
          <div style={[styles.imgWrapper.base, styles.imgWrapper.a]} ref='imgWrapper'>
            <div style={styles.imgWrapperInner}>
              <div style={[styles.img.base, styles.img.logo]}/>
              {imgs.mix}
              {imgs.a}
            </div>
            <div style={styles.label}>{this.state.question.a}</div>
          </div>
          <div style={[styles.imgWrapper.base, styles.imgWrapper.b]}>
            <div style={styles.imgWrapperInner}>
              <div style={[styles.img.base, styles.img.logo]}/>
              {imgs.mix}
              {imgs.b}
              <div style={[styles.bracket.base, styles.bracket.left]}>
                <div style={[styles.bracket.base__inner, styles.bracket.left__inner]}/>
              </div>
              <div style={[styles.bracket.base, styles.bracket.right]}>
                <div style={[styles.bracket.base__inner, styles.bracket.right__inner]}/>
              </div>
            </div>
            <div style={styles.label}>{this.state.question.b}</div>
          </div>
        </div>

        <div style={styles.buttonsWrapper}>
          {prevNext}
          <div style={styles.stateButtonsWrapper}>
            <Button style={styles.button} onClick={this._goto('question')}>question</Button>
            <Button style={styles.button} onClick={this._goto('answer-stage-1')}>answer</Button>
          </div>
        </div>
      </div>
    )
  }

}))

export default Question
