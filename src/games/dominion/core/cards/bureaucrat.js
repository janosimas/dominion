import React from 'react';

import types from '../../cardTypes'
import phases from '../../phases'
import { currentPlayer, getState } from '../../../utils'

import silver from '../../base/cards/silver'

const card = {
  name: "Bureaucrat",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/4/4d/Bureaucrat.jpg/200px-Bureaucrat.jpg' alt="Bureaucrat" />,
  isFaceUp: true,
  canHover: true,
  cost: 4,
  count: 10,
  className: 'card',
  type: [types.ACTION, types.ATTACK],
  onPlay: (G, ctx) => {
    const state = getState(G);
    const player = currentPlayer(state, ctx);
    player.deck.push(silver);

    state.end_turn = true;
    state.attack = true;
    state.active_player = currentPlayer(state, ctx);
    state.custom_phase = 'Bureaucrat discard phase';
    state.onHighlightHand = (G, ctx, card) => {
      if (card.type.includes(types.VICTORY)) {
        return ' highlight-yellow';
      }

      return '';
    };
    state.custom_onClickHand = (G, ctx, index) => {
      if (ctx.phase !== 'Bureaucrat discard phase') {
        return G;
      }

      const state = getState(G);
      const player = currentPlayer(state, ctx);
      const card = player.hand[index];
      if (card.type.includes(types.VICTORY)) {
        player.deck.push(player.hand.splice(index, 1)[0]);
        state.hasSelectedVictory = true;
        return state;
      } else {
        return state;
      }
    };
    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: 'Bureaucrat discard phase',
      allowedMoves: ['onClickHand'],
      endTurnIf: (G, ctx) => {
        const player = currentPlayer(G, ctx);
        if (G.active_player === player) {
          return false;
        }

        return !!G.hasSelectedVictory;
      },
      onTurnBegin: (G, ctx) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);
        if (state.active_player === player) {
          state.custom_end_phase = true;
          return state;
        }

        state.hasSelectedVictory = false;
        for (let index = 0; index < player.hand.length; index++) {
          const card = player.hand[index];
          if (card.type.includes(types.VICTORY)) {
            state.hasSelectedVictory = true;
            break;
          }
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
        state.hasSelectedVictory = undefined;
        state.custom_end_phase = undefined;
        return state;
      },
      endPhaseIf: (G, ctx) => {
        if (G.custom_end_phase) {
          return phases.ACTION_PHASE;
        } else {
          return false;
        }
      }
    }
  ]
};

export default card;

