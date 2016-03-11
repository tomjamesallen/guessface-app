import React from 'react';
import Radium from 'radium';
import AppStore from '../stores/AppStore';
import LoadingScreen from './LoadingScreen.react';
import componentWidthMixin from 'react-component-width-mixin';
import TransitionHook from '../mixins/TransitionHook';
import ConnectToStores from '../mixins/ConnectToStores';

import Button from './Button.react';
import PrevNext from './PrevNextButtons.react';

function getState(props) {

  var _roundId = parseInt(props.roundId, 10) - 1;
  var _questionId = props.questionId;
  if (_questionId !== 'e') _questionId = parseInt(_questionId, 10) - 1;

  const round = AppStore.getRound(_roundId);
  const question = AppStore.getQuestion(_roundId, _questionId);
  const dataReady = AppStore.isDataReady();
  const roundId = round ? round.roundId : null;
  const questionId = question ? question.questionId : null;

  return {
    round,
    question,
    dataReady,
    roundId,
    questionId
  };
};

function transitionHook(call) {
  return true;
  // setTimeout(call.resolve, 900);
};

var Question = Radium(React.createClass({

  mixins: [
    ConnectToStores([AppStore], getState),
    componentWidthMixin,
    TransitionHook(transitionHook)
  ],

  /**
   * Render the App component.
   * @return {object}
   */
  render() {

    if (!this.state.dataReady) return <LoadingScreen/>;
    if (!this.state.question) return <div>Question not found</div>;

    return (
      <div className={this.constructor.displayName}>
        Round: {this.state.round.title} | Question: {this.state.question.questionId}
        <br/>
        <PrevNext />
        {this.state.question.extra ? this.state.question.extra : null}
      </div>
    );
  }

}));

export default Question;
