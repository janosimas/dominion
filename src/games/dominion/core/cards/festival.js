import types from '../../cardTypes'
import React from 'react';

const card = {
  name: "Festival",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/e/ec/Festival.jpg/200px-Festival.jpg' alt="Festival" />,
  isFaceUp: true,
  canHover: true,
  count: 10,
  cost: 5,
  buy: 1,
  actions: 2,
  treasure: 2,
  type: [types.ACTION],
  className: 'card',
};

export default card;