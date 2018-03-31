import React from 'react';

import types from '../../cardTypes'
import phases from '../../phases'
import { currentPlayer, getState } from '../../../utils'

const card = {
  name: "Poacher",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/a/a0/Poacher.jpg/200px-Poacher.jpg' alt="Poacher" />,
  isFaceUp: true,
  canHover: true,
  cost: 4,
  count: 10,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);

    let countEmptyPiles = 0;
    for (const card of G.boardCards) {
      if (card.count === 0) {
        countEmptyPiles++;
      }
    }

    if (countEmptyPiles > 0) {
      state.custom_phase = 'Poacher discard phase';
      state.custom_onClickHand = (G, ctx, index) => {
        if (ctx.phase !== 'Poacher discard phase') {
          return G;
        }

        const state = getState(G);
        const player = currentPlayer(state, ctx);
        player.discard.push(player.hand.splice(index, 1)[0]);
        state.countEmptyPiles--;
        return state;
      };

      state.onHighlightHand = (G, ctx, card) => {
        return ' highlight-yellow';
      };
    }

    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: 'Poacher discard phase',
      allowedMoves: ['onClickHand'],
      endPhaseIf: (G, ctx) => {
        return G.countEmptyPiles === 0;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.countEmptyPiles = undefined;
        state.custom_phase = undefined;
        state.custom_onClickHand = undefined;
        state.onHighlightHand = undefined;
        return state;
      }
    }
  ]
};

export default card;

