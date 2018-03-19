import React from 'react';
import {getRandomInt, copy2DArray} from '../../Utils';
import './Game.css';

function GridCell(props) {
  let className = "grid-cell cell-" + (props.value > 2048 ? 'exceeded' : props.value);
  return (
    <div className={className}>{props.value > 0 ? props.value : ''}</div>
  );
}

function GridRow(props) {
  let cells = props.cells.map((cellValue, index) => {
    return <GridCell key={index} value={cellValue}/>;
  });

  return (
    <div className="grid-row">
      {cells}
    </div>
  );
}

function GridBoard(props) {
  let rows = props.matrix.map((row, rowIndex) => {
    return <GridRow key={'row-'+rowIndex} cells={row}/>;
  });

  return (
    <div className="grid-board">
      {rows}
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    
    // let matrix = [[2, 4, 8, 16], [32, 64, 128, 256], [1024, 2048, 4096, 8192], [0, 0, 0, 0]];
    let matrix = props.matrix || [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    this.spawnNewCell(matrix, 2);

    this.state = {matrix};
  }

  handleKeyDown(e) {
    switch(e.key) {
      case 'ArrowUp':
        this.moveVertical(true);
        break;
      case 'ArrowDown':
        this.moveVertical(false);
        break;
      case 'ArrowLeft':
        this.moveHorizontal(true);
        break;
      case 'ArrowRight':
        this.moveHorizontal(false);
        break;
      default:
        break;
    }
  }

  moveVertical(isDirectionUp) {
    let matrix = copy2DArray(this.state.matrix);
    let changed = false;

    for (let col = 0; col < matrix.length; col++) {
      // change by col
      let gridCol = matrix.map((row) => {
        return row[col];
      });
      if (isDirectionUp) {
        changed = this.moveArrayForward(gridCol) || changed;
      } else {
        gridCol.reverse();
        changed = this.moveArrayForward(gridCol) || changed;
        gridCol.reverse();
      }

      // fill in the new matrix
      for (let row = 0; row < matrix.length; row++) {
        matrix[row][col] = gridCol[row];
      }
    }

    if (changed) {
      this.spawnNewCell(matrix);
      this.setState({matrix: matrix});
    }
  }

  moveHorizontal(isDirectionLeft) {
    console.log('horizontal: ' + isDirectionLeft);
    let matrix = copy2DArray(this.state.matrix);
    let changed = false;

    for (let row = 0; row < matrix.length; row++) {
      // change by row
      let gridRow = matrix[row];
      if (isDirectionLeft) {
        changed = this.moveArrayForward(gridRow) || changed;
      } else {
        gridRow.reverse();
        changed = this.moveArrayForward(gridRow) || changed;
        gridRow.reverse();
      }

      // fill in the new matrix
      matrix[row] = gridRow;
    }

    if (changed) {
      this.spawnNewCell(matrix);
      this.setState({matrix: matrix});
    }
  }

  moveArrayForward(array) {
    let changed = false;
    let added = new Array(array.length).fill(false);
    
    console.log(array);

    for (let i = 1; i < array.length; i++) {
      if (array[i] === 0) {
        continue;
      }

      // move element forward to the furthest vacancy
      let targetPos = i;
      while (targetPos > 0 && array[targetPos - 1] === 0) {
        targetPos--;
      }

      // change position
      if (targetPos > 0 && !added[targetPos - 1] && array[targetPos - 1] === array[i]) {
        targetPos--;
        array[targetPos] *= 2;
        array[i] = 0;
        added[targetPos] = true;
      } else {
        array[targetPos] = array[i];
        array[i] = targetPos !== i ? 0 : array[i];
      }

      changed = changed || targetPos !== i;
    }
    console.log(array);
    console.log('------------------------------');

    return changed;
  }

  spawnNewCell(matrix, num = 1) {
    let emptyCells = [];

    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] === 0) {
          emptyCells.push({row, col});
        }
      }
    }

    for (let i = 0; i < num; i++) {
      if (emptyCells.length) {
        let randomIndex = getRandomInt(emptyCells.length);
        let newCellLocation = emptyCells[randomIndex];
        matrix[newCellLocation.row][newCellLocation.col] = 2;
        emptyCells.splice(randomIndex, 1);
      }
    }
  }

  render() {
    return (
      <div onKeyDown={this.handleKeyDown} tabIndex="0">
        <GridBoard matrix={this.state.matrix}/>
      </div>
    );
  }
}

export default Game;