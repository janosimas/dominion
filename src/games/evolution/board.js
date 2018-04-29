import React from 'react';
import PropTypes from 'prop-types';
import PlayerBoard from './react-components/player';

import './board.css';
import PHASES from './phases';
import { currentPlayer } from '../utils';

class EvolutionBoard extends React.Component {
  constructor(props) {
    super(props);

    this.moves = {
      clickOnCard: (cardIndex) => {
        if (this.props.ctx.phase === PHASES.CARD_ACTION_PHASE) {
          this.props.moves.clickOnCard(cardIndex);
        } else if (this.props.ctx.phase === PHASES.PLAY_FOOD_PHASE) {
          this.props.moves.clickOnCardForFood(cardIndex);
        }
      },
      clickOnSpecie: (specieIndex) => {
        this.props.moves.selectSpecie(specieIndex);
      },
      clickOnWateringHole: () => {
        this.props.moves.eatFromWateringHole();
      },
      attackOtherSpecie: (playerIndex, specieIndex) => {
        this.props.moves.attackOtherSpecie(playerIndex, specieIndex);
      },
      newTrait: (specieIndex) => {
        this.props.moves.newTrait(specieIndex);
      },
      increasePopulation: (specieIndex) => {
        this.props.moves.increasePopulation(specieIndex);
      },
      increaseBodySize: (specieIndex) => {
        this.props.moves.increaseBodySize(specieIndex);
      },
      createNewSpecie: (specieIndex) => {
        this.props.moves.createNewSpecie(specieIndex);
      },
    };
  }
  
  renderControls(G, ctx) {
    let player = currentPlayer(G, ctx);

    let controls = [];
    controls.push(<div key='current-player'>Current player: {player.name}</div>);
    controls.push(<div key='current-phase'>Current phase: {ctx.phase}</div>);
    
    return controls;
  }

  render() {
    const G = this.props.G;
    const ctx = this.props.ctx;
    const players = G.players;
    const playersRender = [];
    for (const player of players) {
      playersRender.push(
        <PlayerBoard moves={this.moves}
          ctx={this.props.ctx}
          player={player}
          key={player.name}
        />
      );
    }

    const control = this.renderControls(G, ctx);

    return (
      <div>
        <div className='player-board-list'>
          {playersRender}
        </div>
        <div className='controls'>
          {control}
        </div>
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