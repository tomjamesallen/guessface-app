import React from 'react'
import Radium from 'radium'
import AppStore from '../stores/AppStore'
import ConnectToStores from '../mixins/ConnectToStores'
import BT from '../constants/BaseTypeStyles'

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
    const styles = {
      base: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
        width: '100%'
      }
    }
    return (
      <div className={this.constructor.displayName} style={styles.base}>
        <h2 style={[BT.h3, BT.noMarginBottom]}>Welcome to Guessface!</h2>
        <p style={[BT.p]}>The face guessing game for all the family... <br/>or at least those that like guessing faces.</p>
        <p style={[BT.p, BT.noMarginBottom]}>Select a round:</p>
        <RoundsList rounds={rounds}/>
      </div>
    )
  }
}))

export default HomeScreen
