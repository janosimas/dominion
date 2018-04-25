import React from 'react';
import SpecieBoard from './specie';

class PlayerBoard extends React.Component {
  render() {
    const species = [];
    const player = {hand: []};

    const handRender = [];
    // hand is a secret parameter
    // it's only available for the player owning it
    if(player.hand) {
      for (const card of player.hand) {
        handRender.push(<div className='player-hand'>{card.name}</div>);
      }
    }


    const speciesRender = [];
    for (const specie of species) {
      speciesRender.push(<SpecieBoard {...specie} />);
    }

    return (
      <div className='player-board'>
        {handRender}
        {speciesRender}
      </div>
    );
  }
}

export default PlayerBoard;