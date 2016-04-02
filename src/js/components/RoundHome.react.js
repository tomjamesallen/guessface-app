import React from 'react'
import Radium from 'radium'
import AppStore from '../stores/AppStore'
import RouteStore from '../stores/RouteStore'
import ConnectToStores from '../mixins/ConnectToStores'
import BT from '../constants/BaseTypeStyles'
import SizingVars from '../constants/SizingVars'
import u from '../helpers/unit'
import Button from './Button.react'

function getState() {
  const route = RouteStore.getRoute()
  var _roundId = parseInt(route.params.roundId, 10) - 1
  const round = AppStore.getRound(_roundId)
  const roundId = round ? round.roundId : null

  return {
    route,
    round,
    roundId
  }
}

var RoundHome = Radium(React.createClass({

  mixins: [ConnectToStores([AppStore, RouteStore], getState)],

  render() {
    if (!this.state.round) {
      return false
    }

    var description
    if (this.state.round.description) {
      description = (
        <p style={BT.p}>{this.state.round.description}</p>
      )
    }

    var exampleButton
    var examplePath = AppStore.getQuestionPath(this.state.roundId, 'e')
    if (examplePath) {
      exampleButton = <Button to={examplePath}>example question</Button>
    }

    const styles = {
      base: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: '100%',
        width: '100%'
      },
      buttonsWrapper: {
        display: 'flex'
      },
      homeButton: {
        marginRight: u(SizingVars.unit / 2)
      }
    }

    return (
      <div className={this.constructor.displayName} style={styles.base}>
        <h2 style={[BT.h3, BT.noMarginBottom]}>{this.state.round.title}</h2>
        {description}
        <div style={styles.buttonsWrapper}>
          <Button to='/' style={styles.homeButton}>home</Button>
          {exampleButton}
        </div>
      </div>
    )
  }

}))

export default RoundHome
