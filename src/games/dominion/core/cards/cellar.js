import React from 'react';

import types from '../../cardTypes'
import phases from '../../phases'
import { currentPlayer, getState, discard } from '../../../utils'
import { drawCard } from '../../utils';

const card = {
  name: "Cellar",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/1/1c/Cellar.jpg/200px-Cellar.jpg' alt="Cellar" />,
  isFaceUp: true,
  canHover: true,
  cost: 2,
  count: 10,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);
    const player = currentPlayer(state, ctx);
    player.actions++;
    state.custom_phase = 'Cellar discard phase';
    state.discard_count = 0;
    state.custom_onClickHand = (G, ctx, index) => {
      if (ctx.phase !== 'Cellar discard phase') {
        return G;
      }

      const state = getState(G);
      const player = currentPlayer(state, ctx);
      discard(player, index);
      state.discard_count++;
      return state;
    };
    state.onHighlightHand = (G, ctx, card) => {
      return ' highlight-yellow';
    };
    state.allowEndPhase = () => {
      return phases.ACTION_PHASE;
    };

    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: 'Cellar discard phase',
      allowedMoves: ['onClickHand'],
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);
        drawCard(ctx, player, state.discard_count);
        state.discard_count = undefined;
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

