import React from 'react';
import PropTypes from 'prop-types';
import Specie from '../specie';
import PHASES from '../phases';

class SpecieBoard extends React.Component {
  render() {
    const specie = this.props.specie;

    const traitsRender = [];
    for (const trait of specie.traits) {
      traitsRender.push(<div>{trait.name}</div>);
    }

    const currentPlayer = this.props.ctx.currentPlayer;
    const phase = this.props.ctx.phase;
    let clickOnSpecie = undefined;
    let clinOnTrait = undefined;
    let clinOnPopulation = undefined;
    let clinOnBodySize = undefined;
    if (currentPlayer === this.props.player.id) {
      switch (phase) {
      case PHASES.EAT_PHASE:
        clickOnSpecie = () => this.props.moves.clickOnSpecie(this.props.id);
        break;
      case PHASES.CARD_ACTION_PHASE:
        clinOnPopulation = () => this.props.moves.increasePopulation(this.props.id);
        clinOnBodySize = () => this.props.moves.increaseBodySize(this.props.id);
        clinOnTrait = () => this.props.moves.newTrait(this.props.id);
        break;
      default:
        break;
      }
    }

    return (
      <div className='specie-board' onClick={clickOnSpecie} >
        <div className='specie-traits' onClick={clinOnTrait}>
          {traitsRender}
        </div>
        <div className='specie-values'>
          <div className='specie-population' onClick={clinOnPopulation}>
            {specie.population}
          </div>
          <div className='specie-body-size' onClick={clinOnBodySize}>
            {specie.bodySize}
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