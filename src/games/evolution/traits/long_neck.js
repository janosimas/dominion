import Trait from './trait';
import PHASES from '../phases';
import { eat } from '../utils';
import FOOD_TYPE from '../food_type';

class LongNeck extends Trait {
  constructor(food) {
    super('Long Neck', [], food);

    this.onPhaseEnd.bind(this);
  }

  onPhaseEnd(state, ctx) {
    if (ctx.phase === PHASES.PLAY_FOOD_PHASE) {
      const { player } = this.getSpecie(state);
      eat(player.species, this.specieIdx, 1, state, 'foodBank', [FOOD_TYPE.PLANT]);
    }
  }
}

const LongNeckCards = [];
LongNeckCards.push(new LongNeck(3));
LongNeckCards.push(new LongNeck(4));
LongNeckCards.push(new LongNeck(5));
LongNeckCards.push(new LongNeck(6));
LongNeckCards.push(new LongNeck(7));
LongNeckCards.push(new LongNeck(8));
LongNeckCards.push(new LongNeck(9));

export default LongNeckCards;