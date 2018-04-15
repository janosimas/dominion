import React from 'react';

import types from '../../cardTypes';
import { currentPlayer, getState } from '../../../utils';
import { playCard, playCopy, getLastPhase, popPhase, pushPhase, getTopPhase } from '../../utils';

const PLAY_PHASE = 'Throne Room play phase';
const COPY_PHASE = 'Throne Room copy phase';

const card = {
  name: 'Throne Room',
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
    pushPhase(state, PLAY_PHASE);
    
    return state;
  },
  custom_moves: [],
  custom_phases: [
    {
      name: PLAY_PHASE,
      allowedMoves: ['onClickHand'],
      onPhaseBegin: (G, ctx) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);
        state.custom_onClickHand = (G, ctx, index) => {
          if (ctx.phase !== PLAY_PHASE) {
            return G;
          }

          let state = getState(G);
          const player = currentPlayer(state, ctx);
          if (!player.hand[index].type.includes(types.ACTION)) {
            return state;
          }

          popPhase(state);
          pushPhase(state, COPY_PHASE);

          state.throne_card = player.hand.splice(index, 1)[0];
          state = playCard(state, ctx, state.throne_card);
          
          return state;
        };

        state.onHighlightHand = (G, ctx, card) => {
          if (card.type.includes(types.ACTION)) {
            return ' highlight';
          }
          return '';
        };

        state.end_custom_phase = true;
        for(const card of player.hand) {
          if(card.type.includes(types.ACTION)) {
            state.end_custom_phase = false;
            break;
          }
        }

        return state;
      },

      endPhaseIf: (G, ctx) => {
        if (G.throne_card) {
          return getTopPhase(G);
        } else if (G.end_custom_phase) {
          return getLastPhase(G);
        }

        return false;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);

        state.custom_onClickHand = undefined;
        state.onHighlightHand = undefined;

        if (state.end_custom_phase) {
          popPhase(state);
        }

        state.end_custom_phase = undefined;

        return state;
      }
    },
    {
      name: COPY_PHASE,
      allowedMoves: [],
      onPhaseBegin: (G, ctx) => {
        let state = getState(G);

        popPhase(state);
        state = playCopy(state, ctx, state.throne_card);
        state.throne_card = undefined;

        return state;
      },

      endPhaseIf: (G, ctx) => {
        if (!G.throne_card) {
          return getTopPhase(G);
        }

        return false;
      }
    }
  ]
};

export default card;

