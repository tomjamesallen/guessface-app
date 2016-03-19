import React, { PropTypes } from 'react'
import Radium from 'radium'
import AppStore from '../stores/AppStore'
import LoadingScreen from './LoadingScreen.react'
import ConnectToStores from '../mixins/ConnectToStores'
import SizingVars from '../constants/SizingVars'
import u from '../helpers/unit'

function getState(props) {
  var _roundId = parseInt(props.params.roundId, 10) - 1

  const round = AppStore.getRound(_roundId)
  const dataReady = AppStore.isDataReady()

  return {
    round,
    dataReady
  }
}

var RoundContainer = Radium(React.createClass({

  propTypes: {
    children: PropTypes.element
  },

  mixins: [
    ConnectToStores([AppStore], getState)
  ],

  /**
   * Render the App component.
   * @return {object}
   */
  render() {
    if (!this.state.dataReady) return <LoadingScreen/>
    if (!this.state.round) return <div>Round not found</div>

    var styles = {
      base: {
        height: '100%',
        width: '100%'
      },
      roundLabel: {
        position: 'absolute',
        top: u(SizingVars.unit * 1.5),
        right: u(SizingVars.unit * 1.5)
      }
    }

    return (
      <div className={this.constructor.displayName} style={styles.base}>
        <div style={styles.roundLabel}>{this.state.round.title}</div>
        {this.props.children ? React.cloneElement(this.props.children, {state: this.state}) : null}
      </div>
    )
  }
}))

export default RoundContainer
