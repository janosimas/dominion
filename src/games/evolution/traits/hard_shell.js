import Trait from './trait';


class HardShell extends Trait {
  constructor(food) {
    super('HardShell', [], food);

    this.increaseDefense.bind(this);
  }

  increaseDefense() {
    return 4;
  }
}

const HardShellCards = [];
HardShellCards.push(new HardShell(1));
HardShellCards.push(new HardShell(2));
HardShellCards.push(new HardShell(3));
HardShellCards.push(new HardShell(3));
HardShellCards.push(new HardShell(4));
HardShellCards.push(new HardShell(4));
HardShellCards.push(new HardShell(5));

export default HardShellCards;