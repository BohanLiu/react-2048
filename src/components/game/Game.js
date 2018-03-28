import React from 'react';
// import PropTypes from 'prop-types';
import { getRandomInt } from '../../Utils';
import CellData from './CellData';
import './Game.css';
import ScorePanel from '../score-panel/ScorePanel';

function ScoreBoard(props) {
  return (
    <div className='score-board'>
      <ScorePanel title='Score' score={props.score} hasDiffAnimation={true}/>
      <ScorePanel title='Best' score={props.bestScore}/>
    </div>
  );
}

function BackgroundBoard(props) {
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

function GameOverCover(props) {
  return (
    <div className='grid-board gameover-cover'>
      <span>GAME OVER</span>
      <button className='new-game-btn' onClick={props.handleNewGame}>NEW GAME</button>
    </div>
  );
}

function GridCell(props) {
  // cell style
  let className = 'grid-cell cell-' + (props.value > 2048 ? 'exceeded' : props.value);
  if (props.isChanged) {
    className += ' cell-value-changed';
  }
  if (props.isNew) {
    className += ' cell-newly-spawned';
  }
  // cell position
  className += ' pos-' + props.pos[0] + '-' + props.pos[1]
  return (
    <div className={className}>{props.value > 0 ? props.value : ''}</div>
  );
}

function GridBoard(props) {
  let cells = [];
  props.valueMatrix.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell) {
        cells.push(
          <GridCell 
            key={cell.id} 
            value={cell.value} 
            isChanged={cell.isValueChanged}
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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this); 
    this.handleNewGame = this.handleNewGame.bind(this);
    
    this.idCounter = 0;
    let matrix = this.convertMatrix(props);
    
    // spawn new cells
    let isAlive = true;
    if (this.idCounter === 0) {
      this.spawnNewCell(matrix, 2);
    } else {
      isAlive = this.isGameAlive(matrix);
    }

    this.state = {
      valueMatrix: matrix,
      isAlive: isAlive,
      score: 0,
      bestScore: 0
    };
  }

  convertMatrix(props) {
    let matrix;
    if (props && props.matrix) {
      matrix = [[],[],[],[]];
      props.matrix.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell === null || cell instanceof CellData) {
            return;
          } else {
            matrix[rowIndex][colIndex] = cell === 0 ? null : new CellData(++this.idCounter, cell);
          }
        })
      });
    } else {
      matrix = this.createSquareMatrix(4, null);
    }
    return matrix;
  }

  createSquareMatrix(size, initialValue) {
    let matrix = [];
    for (let i = 0; i < size; i++) {
      matrix.push(new Array(size).fill(initialValue));
    }
    return matrix;
  }

  cloneMatrix(matrix, dataOnly = true) {
    let clonedMatrix = [];
    matrix.forEach((row) => {
      let clonedRow = new Array(row.length).fill(null);
      row.forEach((cell, index) => {
        if (cell) {
          clonedRow[index] = dataOnly ? cell.cloneDataOnly() : cell.clone(); 
        }
      });
      clonedMatrix.push(clonedRow);
    });
    return clonedMatrix;
  }

  handleNewGame() {
    let matrixSize = this.state.valueMatrix.length;
    let matrix = this.createSquareMatrix(matrixSize, null);
    this.spawnNewCell(matrix, 2);
    this.setState ({
      valueMatrix: matrix,
      isAlive: true,
      score: 0
    });
  }

  handleKeyDown(evt) {
    if (!this.isGameAlive()) {
      this.setState({
        isAlive: false
      })
      return;
    }
    switch(evt.key) {
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

  handleTouchStart(evt) {
    evt.preventDefault();
    this.touchStartPoint = {
      x: evt.touches[0].clientX, 
      y: evt.touches[0].clientY
    };
  }

  handleTouchEnd(evt) {
    let touchEndPoint = {
      x: evt.changedTouches[0].clientX,
      y: evt.changedTouches[0].clientY
    };
    let touchStartPoint = this.touchStartPoint;

    let shiftX = touchStartPoint.x - touchEndPoint.x;
    let shiftY = touchStartPoint.y - touchEndPoint.y;

    // shift less than 5 is ignored
    if (Math.abs(shiftX) > 5 || Math.abs(shiftY) > 5) {
      if (Math.abs(shiftX) > Math.abs(shiftY)) {
        // shiftX > 0 => swipe left
        this.moveHorizontal(shiftX > 0);
      } else {
        // shiftY > 0 => swipe up
        this.moveVertical(shiftY > 0);
      }
    }
    
  }

  moveVertical(isDirectionUp) {
    let matrix = this.cloneMatrix(this.state.valueMatrix);
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
      }
    }

    if (changed) {
      this.spawnNewCell(matrix);
      this.setState({valueMatrix: matrix});
    }
  }

  moveHorizontal(isDirectionLeft) {
    let matrix = this.cloneMatrix(this.state.valueMatrix);
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
      }

      // fill in the new matrix and update changed mark matrix
      matrix[row] = gridRow;
    }

    if (changed) {
      this.spawnNewCell(matrix);
      this.setState({valueMatrix: matrix});
    }
  }

  /**
   * Move array values to left based on 2048 like rule 
   * @param {number[]} array 
   * @returns {object} {changed: boolean, added: boolean[]}
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
        array[targetPos].setValue(array[i].value * 2);
        this.updateScore(array[targetPos].value); // update score
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

  isGameAlive(valueMatrix) {
    let isAlive = false;
    let matrix = valueMatrix || this.state.valueMatrix;
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

    return isAlive;
  }

  updateScore(score2Add) {
    let score = this.state.score;
    let bestScore = this.state.bestScore;
    score += score2Add;
    bestScore = score > bestScore ? score : bestScore;
    this.setState({
      score,
      bestScore
    });
  }

  render() {
    let gameOverCover;
    // let gameOverCover = <GameOverCover/>;
    if (!this.state.isAlive) {
      gameOverCover = <GameOverCover handleNewGame={this.handleNewGame}/>;
    }
    return (
      <div onKeyDown={this.handleKeyDown} 
        onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} 
        tabIndex='0'
      >
        <ScoreBoard score={this.state.score} bestScore={this.state.bestScore}/>
        <BackgroundBoard size={this.state.valueMatrix.length} />
        {gameOverCover}
        <GridBoard valueMatrix={this.state.valueMatrix} />
      </div>
    );
  }
}

Game.propTypes = {
  matrix: function(props, propName) {
    // check prop name
    if (propName !== 'matrix') {
      return new Error('Wrong props name(should be matrix)!')
    }

    let matrix = props[propName];

    if (matrix === null || matrix === undefined) {
      return null;
    }

    let sizeErrMsg = 'Wrong matrix size!';
    let valueErrMsg = 'Wrong matrix value! Either number and 0 or CellData with null!';

    let matrixType; // Either 'number' or 'CellData'

    if (matrix.length !== 4) {
      return new Error(sizeErrMsg);
    }

    for (let row = 0; row < matrix.length; row++) {
      if (matrix[row].length !== 4) {
        return new Error(sizeErrMsg);
      }
      for (let col = 0; col < matrix.length; col++) {
        let cell = matrix[row][col];

        if (row === 0 && col === 0) {
          if (cell === null || cell instanceof CellData) {
            matrixType = 'CellData';
          } else {
            matrixType = 'number';
          }
        }

        if (matrixType === 'number') {
          if (typeof cell !== 'number') {
            return new Error(valueErrMsg);
          }
        } else {
          if (!cell || !(cell instanceof CellData)) {
            return new Error(valueErrMsg);
          }
        }
      }
    }
  }
}

export default Game;