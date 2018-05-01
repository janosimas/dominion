import Trait from './trait';
import PHASES from '../phases';

class FatTissue extends Trait {
  constructor(food) {
    super('Fat Tissue', [], food);
    this.storedFood = 0;

    this.canEat.bind(this);
    this.storeFood.bind(this);
  }

  canEat() {
    if(this.isHungry()) {
      return true;
    }

    return this.storedFood < this.specie.bodySize;
  }

  storeFood(food) {
    this.storedFood += food;
    if (this.storedFood > this.specie.bodySize) {
      this.storedFood = this.specie.bodySize;
    }
  }

  onPhaseEnd(state, ctx) {
    if(ctx.phase === PHASES.PLAY_FOOD_PHASE) {
      if(this.storedFood > 0) {

        const { specie } = this.getSpecie(state);

        specie.food = this.storedFood;
        if (specie.food > specie.bodySize) {
          specie.food = specie.bodySize;
        }

        this.storedFood -= specie.food;
      }
    }
  }
}

const FatTissueCards = [];
FatTissueCards.push(new FatTissue(-1));
FatTissueCards.push(new FatTissue(0));
FatTissueCards.push(new FatTissue(3));
FatTissueCards.push(new FatTissue(4));
FatTissueCards.push(new FatTissue(4));
FatTissueCards.push(new FatTissue(5));
FatTissueCards.push(new FatTissue(5));


export default FatTissueCards;