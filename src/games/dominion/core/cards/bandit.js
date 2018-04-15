import React from 'react';

import types from '../../cardTypes';
import { currentPlayer, getState } from '../../../utils';

import gold from '../../base/cards/gold';
import { getLastPhase, popPhase, pushPhase, popDeckCard, playReaction } from '../../utils';

const CUSTOM_PHASE = 'Bandit trash phase';

const card = {
  name: 'Bandit',
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/4/46/Bandit.jpg/200px-Bandit.jpg' alt="Bandit" />,
  isFaceUp: true,
  canHover: true,
  cost: 5,
  count: 10,
  className: 'card',
  type: [types.ACTION, types.ATTACK],
  onPlay: (G, ctx) => {
    const state = getState(G);
    const player = currentPlayer(state, ctx);
    if (gold.count > 0) {
      player.discard.push(gold);
      gold.count--;
    }

    state.active_player = currentPlayer(state, ctx);
    pushPhase(state, CUSTOM_PHASE);

    return state;
  },
  custom_moves: [
    {
      name: 'onClickExtraBandit',
      move: (G, ctx, index) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);
        const trashCard = state.render_extra.cards.splice(index, 1)[0];
        state.trash.push(trashCard);

        if (state.render_extra.cards.length > 0) {
          const discardCard = state.render_extra.cards[0];
          player.discard.push(discardCard);
        }

        state.attack_condition = true;
        return state;
      }
    }
  ],
  custom_phases: [
    {
      name: CUSTOM_PHASE,
      allowedMoves: ['onClickExtraBandit', 'customAction'],
      endTurnIf: (G, ctx) => {
        const player = currentPlayer(G, ctx);
        // end turn action
        if (G.end_turn) {
          return true;
        }

        // this happens when the attack
        // has ended and it's the active player again
        if (G.active_player === player) {
          return true;
        }

        // attack condition
        return !!G.attack_condition;
      },
      onTurnBegin: (G, ctx) => {
        let state = getState(G);
        const player = currentPlayer(G, ctx);
        if (state.active_player === player) {
          // this happens when the attack
          // has ended and it's the active player again
          state.end_attack_phase = true;
          return state;
        }

        state.attack_condition = false;

        // activate reaction cards
        const [newState, endTurn] = playReaction(state, ctx);
        state = newState;

        const topDeck = [];
        const card1 = popDeckCard(ctx, player);
        if (card1
            && card1.type.includes(types.TREASURE)
            && card1.name !== 'Copper') {
          topDeck.push(card1);
        }
        const card2 = popDeckCard(ctx, player);
        if (card2
            && card2.type.includes(types.TREASURE)
            && card2.name !== 'Copper') {
          topDeck.push(card2);
        }

        // allow end turn?
        if (endTurn || topDeck.length === 0) {
          state.customAction = {
            name: 'End Turn',
            action: (state, ctx) => {
              state.end_turn = true;
              return state;
            }
          };
        } else if (topDeck.length > 0) {
          state.render_extra = {
            cards: topDeck,
            cardsMove: 'onClickExtraBandit'
          };
        }

        return state;
      },
      onTurnEnd: (G, ctx) => {
        const state = getState(G);
        state.customAction = undefined;
        state.render_extra = undefined;
        state.end_turn = undefined;
        state.attack_condition = undefined;

        return state;
      },

      endPhaseIf: (G, ctx) => {
        if (G.end_attack_phase) {
          return getLastPhase(G);
        } else {
          return false;
        }
      },
      onPhaseBegin: (G, ctx) => G,
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.active_player = undefined;
        state.end_attack_phase = undefined;
        popPhase(state);

        return state;
      }
    }
  ]
};

export default card;

