import React from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
import Button from './Button.react';

import ThemeColors from '../constants/ThemeColors';
import SizingVars from '../constants/SizingVars';
const rem = require('../helpers/units').Rem();



import transitionManager from '../transitionManager';

// Create About component.
export default Radium(React.createClass({

  /**
   * Render the About component.
   * @return {object}
   */
  render() {

    function onClick() {}

    var buttonTestStyles = {
      marginRight: rem(SizingVars.unit),
      marginTop: rem(SizingVars.unit)
    };

    return (
      <div className={this.constructor.displayName}>
        <h2 className="about__heading">About</h2>
        <p>An about page</p>


        <Button style={buttonTestStyles} href="/round/1/3">Link</Button>
        <Button style={buttonTestStyles} onClick={onClick}>Button</Button>
        <Button style={buttonTestStyles} onClick={onClick}>Another Button</Button>

        <div>
          <Button style={buttonTestStyles} href="/round/1/3">prev</Button>
          <Button style={buttonTestStyles} href="/round/1/3">next</Button>
        </div>

        <Link to='/about'>About</Link><br/>
        <Link to={{pathname: '/about', query:{test:'test'}}}>About?test=test</Link><br/>

        <Link to="/round/1/2">round/1/2</Link><br/>
        <Link to="/round/1/2">round/1/2</Link><br/>
        <Link to="/round/1/e">round/1/e</Link><br/>
        <Link to="/round/3/25">round/3/25</Link><br/>
        <Link to="/round/1/25?test">round/1/25</Link><br/>
        <Link to="/round/2/2">round/2/2</Link><br/>
        <Link to="/round/1/3">round/1/3</Link><br/>
        <Link to="/round/3/3">round/3/3</Link><br/>
        <Link to="/round/3/example">round/3/example</Link><br/>
        <Link to="/round/2">round/2</Link><br/>
        <Link to="/round/3">round/3</Link><br/>
        <Link to="">Index</Link><br/>
        <Link to="/round/1">Test</Link>
      </div>
    );
  }

}));
