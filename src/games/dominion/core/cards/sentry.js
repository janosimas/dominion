import React from 'react';

import types from '../../cardTypes'
import { currentPlayer, getState } from '../../../utils'
import { pushPhase, getLastPhase, popPhase, drawCard, popDeckCard } from '../../utils';

const SENTRY_TRASH_PHASE = 'Sentry trash phase';
const SENTRY_DISCARD_PHASE = 'Sentry discard phase';
const SENTRY_REORDER_PHASE = 'Sentry reorder phase';

const card = {
  name: "Sentry",
  back: <img src='http://wiki.dominionstrategy.com/images/c/ca/Card_back.jpg' alt='Deck' />,
  front: <img src='http://wiki.dominionstrategy.com/images/thumb/4/4c/Sentry.jpg/200px-Sentry.jpg' alt="Sentry" />,
  isFaceUp: true,
  canHover: true,
  cost: 5,
  count: 10,
  className: 'card',
  type: [types.ACTION],
  onPlay: (G, ctx) => {
    const state = getState(G);
    const player = currentPlayer(state, ctx);
    drawCard(ctx, player, 1);
    player.actions += 1;

    pushPhase(state, SENTRY_TRASH_PHASE);
    return state;
  },
  custom_moves: [
    {
      name: 'onClickExtraHarbinger',
      move: (G, ctx, index) => {
        const state = getState(G);
        const card = state.render_extra.cards.splice(index, 1)[0];
        state.trash.push(card);
        return state;
      }
    }, 
    {
      name: 'onClickSentryDiscard',
      move: (G, ctx, index) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);
        const card = state.render_extra.cards.splice(index, 1)[0];
        player.discard.push(card);
        return state;
      }
    },
    {
      name: 'onClickSentryReorder',
      move: (G, ctx, index) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);
        const card = state.render_extra.cards.splice(index, 1)[0];
        player.deck.unshift(card);
        return state;
      }
    },
  ],
  custom_phases: [
    {
      name: SENTRY_TRASH_PHASE,
      allowedMoves: ['onClickSentryTrash'],
      onPhaseBegin: (G, ctx) => {
        const state = getState(G);
        const player = currentPlayer(state, ctx);

        const cards = [];
        const card1 = popDeckCard(ctx, player);
        if(card1) {
          cards.push(card1);
        }
        const card2 = popDeckCard(ctx, player);
        if (card2) {
          cards.push(card2);
        }

        if(!cards) {
          state.no_cards = true;
          return state;
        }

        state.render_extra = {
          title: 'You may choose cards to trash or end phase: ',
          cards: cards,
          cardsMove: 'onClickSentryTrash'
        }

        state.allowEndPhase = () => {
          return SENTRY_DISCARD_PHASE;
        };

        return state;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.allowEndPhase = undefined;
        popPhase(state);
        return state;
      },
      endPhaseIf: (G, ctx) => {
        if (G.no_cards
            || !G.render_extra.cards) {
          return SENTRY_DISCARD_PHASE;
        } else {
          return false;
        }
      }
    },
    {
      name: SENTRY_DISCARD_PHASE,
      allowedMoves: ['onClickSentryDiscard'],
      onPhaseBegin: (G, ctx) => {
        const state = getState(G);

        state.render_extra.title = 'You may choose cards to discard or end phase: ';
        state.render_extra.cardsMove = 'onClickSentryDiscard'

        state.allowEndPhase = () => {
          return SENTRY_REORDER_PHASE;
        };

        return state;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.allowEndPhase = undefined;
        popPhase(state);
        return state;
      },
      endPhaseIf: (G, ctx) => {
        if (G.no_cards
            || !G.render_extra.cards) {
          return SENTRY_REORDER_PHASE;
        } else {
          return false;
        }
      }
    },
    {
      name: SENTRY_REORDER_PHASE,
      allowedMoves: ['onClickSentryReorder'],
      onPhaseBegin: (G, ctx) => {
        const state = getState(G);

        state.render_extra.title = 'You must choose the cards to put on top of the deck: ';
        state.render_extra.cardsMove = 'onClickSentryReorder'

        return state;
      },
      onPhaseEnd: (G, ctx) => {
        const state = getState(G);
        state.allowEndPhase = undefined;
        state.render_extra = undefined;
        state.no_cards = undefined;
        popPhase(state);
        return state;
      },
      endPhaseIf: (G, ctx) => {
        if (G.no_cards
            || !G.render_extra.cards) {
          return getLastPhase(G);
        } else {
          return false;
        }
      }
    }
  ]
};

export default card;

