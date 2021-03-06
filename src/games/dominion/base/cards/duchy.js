import types from '../../cardTypes'
import React from 'react';

const card = {
  name: "Duchy",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/4/4a/Duchy.jpg/200px-Duchy.jpg' alt="Duchy" />,
  isFaceUp: true,
  canHover: true,
  count: 10,
  cost: 5,
  victory: 3,
  type: [types.VICTORY],
  className: 'card',
};

export default card;