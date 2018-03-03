import types from './card_types'

const base_treasure = [{
  name: 'Copper',
  cost: 0,
  treasure: 1,
  count: 10,
  type: [types.TREASURE],
  image: 'http://wiki.dominionstrategy.com/images/thumb/f/fb/Copper.jpg/200px-Copper.jpg'
}, {
  name: 'Gold',
  cost: 6,
  treasure: 3,
  count: 10,
  type: [types.TREASURE],
  image: 'http://wiki.dominionstrategy.com/images/thumb/5/50/Gold.jpg/200px-Gold.jpg'  
}, {
  name: 'Silver',
  cost: 3,
  treasure: 2,
  count: 10,
  type: [types.TREASURE],
  image: 'http://wiki.dominionstrategy.com/images/thumb/5/5d/Silver.jpg/200px-Silver.jpg'
}];

export default base_treasure;