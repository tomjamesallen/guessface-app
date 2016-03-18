import React, { PropTypes } from 'react'

import Question from './Question.react'

var ExampleContainer = React.createClass({

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
        <Question roundId={this.props.params.roundId} questionId='e'/>
      </div>
    )
  }
})

export default ExampleContainer
