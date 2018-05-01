import Trait from './trait';

class Horns extends Trait {
  constructor(food) {
    super('Horns', [], food);

    this.beforeAttack.bind(this);
  }

  beforeAttack(specie, state, ctx) {
    specie.population--;
  }
}

const HornsCards = [];
HornsCards.push(new Horns(1));
HornsCards.push(new Horns(2));
HornsCards.push(new Horns(3));
HornsCards.push(new Horns(3));
HornsCards.push(new Horns(4));
HornsCards.push(new Horns(4));
HornsCards.push(new Horns(5));

export default HornsCards;