import React from 'react';

import types from '../../cardTypes'
import phases from '../../phases'
import { currentPlayer, getState, discard } from '../../../utils'

const card = {
  name: "Militia",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/a/a0/Militia.jpg/200px-Militia.jpg' alt="Militia" />,
  isFaceUp: true,
  canHover: true,
  cost: 4,
  count: 10,
  treasure: 2,
  className: 'card',
  type: [types.ACTION, types.ATTACK],
  onPlay: (G, ctx) => {
    const state = getState(G);
    state.active_player = currentPlayer(state, ctx);
    state.custom_phase = 'militia_discard_phase';
    state.custom_onClickHand = (G, ctx, index) => {
      if (ctx.phase !== 'militia_discard_phase') {
        return G;
      }

      const state = getState(G);
      const player = currentPlayer(state, ctx);
      discard(player, index);
      return state;
    };
    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: 'militia_discard_phase',
      allowedMoves: ['onClickHand'],
      endTurnIf: (G, ctx) => {
        const player = currentPlayer(G, ctx);
        if (G.active_player === player) {
          return false;
        }
        return player.hand.size <= 3;
      },
      endPhaseIf: (G, ctx) => {
        const player = currentPlayer(G, ctx);
        if (G.active_player === player) {
          G.custom_phase = null;
          G.active_player = null;
          G.custom_onClickHand = null;
          return phases.ACTION_PHASE;
        } else {
          return false;
        }
      }
    }
  ]
};

export default card;

