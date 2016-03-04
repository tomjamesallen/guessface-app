import React from 'react';
import Radium from 'radium';
import AppStore from '../stores/AppStore';
import LoadingScreen from './LoadingScreen.react';
import Button from './Button.react';
import componentWidthMixin from 'react-component-width-mixin';
import TransitionHook from '../mixins/TransitionHook';
import ConnectToStores from '../mixins/ConnectToStores';

function getState(props) {

  var _roundId = parseInt(props.roundId, 10) - 1;
  var _questionId = props.questionId;
  if (_questionId !== 'e') _questionId = parseFloat(_questionId, 10) - 1;

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

    var prevQuestionButton;
    var prevQuestionPath;

    if (this.state.questionId !== 'e' && AppStore.getQuestion(this.state.roundId, this.state.questionId - 1)) {
      prevQuestionPath = `/round/${this.state.roundId+1}/${this.state.questionId}`;
    }

    if (prevQuestionPath) {
      prevQuestionButton = <Button href={prevQuestionPath}>Prev</Button>
    }

    var nextQuestionButton;
    var nextQuestionPath;

    if (this.state.questionId === 'e' && AppStore.getQuestion(this.state.roundId, 0)) {
      nextQuestionPath = `/round/${this.state.roundId+1}/1`;
    }
    else if (AppStore.getQuestion(this.state.roundId, this.state.questionId + 1)) {
      nextQuestionPath = `/round/${this.state.roundId+1}/${this.state.questionId + 2}`;
    }

    if (nextQuestionPath) {
      nextQuestionButton = <Button href={nextQuestionPath}>Next</Button>
    }

    return (
      <div>
        Round: {this.state.round.title} | Question: {this.props.questionId}
        <br/>
        {prevQuestionButton}
        {nextQuestionButton}
        {this.state.question.extra ? this.state.question.extra : null}
      </div>
    );
  }

}));

export default Question;
