import React from 'react'
import Radium from 'radium'
import { Link } from 'react-router'
import history from '../history'

export default Radium(React.createClass({

  /**
   * Render the App component.
   * @return {object}
   */
  render() {
    return (
      <div className={this.constructor.displayName}>
        <h2>Homescreen</h2>
        <Link to='/round/1'>Round 1</Link>
      </div>
    )
  }

}))
