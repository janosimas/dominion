import Trait from './trait';
import FOOD_TYPES from '../food_type';
import { eat } from '../utils';

class Foraging extends Trait {
  constructor(food) {
    super('Foraging', [], food);

    this.specieGotFood.bind(this);
  }

  specieGotFood(species, specieIndex, state, source, type) {
    if (type.includes(FOOD_TYPES.PLANT)) {
      let food = 1;
      eat(species, specieIndex, food, state, source, type, false);
    }
  }
}

const ForagingCards = [];
ForagingCards.push(new Foraging(0));
ForagingCards.push(new Foraging(3));
ForagingCards.push(new Foraging(3));
ForagingCards.push(new Foraging(4));
ForagingCards.push(new Foraging(4));
ForagingCards.push(new Foraging(5));
ForagingCards.push(new Foraging(5));


export default ForagingCards;