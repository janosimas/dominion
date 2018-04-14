import React from 'react';

import types from '../../cardTypes';
import { currentPlayer, getState } from '../../../utils';
import { drawCard } from '../../utils';

import curse from '../../base/cards/curse';

const card = {
  name: "Witch",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/f/f3/Witch.jpg/200px-Witch.jpg' alt="Witch" />,
  isFaceUp: true,
  canHover: true,
  cost: 5,
  count: 10,
  className: 'card',
  type: [types.ACTION, types.ATTACK],
  onPlay: (G, ctx) => {
    const state = getState(G);
    const player = currentPlayer(state, ctx);
    drawCard(ctx, player, 2);

    for(const p in state.players) {
      const otherPlayer = state.players[p];
      if (otherPlayer === player) {
        continue;
      }
      
      if(curse.count > 0) {
        otherPlayer.discard.push(curse);
        curse.count--;
      }
    }

    return state;
  },
  custom_moves: [],
  custom_phases: []
};

export default card;

