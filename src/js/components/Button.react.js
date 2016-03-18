import React, { PropTypes } from 'react'
import Radium from 'radium'
import { Link as LinkImport } from 'react-router'
var Link = Radium(LinkImport)

import ThemeColors from '../constants/ThemeColors'
import SizingVars from '../constants/SizingVars'
const borders = SizingVars.borders
import AnimationConstants from '../constants/AnimationConstants'

import { px } from '../helpers/units'

var Button = Radium(React.createClass({

  propTypes: {
    size: PropTypes.oneOf(['small', 'med', 'lrg']),
    onClick: PropTypes.func,
    query: PropTypes.object,
    style: PropTypes.node,
    active: PropTypes.bool,
    to: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ]),
    children: PropTypes.node
  },

  getDefaultProps() {
    return {
      size: 'med',
      onClick() {},
      query: {},
      style: {}
    }
  },

  /**
   * Render the App component.
   * @return {object}
   */
  render() {
    var hovering = Radium.getState(this.state, 'hoverTrigger', ':hover')
    var depressed = Radium.getState(this.state, 'hoverTrigger', ':active') === 'viamousedown'

    var borderShared = {
      position: 'absolute',
      width: '0.5em',
      top: 0,
      height: '100%',
      borderTop: `${px(borders.sm)} solid ${ThemeColors.primary}`,
      borderBottom: `${px(borders.sm)} solid ${ThemeColors.primary}`,
      zIndex: '3'
    }

    var fontSizes = {
      small: SizingVars.type.p,
      med: SizingVars.type.h3,
      lrg: SizingVars.type.h2
    }

    var fontSize = fontSizes[this.props.size]

    var styles = {
      base: [
        {
          position: 'relative',
          display: 'inline-block',
          backgroundColor: 'inherit',
          border: 'none',
          outline: 'none',
          lineHeight: '1em',
          padding: '0.2em 0.5em',
          textDecoration: 'none',
          color: ThemeColors.primary,
          fontSize
        },
        this.props.style
      ],
      __hoverTrigger: {
        position: 'absolute',
        display: 'block',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 100,
        ':hover': {},
        ':active': {}
      },
      __leftBorder: [
        borderShared,
        {
          left: 0,
          borderLeft: `${px(borders.med)} solid ${ThemeColors.primary}`
        }
      ],
      __rightBorder: [
        borderShared,
        {
          right: 0,
          borderRight: `${px(borders.med)} solid ${ThemeColors.primary}`
        }
      ],
      __background: [
        {
          position: 'absolute',
          display: 'block',
          width: '100%',
          height: '3px',
          transition: `all ${AnimationConstants.easing} ${AnimationConstants.short}`,
          left: 0,
          bottom: 0,
          backgroundColor: ThemeColors.secondary
        },
        hovering && {
          height: '100%'
        },
        (depressed || this.props.active) && {
          height: '100%',
          backgroundColor: 'inherit'
        }
      ],
      _hover__background: {
        height: '100%'
      },
      __innerText: {
        position: 'relative',
        zIndex: '5'
      }
    }

    if (this.props.to) {
      return (
        <Link
          style={styles.base}
          to={this.props.to}
          className={this.constructor.displayName}>
          <span key='hoverTrigger' style={styles.__hoverTrigger}/>
          <span style={styles.__leftBorder}/>
          <span style={styles.__rightBorder}/>
          <span style={styles.__background}/>
          <span style={styles.__innerText}>
            {this.props.children}
          </span>
        </Link>
      )
    }
    else {
      return (
        <button
          style={styles.base}
          onClick={this.props.onClick}
          className={this.constructor.displayName}>
          <span key='hoverTrigger' style={styles.__hoverTrigger}/>
          <span style={styles.__leftBorder}/>
          <span style={styles.__rightBorder}/>
          <span style={styles.__background}/>
          <span style={styles.__innerText}>
            {this.props.children}
          </span>
        </button>
      )
    }
  }

}))

export default Button
