import React from 'react';

import types from '../../cardTypes'
import { getState } from '../../../utils'
import { pushPhase, getLastPhase, popPhase, getCardCost } from '../../utils';

const CUSTOM_PHASE = 'Workshop buy phase';

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
    pushPhase(state, CUSTOM_PHASE);
    state.onHighlightBoard = (G, ctx, card) => {
      if (getCardCost(G, ctx, card) > 4) {
        return '';
      }

      return ' highlight';
    }
    
    state.custom_onClickBoard = (G, ctx, player, card) => {
      if (ctx.phase !== CUSTOM_PHASE) {
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
      name: CUSTOM_PHASE,
      allowedMoves: ['onClickBoard'],
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.custom_onClickBoard = undefined;
        state.end_phase = undefined;
        state.onHighlightBoard = undefined;
        popPhase(state);
        return state;
      },
      endPhaseIf: (G, ctx) => {
        if (G.end_phase) {
          return getLastPhase(G);
        } else {
          return false;
        }
      }
    }
  ]
};

export default card;

