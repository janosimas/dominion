import types from '../../cardTypes'
import React from 'react';
import { Card } from 'boardgame.io/ui';

const card = Card({
  name: "Woodcutter",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/d/d6/Woodcutter.jpg/200px-Woodcutter.jpg' alt="Woodcutter" />,
  isFaceUp: true,
  canHover: true,
  cost: 3,
  count: 10,
  buy: 1,
  treasure: 2,
  type: [types.ACTION],

});

export default card;