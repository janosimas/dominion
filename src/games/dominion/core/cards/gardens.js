import React from 'react';

import types from '../../cardTypes'
import { currentPlayer } from '../../../utils'

const card = {
  name: "Gardens",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/8/8c/Gardens.jpg/200px-Gardens.jpg' alt="Gardens" />,
  isFaceUp: true,
  canHover: true,
  cost: 4,
  count: 12,
  className: 'card',
  type: [types.VICTORY],
  custom_victory: (G, ctx) => {
    const player = currentPlayer(G, ctx);
    const total = player.hand.length + player.deck.length + player.discard.length;
    return Math.floor(total / 10);
  },
  custom_moves: [],
  custom_phases: []
};

export default card;

