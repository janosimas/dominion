import { currentPlayer } from '../utils';
import phases from './phases';
import types from './cardTypes';

import copper from './base/cards/copper';
import estate from './base/cards/estate';

const populateModule = (mod, cards) => {
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
};

const populateMoves = (game, modules) => {
  for (let index = 0; index < modules.length; index++) {
    const mod = modules[index];
    if (!mod.custom_moves) {
      continue;
    }

    for (let i = 0; i < mod.custom_moves.length; i++) {
      const custom_move = mod.custom_moves[i];
      game.moves[custom_move.name] = custom_move.move;
    }
  }
};

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
const defaultAction = (state, ctx, card) => {
  const player = currentPlayer(state, ctx);
  if (card.cards) {
    drawCard(ctx, player, card.cards);
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
};

/**
 * Activate the effects of the card.
 *
 * @param {GameState} G Current game state
 * @param {GameMetadata} ctx Current game metadata
 * @param {number} index Index of the card activated by player
 */
const playCardFromHand = (state, ctx, index) => {
  const player = currentPlayer(state, ctx);
  const hand = player.hand;

  if (ctx.phase === phases.ACTION_PHASE
    || ctx.phase === phases.BUY_PHASE) {

    let card = hand[index];
    if (!canPlay(state, ctx, card)) {
      return state;
    }

    if (ctx.phase === phases.ACTION_PHASE) {
      // cards played in the action phase consume actions
      // other cards that play cards as effects have their own phase
      player.actions--;
    }

    // remove card from hand
    card = hand.splice(index, 1)[0];
    state = playCard(state, ctx, card, index);
  } else if (state.custom_onClickHand) {
    state = state.custom_onClickHand(state, ctx, index);
  } else {
    throw new Error('Invalid play card from hand!');
  }
  return state;
};

const playCopy = (state, ctx, card) => {
  const tempCard = Object.assign({}, card);
  tempCard.temp = true;
  tempCard.className +=' dim-out';
  return playCard(state, ctx, card);
};

const playCard = (state, ctx, card) => {
  if (card.onPlay) {
    state = card.onPlay(state, ctx);
  } else {
    defaultAction(state, ctx, card);
  }
  state.play_area.push(card);
  
  const removeIndexes = [];
  for (let index = 0; index < state.onPlayHandTrigger.length; index++) {
    const trigger = state.onPlayHandTrigger[index];
    const [newState, remove] = trigger(state, ctx, card);
    state = newState;
    if(remove) {
      removeIndexes.push(index);
    }
  }

  for(const index of removeIndexes) {
    state.onPlayHandTrigger.splice(index, 1);
  }

  return state;
};

const buyCard = (state, ctx, player, card) => {
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
};

/**
 * Check if a card can be played
 *
 * @param {Card} card Card played
 * @param {GameState} state Current board of the game
 * @param {GameMetadata} ctx Metadata of the game
 */
const canPlay = (state, ctx, card) => {
  const player = currentPlayer(state, ctx);
  if (ctx.phase === phases.ACTION_PHASE && player.actions > 0) {
    return card.type.includes(types.ACTION);
  }

  if (ctx.phase === phases.BUY_PHASE) {
    return card.type.includes(types.TREASURE) && !card.type.includes(types.ACTION);
  }

  if (ctx.phase === phases.REACTION_PHASE) {
    return card.type.includes(types.REACTION);
  }

  return false;
};

/**
 * Check if the current player can buy a card 
 */
const canBuy = (state, ctx, card) => {
  const player = currentPlayer(state, ctx);
  if (ctx.phase === phases.BUY_PHASE
    && player.buy > 0) {
    return player.treasure >= card.cost;
  }

  return false;
};

const popDeckCard = (ctx, player) => {
  if (player.deck.length === 0) {
    // if there is no card in the deck
    // shuffle the discard pile into the deck
    player.deck = ctx.random.Shuffle(player.discard);
    player.discard = [];
    if (player.deck.length === 0) {
      // if we still have no card
      // nothing to do
      return undefined;
    }
  }

  return player.deck.shift();
};

/**
 * Draw a number of cards from the deck into the player hand
 *
 * if no cards in the deck, shuffle the discard pile
 *
 * @param {Player object} player Player drawing the cards
 * @param {Number} [number=1] Number of cards to draw
 */
const drawCard = (ctx, player, number) => {
  number = number || 1;
  for (let index = 0; index < number; index++) {
    const card = popDeckCard(ctx, player);
    if(!card) {
      // empty deck
      break;
    }

    player.hand.push(card);
  }
  player.hand.sort();

  return player;
};

/**
 * Generate a random start deck
 */
const startDeck = (ctx) => {
  const deck = [];
  for (let index = 0; index < 7; index++) {
    deck.push(copper);
  }
  
  for (let index = 0; index < 3; index++) {
    deck.push(estate);
  }

  return ctx.random.Shuffle(deck);
};

/**
 * Create a player with the initial game conditions
 */
const createPlayer = (ctx) => {
  let player = {
    deck: startDeck(ctx),
    hand: [],
    discard: [],
    treasure: 0,
    actions: 1,
    buy: 1
  };

  player = drawCard(ctx, player, 5);
  return player;
};

const populateCardMap = (modules) => {
  const cardMap = new Map();
  for (let index = 0; index < modules.length; index++) {
    const mod = modules[index];
    for (let i = 0; i < mod.cards.length; i++) {
      const card = mod.cards[i];
      cardMap.set(card.name, card);
    }
  }

  return cardMap;
};

const getCardCost = (G, ctx, card) => {
  return card.cost;
};

const pushPhase = (state, phase) => {
  state.phase_pile.push(phase);
};

const getLastPhase = (G) => {
  return G.phase_pile[G.phase_pile.length - 2];
};

const getTopPhase = (G) => {
  return G.phase_pile[G.phase_pile.length - 1];
};

const popPhase = (state) => {
  state.phase_pile.pop();
};

const playReaction = (state, ctx) => {
  const player = currentPlayer(state, ctx);
  let endPhase = false;
  for(const card of player.hand) {
    if(card.onReaction) {
      const [newState, newEndPhase] = card.onReaction(state, ctx);
      state = newState;
      endPhase = endPhase || newEndPhase;
    }
  }

  return [state, endPhase];
};

export { playReaction, playCopy, popDeckCard, getTopPhase, pushPhase, getLastPhase, popPhase, getCardCost, defaultAction, playCardFromHand, playCard, buyCard, canPlay, canBuy, drawCard, createPlayer, populateModule, populateCardMap, populateMoves };
