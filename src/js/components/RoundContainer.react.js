import React from 'react';
import Radium from 'radium';

export default Radium(React.createClass({

  /**
   * Render the App component.
   * @return {object}
   */
  render() {

    return (
      <div>
        <h2>Round</h2>
        {this.props.children ? React.cloneElement(this.props.children, {state: this.state}) : null}
      </div>
    );
  }

}));
