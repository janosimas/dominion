import React from 'react';
import { Card } from 'boardgame.io/ui';

import { currentPlayer } from '../utils'
import phases from './phases'
import './board.css';
import { canPlay, canBuy } from './utils';

class DominionBoard extends React.Component {

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

  onClickExtra(id) {
    this.props.moves.onClickExtra(id);
  }

  renderMainBoard(G, ctx) {
    const cards = G.boardCards;
    let tbody = [];
    for (let index = 0; index < cards.length; index++) {
      if (cards[index].count === 0) {
        // empty pile of cards on the board
        tbody.push(<Card {...cards[index]} key={cards[index].name} front={null} canHover={false} />); 
      } else {
        const card = Object.assign({}, cards[index]);
        if (canBuy(G, ctx, card)) {
          card.className+=" highlight";
        } else if (G.onHighlightBoard) {
          card.className += (G.onHighlightBoard(G, ctx, card) || "");
        }

        // pile of cards on the board
        tbody.push(<Card {...card} key={card.name} onClick={() => this.props.moves.onClickBoard(card.name)} />);
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

  renderExtra(G, ctx) {
    const render_extra = G.render_extra;
    if (!render_extra) {
      return undefined;
    }

    const cards = render_extra.cards;
    let tbody = [];
    for (let index = 0; index < cards.length; index++) {
      const card = cards[index];
      let onClick = undefined;
      if (render_extra.cardsMove) {
        onClick = () => this.props.moves[render_extra.cardsMove](index);
      }
      tbody.push(<Card {...card} key={index} onClick={onClick}/>);
    }
    if (tbody) {
      tbody.push(<br key='br1000'/>);
    }

    const moves = this.props.moves;
    if (render_extra.buttons) {
      for (const button of render_extra.buttons) {
        tbody.push(<button key={button.text} onClick={() => { button.onClick(moves)}}> { button.text }</button>);
      }
    }

    return <div className='extra'>{tbody}</div>;
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

    // only show image if there are cards in the deck
    const image = player.deck.length ? <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' /> : undefined;
    tbody.push(
      <Card back={image}
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
      } else if (G.onHighlightHand) {
        card.className += G.onHighlightHand(G, ctx, card) || "" ;
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
      controls.push(<button key='end-phase' type="button" onClick={() => this.props.events.endPhase(phases.BUY_PHASE)}>end phase</button>);
    else if (ctx.phase === phases.BUY_PHASE)
      controls.push(<button key='end-turn' type="button" onClick={() => this.onClickEndTurn()}>end turn</button>);
    else if (G.allowEndPhase) {
      const phase = G.allowEndPhase();
      controls.push(<button key='end-phase' type="button" onClick={() => this.props.events.endPhase(phase)}>end phase</button>);
    }
    return controls;
  }

  render() {
    const G = this.props.G;
    const ctx = this.props.ctx;
    const mainBoard = this.renderMainBoard(G, ctx);
    const playArea = this.renderCards(G.play_area, G, ctx);
    const playerBoard = this.renderPlayerBoard(currentPlayer(G, ctx), G, ctx);
    const control = this.renderControls(G, ctx);
    const extraArea = this.renderExtra(G, ctx);

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
        {extraArea}
      </div>
    );
  }
}

export default DominionBoard;