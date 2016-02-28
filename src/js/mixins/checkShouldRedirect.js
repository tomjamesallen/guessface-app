import React from 'react';

export default function (shouldRedirect) {

  function check(props, componentThis) {
    const shouldRedirectReturn = shouldRedirect(props, componentThis);
    if (typeof shouldRedirectReturn === 'string') {
      componentThis.context.history.pushState(null, shouldRedirectReturn);
    }
  }

  return {
    contextTypes: {
      history: React.PropTypes.object.isRequired
    },

    componentWillMount() {
      check(this.props, this);
    },

    componentWillReceiveProps(props) {
      check(props, this);
    },
  }
};
