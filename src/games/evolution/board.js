import React from 'react';
import PropTypes from 'prop-types';
import PlayerBoard from './react-components/player';

import './board.css';
import PHASES from './phases';

class EvolutionBoard extends React.Component {
  constructor(props) {
    super(props);

    this.moves = {
      clickOnCard(cardIndex) {
        if (this.props.ctx.phase === PHASES.CARD_ACTION_PHASE) {
          this.props.moves.clickOnCard(cardIndex);
        } else if (this.props.ctx.phase === PHASES.PLAY_FOOD_PHASE) {
          this.props.moves.clickOnCardForFood(cardIndex);
        }
      },
      clickOnSpecie(specieIndex) {
        this.props.moves.selectSpecie(specieIndex);
      },
      clickOnWateringHole() {
        this.props.moves.eatFromWateringHole();
      },
      attackOtherSpecie(G, ctx, specie) {

      },
      newTrait(G, ctx, trait) {

      },
      increasePopulation(G, ctx) {

      },
      increaseBodySize(G, ctx) {

      },
      createNewSpecie(G, ctx) {

      },
    };
  }
  
  render() {
    const players = this.props.G.players;
    const playersRender = [];
    for (const player of players) {
      playersRender.push(<PlayerBoard moves={this.props.moves} phase={this.props.ctx.phase} player={player} key={player.name} />);
    }

    return (
      <div className='player-board-list'>
        {playersRender}
      </div>
    );
  }
}

EvolutionBoard.propTypes = {
  moves: PropTypes.object,
  G: PropTypes.object,
  ctx: PropTypes.object,
};

export default EvolutionBoard;