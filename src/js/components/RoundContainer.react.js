import React from 'react';
import Radium from 'radium';
import AppStore from '../stores/AppStore';
import ConnectToStores from '../mixins/ConnectToStores';
import CheckShouldRedirect from '../mixins/CheckShouldRedirect';

function getState(props) {

  const round = AppStore.getRound(props.params.roundId);
  const dataReady = AppStore.isDataReady();

  return {
    round,
    dataReady
  };
};

function shouldRedirect(props, state) {
  // If we don't have the round then redirect to the home page.
  if (state.dataReady && !state.round) return '/';
};

var RoundContainer = Radium(React.createClass({

  mixins: [
    ConnectToStores([AppStore], getState),
    CheckShouldRedirect(shouldRedirect)
  ],

  /**
   * Render the App component.
   * @return {object}
   */
  render() {

    if (!this.state.dataReady) return <div />;

    // console.log('render round container', this.props.params, this.state);

    return (
      <div>
        {this.props.children ? React.cloneElement(this.props.children, {state: this.state}) : null}
        {this.state.round.title}
      </div>
    );
  }

}));

export default RoundContainer;
