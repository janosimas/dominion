import types from '../../card_types'
import React from 'react';
import { Card } from 'boardgame.io/ui';

const card = Card({
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

});

export default card;