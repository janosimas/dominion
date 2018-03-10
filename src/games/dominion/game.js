import { currentPlayer, getState, discard } from '../utils'
export { playCard, buyCard, canPlay, drawCard, createPlayer } from './utils'

const Dominion = Game({
  setup: (numPlayers) => {
    let G = {
      victory: base_victory,
      treasure: base_treasure,
      kingdom: base_action,
      play_area: [],
      players: {},
      playerView: PlayerView.STRIP_SECRETS
    };

    for (var i = 0; i < numPlayers; i++) {
      G.players[i] = { ...createPlayer(), name: 'Player ' + (i + 1) };
    }

    return G;
  },

  moves: {
    onClickBoard(G, ctx, key) {
      const state = getState(G);
      const card = state.cardMap[key];
      // Ensure we can't have less then 0 cards.
      if (card.count <= 0) {
        return state;
      }
      
      const player = currentPlayer(Gcopy, ctx);
      state = buyCard(state, ctx, player, card);

      return state;
    },
    onClickHand(G, ctx, index) {
      const state = getState(G, ctx);
      const player = currentPlayer(Gcopy, ctx);
      const hand = player.hand;

      // sanity check
      if (index < 0 || index > hand.length)
        return state;
      
      // can the card be played?
      if (!canPlay(state, ctx, hand[index]))
        return state;

      //TODO: reveal or play card?
      const card = hand.splice(index, 1)[0];
      state = playCard(Gcopy, ctx, card);

      return state;
    }
  },

  flow: {
    endGameIf: (G, ctx) => G,

    // Run at the end of a turn.
    onTurnEnd: (G, ctx) => {
      const state = getState(G);
      const player = currentPlayer(state, ctx)

      player.discard.push(...state.play_area);
      state.play_area = [];
      for (; player.hand.length > 0;) {
        discard(player, 0);
      }
      draw(player, 5);
      return state;
    },

    onTurnBegin: (G, ctx) => {
      const state = getState(G);
      const player = currentPlayer(state, ctx);
      player.actions = 1;
      player.buy = 1;
      player.treasure = 0;

      return state;
    },

    phases: [
      {
        name: phases.ACTION_PHASE,
        allowedMoves: ['onClickHand'],
        endPhaseIf: (G, ctx) => {
          const player = currentPlayer(G, ctx);
          return player.actions === 0;
        }
      },
      {
        name: phases.BUY_PHASE,
        allowedMoves: ['onClickHand', 'onClickBoard']
      },
    ],
  },


});

export default Dominion;
