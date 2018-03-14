import React from 'react';

import types from '../../cardTypes'
import phases from '../../phases'
import { currentPlayer, getState, discard } from '../../../utils'
import { drawCard } from '../../utils';

const card = {
  name: "Chapel",
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
    state.custom_phase = 'Chapel trash phase';
    state.trash_count = 0;
    state.custom_onClickHand = (G, ctx, index) => {
      if (ctx.phase !== 'Chapel trash phase') {
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
      return phases.ACTION_PHASE;
    };

    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: 'Chapel trash phase',
      allowedMoves: ['onClickHand'],
      endPhaseIf: (G, ctx) => {
        return G.trash_count === 4;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);
        state.trash_count = undefined;
        state.custom_phase = undefined;
        state.custom_onClickHand = undefined;
        state.onHighlightHand = undefined;
        state.allowEndPhase = undefined;
        return state;
      }
    }
  ]
};

export default card;

