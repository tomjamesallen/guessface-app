import React, { PropTypes } from 'react';
import Radium from 'radium';

import AppActions from '../actions/AppActions';

import { Link } from 'react-router';

var App = Radium(React.createClass({

  propTypes: {
    children: PropTypes.object
  },

  componentDidMount() {
    AppActions.initialDataFetch();
  },

  /**
   * Render the App component.
   * @return {object}
   */
  render() {

    return (
      <div>
        {this.props.children ? React.cloneElement(this.props.children) : null}

        <Link to="/round/1/2">round/1/2</Link><br/>
        <Link to="/round/1/e">round/1/e</Link><br/>
        <Link to="/round/3/25">round/3/25</Link><br/>
        <Link to="/round/1/25">round/1/25</Link><br/>
        <Link to="/round/2/2">round/2/2</Link><br/>
        <Link to="/round/1/3">round/1/3</Link><br/>
        <Link to="/round/3/3">round/3/3</Link><br/>
        <Link to="/round/3/example">round/3/example</Link><br/>
        <Link to="">Index</Link>
      </div>
    );
  }

}));

export default App;
