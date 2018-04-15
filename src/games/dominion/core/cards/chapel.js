import React from 'react';

import types from '../../cardTypes';
import { currentPlayer, getState } from '../../../utils';
import { pushPhase, getLastPhase, popPhase } from '../../utils';

const CUSTOM_PHASE = 'Chapel trash phase';

const card = {
  name: 'Chapel',
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/2/29/Chapel.jpg/200px-Chapel.jpg' alt="Chapel" />,
  isFaceUp: true,
  canHover: true,
  cost: 2,
  count: 10,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);
    pushPhase(state, CUSTOM_PHASE);
    

    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: CUSTOM_PHASE,
      allowedMoves: ['onClickHand'],
      onPhaseBegin: (G, ctx) => {
        const state = getState(G);
        state.trash_count = 0;
        state.custom_onClickHand = (G, ctx, index) => {
          if (ctx.phase !== CUSTOM_PHASE) {
            return G;
          }

          const state = getState(G);
          const player = currentPlayer(state, ctx);
          state.trash.push(player.hand.splice(index, 1)[0]);
          state.trash_count++;
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
      endPhaseIf: (G, ctx) => {
        if(G.trash_count === 4) {
          return getLastPhase(G);
        }

        return false;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.trash_count = undefined;
        state.custom_onClickHand = undefined;
        state.onHighlightHand = undefined;
        state.allowEndPhase = undefined;
        popPhase(state);
        return state;
      }
    }
  ]
};

export default card;

