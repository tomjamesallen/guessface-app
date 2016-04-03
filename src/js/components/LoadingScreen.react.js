import React from 'react'
import BT from '../constants/BaseTypeStyles'

var LoadingScreen = React.createClass({

  /**
   * Render the App component.
   * @return {object}
   */
  render() {
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
        <h2 style={BT.h2}>Loading Guessface...</h2>
      </div>
    )
  }

})

export default LoadingScreen
