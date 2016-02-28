import React from 'react';

export default function (shouldRedirect) {

  function CallLater(history) {
    return function (path) {
      history.pushState(null, path);
    }
  };

  function check(history, props, state) {
    const shouldRedirectReturn = shouldRedirect(props, state, CallLater(history));
    if (typeof shouldRedirectReturn === 'string') {
      history.pushState(null, shouldRedirectReturn);
    }
  };

  return {
    contextTypes: {
      history: React.PropTypes.object.isRequired
    },

    componentWillMount() {
      check(this.context.history, this.props, this.state);
    },

    componentWillUpdate(nextProps, nextState) {
      check(this.context.history, nextProps, nextState);
    },
  }
};
