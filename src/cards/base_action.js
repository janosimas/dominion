import types from './card_types'

const base_action = [{
  name: "Village",
  cost: 3,
  count: 10,
  cards: 1,
  actions: 2,
  type: [types.ACTION],
  image: 'http://wiki.dominionstrategy.com/images/thumb/5/5a/Village.jpg/200px-Village.jpg'
},
{
  name: "Smith",
  cost: 4,
  count: 10,
  cards: 3,
  type: [types.ACTION],
  image: 'http://wiki.dominionstrategy.com/images/thumb/3/36/Smithy.jpg/200px-Smithy.jpg'
},
{
  name: "Festival",
  cost: 5,
  count: 10,
  buy: 1,
  actions: 2,
  treasure: 2,
  type: [types.ACTION],
  image: 'http://wiki.dominionstrategy.com/images/thumb/e/ec/Festival.jpg/200px-Festival.jpg'
},
{
  name: "Laboratory",
  cost: 5,
  count: 10,
  actions: 1,
  cards: 2,
  type: [types.ACTION],
  image: 'http://wiki.dominionstrategy.com/images/thumb/0/0c/Laboratory.jpg/200px-Laboratory.jpg'
},
{
  name: "Woodcutter",
  cost: 3,
  count: 10,
  buy: 1,
  treasure: 2,
  type: [types.ACTION],
  image: 'http://wiki.dominionstrategy.com/images/thumb/d/d6/Woodcutter.jpg/200px-Woodcutter.jpg'
}];

export default base_action;