import React from 'react';
import { getRandomInt } from '../../Utils';
import CellData from './CellData';
import './Game.css';

function BackgroundBoard(props) {
  let rows = [];
  for (let i = 0; i < props.size; i++) {
    let cells = [];
    for (let j = 0; j < props.size; j++) {
      cells.push(<div key={i + '-' + j} className="background-cell"></div>);
    }
    let row = (
      <div key={'row-'+i} className="background-row">
        {cells}
      </div>);
    rows.push(row);
  }
  return (
    <div className="background-board">
      {rows}
    </div>
  );
}

function GameOverCover() {
  return (
    <div className="grid-board gameover-cover">
      GAME OVER
    </div>
  );
}

function GridCell(props) {
  // cell style
  let className = "grid-cell cell-" + (props.value > 2048 ? 'exceeded' : props.value);
  if (props.changed) {
    className += ' cell-value-changed';
  }
  // cell position
  className += ' pos-' + props.pos[0] + '-' + props.pos[1]
  return (
    <div className={className}>{props.value > 0 ? props.value : ''}</div>
  );
}

function GridBoard(props) {
  let changedMatrix = props.changedMatrix;
  let cells = [];
  props.valueMatrix.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        cells.push(
          <GridCell 
            key={cell.id} 
            value={cell.value} 
            changed={changedMatrix[rowIndex][colIndex]}
            pos={[rowIndex, colIndex]}
          />
        );
      }
    });
  });

  return (
    <div className="grid-board">
      {cells}
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.checkProps(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    // let matrix = props.matrix || [[2, 4, 8, 16], [32, 64, 128, 256], [512, 1024, 2048, 0], [0, 0, 0, 0]];
    let matrix = props.matrix || [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    matrix = this.createSquareMatrix(matrix.length, null);
    this.idCounter = 0;
    this.spawnNewCell(matrix, 2);

    this.state = {
      valueMatrix: matrix,
      isAlive: true
    };

    this.resetChangedMatrix();
    this.initializeIdMatrix();
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
    this.changedMatrix = this.createSquareMatrix(this.state.valueMatrix.length, false);
  }

  initializeIdMatrix() {
    this.idMatrix = this.createSquareMatrix(this.state.valueMatrix.length, 0);
  }

  createSquareMatrix(len, initialValue) {
    let newMatrix = [];
    for (let i = 0; i < len; i++) {
      newMatrix.push(new Array(len).fill(initialValue))
    } 
    return newMatrix;
  }

  handleKeyDown(e) {
    if (!this.isGameAlive()) {
      return;
    }
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
    // let matrix = copy2DArray(this.state.valueMatrix);
    let matrix = this.state.valueMatrix;
    let changed = false;

    for (let col = 0; col < matrix.length; col++) {
      let moveResult;
      // change by col
      let gridCol = matrix.map((row) => {
        return row[col];
      });

      // move cells
      if (isDirectionUp) {
        moveResult = this.moveArrayForward(gridCol);
        changed = moveResult.changed || changed;
      } else {
        gridCol.reverse();
        moveResult = this.moveArrayForward(gridCol);
        changed = moveResult.changed || changed;
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
    // let matrix = copy2DArray(this.state.valueMatrix);
    let matrix = this.state.valueMatrix;
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
      if (!array[i]) {
        continue;
      }
      // move element forward to the most left vacancy
      let targetPos = i;
      while (targetPos > 0 && !array[targetPos - 1]) {
        targetPos--;
      }
      // change position
      if (targetPos > 0 && !added[targetPos - 1] && array[targetPos - 1].value === array[i].value) {
        targetPos--;
        // array[targetPos].id = array[i].id;
        array[targetPos] = array[i];
        array[targetPos].value *= 2;
        array[i] = null;
        added[targetPos] = true;
      } else {
        array[targetPos] = array[i];
        array[i] = targetPos !== i ? null : array[i];
      }

      changed = changed || targetPos !== i;
    }

    return {changed, added};
  }

  spawnNewCell(matrix, num = 1) {
    let emptyCells = [];

    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (!matrix[row][col]) {
          emptyCells.push({row, col});
        }
      }
    }

    for (let i = 0; i < num; i++) {
      if (emptyCells.length) {
        let randomIndex = getRandomInt(emptyCells.length);
        let newCellPos = emptyCells[randomIndex];
        this.idCounter++;
        matrix[newCellPos.row][newCellPos.col] = new CellData(this.idCounter, 2);
        emptyCells.splice(randomIndex, 1);
      }
    }
  }

  isGameAlive() {
    let isAlive = false;
    let matrix = this.state.valueMatrix;
    let boundary = matrix.length - 1;

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        let currentCell = matrix[i][j];
        if (!currentCell) {
          isAlive = true;
          break;
        }
        if (i < boundary) {
          let rightNeighbor = matrix[i + 1][j];
          isAlive =  isAlive || !rightNeighbor || currentCell.value === rightNeighbor.value;
        }
        if (j < boundary) {
          let downNeighbor = matrix[i][j + 1];
          isAlive = isAlive || !downNeighbor || currentCell.value === downNeighbor.value;
        }
      }
      if (isAlive) {
        break;
      }
    }

    if (this.state.isAlive !== isAlive) {
      this.setState({isAlive});
    }
    return isAlive;
  }

  render() {
    let gameOverCover;
    if (!this.state.isAlive) {
      gameOverCover = <GameOverCover/>;
    }
    return (
      <div onKeyDown={this.handleKeyDown} tabIndex="0">
        {gameOverCover}
        <BackgroundBoard size={this.state.valueMatrix.length}/>
        <GridBoard 
          valueMatrix={this.state.valueMatrix}
          changedMatrix={this.changedMatrix}
        />
      </div>
    );
  }
}

export default Game;