import types from '../../cardTypes';
import React from 'react';

const card = {
  name: "Copper",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/f/fb/Copper.jpg/200px-Copper.jpg' alt="Copper" />,
  isFaceUp: true,
  canHover: true,
  count: 60,
  cost: 0,
  treasure: 1,
  type: [types.TREASURE],
  className: 'card',
};

export default card;