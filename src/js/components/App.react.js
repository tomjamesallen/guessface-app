import React, { PropTypes } from 'react'
import Radium from 'radium'
import componentWidthMixin from 'react-component-width-mixin'

import AppActions from '../actions/AppActions'

import ThemeColors from '../constants/ThemeColors'
import SizingVars from '../constants/SizingVars'
import u from '../helpers/unit'

import Logo from './Logo.react'

var App = Radium(React.createClass({

  propTypes: {
    children: PropTypes.object
  },

  getDefaultProps() {
    return {
      initialComponentWidth: 720
    }
  },

  componentDidMount() {
    AppActions.initialDataFetch()
  },

  mixins: [componentWidthMixin],

  /**
   * Render the App component.
   * @return {object}
   */
  render() {
    var styles = {
      base: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        border: `${u(SizingVars.unit)} solid ${ThemeColors.secondary}`,
        paddingLeft: u(SizingVars.unit * 1.5),
        paddingRight: u(SizingVars.unit * 1.5),
        paddingTop: u(SizingVars.unit * 5),
        paddingBottom: u(SizingVars.unit * 5),
        backgroundColor: ThemeColors.tertiary,
        color: ThemeColors.primary
      }
    }

    return (
      <div style={styles.base} className={this.constructor.displayName}>
        <Logo style={{
          width: '300px',
          position: 'absolute',
          top: u(SizingVars.unit * 1.5),
          left: u(SizingVars.unit * 1.5)
        }}/>

        {this.props.children ? React.cloneElement(this.props.children) : null}
      </div>
    )
  }

}))

export default App
