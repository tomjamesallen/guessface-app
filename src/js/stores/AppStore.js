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
    rounds: [],
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

    const route = RouteStore.getRoute()

    round.roundLength = round.questionsData.length
    round.hasExample = typeof round.exampleData === 'object'
    round.path = {
      pathname: `/round/${round.roundId + 1}`,
      query: route.location.query
    }

    if (returnFullData) {
      round.roundId = roundId
      return round
    }

    return {
      title: round.title,
      roundId: round.roundId,
      roundLength: round.roundLength,
      description: round.description || null,
      hasExample: round.hasExample,
      path: round.path
    }
  },

  getRoundPath(roundId) {
    const round = this.getRound(roundId)
    if (!round) return
    return round.path
  },

  getQuestion(roundId, questionId) {
    const round = this.getRound(roundId, true)
    if (!round) return
    const route = RouteStore.getRoute()
    let question

    // Handle example question.
    if (questionId === 'e') {
      if (typeof round.exampleData === 'undefined') return
      else question = round.exampleData
    }
    else {
      questionId = parseInt(questionId, 10)
      if (typeof round.questionsData[questionId] === 'undefined') return
      else question = round.questionsData[questionId]
    }

    let pathRoundId = question.roundData.roundId + 1
    let pathQuestionId = question.questionId
    if (typeof pathQuestionId === 'number') pathQuestionId++

    question.path = {
      pathname: `/round/${pathRoundId}/${pathQuestionId}`,
      query: route.location.query
    }

    return question
  },

  getQuestionPath(roundId, questionId) {
    const question = this.getQuestion(roundId, questionId)
    if (!question) return
    return question.path
  },

  getValidRoundIdParams() {
    let roundIds = []
    if (state.rounds) {
      state.rounds.forEach(function(round) {
        roundIds.push(String(round.roundId + 1))
      })
    }
    return roundIds
  },

  getValidQuestionIdParamsForRound(roundId) {
    let questionIds = []
    const round = this.getRound(roundId, true)
    if (round && round.questionsData) {
      round.questionsData.forEach(function(question) {
        questionIds.push(String(question.questionId + 1))
      })
    }
    if (round && round.exampleData) {
      questionIds.push('e')
    }
    return questionIds
  },

  getRounds() {
    let rounds = []
    state.rounds.forEach((round, id) => {
      rounds.push(this.getRound(id))
    })
    return rounds
  },

  getQuestionsForRound() {

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
