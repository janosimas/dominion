import React from 'react';

import types from '../../cardTypes'
import phases from '../../phases'
import { currentPlayer, getState, discard } from '../../../utils'
import { drawCard, pushPhase, popPhase } from '../../utils';

const CUSTOM_PHASE = 'Cellar discard phase';

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
    pushPhase(state, CUSTOM_PHASE);
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
      name: CUSTOM_PHASE,
      allowedMoves: ['onClickHand'],
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);
        drawCard(ctx, player, state.discard_count);
        state.discard_count = undefined;
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

