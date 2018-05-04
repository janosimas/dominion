import Trait from './trait';

class Symbiosis extends Trait {
  constructor(food) {
    super('Symbiosis', [], food);

    this.canBeAttackedBy.bind(this);
  }

  canBeAttackedBy(attackerSpecie, G) {
    const {player} = this.getSpecie(G);
    if((player.species.length) > this.index+1) {
      const specieToTheRight = player.species(this.index+1);
      if (this.bodySize < specieToTheRight.bodySize) {
        return false;
      }
    }

    return true;
  }
}

const SymbiosisCards = [];
SymbiosisCards.push(new Symbiosis(1));
SymbiosisCards.push(new Symbiosis(2));
SymbiosisCards.push(new Symbiosis(3));
SymbiosisCards.push(new Symbiosis(3));
SymbiosisCards.push(new Symbiosis(4));
SymbiosisCards.push(new Symbiosis(4));
SymbiosisCards.push(new Symbiosis(5));

export default SymbiosisCards;