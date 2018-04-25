import React from 'react';
import PropTypes from 'prop-types';
import PlayerBoard from './react-components/player';

class EvolutionBoard extends React.Component {
  clickOnCard(cardIndex) {
    this.props.moves.clickOnCard(cardIndex);
  }
  clickOnSpecie(specieIndex) {
    this.props.moves.selectSpecie(specieIndex);
  }
  clickOnWateringHole() {
    this.props.moves.eatFromWateringHole();
  }
  attackOtherSpecie(G, ctx, specie) {

  }
  newTrait(G, ctx, trait) {

  }
  increasePopulation(G, ctx) {

  }
  increaseBodySize(G, ctx) {

  }
  createNewSpecie(G, ctx) {

  }
  render() {

    const players = [];
    const playersRender = [];
    for (const player of players) {
      playersRender.push(<PlayerBoard {...player} />);
    }

    return (
      <div>
        <div className='player-board-list'>
          {playersRender}
        </div>
      </div>
    );
  }
}

EvolutionBoard.propTypes = {
  moves: PropTypes.array,
};

export default EvolutionBoard;