class Specie {
  constructor(playerIndex, index) {
    this.playerIndex = playerIndex;
    this.index = index;
    this.population = 1;
    this.bodySize = 1;
    this.food = 0;
    this.traits = [];

    this.isHungry.bind(this);
    this.canEat.bind(this);
    this.isCarnivore.bind(this);
    this.canBeAttackedBy.bind(this);
    this.attack.bind(this);
    this.defense.bind(this);
    this.setIndex.bind(this);
    this.getPlayer.bind(this);
    this.eat.bind(this);
  }

  eat(food, state) {
    const hungry = this.population - this.food;
    const tempFood = food - (hungry - food);
    this.food += tempFood;
    
    // sanity check
    if (this.food > this.population) {
      this.food = this.population;
    }

    food -= tempFood;
    for (const trait of this.traits) {
      if (trait.storeFood) {
        if (trait.storeFood(food, state)) {
          return true;
        }
      }
    }
    
  }

  setIndex(specieIdx) {
    this.index = specieIdx;
  }

  getPlayer(G) {
    return G.players[this.playerIndex];
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

  canEat(G) {
    if(this.isHungry()) {
      return true;
    }

    for (const trait of this.traits) {
      if(trait.canEat) {
        if(trait.canEat(G)) {
          return true;
        }
      }
    }

    return false;
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