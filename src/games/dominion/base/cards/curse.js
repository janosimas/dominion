import types from '../../cardTypes';
import React from 'react';

const card = {
  name: 'Curse',
  // back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  // front: <img src='http://wiki.dominionstrategy.com/images/thumb/9/97/Curse.jpg/200px-Curse.jpg' alt="Curse" />,
  isFaceUp: true,
  canHover: true,
  count: 10,
  cost: 0,
  treasure: -1,
  type: [types.TREASURE],
  className: 'card',
};

export default card;