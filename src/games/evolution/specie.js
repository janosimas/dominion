class Specie {
  constructor() {
    this.population = 1;
    this.bodySize = 1;
    this.food = 0;
    this.traits = [];

    this.isHungry.bind(this);
  }

  isHungry() {
    return this.food < this.population;
  }
}

export default Specie;