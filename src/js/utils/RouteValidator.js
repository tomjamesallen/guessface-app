import AppStore from '../stores/AppStore';

export default function (rules) {
  var transitionId = 0,
      dataReady = AppStore.isDataReady(),
      cachedTransitions = [];

  function handleStoresChanged() {
    dataReady = AppStore.isDataReady();
    retryCachedTransitions();
  };

  function testRules(next, replace) {
    rules.forEach(rule => rule(next, replace));
  };

  function retryCachedTransitions() {
    if (!dataReady) return;

    cachedTransitions.forEach(transition => {
      if (transition.transitionId === transitionId) {
        testRules(transition.next, transition.replace);
      }
    });

    cachedTransitions = [];
  };

  AppStore.addChangeListener(handleStoresChanged);
  
  return {
    validator(next, replace) {
      transitionId ++;
      const thisTransitionId = transitionId;
      
      if (dataReady) testRules(next, replace);
      else cachedTransitions.push({
        next,
        replace,
        transitionId: thisTransitionId
      });

      return true;
    },
    
    destroy() {
      AppStore.removeChangeListener(handleStoresChanged);
    }
  }
};