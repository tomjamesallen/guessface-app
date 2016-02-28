import React from 'react';
import { Link } from 'react-router';
import Radium from 'radium';

import transitionManager from '../transitionManager';

// Create About component.
export default Radium(React.createClass({

  /**
   * Render the About component.
   * @return {object}
   */
  render() {
    return (
      <div className="about">
        <h2 className="about__heading">About</h2>
        <p>An about page</p>
      </div>
    );
  }

}));
