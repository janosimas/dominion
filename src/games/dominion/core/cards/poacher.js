import React from 'react';

import types from '../../cardTypes'
import { currentPlayer, getState } from '../../../utils'
import { popPhase, getLastPhase, pushPhase, drawCard } from '../../utils';

const CUSTOM_PHASE = 'Poacher discard phase';

const card = {
  name: "Poacher",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/a/a0/Poacher.jpg/200px-Poacher.jpg' alt="Poacher" />,
  isFaceUp: true,
  canHover: true,
  cost: 4,
  count: 10,
  cards: 1,
  actions: 1,
  treasure: 1,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);
    const player = currentPlayer(state, ctx);
    drawCard(ctx, player, 1);
    player.actions+=1;
    player.treasure+=1;

    let countEmptyPiles = 0;
    for (const card of G.boardCards) {
      if (card.count === 0) {
        countEmptyPiles++;
      }
    }

    if (countEmptyPiles > 0) {
      pushPhase(state, CUSTOM_PHASE);
      state.custom_onClickHand = (G, ctx, index) => {
        if (ctx.phase !== CUSTOM_PHASE) {
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
      name: CUSTOM_PHASE,
      allowedMoves: ['onClickHand'],
      endPhaseIf: (G, ctx) => {
        if(G.countEmptyPiles === 0) {
          return getLastPhase(G);
        }
        return false;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.countEmptyPiles = undefined;
        state.custom_onClickHand = undefined;
        state.onHighlightHand = undefined;
        popPhase(state);
        return state;
      }
    }
  ]
};

export default card;

