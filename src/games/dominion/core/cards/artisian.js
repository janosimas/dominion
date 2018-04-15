import React from 'react';

import types from '../../cardTypes';
import { currentPlayer, getState } from '../../../utils';
import { pushPhase, getLastPhase, popPhase, getCardCost } from '../../utils';

const ARTISIAN_BUY_PHASE = 'Artisan buy phase';
const ARTISIAN_DISCARD_PHASE = 'Artisan discard phase';

const card = {
  name: 'Artisan',
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/1/1d/Artisan.jpg/200px-Artisan.jpg' alt="Artisan" />,
  isFaceUp: true,
  canHover: true,
  cost: 6,
  count: 10,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);
    pushPhase(state, ARTISIAN_BUY_PHASE);
    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: ARTISIAN_BUY_PHASE,
      allowedMoves: ['onClickBoard'],
      onPhaseBegin: (G, ctx) => {
        const state = getState(G);

        state.custom_onClickBoard = (state, ctx, player, card) => {
          if (ctx.phase !== ARTISIAN_BUY_PHASE) {
            return state;
          }

          if (card.cost <= 5) {
            player.hand.push(card);
            card.count--;
            state.end_phase = true;
          }

          return state;
        };

        state.onHighlightBoard = (G, ctx, card) => {
          if (getCardCost(G, ctx, card) > 5) {
            return '';
          }

          return ' highlight';
        };

        return state;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.allowEndPhase = undefined;
        state.custom_onClickBoard = undefined;
        state.onHighlightBoard = undefined;
        state.end_phase = undefined;
        return state;
      },
      endPhaseIf: (G, ctx) => {
        if (G.end_phase) {
          return ARTISIAN_DISCARD_PHASE;
        } else {
          return false;
        }
      }
    },
    {
      name: ARTISIAN_DISCARD_PHASE,
      allowedMoves: ['onClickHand'],
      onPhaseBegin: (G, ctx) => {
        const state = getState(G);

        state.custom_onClickHand = (G, ctx, index) => {
          if (ctx.phase !== ARTISIAN_DISCARD_PHASE) {
            return G;
          }

          const state = getState(G);
          const player = currentPlayer(state, ctx);

          player.deck.push(player.hand.splice(index, 1)[0]);
          state.end_phase = true;
          return state;
        };

        state.onHighlightHand = (G, ctx, card) => {
          return ' highlight-yellow';
        };

        return state;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.onHighlightHand = undefined;
        state.custom_onClickHand = undefined;
        state.end_phase = undefined;
        popPhase(state);
        return state;
      },
      endPhaseIf: (G, ctx) => {
        if (G.end_phase) {
          return getLastPhase(G);
        } else {
          return false;
        }
      }
    }
  ]
};

export default card;

