import types from '../../cardTypes';
import React from 'react';

const card = {
  name: 'Gold',
  // back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  // front: <img src='http://wiki.dominionstrategy.com/images/thumb/5/50/Gold.jpg/200px-Gold.jpg' alt="Gold" />,
  isFaceUp: true,
  canHover: true,
  count: 10,
  cost: 6,
  treasure: 3,
  type: [types.TREASURE],
  className: 'card',
};

export default card;