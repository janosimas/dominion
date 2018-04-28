import Specie from './specie';
import Ambush from './traits/ambush';

class Player {
  constructor(id, name) {
    this.id = String(id);
    this.name = name;
    this.food = 0;
    this.hand = Ambush;
    // players start with one specie
    this.species = [new Specie(), new Specie(), new Specie()];
  }
}

export default Player;