import React from 'react';

import types from '../../cardTypes';
import { currentPlayer, getState } from '../../../utils';
import { drawCard } from '../../utils';

const card = {
  name: "Council Room",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/e/e0/Council_Room.jpg/200px-Council_Room.jpg' alt="Council Room" />,
  isFaceUp: true,
  canHover: true,
  cost: 5,
  count: 10,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);
    const player = currentPlayer(state, ctx);
    drawCard(ctx, player, 4);
    player.buy+=1;

    for(const p in state.players) {
      const otherPlayer = state.players[p];
      if (otherPlayer === player) {
        continue;
      }
      
      drawCard(ctx, otherPlayer, 1);
    }

    return state;
  },
  custom_moves: [],
  custom_phases: []
};

export default card;

