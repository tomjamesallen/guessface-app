import React from 'react'
import Radium from 'radium'
import AppStore from '../stores/AppStore'
import ConnectToStores from '../mixins/ConnectToStores'

import RoundsList from './RoundsList.react'

function getState() {
  return {
    rounds: AppStore.getRounds()
  }
}

var HomeScreen = Radium(React.createClass({

  mixins: [ConnectToStores([AppStore], getState)],

  /**
   * Render the App component.
   * @return {object}
   */
  render() {
    const rounds = this.state.rounds
    return (
      <div className={this.constructor.displayName}>
        <h2>Homescreen</h2>
        <RoundsList rounds={rounds}/>
      </div>
    )
  }
}))

export default HomeScreen
