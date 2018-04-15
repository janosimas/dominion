import { getState, currentPlayer } from '../../utils';
import { getLastPhase, popPhase, pushPhase, playReaction } from '../utils';
import types from '../cardTypes';

const card = {
  type: [types.ACTION, types.ATTACK],
  onPlay: (G, ctx) => {
    let state = getState(G);
    state.active_player = currentPlayer(state, ctx);
    pushPhase(state, CUSTOM_PHASE);

    return state;
  },
  custom_phases: [
    {
      name: CUSTOM_PHASE,
      allowedMoves: ['customAction'],
      endTurnIf: (G, ctx) => {
        const player = currentPlayer(G, ctx);
        // end turn action
        if (G.end_turn) {
          return true;
        }

        // this happens when the attack
        // has ended and it's the active player again
        if (G.active_player === player) {
          return false;
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
        if (G.custom_end_phase) {
          return getLastPhase(G);
        } else {
          return false;
        }
      },
      onPhaseBegin: (G, ctx) => {
        const state = getState(G);

        return state;
      },

      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.active_player = undefined;
        state.custom_end_phase = undefined;
        popPhase(state);

        return state;
      }
    }
  ]
};