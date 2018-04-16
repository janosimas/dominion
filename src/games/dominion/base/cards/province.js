import types from '../../cardTypes';
import React from 'react';

const card = {
  name: 'Province',
  // back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  // front: <img src='http://wiki.dominionstrategy.com/images/thumb/8/81/Province.jpg/200px-Province.jpg' alt="Province" />,
  isFaceUp: true,
  canHover: true,
  count: 10,
  cost: 8,
  victory: 6,
  type: [types.VICTORY],
  className: 'card',
};

export default card;