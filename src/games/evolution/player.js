import Specie from './specie';

class Player {
  constructor(name) {
    this.name = name;
    this.food = 0;
    this.hand = [];
    // players start with one specie
    this.species = [new Specie()];
  }
}

export default Player;