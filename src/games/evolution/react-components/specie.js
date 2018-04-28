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

    const currentPlayer = this.props.ctx.actionPlayers[0];
    const phase = this.props.ctx.phase;
    let clickOnSpecie = undefined;
    if (currentPlayer === this.props.player.id && phase === PHASES.EAT_PHASE) {
      clickOnSpecie = () => this.props.moves.clickOnSpecie(this.props.id);
    }

    return (
      <div className='specie-board' onClick={clickOnSpecie} >
        <div className='specie-traits'>
          {traitsRender}
        </div>
        <div className='specie-values'>
          <div className='specie-population'>
            {specie.population}
          </div>
          <div className='specie-body-size'>
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