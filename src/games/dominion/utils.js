import { currentPlayer, getState } from '../utils'
import phases from './phases'

import copper from './base/cards/copper'
import estate from './base/cards/estate'

let populateModule = (mod, cards) => {
  mod.cards = cards;
  for (card in cards) {
    if (card.custom_phases)
      mod.custom_phases.push(...card.custom_phases);
    if (card.custom_moves)
      mod.custom_moves.push(...card.custom_moves);
  }
}

let populateMoves = (game, modules) => {
  for(mod in modules) {
    for (custom_move in mod.custom_moves) {
      game.moves[custom_move.name] = custom_move.move;
    }
  }
}

/**
 * Default action for playing cards.
 * 
 * Execute action of simple cards:
 * - draw cards
 * - add actions
 * - add buys
 * - add treasures
 * 
 * @param {GameState} state Game state
 * @param {GameMetadata} ctx Current game metadata
 * @param {Card} card Card beeing played
 */
function defaultAction(state, ctx, card) {
  const player = state.currentPlayer(ctx);
  state.drawCard(player, card.cards);
  state.addBuy(player, card.buy);
  state.addActions(player, card.actions);
  state.addTreasure(player, card.treasure);
}

/**
 * Activate the effects of the card.
 *
 * @param {string} cardName Card activated by player
 * @param {GameState} G Current game state
 * @param {GameMetadata} ctx Current game metadata
 */
let playCard = (state, ctx, card) => {
  let player = currentPlayer(state, ctx);

  if (ctx.phase === phases.ACTION_PHASE)
    player.actions--;

  if(card.onPlay) {
    card.onPlay(G, ctx);
  } else {
    defaultAction(state, ctx, card);
  }
  state.play_area.push(card);

  return state;
}

let buyCard = (state, ctx, player, card) => {
  // if the player has treasure to play
  if (player.treasure >= card.cost) {
    player.treasure -= card.cost;
    player.buy--;
    player.discard.push(card);
    card.count--;
  }

  return state;
}

/**
 * Check if a card can be played
 *
 * @param {Card} card Card played
 * @param {GameState} state Current board of the game
 * @param {GameMetadata} ctx Metadata of the game
 */
let canPlay = (state, ctx, card) => {
  if (ctx.phase === phases.ACTION_PHASE)
    return card.type.includes(types.ACTION);

  if (ctx.phase === phases.BUY_PHASE)
    return card.type.includes(types.TREASURE);

  if (ctx.phase === phases.REACTION_PHASE)
    return card.type.includes(types.REACTION);

  return false;
}

/**
 * Draw a number of cards from the deck into the player hand
 *
 * if no cards in the deck, shuffle the discard pile
 *
 * @param {Player object} player Player drawing the cards
 * @param {Number} [number=1] Number of cards to draw
 */
let drawCard = (player, number) => {
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
 * Generate a random start deck
 */
let startDeck = () => {
  let deck = [];
  for (let index = 0; index < 7; index++) {
    deck.push(copper);
  }
  for (let index = 0; index < 3; index++) {
    deck.push(estate);
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

let populateCardMap = (modules) => {
  let cardMap = new Map();
  for(mod in modules) {
    for(card in mod.cards) {
      cardMap.set(card.name, card);
    }
  }

  return cardMap;
}

export { playCard, buyCard, canPlay, drawCard, createPlayer, populateModule, populateCardMap, populateMoves }