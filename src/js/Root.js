import React, { PropTypes, Component } from 'react';
import { Router, Route, IndexRoute, NotFoundRoute } from 'react-router';

import App from './components/App.react';
import About from './components/About.react';
import HomeScreen from './components/HomeScreen.react';
import RoundContainer from './components/RoundContainer.react';
import RoundHome from './components/RoundHome.react';
import QuestionContainer from './components/QuestionContainer.react';
import ExampleContainer from './components/ExampleContainer.react';

import AppStore from './stores/AppStore';
import RouteValidator from './utils/RouteValidator';

var routeValidator = RouteValidator([
  function (next, replace) {
    const params = next.params;
    if (params.roundId) {
      if (!AppStore.getRound(params.roundId)) {
        replace('/');
      }
      else {
        if (params.questionId && 
            !AppStore.getQuestion(params.roundId, params.questionId)) {
          replace(`/round/${params.roundId}`);
        }
      }
    }
  },
]);

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

          <Route path="round/:roundId" component={RoundContainer} onEnter={routeValidator.validator}>
            <IndexRoute component={RoundHome}/>
            <Route path="example" component={ExampleContainer} onEnter={routeValidator.validator}/>
            <Route path=":questionId" component={QuestionContainer} onEnter={routeValidator.validator}/>
          </Route>
        </Route>
      </Router>
    );
  }
}
