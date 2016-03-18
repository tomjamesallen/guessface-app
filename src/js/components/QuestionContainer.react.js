import React, { PropTypes } from 'react'

import Question from './Question.react'

var QuestionContainer = React.createClass({

  propTypes: {
    params: PropTypes.object
  },

  /**
   * Render the App component.
   * @return {object}
   */
  render() {
    return (
      <div className={this.constructor.displayName}>
        <Question roundId={this.props.params.roundId} questionId={this.props.params.questionId}/>
      </div>
    )
  }

})

export default QuestionContainer
