import React from 'react';

import types from '../../cardTypes'
import { currentPlayer, getState } from '../../../utils'
import { pushPhase, popPhase, getLastPhase, popDeckCard, getTopPhase } from '../../utils';

const LIBRARY_BUY_PHASE = 'Library buy phase';
const LIBRARY_DISCARD_PHASE = 'Library discard phase';

const completeSevenCard = (state, ctx) => {
  const player = currentPlayer(state, ctx);
  while(player.hand.length < 7) {
    const card = popDeckCard(ctx, player);
    if(!card.type.includes(types.ACTION)) {
      player.hand.push(card);
    } else {
      pushPhase(state, LIBRARY_DISCARD_PHASE);
      state.render_extra = {
        cards: [card],
        buttons: [
          {
            text: 'keep',
            onClick: (moves) => {
              moves['onClickExtraLibrary']('keep');
            }
          },
          {
            text: 'discard',
            onClick: (moves) => {
              moves['onClickExtraLibrary']('discard');
            }
          },
        ]
      }
      break;
    }
  }
  return state;
}

const card = {
  name: "Library",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/9/98/Library.jpg/200px-Library.jpg' alt="Library" />,
  isFaceUp: true,
  canHover: true,
  cost: 5,
  count: 10,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    let state = getState(G);
    pushPhase(state, LIBRARY_BUY_PHASE);
    state.temp_discard = [];
    return state;
  },
  custom_moves: [
    {
      name: 'onClickExtraLibrary',
      move: (G, ctx, action) => {
        let state = getState(G);
        const player = currentPlayer(state, ctx);
        const card = state.render_extra.cards.pop();
        state.render_extra = undefined;
        if (action === 'discard') {
          state.temp_discard.push(card);
        } else if (action === 'keep') {
          player.hand.push(card);
        }
        return state;
      }
    }
  ],
  custom_phases: [
    {
      name: LIBRARY_BUY_PHASE,
      allowedMoves: [],
      endPhaseIf: (G, ctx) => {
        const player = currentPlayer(G, ctx);
        if (getTopPhase(G) === LIBRARY_DISCARD_PHASE) {
          return LIBRARY_DISCARD_PHASE;
        }

        if (player.hand.length === 7
          || (player.discard.length + player.deck.length === 0) ) {
          return getLastPhase(G);
        }

        return false;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);
        if(state.temp_discard && ! state.render_extra) {
          player.discard.push(...state.temp_discard);
          state.temp_discard = undefined;
        }

        // only pop when finished library effects
        if (getTopPhase(G) !== LIBRARY_DISCARD_PHASE) {
          popPhase(state);
        }

        return state;
      },
      onPhaseBegin: (G, ctx) => {
        let state = getState(G);
        state = completeSevenCard(state, ctx);
        return state;
      }
    },
    {
      name: LIBRARY_DISCARD_PHASE,
      allowedMoves: ['onClickExtraLibrary'],
      endPhaseIf: (G, ctx) => {
        if (!G.render_extra) {
          return LIBRARY_BUY_PHASE;
        }
        return false;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        popPhase(state);
        return state;
      }
    }
  ]
};

export default card;

