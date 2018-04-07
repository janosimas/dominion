import React from 'react';

import types from '../../cardTypes'
import { currentPlayer, getState } from '../../../utils'
import { playCard, playCopy, getLastPhase, popPhase, pushPhase } from '../../utils';

const CUSTOM_PHASE = 'Throne Room play phase';

const card = {
  name: "Throne Room",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/d/d1/Throne_Room.jpg/200px-Throne_Room.jpg' alt="Throne Room" />,
  isFaceUp: true,
  canHover: true,
  cost: 4,
  count: 10,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);
    pushPhase(state, CUSTOM_PHASE);
    state.custom_onClickHand = (G, ctx, index) => {
      if (ctx.phase !== CUSTOM_PHASE) {
        return G;
      }

      let state = getState(G);
      const player = currentPlayer(state, ctx);
      if (!player.hand[index].type.includes(types.ACTION)) {
        return state;
      }

      const card = player.hand.splice(index, 1)[0];
      state = playCard(state, ctx, card);
      state = playCopy(state, ctx, card);

      state.end_custom_phase = true;
      return state;
    };

    state.onHighlightHand = (G, ctx, card) => {
      if (card.type.includes(types.ACTION)) {
        return ' highlight';
      }
      return '';
    };

    state.allowEndPhase = () => {
      return getLastPhase(state);
    };

    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: CUSTOM_PHASE,
      allowedMoves: ['onClickHand'],
      endPhaseIf: (G, ctx) => {
        if (G.end_custom_phase) {
          return getLastPhase(G);
        }

        return false;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);

        G.end_custom_phase = undefined;
        state.allowEndPhase = undefined;
        state.custom_onClickHand = undefined;
        state.onHighlightHand = undefined;
        popPhase(state);
        return state;
      }
    }
  ]
};

export default card;

