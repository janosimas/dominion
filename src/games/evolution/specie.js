class Specie {
  constructor() {
    this.population = 1;
    this.bodySize = 1;
    this.food = 0;
    this.traits = [];

    this.isHungry.bind(this);
    this.isCarnivore.bind(this);
    this.canBeAttackedBy.bind(this);
    this.attack.bind(this);
    this.defense.bind(this);
  }

  attack() {
    let attack = this.bodySize;
    for (const trait of this.traits) {
      if (trait.increaseAttack) {
        attack += trait.increaseAttack(this);
      }
    }

    return attack;
  }

  defense() {
    let defense = this.bodySize;
    for (const trait of this.traits) {
      if (trait.increaseDefense) {
        defense += trait.increaseDefense(this);
      }
    }
    return defense;
  }

  canBeAttackedBy(attackerSpecie) {
    for (const trait of this.traits) {
      if (trait.checkAttackerTrait && !trait.canBeAttackedBy(attackerSpecie)) {
        return false;
      }
    }

    return true;
  }

  isHungry() {
    return this.food < this.population;
  }

  isCarnivore() {
    for (const trait of this.traits) {
      if(trait.carnivore) {
        return true;
      }
    }

    return false;
  }
}

export default Specie;