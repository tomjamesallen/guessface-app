// App imports.
import AppDispatcher from '../dispatcher/AppDispatcher'
import EventEmitter from 'events'

// Helpers.
import assign from 'object-assign'
import jsonAjaxHelper from '../helpers/jsonAjaxHelper'

// Constants.
import ActionTypes from '../constants/ActionTypes'
import Api from '../constants/Api'
const CHANGE_EVENT = 'change'

// Stores.
import RouteStore from './RouteStore'

// Get ENV.
// const ENV = process.env.NODE_ENV

function getInitialState() {
  return {
    rounds: {},
    dataReady: false
  }
};

// Create state var and set to initial state.
var state = getInitialState()

function initialDataFetch() {
  jsonAjaxHelper(Api.url, function(data) {
    parseData(data.data)
    AppStore.emitChange()
  })
};

function parseData(data) {
  state.rounds = data.rounds
  state.dataReady = true
}

/**
 * Create and export the AppAppStore.
 */
var AppStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the full game state.
   * @return {object}
   */
  getState() {
    return state
  },

  /**
   * Get the meta data for a given round.
   * @param  {string or int} roundId.
   * @param  {bool}          returnFullData whether to returnt the full data for
   *                                        the round.
   * @return {object}        returns the round meta data.
   */
  getRound(roundId, returnFullData) {
    if (!state.dataReady) return

    roundId = parseInt(roundId, 10)
    const round = state.rounds[roundId]

    if (typeof round === 'undefined') return

    round.roundLength = round.questionsData.length
    const hasExample = typeof round.exampleData === 'object'

    if (returnFullData) {
      round.roundId = roundId
      return round
    }

    return {
      title: round.title,
      roundId: round.roundId,
      roundLength: round.roundLength,
      description: round.description || null,
      hasExample
    }
  },

  /**
   * [getQuestion description]
   * @param  {string or int} roundId.
   * @param  {string or int} questionId.
   * @return {object}        returns the question data.
   */
  getQuestion(roundId, questionId) {
    const round = this.getRound(roundId, true)
    if (!round) return

    // Handle example question.
    if (questionId === 'e') {
      if (typeof round.exampleData === 'undefined') return
      else return round.exampleData
    }
    else {
      questionId = parseInt(questionId, 10)
      if (typeof round.questionsData[questionId] === 'undefined') return
      else return round.questionsData[questionId]
    }
  },

  getRoundPath(roundId) {
    const round = this.getRound(roundId)
    if (!round) return
    const route = RouteStore.getRoute()

    return {
      pathname: `/round/${round.roundId + 1}`,
      query: route.location.query
    }
  },

  getQuestionPath(roundId, questionId) {
    const question = this.getQuestion(roundId, questionId)
    if (!question) return
    const route = RouteStore.getRoute()

    var pathRoundId = question.roundData.roundId + 1
    var pathQuestionId = question.questionId
    if (typeof pathQuestionId === 'number') pathQuestionId++

    return {
      pathname: `/round/${pathRoundId}/${pathQuestionId}`,
      query: route.location.query
    }
  },

  getValidRoundIdParams() {
    var roundIds = []
    if (state.rounds) {
      state.rounds.forEach(function(round) {
        roundIds.push(String(round.roundId + 1))
      })
    }
    return roundIds
  },

  getValidQuestionIdParamsForRound(roundId) {
    // var roundIds = [];
    // if (state.rounds) {
    //   state.rounds.forEach(function (round) {
    //     roundIds.push(String(round.roundId));
    //   });
    // }
    // return roundIds;
  },

  isDataReady() {
    return state.dataReady
  },

  /**
   * Used in the functions above to trigger an update to the UI.
   */
  emitChange() {
    this.emit(CHANGE_EVENT)
  },

  /**
   * @param {function} callback
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback)
  },

  /**
   * @param {function} callback
   */
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback)
  }
})

/**
 * Register callback to handle all updates.
 */
AppDispatcher.register(function(action) {
  AppDispatcher.waitFor([RouteStore.dispatchToken])

  switch (action.actionType) {
    case ActionTypes.INITIAL_DATA_FETCH:
      initialDataFetch()

      break

    default:
  }
})

export default AppStore
