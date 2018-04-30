import Trait from './trait';

class PackHunting extends Trait {
  constructor(food) {
    super('Pack Hunting', [], food);

    this.increaseAttack.bind(this);
  }

  increaseAttack(specie) {
    return specie.population;
  }
}

const PackHuntingCards = [];
PackHuntingCards.push(new PackHunting(-3));
PackHuntingCards.push(new PackHunting(-2));
PackHuntingCards.push(new PackHunting(-1));
PackHuntingCards.push(new PackHunting(0));
PackHuntingCards.push(new PackHunting(1));
PackHuntingCards.push(new PackHunting(2));
PackHuntingCards.push(new PackHunting(3));

export default PackHuntingCards;