import React from 'react';
import Radium from 'radium';
import AppStore from '../stores/AppStore';
import LoadingScreen from './LoadingScreen.react';
import ConnectToStores from '../mixins/ConnectToStores';

function getState(props) {

  var _roundId = parseInt(props.params.roundId, 10) - 1;

  const round = AppStore.getRound(_roundId);
  const dataReady = AppStore.isDataReady();

  return {
    round,
    dataReady
  };
};

var RoundContainer = Radium(React.createClass({

  mixins: [
    ConnectToStores([AppStore], getState)
  ],

  /**
   * Render the App component.
   * @return {object}
   */
  render() {

    if (!this.state.dataReady) return <LoadingScreen/>;
    if (!this.state.round) return <div>Round not found</div>;

    return (
      <div>
        {this.props.children ? React.cloneElement(this.props.children, {state: this.state}) : null}
        {this.state.round.title}
      </div>
    );
  }

}));

export default RoundContainer;
