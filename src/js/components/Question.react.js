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

function getState(props) {
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
    questionId
  }
}

function transitionHook(call) {
  let animationRef = ReactDOM.findDOMNode(ComponentRef.refs.imgsWrapper)
  function onAnimationComplete() {
    animationRef.removeEventListener(whichTransitionEvent(), onAnimationComplete)
    call.resolve()
  }
  if (ComponentRef.state.questionState !== 'complete') {
    animationRef.addEventListener(whichTransitionEvent(), onAnimationComplete)
    ComponentRef.setState({
      questionState: 'complete'
    })
  }
}

var Question = Radium(React.createClass({

  propTypes: {
    roundId: PropTypes.string,
    questionId: PropTypes.string,
    initialComponentWidth: PropTypes.number
  },

  getDefaultProps() {
    return {
      initialComponentWidth: null
    }
  },

  getInitialState() {
    return {
      imgsReady: false,
      componentHeight: null,
      componentWidth: null,

      // 'load', 'ready', 'question', 'answer-stage-1', 'answer-stage-2',
      // 'complete'
      questionState: 'load'
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
      this.setState({
        questionState: 'load'
      })
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
  },

  componentWillUpdate(nextProps, nextState) {
    var that = this
    let animationRef = ReactDOM.findDOMNode(ComponentRef.refs.imgLeft)
    function onAnimationComplete() {
      animationRef.removeEventListener(whichTransitionEvent(), onAnimationComplete)
      that.setState({
        questionState: 'answer-stage-2'
      })
    }
    if (nextState.questionState === 'answer-stage-1') {
      animationRef.addEventListener(whichTransitionEvent(), onAnimationComplete)
    }
  },

  _setReadyState() {
    this.setState({
      questionState: 'ready'
    })
  },

  componentDidUpdate() {
    this._getSaveComponentHeight()
    if (this.state.questionState === 'load') {
      setTimeout(this._setReadyState, 10)
    }
  },

  _gotoQuestion() {
    this.setState({
      questionState: 'question'
    })
  },

  _gotoAnswer() {
    this.setState({
      questionState: 'answer-stage-1'
    })
  },

  /**
   * Render the App component.
   * @return {object}
   */
  render() {
    if (!this.state.dataReady) return <LoadingScreen/>
    if (!this.state.question) return <div>Question not found</div>

    let prevNext
    if (this.state.questionId === 'e') {
      let path = AppStore.getQuestionPath(this.state.roundId, 0)
      prevNext = <Button to={path}>start round</Button>
    }
    else {
      prevNext = <PrevNext />
    }

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
          left: 0
        },
        right: {
          right: 0
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
        bottom: 0,
        left: 0,
        zIndex: 200
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

    switch (this.state.questionState) {
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

    console.log(this.state)

    return (
      <div className={this.constructor.displayName} style={styles.base} ref='component'>
        <div style={styles.infoWrapper}/>

        <div style={styles.imgsWrapper} ref='imgsWrapper'>
          <div style={[styles.imgWrapper.base, styles.imgWrapper.a]} ref='imgLeft'>
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
          <button onClick={this._gotoQuestion}>Question</button>
          <button onClick={this._gotoAnswer}>Answer</button>
        </div>
      </div>
    )
  }

}))

export default Question
