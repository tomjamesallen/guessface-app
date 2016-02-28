import React from 'react';
import Radium from 'radium';
import AppStore from '../stores/AppStore';
import ConnectToStores from '../mixins/ConnectToStores';
import CheckShouldRedirect from '../mixins/CheckShouldRedirect';

function getState(props) {

  // const round = AppStore.getRound(props)
  const round = {};

  return {
    round
  };
};

function shouldRedirect(props, componentThis) {

  // If we don't have the round then redirect to the home page.
  if (!componentThis.state.round) return '/';

  return false;
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

    // console.log('render round container', this.props.params, this.state);

    return (
      <div>
        {this.props.children ? React.cloneElement(this.props.children, {state: this.state}) : null}
      </div>
    );
  }

}));

export default RoundContainer;
