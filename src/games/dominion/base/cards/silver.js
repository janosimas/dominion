import types from '../../cardTypes'
import React from 'react';
import { Card } from 'boardgame.io/ui';

const card = Card({
  name: "Silver",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/5/5d/Silver.jpg/200px-Silver.jpg' alt="Silver" />,
  isFaceUp: true,
  canHover: true,
  count: 10,
  cost: 3,
  treasure: 2,
  type: [types.TREASURE],
  className: 'card'
});

export default card;