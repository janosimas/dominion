import React from 'react';

import types from '../../cardTypes';
import { currentPlayer, getState } from '../../../utils';
import { drawCard, playReaction, pushPhase, popPhase, getLastPhase } from '../../utils';

import curse from '../../base/cards/curse';

const CUSTOM_PHASE = 'Witch curse phase';

const card = {
  name: 'Witch',
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/f/f3/Witch.jpg/200px-Witch.jpg' alt="Witch" />,
  isFaceUp: true,
  canHover: true,
  cost: 5,
  count: 10,
  className: 'card',
  type: [types.ACTION, types.ATTACK],
  onPlay: (G, ctx) => {
    let state = getState(G);
    const player = currentPlayer(state, ctx);
    drawCard(ctx, player, 2);

    state.active_player = player;
    pushPhase(state, CUSTOM_PHASE);

    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: CUSTOM_PHASE,
      allowedMoves: ['onClickBoard', 'customAction'],
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
        if (endTurn || curse.count === 0) {
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
        state.onHighlightBoard = (G, ctx, card) => {
          if (card.name === 'Curse') {
            return ' highlight';
          }

          return '';
        };

        state.custom_onClickBoard = (state, ctx, player, card) => {
          if (ctx.phase !== CUSTOM_PHASE
            || card !== curse) {
            return state;
          }

          player.discard.push(card);
          card.count--;
          state.attack_condition = true;

          return state;
        };
        return state;
      },

      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.active_player = undefined;
        state.end_attack_phase = undefined;
        state.onHighlightBoard = undefined;
        state.custom_onClickBoard = undefined;
        popPhase(state);

        return state;
      }
    }
  ]
};

export default card;

