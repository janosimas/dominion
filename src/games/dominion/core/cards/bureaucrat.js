import React from 'react';

import types from '../../cardTypes';
import { currentPlayer, getState } from '../../../utils';

import silver from '../../base/cards/silver';
import { getLastPhase, popPhase, pushPhase } from '../../utils';

const CUSTOM_PHASE = 'Bureaucrat discard phase';

const card = {
  name: 'Bureaucrat',
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
    if(silver.count > 0) {
      player.deck.unshift(silver);
      silver.count--;
    }

    state.attack = true;
    state.active_player = currentPlayer(state, ctx);
    pushPhase(state, CUSTOM_PHASE);
    state.onHighlightHand = (G, ctx, card) => {
      if (card.type.includes(types.VICTORY)) {
        return ' highlight-yellow';
      }

      return '';
    };
    state.custom_onClickHand = (G, ctx, index) => {
      if (ctx.phase !== CUSTOM_PHASE) {
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
      name: CUSTOM_PHASE,
      allowedMoves: ['onClickHand', 'customAction'],
      endTurnIf: (G, ctx) => {
        const player = currentPlayer(G, ctx);
        if(G.end_turn) {
          return true;
        }

        if (G.active_player === player) {
          return false;
        }

        return !!G.hasSelectedVictory;
      },
      onPhaseBegin: (G, ctx) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);
        if (state.active_player === player) {
          state.end_turn = true;
        }
        
        return state;
      },
      onTurnBegin: (G, ctx) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);
        state.end_turn = false;
        if (state.active_player === player) {
          state.custom_end_phase = true;
        }

        let hasSelectableVictory = false;
        for (let index = 0; index < player.hand.length; index++) {
          const card = player.hand[index];
          if (card.type.includes(types.VICTORY)) {
            hasSelectableVictory = true;
            break;
          }
        }

        if (!hasSelectableVictory) {
          state.customAction = {
            name: 'End Turn',
            action: (state, ctx) => {
              state.end_turn = true;
              return state;
            }
          };
          
        }

        return state;
      },
      
      onTurnEnd: (G, ctx) => {
        const state = getState(G);
        state.customAction = undefined;
        state.end_turn = undefined;

        return state;
      },

      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.active_player = undefined;
        state.custom_onClickHand = undefined;
        state.onHighlightHand = undefined;
        state.attack = undefined;
        state.hasSelectedVictory = undefined;
        state.custom_end_phase = undefined;
        state.end_turn = undefined;
        popPhase(state);
        
        return state;
      },
      endPhaseIf: (G, ctx) => {
        if (G.custom_end_phase) {
          return getLastPhase(G);
        } else {
          return false;
        }
      }
    }
  ]
};

export default card;

