/**
 * Default action for playing cards.
 * 
 * Execute action of simple cards:
 * - draw cards
 * - add actions
 * - add buys
 * - add treasures
 * 
 * @param {Game} G Game state
 * @param {GameMetadata} ctx Current game metadata
 * @param {Card} card Card beeing played
 */
function default_action(G, ctx, card) {
  const player = G.currentPlayer(ctx);
  G.draw(player, card.cards);
  G.addBuy(player, card.buy);
  G.addActions(player, card.actions);
  G.addTreasure(player, card.treasure);
}

export default default_action;