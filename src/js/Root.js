import React, { PropTypes, Component } from 'react'
import { Router, Route, IndexRoute, Redirect } from 'react-router'
import shallowequal from 'shallowequal'
import clone from 'clone'

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

let prevRouteState

function routeChanged(prev, next) {
  if (!prev) return true
  if (prev.location.pathname !== next.location.pathname) return true
  if (!shallowequal(prev.location.query, next.location.query)) return true
  return
}

function onRouteEvent(next) {
  if (!routeChanged(prevRouteState, next)) return

  if (routeValidator.validator(next)) {
    emitRouteAction(next)
    prevRouteState = clone(next)
  }
}

var routeValidator = RouteValidator([
  function(next, replace) {
    const params = next.params

    if (!params.roundId) return

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
      return
    }

    return true
  }
])

function emitRouteAction(next) {
  const { location, params } = next
  RouteActions.onRouteUpdated(location, params)
}

export default class Root extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  onUpdate() {
    const { location, params } = this.state
    onRouteEvent({
      location, params
    })
  }

  render() {
    const { history } = this.props
    return (
      <Router history={history} onUpdate={this.onUpdate}>
        <Route name='home' path='/' component={App} onEnter={onRouteEvent}>
          <IndexRoute component={HomeScreen} onEnter={onRouteEvent}/>
          <Route name='/about' path='about' component={About} onEnter={onRouteEvent}/>
          <Redirect from='round' to='/' />
          <Route path='round/:roundId' component={RoundContainer} onEnter={onRouteEvent}>
            <IndexRoute component={RoundHome} onEnter={onRouteEvent}/>
            <Route path='example' component={ExampleContainer} onEnter={onRouteEvent}/>
            <Route path=':questionId' component={QuestionContainer} onEnter={onRouteEvent}/>
          </Route>
        </Route>
      </Router>
    )
  }
}
