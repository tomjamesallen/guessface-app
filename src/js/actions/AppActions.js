/*
 * AppActions
 */

import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {

  initialDataFetch() {
    AppDispatcher.dispatch({
      actionType: ActionTypes.INITIAL_DATA_FETCH
    });
  }

};