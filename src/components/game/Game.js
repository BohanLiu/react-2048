import React from 'react';
import {getRandomInt, copy2DArray} from '../../Utils';
import './Game.css';

function GridCell(props) {
  let className = "grid-cell cell-" + (props.value > 2048 ? 'exceeded' : props.value);
  if (props.changed) {
    className += ' cell-value-changed';
  }
  return (
    <div className={className}>{props.value > 0 ? props.value : ''}</div>
  );
}

function GridRow(props) {
  let changes = props.changes;
  let cells = props.values.map((cellValue, index) => {
    return <GridCell key={index} value={cellValue} changed={changes[index]}/>;
  });

  return (
    <div className="grid-row">
      {cells}
    </div>
  );
}

function GridBoard(props) {
  let changedMatrix = props.changedMatrix;
  let rows = props.valueMatrix.map((row, rowIndex) => {
    return <GridRow key={'row-'+rowIndex} values={row} changes={changedMatrix[rowIndex]}/>;
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
    this.checkProps(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    let matrix = props.matrix || [[2, 4, 8, 16], [32, 64, 128, 256], [512, 1024, 2048, 0], [0, 0, 0, 0]];
    // let matrix = props.matrix || [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    this.spawnNewCell(matrix, 2);
    this.state = {
      valueMatrix: matrix,
      isAlive: true
    };

    this.resetChangedMatrix();
  }

  checkProps(props) {
    if (props.matrix) {
      if (props.matrix.length !== 4) {
        throw(new Error('wrong matrix row number'));
      }
      props.matrix.forEach(row => {
        if (row.length !== 4) {
          throw(new Error('wrong matrix col number'));
        }
      });
    }
  }

  resetChangedMatrix() {
    let len = this.state.valueMatrix.length;
    this.changedMatrix = [];
    for (let i = 0; i < len; i++) {
      this.changedMatrix.push(new Array(len).fill(false));
    }
  }

  handleKeyDown(e) {
    this.resetChangedMatrix();
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
    let matrix = copy2DArray(this.state.valueMatrix);
    let changed = false;

    for (let col = 0; col < matrix.length; col++) {
      let moveResult;
      // change by col
      let gridCol = matrix.map((row) => {
        return row[col];
      });
      if (isDirectionUp) {
        moveResult = this.moveArrayForward(gridCol);
        changed = moveResult.changed || changed;
      } else {
        gridCol.reverse();
        moveResult = this.moveArrayForward(gridCol);
        changed = this.moveArrayForward(gridCol) || changed;
        gridCol.reverse();
        moveResult.added.reverse();
      }

      // fill in the new matrix
      for (let row = 0; row < matrix.length; row++) {
        matrix[row][col] = gridCol[row];
        this.changedMatrix[row][col] = moveResult.added[row];
      }
    }

    if (changed) {
      this.spawnNewCell(matrix);
      this.setState({valueMatrix: matrix});
    }
  }

  moveHorizontal(isDirectionLeft) {
    let matrix = copy2DArray(this.state.valueMatrix);
    let changed = false;

    for (let row = 0; row < matrix.length; row++) {
      let moveResult;
      // change by row
      let gridRow = matrix[row];
      
      if (isDirectionLeft) {
        moveResult = this.moveArrayForward(gridRow);
        changed = moveResult.changed || changed;
      } else {
        gridRow.reverse();
        moveResult = this.moveArrayForward(gridRow);
        changed = moveResult.changed || changed;
        gridRow.reverse();
        moveResult.added.reverse();
      }

      // fill in the new matrix and update changed mark matrix
      matrix[row] = gridRow;
      this.changedMatrix[row] = moveResult.added;
    }

    if (changed) {
      this.spawnNewCell(matrix);
      this.setState({valueMatrix: matrix});
    }
  }

  /**
   * Move array values to left based on 2048 like rule 
   * @param {number[]} array 
   * @returns {object} {changed: boolean, add: number[]}
   */
  moveArrayForward(array) {
    let changed = false;
    // array to store where two elements have been added together
    let added = new Array(array.length).fill(false);

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

    return {changed, added};
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

  checkAlive() {
    let matrix = copy2DArray(this.state.valueMatrix);
    for (let row = 0; row < matrix.length - 1; row++) {
      for (let col = 0; col < matrix.length - 1; col++) {
        if (
          matrix[row][col] === 0 // vacancy
          || matrix[row][col] === matrix[row + 1][col] // right
          || matrix[row][col] === matrix[row][col + 1] // bottom
        ) {
          return true;
        }
      }
    }
    console.log('check edge');
    // check edge vacancy
    for (let col = 0; col < matrix.length; col++) {
      if (matrix[matrix.length - 1][col] === 0) {
        return true;
      }
      if (col === matrix.length - 1) {
        for (let row = 0; row < matrix.length - 2; row++) {
          if (matrix[row][col] === 0) {
            return true;
          }
        }
      }
    }

    return false;
  }

  render() {
    if (!this.checkAlive()) {
      alert('GAME OVER!');
    }
    return (
      <div onKeyDown={this.handleKeyDown} tabIndex="0">
        <GridBoard 
          valueMatrix={this.state.valueMatrix}
          changedMatrix={this.changedMatrix}
        />
      </div>
    );
  }
}

export default Game;