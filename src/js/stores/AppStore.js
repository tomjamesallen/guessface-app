// App imports.
import AppDispatcher from '../dispatcher/AppDispatcher';
import EventEmitter from 'events';
import history from '../history';

// Helpers.
import assign from 'object-assign';
import jsonAjaxHelper from '../helpers/jsonAjaxHelper';

// Constants.
import ActionTypes from '../constants/ActionTypes';
import Api from '../constants/Api';
const CHANGE_EVENT = 'change';

// Get ENV.
const ENV = process.env.NODE_ENV;

function getInitialState() {
  return {
    rounds: {},
    dataReady: false
  }
};

// Create state var and set to initial state.
var state = getInitialState();

function initialDataFetch() {
  jsonAjaxHelper(Api.url, function (data) {
    parseData(data.data);
    AppStore.emitChange();
  });
};

function parseData(data) {
  state.rounds = data.rounds;
  state.dataReady = true;
};


/**
 * Create and export the AppAppStore.
 */
var AppStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the full game state.
   * @return {object}
   */
  getState() {
    return state;
  },

  /**
   * Get the meta data for a given round.
   * @param  {string or int} roundId human readible roundId (starts at 1).
   * @param  {bool}          returnFullData whether to returnt the full data for
   *                                        the round. 
   * @return {object}        returns the round meta data.
   */
  getRound(roundId, returnFullData) {
    if (!state.dataReady) return;

    roundId = parseInt(roundId, 10) - 1;
    const round = state.rounds[roundId];

    if (typeof round === 'undefined') return;

    if (returnFullData) {
      round.roundId = roundId;
      return round;
    }
    
    return {
      title: round.title,
      roundId: round.roundId
    };
  },

  /**
   * [getQuestion description]
   * @param  {string or int} roundId human readible roundId (starts at 1).
   * @param  {string or int} questionId human readible questionId (starts at 1).
   * @return {object}        returns the question data.
   */
  getQuestion(roundId, questionId) {
    console.log('getQuestion', roundId, questionId);
    const round = this.getRound(roundId, true);
    if (!round) return;

    // Handle example question.
    if (questionId === 'e') {
      if (typeof round.exampleData === 'undefined') return;
      else return round.exampleData;
    }
    else {
      questionId = parseInt(questionId, 10) - 1;
      if (typeof round.questionsData[questionId] === 'undefined') return;
      else return round.questionsData[questionId];
    }
  },

  isDataReady() {
    return state.dataReady;
  },

  /**
   * Used in the functions above to trigger an update to the UI.
   */
  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

/**
 * Register callback to handle all updates.
 */
AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case ActionTypes.INITIAL_DATA_FETCH:
      initialDataFetch();
      
      break;      

    default:
  }
});

export default AppStore;
