import React from 'react';
import PropTypes from 'prop-types';

const BackgroundBoard = (props) => {
  let rows = [];
  for (let i = 0; i < props.size; i++) {
    let cells = [];
    for (let j = 0; j < props.size; j++) {
      cells.push(<div key={i + '-' + j} className='background-cell'></div>);
    }
    let row = (
      <div key={'row-'+i} className='background-row'>
        {cells}
      </div>);
    rows.push(row);
  }
  return (
    <div className='background-board'>
      {rows}
    </div>
  );
}

BackgroundBoard.propTypes = {
  size: PropTypes.number.isRequired
}

export default BackgroundBoard;
