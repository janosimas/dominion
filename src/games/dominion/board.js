import React from 'react';
import { Card } from 'boardgame.io/ui';

import { currentPlayer } from '../utils'
import phases from './phases'
import './board.css';
import { canPlay } from './utils';

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
      if (cards[index].count === 0) {
        // empty pile of cards on the board
        tbody.push(<Card {...cards[index]} key={cards[index].name} front={null} canHover={false} />); 
      } else {
        // pile of cards on the board
        tbody.push(<Card {...cards[index]} key={cards[index].name} onClick={() => this.props.moves.onClickBoard(cards[index].name)} />);
      }
    }
    return tbody;
  }

  /**
   * Generic render method for cards
   */
  renderCards(cards, G, ctx) {
    let tbody = [];
    for (let index = 0; index < cards.length; index++) {
      tbody.push(<Card {...cards[index]} key={index + 100} />);
    }
    return tbody;
  }

  /**
   * Render player board
   * 
   * Render:
   *  - hand
   *  - deck
   *  - discard pile
   */
  renderPlayerBoard(player, G, ctx) {
    let tbody = [];
    const discard = player.discard[player.discard.length - 1];
    tbody.push(
      <Card {...discard} className = 'card' canHover = {false} key='discard' />);

    tbody.push(
      <Card back={<img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />}
            isFaceUp={false}
            canHover={false}
            className='card'
            key='deck' />);

    const cards = player.hand;
    for (let index = 0; index < cards.length; index++) {
      //NOTE: does this have any side effects?!
      const card = Object.assign({}, cards[index]);
      if (canPlay(G, ctx, card)) {
        card.className+=' highlight';
      }

      tbody.push(<Card {...card} key={index} onClick={() => this.props.moves.onClickHand(index)}/>);
    }

    return tbody;
  }

  /**
   * Render game information and control
   * 
   * Information:
   *  - active player
   *  - current phase
   *  - player current treasure
   *  - player available number of actions
   *  - player available number of buys
   * 
   * Controls:
   *  - End phase (during action phase)
   *  - End turn (during buy phase)
   */
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
    else if (ctx.phase === phases.BUY_PHASE)
      controls.push(<button key='end-turn' type="button" onClick={() => this.onClickEndTurn()}>end turn</button>);
    return controls;
  }

  render() {
    const mainBoard = this.renderMainBoard(this.props.G, this.props.ctx);
    const playArea = this.renderCards(this.props.G.play_area, this.props.G, this.props.ctx);
    const playerBoard = this.renderPlayerBoard(currentPlayer(this.props.G, this.props.ctx), this.props.G, this.props.ctx);
    const control = this.renderControls(this.props.G, this.props.ctx);

    let winner = null;
    if (this.props.ctx.gameover) {
      winner = <div>Winner: {this.props.ctx.gameover}</div>;
    }

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
          {winner}
        </div>
      </div>
    );
  }
}

export default DominionBoard;