import { Random } from 'boardgame.io/core';

import { currentPlayer } from '../utils'
import phases from './phases'
import types from './cardTypes'

import copper from './base/cards/copper'
import estate from './base/cards/estate'

let populateModule = (mod, cards) => {
  mod.cards = cards;
  for (let index = 0; index < cards.length; index++) {
    const card = cards[index];
    if (card.custom_phases) {
      mod.custom_phases.push(...card.custom_phases);
    }
    if (card.custom_moves) {
      mod.custom_moves.push(...card.custom_moves);
    }
  }
}

let populateMoves = (game, modules) => {
  for (let index = 0; index < modules.length; index++) {
    const mod = modules[index];
    if(!mod.custom_moves) {
      continue;
    }
    
    for (let i = 0; i < mod.custom_moves.length; i++) {
      const custom_move = mod.custom_moves[i];
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
  const player = currentPlayer(state, ctx);
  if (card.cards) {
    drawCard(player, card.cards);
  }
  if (card.buy) {
    player.buy += card.buy;
  }
  if (card.actions) {
    player.actions += card.actions;
  }
  if (card.treasure) {
    player.treasure += card.treasure;
  }
}

/**
 * Activate the effects of the card.
 *
 * @param {GameState} G Current game state
 * @param {GameMetadata} ctx Current game metadata
 * @param {number} index Index of the card activated by player
 */
let playCardFromHand = (state, ctx, index) => {
  let player = currentPlayer(state, ctx);
  const hand = player.hand;
  
  if (ctx.phase === phases.ACTION_PHASE
      || ctx.phase === phases.BUY_PHASE) {
  
    if (ctx.phase === phases.ACTION_PHASE) {
      // cards played in the action phase consume actions
      // other cards that play cards as effects have their own phase
      player.actions--;
    }

    // remove card from hand
    const card = hand.splice(index, 1)[0];
    if (!canPlay(state, ctx, card)) {
      return state;
    }
    state = playCard(state, ctx, card, index);

  } else if (state.custom_onClickHand) {
    state = state.custom_onClickHand(state, ctx, index);
  } else {
    const error = 'Invalid play card from hand!';
    throw error;
  }
  return state;
}

let playCard = (state, ctx, card) => {
  let player = currentPlayer(state, ctx);

  if (state.attack && card.type.includes(types.REACTION)) {
    const reaction = card.onReaction(state, ctx);
    state = reaction[0];
    const endPhase = reaction[1];
    player.hand.push(card);
    if (endPhase) {
      //TODO: end phase here
    }
  } else {
    if (card.onPlay) {
      state = card.onPlay(state, ctx);
    } else {
      defaultAction(state, ctx, card);
    }
    state.play_area.push(card);
  }

  return state;
}

let buyCard = (state, ctx, player, card) => {

  if (state.custom_onClickBoard) {
    state = state.custom_onClickBoard(state, ctx, player, card);
  } else if (player.treasure >= card.cost) {
    // if the player has treasure to play
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
  if (ctx.phase === phases.ACTION_PHASE) {
    return card.type.includes(types.ACTION);
  }

  if (ctx.phase === phases.BUY_PHASE) {
    return card.type.includes(types.TREASURE) && !card.type.includes(types.ACTION);
  }

  if (ctx.phase === phases.REACTION_PHASE) {
    return card.type.includes(types.REACTION);
  }

  return false;
}

/**
 * Check if the current player can buy a card 
 */
let canBuy = (state, ctx, card) => {
  const player = currentPlayer(state, ctx);
  if (ctx.phase === phases.BUY_PHASE
      && player.buy > 0) {
    return player.treasure >= card.cost;
  }

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

  player = drawCard(player, 5);
  return player;
}

let populateCardMap = (modules) => {
  let cardMap = new Map();
  for (let index = 0; index < modules.length; index++) {
    const mod = modules[index];
    for (let i = 0; i < mod.cards.length; i++) {
      const card = mod.cards[i];
      cardMap.set(card.name, card);
    }
  }

  return cardMap;
}

export { defaultAction, playCardFromHand, playCard, buyCard, canPlay, canBuy, drawCard, createPlayer, populateModule, populateCardMap, populateMoves }