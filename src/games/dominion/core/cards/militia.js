import React from 'react';
import { Card } from 'boardgame.io/ui';

import types from '../../cardTypes'
import phases from '../../phases'
import { currentPlayer, getState } from '../../../utils'

const card = Card({
  name: "Militia",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/a/a0/Militia.jpg/200px-Militia.jpg' alt="Militia" />,
  isFaceUp: true,
  canHover: true,
  cost: 4,
  count: 10,
  treasure: 2,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);
    state.events.endTurn();
    state.events.endPhase('militia_discard_phase');
    return state;
  },
  custom_moves: [
    {
      name: 'militia_discard',
      move: (G, ctx) => {
        const state = getState(G);
        state.active_player = currentPlayer(state, ctx);
        state.events.endTurn();
        return state;
      }
    }
  ],
  custom_phases: [
    {
      name: 'militia_discard_phase',
      allowedMoves: ['militia_discard'],
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
          return phases.ACTION_PHASE;
        } else {
          return false;
        }
      }
    }
  ]
});

export default card;

