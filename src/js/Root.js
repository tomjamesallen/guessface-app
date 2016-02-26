import React, { PropTypes, Component } from 'react';
import { Router, Route, IndexRoute, NotFoundRoute } from 'react-router';

import App from './components/App.react';
import About from './components/About.react';
import HomeScreen from './components/HomeScreen.react';
import RoundContainer from './components/RoundContainer.react';
import RoundHome from './components/RoundHome.react';

export default class Root extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  render() {
    const { history } = this.props;
    return (
      <Router history={history}>
        <Route name='home' path='/' component={App}>
          <IndexRoute component={HomeScreen}/>
          <Route name='about' path='/about' component={About} />

          <Route path="round/:roundId" component={RoundContainer}>
            <IndexRoute component={RoundHome}/>
            <Route path="example" />
          </Route>
        </Route>
      </Router>
    );
  }
}
