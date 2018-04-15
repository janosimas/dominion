import React from 'react';

import types from '../../cardTypes';
import { currentPlayer, getState } from '../../../utils';
import { drawCard } from '../../utils';

import silver from '../../base/cards/silver';

const card = {
  name: 'Merchant',
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/7/78/Merchant.jpg/200px-Merchant.jpg' alt="Merchant" />,
  isFaceUp: true,
  canHover: true,
  cost: 3,
  count: 10,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);
    const player = currentPlayer(state, ctx);
    drawCard(ctx, player, 1);
    player.actions+=1;

    state.onPlayHandTrigger.push((G, ctx, card) => {
      const state = getState(G);
      if (card === silver) {
        const player = currentPlayer(state, ctx);

        player.treasure += 1;
        return [state, true];
      }

      return [state];
    });
    
    return state;
  },
  custom_moves: [],
  custom_phases: []
};

export default card;

