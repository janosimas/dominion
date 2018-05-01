import Trait from './trait';
import PHASES from '../phases';


class Fertile extends Trait {
  constructor(food) {
    super('Fertile', [], food);

    this.onPhaseEnd.bind(this);
  }

  onPhaseEnd(state, ctx) {
    if(ctx.phase === PHASES.PLAY_FOOD_PHASE) {
      if(state.wateringHole > 0) {
        const { specie } = this.getSpecie(state);
        specie.population++;
      }
    }
  }
}

const FertileCards = [];
FertileCards.push(new Fertile(2));
FertileCards.push(new Fertile(3));
FertileCards.push(new Fertile(4));
FertileCards.push(new Fertile(5));
FertileCards.push(new Fertile(6));
FertileCards.push(new Fertile(6));
FertileCards.push(new Fertile(7));


export default FertileCards;