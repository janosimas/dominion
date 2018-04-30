import Trait from './trait';


class Carnivore extends Trait {
  constructor(food) {
    super('Carnivore', [], food);

    this.carnivore = true;
  }
}

const CarnivoreCards = [];
CarnivoreCards.push(new Carnivore(0));
CarnivoreCards.push(new Carnivore(0));
CarnivoreCards.push(new Carnivore(1));
CarnivoreCards.push(new Carnivore(1));
CarnivoreCards.push(new Carnivore(2));
CarnivoreCards.push(new Carnivore(2));
CarnivoreCards.push(new Carnivore(2));
CarnivoreCards.push(new Carnivore(3));
CarnivoreCards.push(new Carnivore(3));
CarnivoreCards.push(new Carnivore(3));
CarnivoreCards.push(new Carnivore(4));
CarnivoreCards.push(new Carnivore(4));
CarnivoreCards.push(new Carnivore(4));
CarnivoreCards.push(new Carnivore(5));
CarnivoreCards.push(new Carnivore(5));
CarnivoreCards.push(new Carnivore(6));
CarnivoreCards.push(new Carnivore(6));

export default CarnivoreCards;