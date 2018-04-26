import React from 'react';
import PropTypes from 'prop-types';
import SpecieBoard from './specie';
import Player from '../player';
import PHASES from '../phases';

class PlayerBoard extends React.Component {
  render() {
    const player = this.props.player;
    const species = player.species;

    let clickOnCard = undefined;
    const phase = this.props.phase;
    if (phase === PHASES.CARD_ACTION_PHASE
      || phase === PHASES.PLAY_FOOD_PHASE) {
      clickOnCard = this.props.moves.clickOnCard;
    }

    const handRender = [];
    // hand is a secret parameter
    // it's only available for the player owning it
    if(player.hand) {
      let c = 0;
      for (const card of player.hand) {
        c++;
        handRender.push(<div onClick={() => clickOnCard(c)} className='player-hand' key={c}>{card.name}</div>);
      }
    }

    let clickOnSpecie = undefined;
    if (phase === PHASES.EAT_PHASE) {
      clickOnSpecie = this.props.moves.clickOnSpecie;
    }
    const speciesRender = [];
    let i = 0;
    for (const specie of species) {
      i++;
      speciesRender.push(<SpecieBoard onClick={() => clickOnSpecie(i)} specie={specie} key={i} />);
    }

    return (
      <div className='player-board'>
        {player.name}
        {handRender}
        {speciesRender}
      </div>
    );
  }
}

PlayerBoard.propTypes = {
  player: PropTypes.instanceOf(Player),
  moves: PropTypes.object,
  phase: PropTypes.string,
};

export default PlayerBoard;