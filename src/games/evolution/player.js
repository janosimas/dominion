class Player {
  constructor(id, name) {
    this.id = String(id);
    this.name = name;
    this.food = 0;
    this.hand = [];
    // players start with one specie
    this.species = [];
    this.endTurn = false;
  }
}


export default Player;