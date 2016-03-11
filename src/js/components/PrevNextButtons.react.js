import React from 'react'
import Radium from 'radium'
import AppStore from '../stores/AppStore'
import RouteStore from '../stores/RouteStore'
import SizingVars from '../constants/SizingVars'
const rem = require('../helpers/units').Rem()
import Button from './Button.react'
import ConnectToStores from '../mixins/ConnectToStores'

function getState(props) {
  const route = RouteStore.getRoute()
  var _roundId = parseInt(route.params.roundId, 10) - 1
  var _questionId = route.params.questionId
  if (_questionId !== 'e') _questionId = parseFloat(_questionId, 10) - 1

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

var PrevNextButtons = Radium(React.createClass({

  mixins: [
    ConnectToStores([AppStore, RouteStore], getState)
  ],

  /**
   * Render the App component.
   * @return {object}
   */
  render() {
    // Shared button styles.
    var sharedStyle = {}

    // Prev button.
    var prevQuestionButton
    var prevQuestionPath
    var prevButtonStyle = [
      sharedStyle, {
        marginRight: rem(SizingVars.unit / 2)
      }
    ]

    if (this.state.questionId !== 'e' && AppStore.getQuestion(this.state.roundId, this.state.questionId - 1)) {
      prevQuestionPath = `/round/${this.state.roundId + 1}/${this.state.questionId}`
    }

    if (prevQuestionPath) {
      prevQuestionButton = <Button style={prevButtonStyle} href={prevQuestionPath}>prev</Button>
    }

    // Next button.
    var nextQuestionButton
    var nextQuestionPath
    var nextButtonStyle = [
      sharedStyle, {}
    ]

    if (this.state.questionId === 'e' && AppStore.getQuestion(this.state.roundId, 0)) {
      nextQuestionPath = AppStore.getQuestionPath(this.state.roundId, 0).pathname
    }
    else if (AppStore.getQuestion(this.state.roundId, this.state.questionId + 1)) {
      nextQuestionPath = AppStore.getQuestionPath(this.state.roundId, this.state.questionId + 1).pathname
    }

    if (nextQuestionPath) {
      nextQuestionButton = <Button style={nextButtonStyle} href={nextQuestionPath}>next</Button>
    }

    // Output.
    return (
      <div className={this.constructor.displayName}>
        {prevQuestionButton}
        {nextQuestionButton}
      </div>
    )
  }

}))

export default PrevNextButtons
