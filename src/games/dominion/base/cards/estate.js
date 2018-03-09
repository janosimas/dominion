import types from '../../card_types'
import React from 'react';
import { Card } from 'boardgame.io/ui';

const card = Card({
  name: "Estate",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/9/91/Estate.jpg/200px-Estate.jpg' alt="Estate" />,
  isFaceUp: true,
  canHover: true,
  count: 10,
  cost: 2,
  victory: 1,
  type: [types.VICTORY],
});

export default card;