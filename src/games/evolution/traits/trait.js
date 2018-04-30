
class Trait {
  constructor(name, types, food) {
    this.name = name;
    this.food = food;
    this.types = types;
    this.className = 'trait';

    this.specieIdx = undefined;

    this.setSpecie.bind(this);
    this.getSpecie.bind(this);
  }

  getSpecie(state) {
    const player = state.players[this.playerIndex];
    const specie = player.specie[this.specieIdx];

    return { player: player, specie: specie };
  }

  setSpecie(playerIndex, specieIdx) {
    this.playerIndex = playerIndex;
    this.specieIdx = specieIdx;
  }
}

export default Trait;