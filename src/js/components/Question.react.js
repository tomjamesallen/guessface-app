import React from 'react';
import Radium from 'radium';
import AppStore from '../stores/AppStore';
import LoadingScreen from './LoadingScreen.react';
import componentWidthMixin from 'react-component-width-mixin';
import TransitionHook from '../mixins/TransitionHook';
import ConnectToStores from '../mixins/ConnectToStores';

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
      <div>
        Round: {this.state.round.title} | Question: {this.props.questionId}
        <br/>
        {this.state.question.extra ? this.state.question.extra : null}
      </div>
    );
  }

}));

export default Question;
