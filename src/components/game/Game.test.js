import React from 'react';
import Game from './Game';
import CellData from './CellData';
import ReactTestUtils from 'react-dom/test-utils';
import TestRenderer from 'react-test-renderer';

describe('Game', () => {
  it('fresh start should has two initial cells and 0 score', () => {
    let game = new Game({});

    let matrix = game.state.valueMatrix;
    let counter = 0;
    
    matrix.forEach((row) => {
      row.forEach((cell) => {
        if (cell) {
          counter++;
        }
      })
    });

    expect(counter).toEqual(2);
    expect(game.state.isAlive).toBe(true);
    expect(game.state.score).toEqual(0);
  });

  it('starts with given matrix should has the same matrix', () => {
    let initialMatrix = [
      [2, 0, 0, 0],
      [0, 4, 0, 0],
      [0, 0, 8, 0],
      [0, 0, 0, 16]
    ];
    
    let game = new Game({matrix: initialMatrix});
    let gameMatrix = game.state.valueMatrix;

    initialMatrix.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          expect(gameMatrix[rowIndex][colIndex]).toBeNull();
        } else {
          expect(gameMatrix[rowIndex][colIndex].value).toEqual(cell);
        }
      })
    });

    expect(game.idCounter).toBe(4);
  });

  it('game over shows game over cover and new game button', () => {
    let initialMatrix = [
      [2, 4, 8, 16],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 64, 128]
    ];

    let gameRenderer = TestRenderer.create(<Game matrix={initialMatrix}/>);
    let gameInstance = gameRenderer.root;
    let gameState = gameRenderer.getInstance().state;
    let gameMatrix = gameState.valueMatrix;
    
    expect(gameState.isAlive).toBe(false);
    expect(gameInstance.findByProps({className: 'grid-board gameover-cover'})).not.toBeNull();
    expect(gameInstance.findByType('button').props.children).toEqual('NEW GAME');
  });

  it('new game button should reset the game', () => {
    let initialMatrix = [
      [2, 4, 8, 16],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 64, 128]
    ];

    let gameRenderer = TestRenderer.create(<Game matrix={initialMatrix}/>);
    let gameInstance = gameRenderer.root;
    
    let newGameButton = gameInstance.findByType('button');
    // simulate click on button
    newGameButton.props.onClick()

    // the cover should be removed
    expect(() => {gameInstance.findByProps({className: 'grid-board gameover-cover'})}).toThrow();
    // the game should now has two initial cells only
    let gameMatrix = gameRenderer.getInstance().state.valueMatrix;
    let counter = 0;
    gameMatrix.forEach((row) => {
      row.forEach((cell) => {
        if (cell) {
          counter++;
        }
      })
    });
    expect(counter).toEqual(2);
    // score reset to 0
    expect(gameRenderer.getInstance().state.score).toEqual(0);
  });

  it('score should be updated correctly', () => {
    let initialMatrix = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    let gameRenderer = TestRenderer.create(<Game matrix={initialMatrix}/>);
    let game = gameRenderer.getInstance();
    expect(game.state.score).toEqual(0);
    expect(game.state.bestScore).toEqual(0);
    
    game.moveVertical(true);
    expect(game.state.score).toEqual(4);
    expect(game.state.bestScore).toEqual(4);
  });

});

// move algorithm unit tests 
describe('game moves array forward testing', () => {
  let game;
  let array;
  
  beforeEach(() => {
    game = new Game({});
  });

  it('moves cell to furthest vacancy', () => {
    // [2, 0, 0, 0]
    array = [new CellData(1, 2), null, null, null];
    expect(game.moveArrayForward(array).changed).toEqual(false);
    expect(array[0].value).toEqual(2);
    expect(array[0].id).toEqual(1);
    expect(array.slice(1)).toEqual([null, null, null]);

    // [0, 2, 0, 0]
    array = [null, new CellData(1, 2), null, null];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array[0].value).toEqual(2);
    expect(array[0].id).toEqual(1);
    expect(array.slice(1)).toEqual([null, null, null]);

    // [0, 0, 2, 0]
    array = [null, null, new CellData(1, 2), null];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array[0].value).toEqual(2);
    expect(array[0].id).toEqual(1);
    expect(array.slice(1)).toEqual([null, null, null]);
    
    // [0, 0, 0, 2]
    array = [null, null, null, new CellData(1, 2)];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array[0].value).toEqual(2);
    expect(array[0].id).toEqual(1);
    expect(array.slice(1)).toEqual([null, null, null]);
  });

  it('should not move cell', () => {
    // [2, 4, 0, 0]
    array = [new CellData(1, 2), new CellData(2, 4), null, null];
    expect(game.moveArrayForward(array).changed).toEqual(false);
    expect(array[0].value).toEqual(2);
    expect(array[0].id).toEqual(1);
    expect(array[1].value).toEqual(4);
    expect(array[1].id).toEqual(2);
    expect(array.slice(2)).toEqual([null, null]);
  })

  it('adds equal value', () => {
    // [2, 2, 0, 0]
    array = [new CellData(1, 2), new CellData(2, 2), null, null];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array[0].value).toEqual(4);
    expect(array[0].id).toEqual(2);
    expect(array.slice(1)).toEqual([null, null, null]);

    // [4, 4, 0, 0]
    array = [new CellData(1, 4), new CellData(2, 4), null, null];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array[0].value).toEqual(8);
    expect(array[0].id).toEqual(2);
    expect(array.slice(1)).toEqual([null, null, null]);
  });

  it('adds equal value and moves forward', () => {
    // [0, 2, 2, 0]
    array = [null, new CellData(1, 2), new CellData(2, 2), null];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array[0].value).toEqual(4);
    expect(array[0].id).toEqual(2);
    expect(array.slice(1)).toEqual([null, null, null]);

    // [0, 0, 2, 2]
    array = [null, null, new CellData(1, 2), new CellData(2, 2)];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array[0].value).toEqual(4);
    expect(array[0].id).toEqual(2);
    expect(array.slice(1)).toEqual([null, null, null]);
  });

  it('adds equal value only once', () => {
    // [0, 2, 2, 0]
    array = [null, new CellData(1, 2), new CellData(2, 2), null];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array[0].value).toEqual(4);
    expect(array[0].id).toEqual(2);
    expect(array.slice(2)).toEqual([null, null]);
    
    // [2, 2, 2, 2]
    array = [new CellData(1, 2), new CellData(2, 2), new CellData(3, 2), new CellData(4, 2)];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array[0].value).toEqual(4);
    expect(array[0].id).toEqual(2);
    expect(array[1].value).toEqual(4);
    expect(array[1].id).toEqual(4);
    expect(array.slice(2)).toEqual([null, null]);

    // [4, 2, 2, 0]
    array = [new CellData(1, 4), new CellData(2, 2), new CellData(3, 2), null];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array[0].value).toEqual(4);
    expect(array[0].id).toEqual(1);
    expect(array[1].value).toEqual(4);
    expect(array[1].id).toEqual(3);
    expect(array.slice(2)).toEqual([null, null]);

    // [8, 4, 2, 2]
    array = [new CellData(1, 8), new CellData(2, 4), new CellData(3, 2), new CellData(4, 2)];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array[0].value).toEqual(8);
    expect(array[0].id).toEqual(1);
    expect(array[1].value).toEqual(4);
    expect(array[1].id).toEqual(2);
    expect(array[2].value).toEqual(4);
    expect(array[2].id).toEqual(4);
    expect(array.slice(3)).toEqual([null]);
  });

});
