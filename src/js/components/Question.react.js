import React from 'react';
import Radium from 'radium';
import AppStore from '../stores/AppStore';
import componentWidthMixin from 'react-component-width-mixin';
import TransitionHook from '../mixins/TransitionHook';
import ConnectToStores from '../mixins/ConnectToStores';
import CheckShouldRedirect from '../mixins/CheckShouldRedirect';

function getState(props) {

  // const round = AppStore.getRound(props)
  const question = {};

  return {
    question
  };
};

function shouldRedirect(props, componentThis, callLater) {

  // console.log(componentThis);

  // If we don't have the round then redirect to the home page.
  // if (!componentThis.state.round) return '/';

  // setTimeout(callLater, 1000);
};


function transitionHook(call) {
  return true;
  // setTimeout(call.resolve, 900);
};

var Question = Radium(React.createClass({

  mixins: [
  ConnectToStores([AppStore], getState),
    CheckShouldRedirect(shouldRedirect),
    componentWidthMixin,
    TransitionHook(transitionHook)
  ],

  /**
   * Render the App component.
   * @return {object}
   */
  render() {

    return (
      <div>
        Round: {this.props.roundId} | Question: {this.props.questionId}
      </div>
    );
  }

}));

export default Question;
