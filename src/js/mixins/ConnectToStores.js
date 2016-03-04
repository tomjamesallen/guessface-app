// Mixin based on:
// https://github.com/gaearon/flux-react-router-example/blob/master/scripts/utils/connectToStores.js

import shallowEqual from 'react-pure-render/shallowEqual';

export default function(stores, getState) {
  return {

    getInitialState() {
      return getState(this.props);
    },

    componentWillMount() {
      stores.forEach(store =>
        store.addChangeListener(this.handleStoresChanged)
      );
    },

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(nextProps, this.props)) {
        this.setState(getState(nextProps));
      }
    },

    componentWillUnmount() {
      stores.forEach(store =>
        store.removeChangeListener(this.handleStoresChanged)
      );
    },

    handleStoresChanged() {
      this.setState(getState(this.props));
    }

  };
};