import React from 'react'

var LoadingScreen = React.createClass({

  /**
   * Render the App component.
   * @return {object}
   */
  render() {
    return (
      <div className={this.constructor.displayName}>
        Loading!
      </div>
    )
  }

})

export default LoadingScreen
