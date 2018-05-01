import Trait from './trait';
import PHASES from '../phases';

const FatTissueName = 'Fat Tissue';

class FatTissue extends Trait {
  constructor(food) {
    super(FatTissueName, [], food);
    this.storedFood = 0;

    this.canEat.bind(this);
    this.storeFood.bind(this);
  }

  canEat(G) {
    if(this.isHungry()) {
      return true;
    }

    const {specie} = this.getSpecie(G);
    return this.storedFood < specie.bodySize;
  }

  storeFood(food, state) {
    this.storedFood += food;
    const { specie } = this.getSpecie(state);
    if (this.storedFood > specie.bodySize) {
      this.storedFood = specie.bodySize;
    }

    this.name = FatTissueName+' ('+this.storedFood+')';
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
        this.name = FatTissueName + ' (' + this.storedFood + ')';
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