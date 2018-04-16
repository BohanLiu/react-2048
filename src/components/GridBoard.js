import React from 'react';
import GridCell from './GridCell';

const GridBoard = (props) => {
  let cells = [];
  props.valueMatrix.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        cells.push(
          <GridCell 
            key={cell.id} 
            value={cell.value} 
            hasValueChanged={cell.hasValueChanged}
            isNew={cell.isNewlySpawned}
            pos={[rowIndex, colIndex]}
          />
        );
      }
    });
  });

  return (
    <div className='grid-board'>
      {cells}
    </div>
  );
}

export default GridBoard;
