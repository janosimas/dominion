import types from '../../card_types'
import React from 'react';
import { Card } from 'boardgame.io/ui';

const card = Card({
  name: "Copper",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/f/fb/Copper.jpg/200px-Copper.jpg' alt="Copper" />,
  isFaceUp: true,
  canHover: true,
  count: 10,
  cost: 0,
  treasure: 1,
  type: [types.TREASURE],
});

export default card;