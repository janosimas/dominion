import Trait from './trait';


class Cooperation extends Trait {
  constructor(food) {
    super('Cooperation', [], food);

    this.giveFoodRight.bind(this);
  }

  giveFoodRight(state, source, type) {
    return true;
  }
}

const CooperationCards = [];
CooperationCards.push(new Cooperation(0));
CooperationCards.push(new Cooperation(3));
CooperationCards.push(new Cooperation(3));
CooperationCards.push(new Cooperation(4));
CooperationCards.push(new Cooperation(4));
CooperationCards.push(new Cooperation(5));
CooperationCards.push(new Cooperation(5));


export default CooperationCards;