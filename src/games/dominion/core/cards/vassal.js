import React from 'react';

import types from '../../cardTypes'
import { currentPlayer, getState } from '../../../utils'
import { playCard, pushPhase, getLastPhase, popPhase } from '../../utils';

const CUSTOM_PHASE = 'Vassal option phase';

const card = {
  name: "Vassal",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/0/0b/Vassal.jpg/200px-Vassal.jpg' alt="Vassal" />,
  isFaceUp: true,
  canHover: true,
  cost: 3,
  treasure: 2,
  count: 10,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);
    const player = currentPlayer(state, ctx);
    player.treasure += 2;

    const card = player.deck.pop();
    if (card.type.includes(types.ACTION)) {
      pushPhase(state, CUSTOM_PHASE);
      state.render_extra = {
        cards: [card],
        buttons: [
          {
            text: 'play',
            onClick: (moves) => {
              moves['onClickExtraVassal']('play');
            }
          },
          {
            text: 'discard',
            onClick: (moves) => {
              moves['onClickExtraVassal']('discard');
            }
          },
        ]
      }
    } else {
      player.discard.push(card);
    }

    return state;
  },
  custom_moves: [
    {
      name: 'onClickExtraVassal',
      move: (G, ctx, action) => {
        let state = getState(G);
        const player = currentPlayer(state, ctx);
        const card = state.render_extra.cards.pop();
        if(action === 'discard') {
          player.discard.push(card);
        } else if (action === 'play') {
          state = playCard(G, ctx, card);
        }
        state.render_extra = undefined;
        return state;
      }
    }
  ],
  custom_phases: [
    {
      name: CUSTOM_PHASE,
      allowedMoves: ['onClickExtraVassal'],
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.render_extra = undefined;
        popPhase(state);
        return state;
      },
      endPhaseIf: (G, ctx) => {
        if(!G.render_extra) {
          return getLastPhase(G);
        }

        return false;
      }
    }
  ]
};

export default card;

