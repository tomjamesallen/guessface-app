import React from 'react';
import Radium from 'radium';
import AppStore from '../stores/AppStore';
import componentWidthMixin from 'react-component-width-mixin';
import TransitionHook from '../mixins/TransitionHook';
import ConnectToStores from '../mixins/ConnectToStores';
import CheckShouldRedirect from '../mixins/CheckShouldRedirect';

function getState(props) {

  const round = AppStore.getRound(props.roundId);
  const question = AppStore.getQuestion(props.roundId, props.questionId);
  const dataReady = AppStore.isDataReady();

  return {
    round,
    question,
    dataReady
  };
};

function shouldRedirect(props, state) {
  // If we don't have the round then redirect to the home page.
  if (state.dataReady && !state.round) return '/';
  if (state.dataReady && !state.question) return `/round/${props.roundId}`;
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
        Round: {this.state.round.title} | Question: {this.props.questionId}
        <br/>
        {this.state.question.extra ? this.state.question.extra : null}
      </div>
    );
  }

}));

export default Question;
