import types from './card_types'

const base_victory = [{
  name: "Estate",
  cost: 2,
  victory: 1,
  count: 10,
  type: [types.VICTORY],
  image: 'http://wiki.dominionstrategy.com/images/thumb/9/91/Estate.jpg/200px-Estate.jpg'
},
{
  name: "Duchy",
  cost: 5,
  victory: 3,
  count: 10,
  type: [types.VICTORY],
  image: 'http://wiki.dominionstrategy.com/images/thumb/4/4a/Duchy.jpg/200px-Duchy.jpg'
},
{
  name: "Province",
  cost: 8,
  victory: 6,
  count: 10,
  type: [types.VICTORY],
  image: 'http://wiki.dominionstrategy.com/images/thumb/8/81/Province.jpg/200px-Province.jpg'
}];

export default base_victory;