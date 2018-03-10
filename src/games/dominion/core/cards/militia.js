import types from '../../cardTypes'
import phases from '../../phases'
import React from 'react';
import { Card } from 'boardgame.io/ui';

const card = Card({
  name: "Militia",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/a/a0/Militia.jpg/200px-Militia.jpg' alt="Militia" />,
  isFaceUp: true,
  canHover: true,
  cost: 4,
  count: 10,
  treasure: 2,
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    endTurn();
    endPhase('militia_discard_phase');
  },
  custom_moves: [
    {
      name: 'militia_discard',
      move: (G, ctx) => {
        G.active_player = currentPlayer(G, ctx);
        endTurn();
      }
    }
  ],
  custom_phases: [
    {
      name: 'militia_discard_phase',
      allowedMoves: ['militia_discard'],
      endTurnIf: (G, ctx) => {
        let player = currentPlayer(G, ctx);
        if (G.active_player === player) {
          return false;
        }
        return player.hand.size <= 3;
      },
      endPhaseIf: (G, ctx) => {
        if (G.active_player === player) {
          return phases.ACTION_PHASE;;
        } else {
          return false;
        }
      }
    }
  ]
});

export default card;

