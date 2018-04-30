import { Game } from 'boardgame.io/dist/core';
import { getState, currentPlayer } from '../utils';
import Specie from './specie';
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

const attackOtherSpecie = (G, ctx, attackedPlayerIndex, defendingSpecieIndex) => {
  const state = getState(G, ctx);
  const player = currentPlayer(state, ctx);
  if (player.selectedSpecie === undefined) {
    return G;
  }

  const specie = player.species[player.selectedSpecie];
  if (!specie.isHungry()
    || !specie.isCarnivore()
    || state.foodBank === 0) {
    return G;
  }

  const defendingSpecies = state.players[attackedPlayerIndex].species;
  const defendingSpecie = defendingSpecies[defendingSpecieIndex];
  if (!canAttack(specie, defendingSpecies[defendingSpecieIndex])) {
    return G;
  }
  if (!canBeAttacked(defendingSpecies, defendingSpecieIndex, specie)) {
    return G;
  }

  defendingSpecie.population--;

  const missingFood = specie.population - specie.food;
  const food = defendingSpecie.bodySize > missingFood ? missingFood : defendingSpecie.bodySize;
  eat(player.species, player.selectedSpecie, food, state, 'foodBank', FOOD_TYPE.MEAT);

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
      G.players.push(new Player(i, 'Player '+(i+1)));
    }

    G.secret.traitsDeck = ctx.random.Shuffle(BaseTraits);
    
    return G;
  },
  moves: {
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
      const card = getCardFromHand(state, ctx, index);
      if (!card) {
        return G;
      }

      const player = currentPlayer(state, ctx);
      // if the player change his mind,
      // put the old card back in his hand
      if (player.selectedCard) {
        player.hand.push(player.selectedCard);
      }

      player.selectedCard = card;
      return state;
    },

    newTrait: (G, ctx, specieIndex) => {
      const state = getState(G, ctx);
      const player = currentPlayer(state, ctx);
      if (!player.selectedCard) {
        return G;
      }

      const specie = player.species[specieIndex];
      if(specie.traits.length >= 4) {
        return G;
      }

      for (const trait of specie.traits) {
        if(trait.name === player.selectedCard.name) {
          return G;
        }
      }

      specie.traits.push(player.selectedCard);

      player.selectedCard = undefined;
      return state;
    },
    increasePopulation: (G, ctx, specieIndex) => {
      const state = getState(G, ctx);
      const player = currentPlayer(state, ctx);
      if (!player.selectedCard) {
        return G;
      }

      const specie = player.species[specieIndex];
      if (specie.population >= 9) {
        return G;
      }

      specie.population++;

      player.selectedCard = undefined;
      return state;
    },
    increaseBodySize: (G, ctx, specieIndex) => {
      const state = getState(G, ctx);
      const player = currentPlayer(state, ctx);
      if (!player.selectedCard) {
        return G;
      }

      const specie = player.species[specieIndex];
      if (specie.bodySize >= 9) {
        return G;
      }

      specie.bodySize++;

      player.selectedCard = undefined;
      return state;
    },
    createNewSpecie: (G, ctx, position) => {
      const state = getState(G, ctx);
      const player = currentPlayer(state, ctx);
      if (!player.selectedCard) {
        return G;
      }

      player.species.splice(position, 0, new Specie());

      player.selectedCard = undefined;
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
      if (!specie.isHungry()
          || specie.isCarnivore()
          || state.wateringHole === 0) {
        return G;
      }

      let food = 1;
      eat(player.species, player.selectedSpecie, food, state, 'wateringHole', FOOD_TYPE.PLANT);
      
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
            drawCard(state, ctx, player, 4);
            // drawCard(state, ctx, player, 4 + player.species.length);
          }
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
          return state;
        }
      },
      {
        name: PHASES.CARD_ACTION_PHASE,
        allowedMoves: ['clickOnCard', 'newTrait', 'increasePopulation', 'increaseBodySize', 'createNewSpecie'],
        endTurnIf: (G, ctx) => {
          const player = currentPlayer(G, ctx);
          // end turn if the player has no card in hand
          // and no selected card
          return (!player.hand.length && !player.selectedCard);
        },
        endPhaseIf: (G, ctx) => {
          let endPhase = true;
          for (const player of G.players) {
            if (player.hand.length || player.selectedCard) {
              endPhase = false;
              break;
            }  
          }
          
          if(endPhase) {
            return PHASES.EAT_PHASE;
          } else {
            return false;
          }
        }
      },
      {
        name: PHASES.EAT_PHASE, 
        allowedMoves: ['clickOnSpecie', 'eatFromWateringHole'],
        onPhaseEnd: (G, ctx) => {
          const state = getState(G, ctx);
          for (const player of state.players) {
            for (const specie of player.species) {
              player.food += specie.food;
              specie.food = 0;
            }
          }
          
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