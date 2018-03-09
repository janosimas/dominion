import types from '../../card_types'
import React from 'react';
import { Card } from 'boardgame.io/ui';

const card = Card({
  name: "Smith",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/3/36/Smithy.jpg/200px-Smithy.jpg' alt="Smith" />,
  isFaceUp: true,
  canHover: true,
  count: 10,
  cost: 4,
  cards: 3,
  type: [types.ACTION],

});

export default card;