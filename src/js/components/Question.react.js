import React, { PropTypes } from 'react'
import Radium from 'radium'
import AppStore from '../stores/AppStore'
import LoadingScreen from './LoadingScreen.react'
import componentWidthMixin from 'react-component-width-mixin'
import TransitionHook from '../mixins/TransitionHook'
import ConnectToStores from '../mixins/ConnectToStores'
import CallbackManager from '../utils/CallbackManager'
const callbackManager = CallbackManager()

import Button from './Button.react'
import PrevNext from './PrevNextButtons.react'
import ResponsiveImageImport from './ResponsiveImage.react'
const ResponsiveImage = Radium(ResponsiveImageImport)

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
  return true
  // setTimeout(call.resolve, 900);
}

var Question = Radium(React.createClass({

  propTypes: {
    roundId: PropTypes.string,
    questionId: PropTypes.string
  },

  getInitialState() {
    return {
      imgsReady: false,
      test: true
    }
  },

  mixins: [
    ConnectToStores([AppStore], getState),
    componentWidthMixin,
    TransitionHook(transitionHook)
  ],

  componentWillReceiveProps(nextProps) {
    if (this.props.roundId !== nextProps.roundId ||
        this.props.questionId !== nextProps.questionId) {
      this.setState({
        imgsReady: false
      })
      callbackManager.reset()
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

  _handleClick() {
    this.setState({
      test: !this.state.test
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

    var imgs = {}
    const imgLabels = Object.keys(this.state.question.imgs)

    imgLabels.forEach((label) => {
      let img = this.state.question.imgs[label]
      let imgProps = {
        srcs: img.srcs,
        aspectRatio: img.aspectRatio,
        onLoad: this._handleImgLoaded(label)
      }
      imgs[label] = (
        <ResponsiveImage {...imgProps}/>
      )
    })

    return (
      <div className={this.constructor.displayName}>
        Round: {this.state.round.title} | Question: {this.state.question.questionId}

        {imgs.a}
        {imgs.mix}
        {imgs.b}

        <button onClick={this._handleClick}>{this.state.test ? 'toggle on' : 'toggle off'}</button>

        <br/>
        {prevNext}
        {this.state.question.extra ? this.state.question.extra : null}
      </div>
    )
  }

}))

export default Question
