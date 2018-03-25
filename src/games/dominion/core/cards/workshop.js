import React from 'react';

import types from '../../cardTypes'
import phases from '../../phases'
import { getState } from '../../../utils'

const card = {
  name: "Workshop",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/5/50/Workshop.jpg/200px-Workshop.jpg' alt="Workshop" />,
  isFaceUp: true,
  canHover: true,
  cost: 3,
  count: 10,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);
    state.custom_phase = 'Workshop buy phase';
    state.custom_onClickBoard = (G, ctx, player, card) => {
      if (ctx.phase !== 'Workshop buy phase') {
        return G;
      }

      let state = getState(G);
      if(card.cost <= 4) {
        player.discard.push(card);
        card.count--;
        state.end_phase = true;
      }

      return state;
    };
    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: 'Workshop buy phase',
      allowedMoves: ['onClickBoard'],
      endPhaseIf: (G, ctx) => {
        if (G.end_phase) {
          G.custom_phase = undefined;
          G.custom_onClickBoard = undefined;
          G.end_phase = undefined;
          return phases.ACTION_PHASE;
        } else {
          return false;
        }
      }
    }
  ]
};

export default card;

