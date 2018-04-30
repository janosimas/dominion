import Trait from './trait';


class Burrowing extends Trait {
  constructor(food) {
    super('Burrowing', [], food);

    this.canBeAttackedBy.bind(this);
  }

  canBeAttackedBy(defendingSpecie, attackerSpecie) {
    return defendingSpecie.isHungry();
  }
}

const BurrowingCards = [];
BurrowingCards.push(new Burrowing(1));
BurrowingCards.push(new Burrowing(2));
BurrowingCards.push(new Burrowing(3));
BurrowingCards.push(new Burrowing(3));
BurrowingCards.push(new Burrowing(4));
BurrowingCards.push(new Burrowing(4));
BurrowingCards.push(new Burrowing(5));


export default BurrowingCards;