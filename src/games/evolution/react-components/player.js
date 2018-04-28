import React from 'react';
import PropTypes from 'prop-types';

import { Card } from 'boardgame.io/ui';

import SpecieBoard from './specie';
import Player from '../player';
import PHASES from '../phases';

class PlayerBoard extends React.Component {
  render() {
    const player = this.props.player;
    const species = player.species;

    const currentPlayer = this.props.ctx.actionPlayers[0];
    let clickOnCard = undefined;
    const phase = this.props.ctx.phase;
    if (currentPlayer === player.id 
      && (phase === PHASES.CARD_ACTION_PHASE
          || phase === PHASES.PLAY_FOOD_PHASE)) {
      clickOnCard = this.props.moves.clickOnCard;
    }

    const handRender = player.hand.map((card, index)  => {
      return  <Card 
        className='card'
        isFaceUp={true}
        canHover={currentPlayer === player.id} 
        onClick={clickOnCard && (() => clickOnCard(index))} 
        front={card.name}
        key={index} />;
    });

    const speciesRender = species.map((specie, index) => {
      return <SpecieBoard 
        ctx={this.props.ctx}
        player={player}
        moves={this.props.moves}
        specie={specie}
        id={index}
        key={index}
      />;
    });

    return (
      <div className='player-board'>
        <div className='player-name'>
          {player.name}
        </div>
        <div className='player-hand'>
          {handRender}
        </div>
        <div className='species-list'>
          {speciesRender}
        </div>
      </div>
    );
  }
}

PlayerBoard.propTypes = {
  player: PropTypes.instanceOf(Player),
  moves: PropTypes.object,
  ctx: PropTypes.object,
};

export default PlayerBoard;