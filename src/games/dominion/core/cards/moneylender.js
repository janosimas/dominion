import React from 'react';

import types from '../../cardTypes'
import phases from '../../phases'
import { currentPlayer, getState } from '../../../utils'

const card = {
  name: "Moneylender",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/7/70/Moneylender.jpg/200px-Moneylender.jpg' alt="Moneylender" />,
  isFaceUp: true,
  canHover: true,
  cost: 4,
  count: 10,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);

    state.hasTrashCopper = false;
    state.custom_phase = 'Moneylender discard phase';
    state.onHighlightHand = (G, ctx, card) => {
      if (card.name === 'Copper') {
        return ' highlight-red';
      }

      return '';
    };
    state.custom_onClickHand = (G, ctx, index) => {
      if (ctx.phase !== 'Moneylender discard phase') {
        return G;
      }

      const state = getState(G);
      const player = currentPlayer(state, ctx);
      const card = player.hand[index];
      if (card.name === 'Copper') {
        state.trash.push(player.hand.splice(index, 1)[0]);
        player.treasure += 3;
      }

      return state;
    };

    state.allowEndPhase = () => {
      return phases.ACTION_PHASE;
    };

    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: 'Moneylender discard phase',
      allowedMoves: ['onClickHand'],
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.custom_phase = undefined;
        state.custom_onClickHand = undefined;
        state.onHighlightHand = undefined;
        state.hasTrashCopper = undefined;
        return state;
      },
      endPhaseIf: (G, ctx) => {
        if (G.hasTrashCopper) {
          return phases.ACTION_PHASE;
        } else {
          return false;
        }
      }
    }
  ]
};

export default card;

