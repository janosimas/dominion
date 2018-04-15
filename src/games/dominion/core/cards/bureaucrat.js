import React from 'react';

import types from '../../cardTypes';
import { currentPlayer, getState } from '../../../utils';

import silver from '../../base/cards/silver';
import { getLastPhase, popPhase, pushPhase, playReaction } from '../../utils';

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

    state.active_player = currentPlayer(state, ctx);
    pushPhase(state, CUSTOM_PHASE);
    
    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: CUSTOM_PHASE,
      allowedMoves: ['onClickHand','customAction'],
      endTurnIf: (G, ctx) => {
        const player = currentPlayer(G, ctx);
        // end turn action
        if (G.end_turn) {
          return true;
        }

        // this happens when the attack
        // has ended and it's the active player again
        if (G.active_player === player) {
          return true;
        }

        // attack condition
        return !!G.attack_condition;
      },
      onTurnBegin: (G, ctx) => {
        let state = getState(G);
        const player = currentPlayer(G, ctx);
        if (state.active_player === player) {
          // this happens when the attack
          // has ended and it's the active player again
          state.end_attack_phase = true;
          return state;
        }

        let hasSelectableVictory = false;
        for (let index = 0; index < player.hand.length; index++) {
          const card = player.hand[index];
          if (card.type.includes(types.VICTORY)) {
            hasSelectableVictory = true;
            break;
          }
        }

        state.attack_condition = hasSelectableVictory;

        // activate reaction cards
        const [newState, endTurn] = playReaction(state, ctx);
        state = newState;

        // allow end turn?
        if (endTurn || !hasSelectableVictory) {
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
        state.attack_condition = undefined;

        return state;
      },

      endPhaseIf: (G, ctx) => {
        if (G.end_attack_phase) {
          return getLastPhase(G);
        } else {
          return false;
        }
      },
      onPhaseBegin: (G, ctx) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);

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
            player.deck.unshift(player.hand.splice(index, 1)[0]);
            state.end_attack_phase = true;
            return state;
          } else {
            return state;
          }
        };

        if (state.active_player === player) {
          state.end_turn = true;
        }

        return state;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.active_player = undefined;
        state.end_attack_phase = undefined;
        state.onHighlightHand = undefined;
        state.custom_onClickHand = undefined;
        popPhase(state);

        return state;
      }
    }
  ]
};

export default card;

