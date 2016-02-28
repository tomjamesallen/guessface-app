import React, { PropTypes } from 'react';
import Radium from 'radium';

import AppActions from '../actions/AppActions';

export default Radium(React.createClass({

  propTypes: {
    children: PropTypes.object
  },

  /**
   * Render the App component.
   * @return {object}
   */
  render() {

    return (
      <div>
        {this.props.children ? React.cloneElement(this.props.children) : null}
      </div>
    );
  }

}));
