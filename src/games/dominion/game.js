import { Game, PlayerView } from 'boardgame.io/core';

import { currentPlayer, getState, discard } from '../utils'
import { playCardFromHand, buyCard, drawCard, createPlayer, populateCardMap, populateMoves } from './utils'
import phases from './phases'

import baseModule from './base/module'
import coreModule from './core/module'


const Dominion = {
  setup: (ctx) => {
    let G = {
      play_area: [],
      trash: [],
      players: {},
      cardMap: populateCardMap([baseModule, coreModule]),
      boardCards: [...baseModule.cards, ...coreModule.cards],
      playerView: PlayerView.STRIP_SECRETS
    };

    for (var i = 0; i < ctx.numPlayers; i++) {
      G.players[i] = { ...createPlayer(ctx), name: 'Player ' + (i + 1) };
    }

    return G;
  },
  moves: {
    onClickBoard(G, ctx, key) {
      let state = getState(G);
      const card = state.cardMap.get(key);
      // Ensure we can't have less then 0 cards.
      if (card.count <= 0) {
        return state;
      }

      const player = currentPlayer(state, ctx);
      state = buyCard(state, ctx, player, card);

      return state;
    },
    onClickHand(G, ctx, index) {
      let state = getState(G, ctx);
      const player = currentPlayer(state, ctx);
      const hand = player.hand;

      // sanity check
      if (index < 0 || index > hand.length) {
        return state;
      }

      //TODO: reveal or play card?
      state = playCardFromHand(state, ctx, index);

      return state;
    },
  },
  flow: {
    endGameIf: (G, ctx) => {
      // check if there are 3 or more empty piles in the board
      let emptyCount = 0;
      for (let index = 0; index < G.boardCards.length; index++) {
        const card = G.boardCards[index];
        if(card.count === 0) {
          emptyCount+=1;
        }
      }

      if(emptyCount < 2) {
        return undefined;
      } else {
        // game end, check victory condition
        let victoryMap = new Map();
        for (let player in G.players) {
          if (G.players.hasOwnProperty(player)) {
            let playerVictory = 0;
            const props = G.players[player];
            const cards = [...props.hand, ...props.deck, ...props.discard];
            for (const playerCard of cards) {
              if (playerCard.victory) {
                playerVictory += playerCard.victory;
              }
            }
            victoryMap.set(player, playerVictory);
          }
        }

        let winner = null;
        let mostPoints = null;
        for (const maybeWinner of victoryMap) {
          const points = maybeWinner[1];
          if (!winner || points > mostPoints) {
            mostPoints = points;
            winner = maybeWinner[0];
          }
        }
        
        return winner;
      }
    },

    // Run at the end of a turn.
    onTurnEnd: (G, ctx) => {
      G.end_turn = false;
      if (G.custom_phase) {
        return G;
      }

      const state = getState(G);
      const player = currentPlayer(state, ctx)

      player.discard.push(...state.play_area);
      state.play_area = [];
      for (; player.hand.length > 0;) {
        discard(player, 0);
      }
      drawCard(ctx, player, 5);
      return state;
    },

    onTurnBegin: (G, ctx) => {
      if (G.custom_phase) {
        return G;
      }

      const state = getState(G);
      const player = currentPlayer(state, ctx);
      player.actions = 1;
      player.buy = 1;
      player.treasure = 0;

      return state;
    },

    endTurnIf: (G, ctx) => {
      return !!G.end_turn;
    },

    phases: [
      {
        name: phases.ACTION_PHASE,
        allowedMoves: ['onClickHand'],
        endPhaseIf: (G, ctx) => {
          if(G.custom_phase) {
            return G.custom_phase;
          }

          return false;
          // const player = currentPlayer(G, ctx);
          // return player.actions === 0;
        }
      },
      {
        name: phases.BUY_PHASE,
        allowedMoves: ['onClickHand', 'onClickBoard']
      },
      ...coreModule.custom_phases
    ],
  },
}

populateMoves(Dominion, [baseModule, coreModule]);

export default Game(Dominion);
