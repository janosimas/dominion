import Trait from './trait';
import FOOD_TYPE from '../food_type';

class Scavenger extends Trait {
  constructor(food) {
    super('Scavenger', [], food);

    this.globalSpecieGotFood.bind(this);
  }

  globalSpecieGotFood(state, source, type) {
    if(type.includes(FOOD_TYPE.ATTACK)) {
      return {food:1, newSource: source, newType: [FOOD_TYPE.MEAT]};
    }
  }
}

const ScavengerCards = [];
ScavengerCards.push(new Scavenger(2));
ScavengerCards.push(new Scavenger(3));
ScavengerCards.push(new Scavenger(4));
ScavengerCards.push(new Scavenger(5));
ScavengerCards.push(new Scavenger(6));
ScavengerCards.push(new Scavenger(6));
ScavengerCards.push(new Scavenger(7));

export default ScavengerCards;