// auxiliary functions

let currentPlayer = (state, ctx) => {
  return state.players[ctx.actionPlayers[0]];
};

let getState = (G) => {
  return Object.assign({}, G);
};

/**
 * Discard a number of cards from the player hand into the discard pile
 *
 * if number is greater than the number of cards in
 * the player hand, discard all cards
 *
 * @param {Player object} player Player discarding the cards
 * @param {Number} index Index of the card to discard
 */
let discard = (player, index) => {
  player.discard.push(player.hand.splice(index, 1)[0]);
  return player;
};

export { currentPlayer, getState, discard };