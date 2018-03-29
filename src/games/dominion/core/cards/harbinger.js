import React from 'react';

import types from '../../cardTypes'
import phases from '../../phases'
import { currentPlayer, getState } from '../../../utils'
import { drawCard } from '../../utils';

const card = {
  name: "Harbinger",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/3/32/Harbinger.jpg/200px-Harbinger.jpg' alt="Harbinger" />,
  isFaceUp: true,
  canHover: true,
  cost: 3,
  cards: 1,
  actions:1,
  count: 10,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);
    const player = currentPlayer(state, ctx);
    drawCard(ctx, player, 1);
    player.actions += 1;

    state.custom_phase = 'Harbinger select phase';
    state.allowEndPhase = () => {
      return phases.ACTION_PHASE;
    };

    state.render_extra = {
      cards: player.discard,
      cardsMove: 'onClickExtraHarbinger'
    }

    return state;
  },
  custom_moves: [
    {
      name: 'onClickExtraHarbinger',
      move: (G, ctx, index) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);
        const card = player.discard.splice(index, 1)[0];
        player.deck.unshift(card);
        state.end_phase = true;
        return state;
      }
    }
  ],
  custom_phases: [
    {
      name: 'Harbinger select phase',
      allowedMoves: ['onClickExtraHarbinger'],
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.custom_phase = undefined;
        state.allowEndPhase = undefined;
        state.render_extra = undefined;
        state.end_phase = undefined;
        return state;
      },
      endPhaseIf: (G, ctx) => {
        if(G.end_phase ) {
          return phases.ACTION_PHASE;
        }
        const player = currentPlayer(G, ctx);
        if (player.discard.length === 0) {
          return phases.ACTION_PHASE;
        }
        return false;
      }
    }
  ]
};

export default card;

