import React from 'react';
import PropTypes from 'prop-types';
import Specie from '../specie';

class SpecieBoard extends React.Component {
  render() {
    const specie = this.props.specie;

    const traitsRender = [];
    for (const trait of specie.traits) {
      traitsRender.push(<div>{trait.name}</div>);
    }

    return (
      <div className='specie-board'>
        {
          specie.traits.lengh > 0 &&
          <div className='specie-traits'>
            {traitsRender}
          </div>
        }
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

SpecieBoard.propTypes = {
  specie: PropTypes.instanceOf(Specie),
};

export default SpecieBoard;