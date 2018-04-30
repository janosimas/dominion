import Trait from './trait';

const AmbushName = 'Ambush';

class WarningCall extends Trait {
  constructor(food) {
    super('Warning Call', [], food);

    this.canBeAttackedByLeft.bind(this);
    this.canBeAttackedByRight.bind(this);
  }

  canBeAttackedByLeft(attackerSpecie) {
    for (const trait of attackerSpecie.traits) {
      if (trait.name === AmbushName) {
        return true;
      }
    }

    return false;
  }
  
  canBeAttackedByRight(attackerSpecie) {
    for (const trait of attackerSpecie.traits) {
      if (trait.name === AmbushName) {
        return true;
      }
    }

    return false;
  }
}

const WarningCallCards = [];
WarningCallCards.push(new WarningCall(1));
WarningCallCards.push(new WarningCall(2));
WarningCallCards.push(new WarningCall(3));
WarningCallCards.push(new WarningCall(3));
WarningCallCards.push(new WarningCall(4));
WarningCallCards.push(new WarningCall(4));
WarningCallCards.push(new WarningCall(5));

export default WarningCallCards;