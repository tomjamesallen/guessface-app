import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link as LinkImport } from 'react-router';
var Link = Radium(LinkImport);

import AppConstants from '../constants/AppConstants';

var Logo = Radium(React.createClass({

  /**
   * Render the App component.
   * @return {object}
   */
  render() {

    var styles = {
      base: [
        {
          display: 'block',
          position: 'relative',
          width: '100%',
          textIndent: '-9999px',
          overflow: 'hidden'
        },
        this.props.style
      ],
      intrinsic: {
        position: 'relative',
        display: 'block',
        paddingBottom: '15.64%',
      },
      inner: {
        position: 'absolute',
        display: 'block',
        width: '100%',
        height: '100%',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(/imgs/Logo.svg)'
      }
    };

    return (
      <Link style={styles.base} to={{pathname: '/'}} className={this.constructor.displayName}>
        <span style={styles.intrinsic}>
          <span style={styles.inner}>{AppConstants.APP_NAME}</span>
        </span>
      </Link>
    );
  }

}));

export default Logo;
