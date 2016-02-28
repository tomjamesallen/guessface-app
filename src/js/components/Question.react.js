import React from 'react';
import Radium from 'radium';

import componentWidthMixin from 'react-component-width-mixin';
import TransitionHook from '../mixins/TransitionHook';

function transitionHook(call) {
  return true;
  // setTimeout(call.resolve, 900);
};

var Question = Radium(React.createClass({

  mixins: [
    componentWidthMixin,
    TransitionHook(transitionHook)
  ],

  /**
   * Render the App component.
   * @return {object}
   */
  render() {

    console.log(this.props);

    return (
      <div>
        Round: {this.props.roundId} | Question: {this.props.questionId}
      </div>
    );
  }

}));

export default Question;
