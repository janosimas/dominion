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

    const currentPlayer = this.props.ctx.currentPlayer;
    let clickOnCard = undefined;
    let createNewSpecie = undefined;
    const phase = this.props.ctx.phase;
    if (currentPlayer === this.props.player.id) {
      switch (phase) {
      case PHASES.CARD_ACTION_PHASE:
        createNewSpecie = this.props.moves.createNewSpecie;
        // falls through
      case PHASES.PLAY_FOOD_PHASE:
        clickOnCard = this.props.moves.clickOnCard;
        break;
      default:
        break;
      }
    }

    const handRender = player.hand.map((card, index)  => {
      return  <Card 
        className='card'
        isFaceUp={currentPlayer === this.props.player.id}
        canHover={currentPlayer === player.id} 
        onClick={clickOnCard && (() => clickOnCard(index))} 
        front={
          <div>
            <div className='name'>
              {card.name}
            </div>
            <div className='food'>
              {card.food}
            </div>
          </div>}
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

    const size = speciesRender.length;
    for (let index = size; index >= 0 ; index--) {
      speciesRender.splice(index, 0, <div className='between-species' key={100 + index} onClick={() => createNewSpecie(index)} ></div>);
    }

    return (
      <div className='player-board'>
        <div className='player-name'>
          {player.name}
        </div>
        {
          <div className='player-hand'>
            {handRender}
          </div>
        }
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