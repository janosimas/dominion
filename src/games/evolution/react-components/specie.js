import React from 'react';
import PropTypes from 'prop-types';
import {Specie} from '../specie';
import PHASES from '../phases';

class SpecieBoard extends React.Component {
  render() {
    const player = this.props.player;
    const specie = this.props.specie;

    const traitsRender = [];
    for (const trait of specie.traits) {
      traitsRender.push(<div className='trait' key={trait.name}>{trait.name}</div>);
    }

    const currentPlayer = this.props.ctx.currentPlayer;
    const phase = this.props.ctx.phase;
    
    let clinOnTrait = undefined;
    let clinOnPopulation = undefined;
    let clinOnBodySize = undefined;

    if (currentPlayer === player.id) {
      switch (phase) {
      case PHASES.CARD_ACTION_PHASE:
        clinOnPopulation = () => this.props.moves.increasePopulation(this.props.id);
        clinOnBodySize = () => this.props.moves.increaseBodySize(this.props.id);
        clinOnTrait = () => this.props.moves.newTrait(this.props.id);
        break;
      default:
        break;
      }
    }

    let clickOnSpecie = undefined;
    if(phase === PHASES.EAT_PHASE) {
      clickOnSpecie = () => this.props.moves.clickOnSpecie(player.id, this.props.id);
    }

    const specieStyle = specie.isCarnivore() ? { background: '#FFccaa' } : undefined;

    let specieBoardClass = 'specie-board';
    if(phase === PHASES.EAT_PHASE) {
      if (currentPlayer === player.id) {
        if (player.selectedSpecie === this.props.id) {
          specieBoardClass += ' highlight-green';
        }
        
        if(player.selectedSpecie === undefined
            && specie.canEat()) {
          specieBoardClass +=' highlight-blue';
        }
      }
    }

    return (
      <div className={specieBoardClass} onClick={clickOnSpecie} >
        <div className='specie-traits' onClick={clinOnTrait} style={specieStyle}>
          {traitsRender}
        </div>
        <div className='specie-values'>
          <div className='specie-population' onClick={clinOnPopulation}>
            {specie.population}
          </div>
          <div className='specie-body-size' onClick={clinOnBodySize}>
            {specie.bodySize}
          </div>
          <div className='specie-food'>
            {specie.food}
          </div>
        </div>
      </div>
    );
  }
}

SpecieBoard.propTypes = {
  ctx: PropTypes.object,
  player: PropTypes.object,
  specie: PropTypes.instanceOf(Specie),
  id: PropTypes.number,
  moves: PropTypes.object,
};

export default SpecieBoard;