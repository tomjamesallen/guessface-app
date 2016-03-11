import React, { PropTypes } from 'react';
import Radium from 'radium';
import componentWidthMixin from 'react-component-width-mixin';

import AppActions from '../actions/AppActions';

import ThemeColors from '../constants/ThemeColors';
import SizingVars from '../constants/SizingVars';
const rem = require('../helpers/units').Rem();

import { Link } from 'react-router';
import Logo from './Logo.react';
import Button from './Button.react';

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
    AppActions.initialDataFetch();
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
        border: `${rem(SizingVars.unit)} solid ${ThemeColors.secondary}`,
        padding: rem(SizingVars.unit*1.5),
        backgroundColor: ThemeColors.tertiary,
        color: ThemeColors.primary
      },
    };

    return (
      <div style={styles.base} className={this.constructor.displayName}>
        <Logo style={{
          width: '300px',
          position: 'absolute',
          left: rem(SizingVars.unit*1.5)
        }}/>

        {this.props.children ? React.cloneElement(this.props.children) : null}
      </div>
    );
  }

}));

export default App;
