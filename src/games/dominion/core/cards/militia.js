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
    const player = currentPlayer(state, ctx);
    // javascript if getting lost with "this"
    // be careful with changes
    player.treasure += 2;
    
    state.end_turn = true;
    state.attack = true;
    state.active_player = currentPlayer(state, ctx);
    state.custom_phase = 'Militia discard phase';
    state.onHighlightHand = (G, ctx, card) => {
      if(card.type.includes(types.REACTION)) {
        return ' highlight';
      }

      return ' highlight-yellow';
    };
    state.custom_onClickHand = (G, ctx, index) => {
      if (ctx.phase !== 'Militia discard phase') {
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
      name: 'Militia discard phase',
      allowedMoves: ['onClickHand'],
      endTurnIf: (G, ctx) => {
        const player = currentPlayer(G, ctx);
        if (G.active_player === player) {
          return false;
        }
        return player.hand.length <= 3;
      },
      onTurnBegin: (G, ctx) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);
        if (state.active_player === player) {
          state.end_phase = true;
        }
        return state;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.custom_phase = undefined;
        state.active_player = undefined;
        state.custom_onClickHand = undefined;
        state.onHighlightHand = undefined;
        state.attack = undefined;
        state.end_phase = undefined;
        return state;
      },
      endPhaseIf: (G, ctx) => {
        if (G.end_phase) {
          return phases.ACTION_PHASE;
        } else {
          return false;
        }
      }
    }
  ]
};

export default card;

