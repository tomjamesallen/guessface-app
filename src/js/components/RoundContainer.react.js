import React from 'react';
import Radium from 'radium';
import AppStore from '../stores/AppStore';
import connectToStores from '../utils/connectToStores';
import checkShouldRedirect from '../utils/checkShouldRedirect';
import { Link } from 'react-router';

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

export default Radium(React.createClass({

  mixins: [ connectToStores([AppStore], getState), checkShouldRedirect(shouldRedirect) ],

  /**
   * Render the App component.
   * @return {object}
   */
  render() {

    console.log('render round container', this.props.params, this.state);

    return (
      <div>
        <h2>Round</h2>
        {this.props.children ? React.cloneElement(this.props.children, {state: this.state}) : null}
        <Link to="/round/1/2">round/1/2</Link><br/>
        <Link to="/round/1/3">round/1/3</Link><br/>
        <Link to="/round/3/3">round/3/3</Link><br/>
        <Link to="">Index</Link>
      </div>
    );
  }

}));
