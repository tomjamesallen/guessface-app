import React, { PropTypes, Component } from 'react'
import { Router, Route, IndexRoute, Redirect } from 'react-router'

import App from './components/App.react'
import About from './components/About.react'
import HomeScreen from './components/HomeScreen.react'
import RoundContainer from './components/RoundContainer.react'
import RoundHome from './components/RoundHome.react'
import QuestionContainer from './components/QuestionContainer.react'
import ExampleContainer from './components/ExampleContainer.react'

import AppStore from './stores/AppStore'
import RouteValidator from './utils/RouteValidator'
import RouteActions from './actions/RouteActions'

var routeValidator = RouteValidator([
  function(next, replace) {
    const params = next.params

    // Validate round Id.
    const validRoundIds = AppStore.getValidRoundIdParams()
    if (validRoundIds.indexOf(params.roundId) === -1) {
      replace('/')
      return
    }

    // Validate question Id.
    const _roundId = parseInt(params.roundId, 10) - 1
    const validQuestionIds = AppStore.getValidQuestionIdParamsForRound(_roundId)
    if (validQuestionIds.indexOf(params.questionId) === -1) {
      replace(AppStore.getRoundPath(_roundId) || {pathname: '/'})
    }
  }
])

export default class Root extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  checkState() {
    const { location, params } = this.state
    RouteActions.onRouteUpdated(location, params)
  }

  render() {
    const { history } = this.props
    return (
      <Router history={history} onUpdate={this.checkState}>
        <Route name='home' path='/' component={App}>
          <IndexRoute component={HomeScreen}/>
          <Route name='about' path='/about' component={About}/>
          <Redirect from='round' to='/' />
          <Route path='round/:roundId' component={RoundContainer} onEnter={routeValidator.validator}>
            <IndexRoute component={RoundHome}/>
            <Route path='example' component={ExampleContainer} onEnter={routeValidator.validator}/>
            <Route path=':questionId' component={QuestionContainer} onEnter={routeValidator.validator}/>
          </Route>
        </Route>
      </Router>
    )
  }
}
