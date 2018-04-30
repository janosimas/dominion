import Trait from './trait';


class Climbing extends Trait {
  constructor(food) {
    super('Climbing', [], food);
    this.climbing = true;

    this.canBeAttackedBy.bind(this);
  }

  canBeAttackedBy(defendingSpecie, attackerSpecie) {
    for (const attTrait of attackerSpecie.traits) {
      if(attTrait.climbing) {
        return true;
      }
    }

    return false;
  }
}

const ClimbingCards = [];
ClimbingCards.push(new Climbing(1));
ClimbingCards.push(new Climbing(2));
ClimbingCards.push(new Climbing(3));
ClimbingCards.push(new Climbing(3));
ClimbingCards.push(new Climbing(4));
ClimbingCards.push(new Climbing(4));
ClimbingCards.push(new Climbing(5));


export default ClimbingCards;