import React from 'react';

import types from '../../cardTypes'
import { currentPlayer, getState } from '../../../utils'
import { pushPhase, getLastPhase, popPhase } from '../../utils';

const MINE_TRASH_PHASE = 'Mine trash phase';
const MINE_BUY_PHASE = 'Mine buy phase';

const card = {
  name: "Mine",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/8/8e/Mine.jpg/200px-Mine.jpg' alt="Mine" />,
  isFaceUp: true,
  canHover: true,
  cost: 5,
  count: 10,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);
    pushPhase(state, MINE_TRASH_PHASE);
    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: MINE_TRASH_PHASE,
      allowedMoves: ['onClickHand'],
      onPhaseBegin: (G, ctx) => {
        const state = getState(G);
        state.onHighlightHand = (G, ctx, card) => {
          if (card.type.includes(types.TREASURE)) {
            return ' highlight-red';
          }

          return '';
        };

        state.custom_onClickHand = (G, ctx, index) => {
          if (ctx.phase !== MINE_TRASH_PHASE) {
            return G;
          }

          const state = getState(G);
          const player = currentPlayer(state, ctx);
          let card = player.hand[index];
          if (card.type.includes(types.TREASURE)) {
            card = player.hand.splice(index, 1)[0];
            state.trash.push(card);
            state.mine_bonus_cost = card.cost + 3;
          }

          return state;
        };

        state.allowEndPhase = () => {
          return getLastPhase(state);
        };

        return state;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.custom_onClickHand = undefined;
        state.onHighlightHand = undefined;
        state.allowEndPhase = undefined;
        popPhase(state);
        return state;
      },
      endPhaseIf: (G, ctx) => {
        if (G.mine_bonus_cost) {
          return MINE_BUY_PHASE;
        } else {
          return false;
        }
      }
    },
    {
      name: MINE_BUY_PHASE,
      allowedMoves: ['onClickBoard'],
      onPhaseBegin: (G, ctx) => {
        const state = getState(G);
        pushPhase(state, MINE_BUY_PHASE);
        state.onHighlightBoard = (G, ctx, card) => {
          if (card.type.includes(types.TREASURE)
              && card.cost <= G.mine_bonus_cost) {
            return ' highlight';
          }

          return '';
        };

        state.custom_onClickBoard = (state, ctx, player, card) => {
          if (ctx.phase !== MINE_BUY_PHASE) {
            return state;
          }

          if (card.type.includes(types.TREASURE)
              && card.cost <= state.mine_bonus_cost
              && card.count > 0) {
            player.hand.push(card);
            card.count--;
            state.mine_bonus_cost = undefined;
          }

          return state;
        };

        return state;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.custom_onClickBoard = undefined;
        state.onHighlightBoard = undefined;
        state.mine_bonus_cost = undefined;
        popPhase(state);
        return state;
      },
      endPhaseIf: (G, ctx) => {
        if (!G.mine_bonus_cost) {
          return getLastPhase(G);
        } else {
          return false;
        }
      }
    }
  ]
};

export default card;

