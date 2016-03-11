import React from 'react';
import Radium from 'radium';
import AppStore from '../stores/AppStore';
import RouteStore from '../stores/RouteStore';
import ConnectToStores from '../mixins/ConnectToStores';
import Type from '../constants/BaseTypeStyles';
import Button from './Button.react';

function getState() {
  const route = RouteStore.getRoute();
  var _roundId = parseInt(route.params.roundId, 10) - 1;
  const round = AppStore.getRound(_roundId);
  const roundId = round ? round.roundId : null;

  return {
    round,
    roundId
  };
}

var RoundHome = Radium(React.createClass({

  mixins: [ConnectToStores([AppStore, RouteStore], getState)],

  render() {

    var description;
    if (this.state.round.description) {
      description = (
        <p style={Type.p}>{this.state.round.description}</p>
      );
    }

    var exampleButton;
    var exampleHref = AppStore.getQuestionPath(this.state.roundId, 'e');
    var path;
    var query;
    if (exampleHref) {
      path = exampleHref.pathname;
      query = exampleHref.query;
      exampleButton = <Button size="small" href={path} query={query}>Example Question</Button>;
    }

    return (
      <div className={this.constructor.displayName}>
        <h2 style={Type.h2}>{this.state.round.title}</h2>
        {description}
        {exampleButton}
      </div>
    );
  }

}));

export default RoundHome;
