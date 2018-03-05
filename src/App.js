import { Client } from 'boardgame.io/react';
import { Game, PlayerView, Random } from 'boardgame.io/core';
import React from 'react';
import base_treasure from './cards/base_treasure';
import base_victory from './cards/base_victory';
import base_action from './cards/base_action';
import types from './cards/card_types';
import phases from './phases';

import './App.css';

function IsVictory(cells) {

}

let cardsMap = () => {
  let cardsMap = new Map();
  const cards = getCards();
  for (let index = 0; index < cards.length; index++) {
    const card = cards[index];
    cardsMap.set(card.name, card);
  }
  return cardsMap;
}

let getCards = () => {
  return [...base_victory, ...base_treasure, ...base_action];
}

/**
 * Generate a random start deck
 */
let startDeck = () => {
  let deck = [];
  for (let index = 0; index < 7; index++) {
    deck.push(base_treasure[0]);
  }
  for (let index = 0; index < 3; index++) {
    deck.push(base_victory[0]);
  }
  return Random.Shuffle(deck);
}

/**
 * Create a player with the initial game conditions
 */
let createPlayer = () => {
  let player = {
    deck: startDeck(),
    hand: [],
    discard: [],
    treasure: 0,
    actions: 1,
    buy: 1
  };

  player = draw(player, 5);
  return player;
}

/**
 * Draw a number of cards from the deck into the player hand
 *
 * if no cards in the deck, shuffle the discard pile
 *
 * @param {Player object} player Player drawing the cards
 * @param {Number} [number=1] Number of cards to draw
 */
let draw = (player, number) => {
  number = number || 1;
  for (let index = 0; index < number; index++) {
    if (player.deck.length === 0) {
      // if there is no card in the deck
      // shuffle the discard pile into the deck
      player.deck = Random.Shuffle(player.discard);
      player.discard = [];
      if (player.deck.length === 0) {
        // if we still have no card
        // nothing to do
        return player;
      }
    }
    player.hand.push(player.deck.shift());
  }
  player.hand.sort();
  return player;
}

/**
 * Check if a card can be played
 *
 * @param {*} card Card played
 * @param {*} G Current board of the game
 * @param {*} ctx Metadata of the game
 */
let canPlay = (card, G, ctx) => {
  if (ctx.phase === phases.ACTION_PHASE)
    return card.type.includes(types.ACTION);

  if (ctx.phase === phases.BUY_PHASE)
    return card.type.includes(types.TREASURE);

  return false;
}

/**
 * Activate the effects of the card.
 *
 * @param {string} cardName Card activated by player
 * @param {GameBoard} G Current game state
 * @param {GameMetadata} ctx Current game metadata
 */
let playCard = (card, G, ctx) => {
  let Gcopy = getBoard(G);
  let player = currentPlayer(Gcopy, ctx);

  if (ctx.phase === phases.ACTION_PHASE)
    player.actions--;

  if (card.cards) {
    draw(player, card.cards);
  }

  if (card.actions) {
    player.actions += card.actions;
  }

  if (card.buy) {
    player.buy += card.buy;
  }

  if (card.treasure) {
    player.treasure += card.treasure;
  }

  Gcopy.play_area.push(card);

  return Gcopy;
}

let currentPlayer = (G, ctx) => {
  return G.players[ctx.currentPlayer];
}

/**
 * Discard a number of cards from the player hand into the discard pile
 *
 * if number is greater than the number of cards in
 * the player hand, discard all cards
 *
 * @param {Player object} player Player discarding the cards
 * @param {Number} [number=1] Number of cards to discard
 */
let discard = (player, number) => {
  number = number || 1;
  for (let index = 0; index < number; index++) {
    if (player.hand.length === 0) {
      // if no cards in the player hand
      // nothing to do
      return player
    }
    player.discard.push(player.hand.pop());
  }
  return player;
}

let getBoard = (G) => {
  return Object.assign({}, G);
}

const Dominion = Game({
  setup: (numPlayers) => {
    let G = {
      victory: base_victory,
      treasure: base_treasure,
      kingdom: base_action,
      play_area: [],
      players: {},
      playerView: PlayerView.STRIP_SECRETS
    };

    for (var i = 0; i < numPlayers; i++) {
      G.players[i] = { ...createPlayer(), name: 'Player '+(i+1) };
    }

    return G;
  },

  moves: {
    onClickVictory(G, ctx, index) {
      let Gcopy = getBoard(G);
      const cells = [...Gcopy.victory];
      let card = cells[index];

      // Ensure we can't have less then 0 cards.
      if (card.count > 0) {
        let player = currentPlayer(Gcopy, ctx);

        // if the player has treasure to play
        if (player.treasure >= card.cost) {
          player.treasure -= card.cost;
          player.buy--;
          player.discard.push(card);
          card.count--;
        }
      }

      return Gcopy;
    },

    onClickKingdom(G, ctx, index) {
      let Gcopy = getBoard(G);
      const cells = [...Gcopy.kingdom];
      let card = cells[index];

      // Ensure we can't have less then 0 cards.
      if (card.count > 0) {
        let player = currentPlayer(Gcopy, ctx);

        // if the player has treasure to play
        if (player.treasure >= card.cost) {
          player.treasure -= card.cost;
          player.buy--;
          player.discard.push(card);
          card.count--;
        }
      }

      return Gcopy;
    },

    onClickTreasure(G, ctx, index) {
      let Gcopy = getBoard(G);
      const cells = [...Gcopy.treasure];
      let card = cells[index];

      // Ensure we can't have less then 0 cards.
      if (card.count > 0) {
        let player = currentPlayer(Gcopy, ctx);

        // if the player has treasure to play
        if (player.treasure >= card.cost) {
          player.treasure -= card.cost;
          player.buy--;
          player.discard.push(card);
          card.count--;
        }
      }

      return Gcopy;
    },

    onClickHand(G, ctx, index) {
      let Gcopy = Object.assign({}, G);
      let player = currentPlayer(Gcopy, ctx);
      let hand = player.hand;

      // sanity check
      if (index < 0 || index > hand.length)
        return Gcopy;

      // can the card be played?
      if (!canPlay(hand[index], Gcopy, ctx))
        return Gcopy;

      const card = hand.splice(index, 1)[0];

      Gcopy = playCard(card, Gcopy, ctx);

      return Gcopy;
    },
  },

  flow: {
    endGameIf: (G, ctx) => {
      if (false) {
        return ctx.currentPlayer;
      }
    },

    // Run at the end of a turn.
    onTurnEnd: (G, ctx) => {
      const Gcopy = getBoard(G);
      let player = currentPlayer(Gcopy, ctx)

      player.discard.push(...Gcopy.play_area);
      Gcopy.play_area = [];
      discard(player, player.hand.length);
      draw(player, 5);
      return Gcopy;
    },

    onTurnBegin: (G, ctx) => {
      const Gcopy = getBoard(G);
      let player = currentPlayer(Gcopy, ctx);
      player.actions = 1;
      player.buy = 1;
      player.treasure = 0;

      return Gcopy;
    },

    phases: [
      {
        name: phases.ACTION_PHASE,
        allowedMoves: ['onClickHand'],
        endPhaseIf: (G, ctx) => {
          let player = currentPlayer(G, ctx);
          return player.actions === 0;
        }
      },
      {
        name: phases.BUY_PHASE,
        allowedMoves: ['onClickHand', 'onClickVictory', 'onClickKingdom', 'onClickTreasure']
      },
    ],
  },
});

class DominionBoard extends React.Component {
  onClickEndPhase() {
    this.props.events.endPhase();
  }

  onClickEndTurn() {
    this.props.events.endPhase();
    this.props.events.endTurn();
  }

  /**
   * Event of clicking in an item of the board.
   *
   * @param {number} id Id of the clicked item.
   */
  onClickVictory(id, self) {
    if (self.isActive(id)) {
      self.props.moves.onClickVictory(id);
    }
  }

  onClickTreasure(id, self) {
    if (self.isActive(id)) {
      self.props.moves.onClickTreasure(id);
    }
  }

  onClickKingdom(id, self) {
    if (self.isActive(id)) {
      self.props.moves.onClickKingdom(id);
    }
  }

  onClickHand(id, self) {
    if (self.isActive(id)) {
      self.props.moves.onClickHand(id);
      let player = currentPlayer(self.props.G, self.props.ctx);
      if (self.props.ctx.phase === phases.ACTION_PHASE && player.actions === 0)
        self.props.events.endTurn();

      if (self.props.ctx.phase === phases.BUY_PHASE && player.buy === 0)
        self.props.events.endTurn();
    }
  }

  isActive(id) {
    // if (this.props.G.cells[id].count === 0) return false;
    return true;
  }

  renderMainBoard(G, ctx) {
    let tbody = [];
    tbody.push(...this.renderCards(G.victory, this.onClickVictory, G, ctx));
    tbody.push(...this.renderCards(G.treasure, this.onClickTreasure, G, ctx));
    tbody.push(...this.renderCards(G.kingdom, this.onClickKingdom, G, ctx));

    return tbody;
  }

  renderCards(cards, onClickAction, G, ctx, highlight) {
    let tbody = [];
    for (let index = 0; index < cards.length; index++) {
      let className = 'card';
      if (highlight) {
        if (ctx.phase === phases.ACTION_PHASE
            && cards[index].type.includes(types.ACTION))
          className += ' highlight';

        if (ctx.phase === phases.BUY_PHASE
            && cards[index].type.includes(types.TREASURE))
          className += ' highlight';
      }

      tbody.push(
        <span className={className} onClick={() => onClickAction(index, this)}>
          <img src={cards[index].image} alt={cards[index].name} />
        </ span>);
    }
    return tbody;
  }

  renderPlayerBoard(player, G, ctx) {
    let tbody = [];
    let deck = {
      margin: '15px'
    }
    tbody.push(
      <span className='card' style={deck}>
        <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />
      </ span>);

    tbody.push(...this.renderCards(player.hand, this.onClickHand, G, ctx, true));
    return tbody;
  }

  renderControls(G, ctx) {
    let player = currentPlayer(G, ctx);

    let controls = [];
    controls.push(<span>Current player: {player.name}</span>);
    controls.push(<br />);
    controls.push(<span>Current phase: {ctx.phase}</span>);
    controls.push(<br />);
    controls.push(<span>Treasure: {player.treasure}</span>);
    controls.push(<br />);
    controls.push(<span>Actions: {player.actions}</span>);
    controls.push(<br />);
    controls.push(<span>Buy: {player.buy}</span>);
    controls.push(<br />);
    if (ctx.phase === phases.ACTION_PHASE)
      controls.push(<button type="button" onClick={() => this.onClickEndPhase()}>end phase</button>);
    else
      controls.push(<button type="button" onClick={() => this.onClickEndTurn()}>end turn</button>);
    return controls;
  }

  render() {
    let winner = '';
    if (this.props.ctx.gameover !== null) {
      winner = <div>Winner: {this.props.ctx.gameover}</div>;
    }
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
        {winner}
        <div className='controls'>
          {control}
        </div>
      </div>
    );
  }
}

const App = Client({
  game: Dominion,
  numPlayers: 4,
  board: DominionBoard
});

export default App;
