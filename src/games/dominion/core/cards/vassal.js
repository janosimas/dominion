import React from 'react';

import types from '../../cardTypes'
import { currentPlayer, getState } from '../../../utils'
import { playCard } from '../../utils';

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
      state.custom_phase = 'Vassal option phase';
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
        const card = state.render_extra.pop();
        if(action === 'discard') {
          player.discard.push(card);
        } else if (action === 'play') {
          state = playCard(G, ctx, card);
        }
        return state;
      }
    }
  ],
  custom_phases: [
    {
      name: 'Vassal option phase',
      allowedMoves: ['onClickExtraVassal'],
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.custom_phase = undefined;
        state.render_extra = undefined;
        return state;
      }
    }
  ]
};

export default card;

