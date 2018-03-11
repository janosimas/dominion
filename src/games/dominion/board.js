import React from 'react';
import { Card } from 'boardgame.io/ui';

import { currentPlayer } from '../utils'
import phases from './phases'
import './board.css';

class DominionBoard extends React.Component {
  onClickEndPhase() {
    this.props.events.endPhase(phases.BUY_PHASE);
  }

  onClickEndTurn() {
    this.props.events.endPhase(phases.ACTION_PHASE);
    this.props.events.endTurn();
  }

  onClickBoard(key) {
    this.props.moves.onClickBoard(key);
  }

  onClickHand(id) {
      this.props.moves.onClickHand(id);
  }

  renderMainBoard(G, ctx) {
    const cards = G.boardCards;
    let tbody = [];
    for (let index = 0; index < cards.length; index++) {
      tbody.push(<Card {...cards[index]} key={cards[index].name} onClick={() => this.props.moves.onClickBoard(cards[index].name)} />);
    }
    return tbody;
  }

  renderCards(cards, onClickAction, G, ctx, highlight) {
    let tbody = [];
    for (let index = 0; index < cards.length; index++) {
      tbody.push(<Card {...cards[index]} key={index + 100} />);
    }
    return tbody;
  }

  renderPlayerBoard(player, G, ctx) {
    let tbody = [];
    let deck = {
      margin: '15px'
    }
    tbody.push(
      <span key='deck' className='card' style={deck}>
        <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />
      </ span>);

    const cards = player.hand;
    for (let index = 0; index < cards.length; index++) {
      tbody.push(<Card {...cards[index]} key={index} onClick={() => this.props.moves.onClickHand(index)}/>);
    }

    return tbody;
  }

  renderControls(G, ctx) {
    let player = currentPlayer(G, ctx);

    let controls = [];
    controls.push(<div key='current-player'>Current player: {player.name}</div>);
    controls.push(<div key='current-phase'>Current phase: {ctx.phase}</div>);
    controls.push(<div key='current-treasure'>Treasure: {player.treasure}</div>);
    controls.push(<div key='current-actions'>Actions: {player.actions}</div>);
    controls.push(<div key='current-buy'>Buy: {player.buy}</div>);
    if (ctx.phase === phases.ACTION_PHASE)
      controls.push(<button key='end-phase' type="button" onClick={() => this.onClickEndPhase()}>end phase</button>);
    else
      controls.push(<button key='end-turn' type="button" onClick={() => this.onClickEndTurn()}>end turn</button>);

    // if (this.props.ctx.gameover !== null) {
    //   controls.push(<div>Winner: {this.props.ctx.gameover}</div>);
    // }

    return controls;
  }

  render() {
    const mainBoard = this.renderMainBoard(this.props.G, this.props.ctx);
    const playArea = this.renderCards(this.props.G.play_area, this.props.G, this.props.ctx);
    const playerBoard = this.renderPlayerBoard(currentPlayer(this.props.G, this.props.ctx), this.props.G, this.props.ctx);
    const control = this.renderControls(this.props.G, this.props.ctx);

    return (
      <div>
        <div className='buy-board'>
          {mainBoard}
        </div>
        <div className='play-board'>
          {playArea}
        </div>
        <div className='player-board'>
          {playerBoard}
        </div>
        <div className='controls'>
          {control}
        </div>
      </div>
    );
  }
}

export default DominionBoard;