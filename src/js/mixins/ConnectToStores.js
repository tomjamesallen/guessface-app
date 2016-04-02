// Mixin based on:
// https://github.com/gaearon/flux-react-router-example/blob/master/scripts/utils/connectToStores.js

export default function(stores, getState) {
  return {
    getInitialState() {
      return getState(this.props, this.state)
    },

    componentWillMount() {
      stores.forEach((store) =>
        store.addChangeListener(this.handleStoresChanged)
      )
    },

    componentWillReceiveProps(nextProps) {
      this.setState(getState(nextProps, this))
    },

    componentWillUnmount() {
      stores.forEach((store) =>
        store.removeChangeListener(this.handleStoresChanged)
      )
    },

    handleStoresChanged() {
      this.setState(getState(this.props, this))
    }
  }
}
