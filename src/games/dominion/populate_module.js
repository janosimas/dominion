let populate_module = (module, cards) => {
  module.cards = cards;
  for (card in cards) {
    if (card.actions)
      module.custom_actions.push(...card.custom_actions);
    if (card.phases)
      module.custom_moves.push(...card.custom_moves);
  }
}

export default populate_module;