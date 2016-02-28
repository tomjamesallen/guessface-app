import React from 'react';

import Question from './Question.react';

var ExampleContainer = React.createClass({

  /**
   * Render the App component.
   * @return {object}
   */
  render() {

    return (
      <div>
        <Question roundId={this.props.params.roundId} questionId="e"/>
      </div>
    );
  }

});

export default ExampleContainer;
