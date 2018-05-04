import { Game } from 'boardgame.io/dist/core';
import { getState, currentPlayer } from '../utils';
import { Specie } from './specie';
import Player from './player';
import PHASES from './phases';
import BaseTraits from './traits/base_traits';
import FOOD_TYPE from './food_type';
import { getCardFromHand, eat, canAttack, canBeAttacked, drawCard } from './utils';

const selectSpecie = (G, ctx, specieIndex) => {
  const state = getState(G, ctx);
  const player = currentPlayer(state, ctx);
  player.selectedSpecie = specieIndex;
  return state;
};

const loosePopulation = (state, ctx, defendingSpecies, defendingSpecieIndex) => {
  const defendingSpecie = defendingSpecies[defendingSpecieIndex];
  defendingSpecie.population--;

  if(defendingSpecie.population === 0) {
    defendingSpecies.splice(defendingSpecieIndex, 1);
    for (let index = 0; index < defendingSpecies.length; index++) {
      const specie = defendingSpecies[index];
      specie.setIndex(index);
    }
  }
};

const triggerPlayerSpecieTrait = (state, ctx, functionName) => {
  for (const player of state.players) {
    for (const specie of player.species) {
      for (const trait of specie.traits) {
        if (trait[functionName]) {
          trait[functionName](state, ctx);
        }
      }
    }
  }
};

const triggerOnPhaseEndTraits = (state, ctx) => {
  triggerPlayerSpecieTrait(state, ctx, 'onPhaseEnd');
};

const triggerOnPhaseBeginTraits = (state, ctx) => {
  triggerPlayerSpecieTrait(state, ctx, 'onPhaseBegin');
};

const triggerBeforeAttack = (defendingSpecie, specie, state, ctx) => {
  for (const trait of defendingSpecie.traits) {
    if (trait.beforeAttack) {
      trait.beforeAttack(specie, state, ctx);
    }
  }
};

const attackOtherSpecie = (G, ctx, attackedPlayerIndex, defendingSpecieIndex) => {
  const state = getState(G, ctx);
  const player = currentPlayer(state, ctx);
  if (player.selectedSpecie === undefined) {
    return G;
  }

  const specie = player.species[player.selectedSpecie];
  if (!specie.canEat()
    || !specie.isCarnivore()
    || state.foodBank === 0) {
    return G;
  }

  const defendingSpecies = state.players[attackedPlayerIndex].species;
  const defendingSpecie = defendingSpecies[defendingSpecieIndex];
  if (!canAttack(specie, defendingSpecies[defendingSpecieIndex])) {
    return G;
  }

  if (!canBeAttacked(defendingSpecies, defendingSpecieIndex, specie, G)) {
    return G;
  }

  triggerBeforeAttack(defendingSpecie, specie, state, ctx);

  loosePopulation(state, ctx, defendingSpecies, defendingSpecieIndex);

  const missingFood = specie.population - specie.food;
  const food = defendingSpecie.bodySize > missingFood ? missingFood : defendingSpecie.bodySize;
  eat(player.species, player.selectedSpecie, food, state, 'foodBank', [FOOD_TYPE.MEAT, FOOD_TYPE.ATTACK]);

  player.selectedSpecie = undefined;
  state.endTurn = true;
  return state;
};

const Evolution = {
  setup: (ctx) => {
    let G = {
      secret: {},
      players: [],
      discard: [],
      wateringHole: 0,
      foodBank: 100,
      // playerView: PlayerView.STRIP_SECRETS
    };

    // create n players for the game
    for (var i = 0; i < ctx.numPlayers; i++) {
      const player = new Player(i, 'Player ' + (i + 1));
      player.species.push(new Specie(player.id, 0));
      G.players.push(player);
    }

    G.secret.traitsDeck = ctx.random.Shuffle(BaseTraits);
    
    return G;
  },
  moves: {
    endTurn: (G, ctx) => {
      const state = getState(G, ctx);
      const player = currentPlayer(state, ctx);
      player.endTurn = true;
      state.endTurn = true;
      return state;
    },
    //////////////////////////////////////////
    // play card for food phase
    clickOnCardForFood: (G, ctx, index) => {
      const state = getState(G, ctx);
      const card = getCardFromHand(state, ctx, index);
      if(!card) {
        return G;
      }

      state.secret.selectedCards.push(card);
      state.endTurn = true;

      return state;
    },
    //////////////////////////////////////////
    // cards action phase
    clickOnCard: (G, ctx, index) => {
      const state = getState(G, ctx);
      const player = currentPlayer(state, ctx);

      player.selectedCardIndex = index;
      return state;
    },

    newTrait: (G, ctx, specieIndex) => {
      const state = getState(G, ctx);
      const player = currentPlayer(state, ctx);
      if (player.selectedCardIndex === undefined) {
        return G;
      }

      const specie = player.species[specieIndex];
      if(specie.traits.length >= 4) {
        return G;
      }

      const card = getCardFromHand(state, ctx, player.selectedCardIndex);
      for (const trait of specie.traits) {
        if(trait.name === card.name) {
          player.hand.push(card);
          return G;
        }
      }

      card.setSpecie(player.id, specieIndex);
      specie.traits.push(card);
      player.selectedCardIndex = undefined;
      return state;
    },
    increasePopulation: (G, ctx, specieIndex) => {
      const state = getState(G, ctx);
      const player = currentPlayer(state, ctx);
      if (player.selectedCardIndex === undefined) {
        return G;
      }

      const specie = player.species[specieIndex];
      if (specie.population >= 9) {
        return G;
      }

      getCardFromHand(state, ctx, player.selectedCardIndex);
      specie.population++;
      player.selectedCardIndex = undefined;
      return state;
    },
    increaseBodySize: (G, ctx, specieIndex) => {
      const state = getState(G, ctx);
      const player = currentPlayer(state, ctx);
      if (player.selectedCardIndex === undefined) {
        return G;
      }

      const specie = player.species[specieIndex];
      if (specie.bodySize >= 9) {
        return G;
      }

      getCardFromHand(state, ctx, player.selectedCardIndex);
      specie.bodySize++;
      player.selectedCardIndex = undefined;
      return state;
    },
    createNewSpecie: (G, ctx, position) => {
      const state = getState(G, ctx);
      const player = currentPlayer(state, ctx);
      if (player.selectedCardIndex === undefined) {
        return G;
      }

      getCardFromHand(state, ctx, player.selectedCardIndex);
      player.species.splice(position, 0, new Specie(player.id, position));
      player.selectedCardIndex = undefined;
      return state;
    },
    //////////////////////////////////////////
    // eat phase actions
    clickOnSpecie: (G, ctx, playerId, specieIndex) => {
      const state = getState(G, ctx);
      const player = currentPlayer(state, ctx);
      if (playerId === player.id) {
        // select specie
        if (player.selectedSpecie === undefined) {
          return selectSpecie(G, ctx, specieIndex);
        }
      
        // deselect specie
        if(player.selectedSpecie === specieIndex) {
          player.selectedSpecie = undefined;
          return state;
        }

        // change selection (not carnivore)
        const specie = player.species[specieIndex];
        if (playerId === player.id && !specie.isCarnivore()) {
          return selectSpecie(G, ctx, specieIndex);
        }

        // attack owned specie
        return attackOtherSpecie(G, ctx, playerId, specieIndex);
      } else {
        return attackOtherSpecie(G, ctx, playerId, specieIndex);
      }
    },
    eatFromWateringHole: (G, ctx) => {
      const state = getState(G, ctx);
      const player = currentPlayer(state, ctx);
      if (player.selectedSpecie === undefined) {
        return G;
      }

      const specie = player.species[player.selectedSpecie];
      if (!specie.canEat()
          || specie.isCarnivore()
          || state.wateringHole === 0) {
        return G;
      }

      let food = 1;
      eat(player.species, player.selectedSpecie, food, state, 'wateringHole', [FOOD_TYPE.PLANT]);
      
      player.selectedSpecie = undefined;
      state.endTurn = true;
      return state;
    }
    //////////////////////////////////////////
  },
  flow: {
    endGameIf: (G, ctx) => {
      return undefined;
    },
    phases: [
      {
        name: PHASES.PLAY_FOOD_PHASE,
        allowedMoves: ['clickOnCardForFood'],
        endTurnIf: (G, ctx) => {
          return G.endTurn;
        },
        onTurnEnd: (G, ctx) => {
          const state = getState(G, ctx);
          state.endTurn = undefined;
          return state;
        },
        endPhaseIf: (G, ctx) => {
          if (G.secret.selectedCards && G.secret.selectedCards.length === G.players.length) {
            return PHASES.CARD_ACTION_PHASE;
          } else {
            return false;
          }
        },
        onPhaseBegin: (G, ctx) => {
          const state = getState(G, ctx);
          state.secret.selectedCards = [];
          for (const player of state.players) {
            drawCard(state, ctx, player, 4 + player.species.length);
          }

          triggerOnPhaseBeginTraits(state, ctx);
          return state;
        },
        onPhaseEnd: (G, ctx) => {
          const state = getState(G, ctx);
          let food = 0;
          for (const card of state.secret.selectedCards) {
            food+=card.food;
          }

          if (food > state.foodBank) {
            food = state.foodBank;
          }

          if(food > 0) {
            state.foodBank -= food;
          }

          state.wateringHole += food;
          if (state.wateringHole < 0) {
            state.wateringHole = 0;
          }

          state.secret.selectedCards = undefined;

          triggerOnPhaseEndTraits(state, ctx);
          return state;
        }
      },
      {
        name: PHASES.CARD_ACTION_PHASE,
        allowedMoves: ['clickOnCard', 'newTrait', 'increasePopulation', 'increaseBodySize', 'createNewSpecie', 'endTurn'],
        endTurnIf: (G, ctx) => {
          const player = currentPlayer(G, ctx);
          // end turn if the player has no card in hand
          // and no selected card
          return (!player.hand.length && !player.selectedCard) || G.endTurn;
        },
        onTurnBegin: (G, ctx) => {
          return G;
        },
        onTurnEnd: (G, ctx) => {
          const state = getState(G, ctx);
          state.endTurn = undefined;
          return state;
        },
        endPhaseIf: (G, ctx) => {
          let endPhase = true;
          for (const player of G.players) {
            if (player.hand.length || player.selectedCard) {
              endPhase = false;
              break;
            }  
          }

          let playersPassTurn = true;
          for (const player of G.players) {
            playersPassTurn = playersPassTurn && player.endTurn;
          }
          
          if (endPhase || playersPassTurn) {
            return PHASES.EAT_PHASE;
          } else {
            return false;
          }
        },
        onPhaseBegin(G, ctx) {
          const state = getState(G, ctx);
          triggerOnPhaseBeginTraits(state, ctx);
          return state;
        },
        onPhaseEnd: (G, ctx) => {
          const state = getState(G, ctx);

          for (const player of state.players) {
            player.endTurn = false;
          }

          triggerOnPhaseEndTraits(state, ctx);
          return state;
        }
      },
      {
        name: PHASES.EAT_PHASE, 
        allowedMoves: ['clickOnSpecie', 'eatFromWateringHole', 'endTurn'],
        endPhaseIf: (G, ctx) => {
          let playersPassTurn = true;
          for (const player of G.players) {
            playersPassTurn = playersPassTurn && player.endTurn;
          }

          if (playersPassTurn) {
            return PHASES.PLAY_FOOD_PHASE;
          } else {
            return false;
          }
        },
        onPhaseBegin: (G, ctx) => {
          const state = getState(G, ctx);
          triggerOnPhaseBeginTraits(state, ctx);
          return state;
        },
        onPhaseEnd: (G, ctx) => {
          const state = getState(G, ctx);
          for (const player of state.players) {
            for (let index = 0; index < player.species.length; index++) {
              const specie = player.species[index];

              while(specie.population > specie.food) {
                loosePopulation(state, ctx, player.species, index);
              }

              player.food += specie.food;
              specie.food = 0;
            }
          }

          for (let index = 0; index < state.players.length; index++) {
            const player = state.players[index];
            if(player.species.length === 0) {
              player.species.push(new Specie(index, 0));
            }
            player.endTurn = false;
          }
          
          triggerOnPhaseEndTraits(state, ctx);

          return state;
        },
        onTurnBegin: (G, ctx) => {
          const state = getState(G, ctx);
          const player = currentPlayer(G, ctx);
          player.endTurn = false;
          return state;
        },
        onTurnEnd: (G, ctx) => {
          const state = getState(G, ctx);
          state.endTurn = undefined;
          return state;
        },
        endTurnIf: (G, ctx) => {
          return G.endTurn;
        }
      }
    ]
  }
};

export default Game(Evolution);