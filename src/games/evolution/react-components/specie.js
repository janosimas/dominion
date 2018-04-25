import React from 'react';

class SpecieBoard extends React.Component {
  render() {
    const specie = {};

    const traitsRender = [];
    for (const trait of specie.traits) {
      traitsRender.push(<div>{trait.name}</div>);
    }

    return (
      <div className='specie-board'>
        <div className='specie-traits'>
          {traitsRender}
        </div>
        <div className='specie-population'>
          {specie.population}
        </div>
        <div className='specie-body-size'>
          {specie.bodySize}
        </div>
      </div>
    );
  }
}

export default SpecieBoard;