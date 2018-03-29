import React from 'react';

import types from '../../cardTypes'
import { currentPlayer, getState } from '../../../utils'
import { drawCard } from '../../utils'

const card = {
  name: "Moat",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/f/fe/Moat.jpg/200px-Moat.jpg' alt="Moat" />,
  isFaceUp: true,
  canHover: true,
  cost: 2,
  count: 10,
  cards: 2,
  className: 'card',
  type: [types.ACTION, types.REACTION],
  onReaction: (G, ctx) => {
    // return the state
    // and if the attack phase should end
    return [G, true];
  },
  onPlay: (G, ctx) => {
    const state = getState(G);
    const player = currentPlayer(state, ctx);
    // javascript if getting lost with "this"
    // be careful with changes
    drawCard(ctx, player, 2);
    return state;
  }
};

export default card;

