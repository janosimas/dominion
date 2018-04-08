import React from 'react';

import types from '../../cardTypes'
import { currentPlayer, getState } from '../../../utils'

import gold from '../../base/cards/gold'
import { getLastPhase, popPhase, pushPhase, popDeckCard } from '../../utils';

const CUSTOM_PHASE = 'Bandit trash phase';

const card = {
  name: "Bandit",
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

    state.attack = true;
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

        if (state.render_extra.topDeck) {
          const discardCard = state.render_extra.topDeck[0];
          player.discard.push(discardCard);
        }

        state.end_turn = true;
        return state;
      }
    }
  ],
  custom_phases: [
    {
      name: CUSTOM_PHASE,
      allowedMoves: ['onClickExtraBandit'],
      endTurnIf: (G, ctx) => {
        return !!G.end_turn;
      },
      onPhaseBegin: (G, ctx) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);
        if (state.active_player === player) {
          state.end_turn = true;
          return state;
        }
        
        return state;
      },
      onTurnBegin: (G, ctx) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);
        state.end_turn = false;
        if (state.active_player === player) {
          state.custom_end_phase = true;
          return state;
        }


        const topDeck = [];
        const card1 = popDeckCard(ctx, player);
        if (card1 && card1.type.includes(types.TREASURE)) {
          topDeck.push(card1);
        }
        const card2 = popDeckCard(ctx, player);
        if (card2 && card2.type.includes(types.TREASURE)) {
          topDeck.push(card2);
        }

        if (topDeck) {
          state.render_extra = {
            cards: topDeck,
            cardsMove: 'onClickExtraBandit'
          }
        } else {
          state.end_turn = true;
        }

        return state;
      },
      
      onTurnEnd: (G, ctx) => {
        const state = getState(G);
        state.render_extra = undefined;
        state.end_turn = undefined;

        return state;
      },

      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.active_player = undefined;
        state.attack = undefined;
        state.end_turn = undefined;
        popPhase(state);
        
        return state;
      },
      endPhaseIf: (G, ctx) => {
        if (G.custom_end_phase) {
          return getLastPhase(G);
        } else {
          return false;
        }
      }
    }
  ]
};

export default card;

