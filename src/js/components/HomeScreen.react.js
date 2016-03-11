import React from 'react';
import Radium from 'radium';

export default Radium(React.createClass({

  /**
   * Render the App component.
   * @return {object}
   */
  render() {

    return (
      <div className={this.constructor.displayName}>
        <h2>Homescreen</h2>
      </div>
    );
  }

}));
