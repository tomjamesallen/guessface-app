import React from 'react'
import Radium from 'radium'
import { Link } from 'react-router'
import AppStore from '../stores/AppStore'
import ConnectToStores from '../mixins/ConnectToStores'

function getState() {
  return {
    rounds: AppStore.getRounds()
  }
}

export default Radium(React.createClass({

  mixins: [ConnectToStores([AppStore], getState)],

  /**
   * Render the App component.
   * @return {object}
   */
  render() {
    console.log(this.state.rounds)
    return (
      <div className={this.constructor.displayName}>
        <h2>Homescreen</h2>
        <Link to='/round/1'>Round 1</Link>
      </div>
    )
  }
}))
