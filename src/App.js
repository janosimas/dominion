import { Client } from 'boardgame.io/react';
import { Game, PlayerView, Random } from 'boardgame.io/core';
import React from 'react';
import base_treasure from './cards/base_treasure';
import base_victory from './cards/base_victory';
import base_action from './cards/base_action';
import types from './cards/card_types';
import phases from './phases';

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
  setup: () => ({
    victory: base_victory,
    treasure: base_treasure,
    kingdom: base_action,
    play_area: [],
    players: {
      0: createPlayer(),
      1: createPlayer()
    },
    playerView: PlayerView.STRIP_SECRETS
  }),

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
        allowedMoves: ['onClickHand', 'onClickVictory', 'onClickKingdom', 'onClickTreasure'],
        endPhaseIf: (G, ctx) => {
          const player = currentPlayer(G, ctx);
          return player.buy === 0;
        }
      },
    ],
  },
});

class DominionBoard extends React.Component {
  onClickEndPhase() {
    this.props.events.endPhase();
  }
  /**
   * Event of clicking in an item of the board.
   * 
   * @param {number} id Id of the clicked item.
   */
  onClickVictory(id) {
    if (this.isActive(id)) {
      this.props.moves.onClickVictory(id);
      let player = currentPlayer(this.props.G, this.props.ctx);
      if (player.buy === 0)
        this.props.events.endTurn();
    }
  }

  onClickTreasure(id) {
    if (this.isActive(id)) {
      this.props.moves.onClickTreasure(id);
      let player = currentPlayer(this.props.G, this.props.ctx);
      if (player.buy === 0)
        this.props.events.endTurn();
    }
  }

  onClickKingdom(id) {
    if (this.isActive(id)) {
      this.props.moves.onClickKingdom(id);
      let player = currentPlayer(this.props.G, this.props.ctx);
      if (player.buy === 0)
        this.props.events.endTurn();
    }
  }

  onClickHand(id) {
    if (this.isActive(id)) {
      this.props.moves.onClickHand(id);
      let player = currentPlayer(this.props.G, this.props.ctx);
      if (this.props.ctx.phase === phases.ACTION_PHASE && player.actions === 0)
        this.props.events.endTurn();

      if (this.props.ctx.phase === phases.BUY_PHASE && player.buy === 0)
        this.props.events.endTurn();
    }
  }

  isActive(id) {
    // if (this.props.G.cells[id].count === 0) return false;
    return true;
  }

  renderMainBoard(G, cellStyle) {
    let tbody = [];
    let victory_cards = [];
    for (let index = 0; index < G.victory.length; index++) {
      victory_cards.push(
        <td style={cellStyle} key={index} onClick={() => this.onClickVictory(index)}>
          {
            G.victory[index].count > 0 &&
            <img style={cellStyle} src={G.victory[index].image} alt={G.victory[index].name} />
          }
        </td>);
    }
    tbody.push(<tr>{victory_cards}</tr>);

    let treasure_cards = [];
    for (let index = 0; index < G.treasure.length; index++) {
      treasure_cards.push(
        <td style={cellStyle} key={index} onClick={() => this.onClickTreasure(index)}>
          {
            G.treasure[index].count > 0 &&
            <img style={cellStyle} src={G.treasure[index].image} alt={G.treasure[index].name} />
          }
        </td>);
    }
    tbody.push(<tr>{treasure_cards}</tr>);

    // for (let line = 0; line < 2; line++) {
    let kingdom_cards = [];
    for (let index = 0; index < G.kingdom.length; index++) {
      kingdom_cards.push(
        <td style={cellStyle} key={index} onClick={() => this.onClickKingdom(index)}>
          {
            G.kingdom[index].count > 0 &&
            <img style={cellStyle} src={G.kingdom[index].image} alt={G.kingdom[index].name} />
          }
        </td>);
    }
    tbody.push(<tr>{kingdom_cards}</tr>);
    // }

    return tbody;
  }

  renderPlayArea(G, cellStyle) {
    let tbody = [];
    for (let index = 0; index < G.play_area.length; index++) {
      tbody.push(
        <td>
          <img style={cellStyle} src={G.play_area[index].image} alt={G.play_area[index].name} />
        </td>);
    }
    return <tr>{tbody}</tr>;
  }

  renderPlayerBoard(player, cellStyle) {
    let tbody = [];
    tbody.push(
      <td>
        <img style={cellStyle} src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />
      </td>);

    for (let index = 0; index < player.hand.length; index++) {
      tbody.push(
        <td key={index} onClick={() => this.onClickHand(index)}>
          <img style={cellStyle} src={player.hand[index].image} alt={player.hand[index].name} />
        </td>);
    }
    return <tr>{tbody}</tr>;
  }

  renderControls() {
    let controls = [];
    controls.push(<button type="button" onClick={() => this.onClickEndPhase()}>end phase</button>);
    controls.push(<br />);
    // controls.push(<button type="button" onClick={() => this.onClickEndTurn()}>end turn</button>);
    return controls;
  }

  render() {
    let winner = '';
    if (this.props.ctx.gameover !== null) {
      winner = <div>Winner: {this.props.ctx.gameover}</div>;
    }
    // 200 x 322
    const cellStyle = {
      border: '1px solid #555',
      width: '100px',
      height: '161px',
      textAlign: 'center',
    };

    const mainBoard = this.renderMainBoard(this.props.G, cellStyle);
    const playArea = this.renderPlayArea(this.props.G, cellStyle);
    const playerBoard = this.renderPlayerBoard(currentPlayer(this.props.G, this.props.ctx), cellStyle);
    const control = this.renderControls();

    return (
      <div>
        <table id="board">
          <tbody>{mainBoard}</tbody>
        </table>
        <br /><br />
        <table id="play-area">
          <tbody>{playArea}</tbody>
        </table>
        <br /><br />
        <table id="player-board">
          <tbody>{playerBoard}</tbody>
        </table>
        <br />
        {winner}
        <br />
        {control}
      </div>
    );
  }
}

const App = Client({
  game: Dominion,
  board: DominionBoard
});

export default App;

// import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h1 className="App-title">Welcome to React</h1>
//         </header>
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload.
//         </p>
//       </div>
//     );
//   }
// }

// export default App;
