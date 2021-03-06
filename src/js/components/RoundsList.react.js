import React, { PropTypes } from 'react'
import Radium from 'radium'
import { Link } from 'react-router'
import BT from '../constants/BaseTypeStyles'

var RoundsList = Radium(React.createClass({

  propTypes: {
    rounds: PropTypes.array.isRequired
  },

  /**
   * Render the App component.
   * @return {object}
   */
  render() {
    let roundsDisplayArray = this.props.rounds.map((round, i) => {
      return (
        <li style={BT.li} key={i}>{round.roundId + 1}: <Link style={BT.a} to={round.path}>{round.title}</Link></li>
      )
    })
    let roundsDisplay = <ul style={BT.ul}>{roundsDisplayArray}</ul>
    return (
      <div className={this.constructor.displayName}>
        {roundsDisplay}
      </div>
    )
  }
}))

export default RoundsList
