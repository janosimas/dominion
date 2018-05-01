import Trait from './trait';


class DefensiveHerding extends Trait {
  constructor(food) {
    super('Defensive Herding', [], food);

    this.canBeAttackedBy.bind(this);
  }

  canBeAttackedBy(attackerSpecie, G) {
    const { specie } = this.getSpecie(G);
    return attackerSpecie.population > specie.population;
  }
}

const DefensiveHerdingCards = [];
DefensiveHerdingCards.push(new DefensiveHerding(2));
DefensiveHerdingCards.push(new DefensiveHerding(3));
DefensiveHerdingCards.push(new DefensiveHerding(4));
DefensiveHerdingCards.push(new DefensiveHerding(5));
DefensiveHerdingCards.push(new DefensiveHerding(6));
DefensiveHerdingCards.push(new DefensiveHerding(7));
DefensiveHerdingCards.push(new DefensiveHerding(8));


export default DefensiveHerdingCards;