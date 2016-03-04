import React, { PropTypes } from 'react';
import Radium from 'radium';

import AppActions from '../actions/AppActions';

import { Link } from 'react-router';
import Logo from './Logo.react';
import Button from './Button.react';

import ThemeColors from '../constants/ThemeColors';
import SizingVars from '../constants/SizingVars';

var App = Radium(React.createClass({

  propTypes: {
    children: PropTypes.object
  },

  componentDidMount() {
    AppActions.initialDataFetch();
  },

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
        border: `${SizingVars.unit}px solid ${ThemeColors.secondary}`,
        padding: SizingVars.unit*1.5,
        backgroundColor: ThemeColors.tertiary,
        color: ThemeColors.primary
      },
    };

    function onClick() {
      console.log('clicked');
    }

    var buttonTestStyles = {
      // display: 'block'
      marginRight: SizingVars.unit,
      marginTop: SizingVars.unit
    };

    return (
      <div style={styles.base}>
        <Logo style={{width: '50%'}}/>

        <Button style={buttonTestStyles} href="/round/1/3">Link</Button>
        <Button style={buttonTestStyles} onClick={onClick}>Button</Button>
        <Button style={buttonTestStyles} onClick={onClick}>Another Button</Button>

        <div>
          <Button style={buttonTestStyles} href="/round/1/3">prev</Button>
          <Button style={buttonTestStyles} href="/round/1/3">next</Button>
        </div>

        {this.props.children ? React.cloneElement(this.props.children) : null}

        <Link to="/round/1/2">round/1/2</Link><br/>
        <Link to="/round/1/e">round/1/e</Link><br/>
        <Link to="/round/3/25">round/3/25</Link><br/>
        <Link to="/round/1/25">round/1/25</Link><br/>
        <Link to="/round/2/2">round/2/2</Link><br/>
        <Link to="/round/1/3">round/1/3</Link><br/>
        <Link to="/round/3/3">round/3/3</Link><br/>
        <Link to="/round/3/example">round/3/example</Link><br/>
        <Link to="/round/2">round/2</Link><br/>
        <Link to="/round/3">round/3</Link><br/>
        <Link to="">Index</Link>
      </div>
    );
  }

}));

export default App;
