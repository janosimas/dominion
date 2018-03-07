import types from '../card_types'
import React from 'react';
import { Card } from 'boardgame.io/ui';

const card = Card({
    name: "Village",
    back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
    front: <img src='http://wiki.dominionstrategy.com/images/thumb/5/5a/Village.jpg/200px-Village.jpg' alt="Village" />,
    isFaceUp: true,
    canHover: true,
    count: 10,
    cost: 3,
    cards: 1,
    actions: 2,
    type: [types.ACTION],
  });

export default card;