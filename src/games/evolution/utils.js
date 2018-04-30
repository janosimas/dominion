import { currentPlayer } from '../utils';

const eat = (species, specieIndex, food, state, source, type, triggerEffects = true) => {
  if (specieIndex < 0 || specieIndex >= species.length) {
    return;
  }

  const specie = species[specieIndex];
  if (state[source] < food) {
    food = state[source];
  }

  state[source] -= food;
  specie.food += food;
  // sanity check
  if (specie.food > specie.population) {
    specie.food = specie.population;
  }

  if (triggerEffects) {
    triggerSpecieGotFood(species, specieIndex, state, source, type);
  }
};

const getCardFromHand = (state, ctx, index) => {
  const player = currentPlayer(state, ctx);
  // sanity check
  if (index < 0 || index > player.hand.length) {
    return undefined;
  }

  const card = player.hand.splice(index, 1)[0];
  return card;
};

const triggerSpecieGotFood = (species, specieIndex, state, source, type) => {
  triggerSpecieGotFoodSelf(species, specieIndex, state, source, type);
  triggerSpecieGotFoodLeft(species, specieIndex, state, source, type);
  triggerSpecieGotFoodRight(species, specieIndex, state, source, type);

  triggerSpecieGotFoodGlobal(species, specieIndex, state, source, type);
};

const triggerSpecieGotFoodSelf = (species, specieIndex, state, source, type) => {
  const specie = species[specieIndex];
  for (const trait of specie.traits) {
    if (trait.specieGotFood) {
      trait.specieGotFood(species, specieIndex, state, source, type);
    }
  }
};

const triggerSpecieGotFoodLeft = (species, specieIndex, state, source, type) => {
  const specie = species[specieIndex];
  for (const trait of specie.traits) {
    if (trait.giveFoodLeft && trait.giveFoodLeft(state, source, type)) {
      eat(species, specieIndex - 1, state, source, type);
    }
  }
};

const triggerSpecieGotFoodRight = (species, specieIndex, state, source, type) => {
  const specie = species[specieIndex];
  for (const trait of specie.traits) {
    if (trait.giveFoodRight && trait.giveFoodRight(state, source, type)) {
      eat(species, specieIndex + 1, 1, state, source, type);
    }
  }
};

const triggerSpecieGotFoodGlobal = (species, specieIndex, state, source, type) => {
  for (let i = 0; i < species.length; ++i) {
    const specie = species[i];
    for (const trait of specie.traits) {
      if (trait.globalSpecieGotFood) {
        const {food, newSource, newType} = trait.globalSpecieGotFood(state, source, type);
        if(food) {
          eat(species, i, food, state, newSource, newType);
        }
      }
    }
  }
};

/**
 * Draw a number of cards from the deck into the player hand
 *
 * if no cards in the deck, shuffle the discard pile
 *
 * @param {Player object} player Player drawing the cards
 * @param {Number} [number=1] Number of cards to draw
 */
const drawCard = (state, ctx, player, number) => {
  number = number || 1;
  for (let index = 0; index < number; index++) {
    const card = state.secret.traitsDeck.pop();
    if (!card) {
      // empty deck
      break;
    }

    player.hand.push(card);
  }

  return player;
};

/**
 * Check body size and traits of the attacking specie
 * 
 * @param {Specie} specie 
 * @param {Specie} attackedSpecie
 */
const canAttack = (specie, attackedSpecie) => {
  return specie.attack() > attackedSpecie.defense();
};

/**
 * Check traits of the attacked specie
 * @param {Specie} defendingSpecie
 * @param {Specie} specie
 */
const canBeAttacked = (defendingSpecies, defendingSpecieIndex, specie, G) => {
  const defendingSpecie = defendingSpecies[defendingSpecieIndex];
  for (const trait of defendingSpecie.traits) {
    if (trait.canBeAttackedBy && !trait.canBeAttackedBy(specie, G)) {
      return false;
    }
  }

  if(defendingSpecieIndex > 0) {
    const leftDefendingSpecie = defendingSpecies[defendingSpecieIndex-1];
    for (const trait of leftDefendingSpecie.traits) {
      if (trait.canBeAttackedByLeft && !trait.canBeAttackedByLeft(specie, G)) {
        return false;
      }
    }
  }

  if (defendingSpecieIndex + 1 < defendingSpecies.length) {
    const rightDefendingSpecie = defendingSpecies[defendingSpecieIndex+1];
    for (const trait of rightDefendingSpecie.traits) {
      if (trait.canBeAttackedByLeft && !trait.canBeAttackedByLeft(specie, G)) {
        return false;
      }
    }
  }

  return true;
};

export { canBeAttacked,
  canAttack,
  drawCard,
  triggerSpecieGotFoodGlobal,
  triggerSpecieGotFood,
  triggerSpecieGotFoodLeft,
  triggerSpecieGotFoodRight,
  triggerSpecieGotFoodSelf,
  getCardFromHand,
  eat
};