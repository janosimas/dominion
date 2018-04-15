import React from 'react';

import types from '../../cardTypes'
import { currentPlayer, getState } from '../../../utils'
import { pushPhase, popPhase, getLastPhase, getTopPhase, getCardCost } from '../../utils';

const REMODEL_BUY_PHASE = 'Remodel buy phase';
const REMODEL_TRASH_PHASE = 'Remodel trash phase';

const card = {
  name: "Remodel",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/2/2e/Remodel.jpg/200px-Remodel.jpg' alt="Remodel" />,
  isFaceUp: true,
  canHover: true,
  cost: 4,
  count: 10,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);
    pushPhase(state, REMODEL_TRASH_PHASE);
    state.custom_onClickHand = (G, ctx, index) => {
      if (ctx.phase !== REMODEL_TRASH_PHASE) {
        return G;
      }

      const state = getState(G);
      const player = currentPlayer(state, ctx);
      const card = player.hand.splice(index, 1)[0];
      state.trash.push(card);
      state.remodel_temp_treasure = getCardCost(state, ctx, card) + 2;
      popPhase(state);
      pushPhase(state, REMODEL_BUY_PHASE);
      return state;
    };
    state.onHighlightHand = (G, ctx, card) => {
      return ' highlight-red';
    };
    state.allowEndPhase = () => {
      return getLastPhase(state);
    };

    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: REMODEL_TRASH_PHASE,
      allowedMoves: ['onClickHand'],
      endPhaseIf: (G, ctx) => {
        if (getTopPhase(G) === REMODEL_BUY_PHASE) {
          return REMODEL_BUY_PHASE;
        }
        return false;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.custom_onClickBoard = (state, ctx, player, card) => {
          if (getCardCost(state, ctx, card) > state.remodel_temp_treasure) {
            return state;
          }

          player.discard.push(card);
          card.count--;
          state.remodel_temp_treasure = undefined;
          return state;
        };

        state.onHighlightBoard = (G, ctx, card) => {
          if (getCardCost(G, ctx, card) > state.remodel_temp_treasure) {
            return '';
          }

          return ' highlight';
        };

        state.allowEndPhase = false;
        state.custom_onClickHand = undefined;
        state.onHighlightHand = undefined;
        return state;
      }
    },
    {
      name: REMODEL_BUY_PHASE,
      allowedMoves: ['onClickBoard'],
      endPhaseIf: (G, ctx) => {
        if (!G.remodel_temp_treasure) {
          return getLastPhase(G);
        }
        return false;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.custom_onClickBoard = undefined;
        state.onHighlightBoard = undefined;
        state.allowEndPhase = undefined;
        popPhase(state);
        return state;
      }
    }
  ]
};

export default card;

