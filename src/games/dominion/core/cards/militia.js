import React from 'react';

import types from '../../cardTypes';
import { currentPlayer, getState, discard } from '../../../utils';
import { pushPhase, getLastPhase, popPhase, playReaction } from '../../utils';

const CUSTOM_PHASE = 'Militia discard phase';

const card = {
  name: 'Militia',
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/a/a0/Militia.jpg/200px-Militia.jpg' alt="Militia" />,
  isFaceUp: true,
  canHover: true,
  cost: 4,
  count: 10,
  treasure: 2,
  className: 'card',
  type: [types.ACTION, types.ATTACK],
  onPlay: (G, ctx) => {
    const state = getState(G);
    const player = currentPlayer(state, ctx);
    player.treasure += 2;
    state.active_player = player;
    pushPhase(state, CUSTOM_PHASE);
    
    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: CUSTOM_PHASE,
      allowedMoves: ['onClickHand', 'customAction'],
      endTurnIf: (G, ctx) => {
        const player = currentPlayer(G, ctx);
        // end turn action
        if (G.end_turn) {
          return true;
        }

        if (G.active_player === player) {
          return true;
        }

        // attack condition
        return player.hand.length <= 3;
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

        state.attack_condition = false;

        // activate reaction cards
        const [newState, endTurn] = playReaction(state, ctx);
        state = newState;

        // allow end turn?
        if (endTurn) {
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
        state.onHighlightHand = (G, ctx, card) => {
          return ' highlight-yellow';
        };

        state.custom_onClickHand = (G, ctx, index) => {
          if (ctx.phase !== CUSTOM_PHASE) {
            return G;
          }

          const state = getState(G);
          const player = currentPlayer(state, ctx);
          discard(player, index);
          return state;
        };
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

