import types from '../../cardTypes'
import React from 'react';


const card = {
  name: "Smith",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/3/36/Smithy.jpg/200px-Smithy.jpg' alt="Smith" />,
  isFaceUp: true,
  canHover: true,
  count: 10,
  cost: 4,
  cards: 3,
  type: [types.ACTION],
  className: 'card',
};

export default card;