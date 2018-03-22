import React from 'react';
import Game from './Game';
import CellData from './CellData';

// bug 1 : unmovable can still spawn new cell

// bug 2 : downwards animation sometimes disappears

// bug 3 : game over detection error

// bug 4 : test pass, but add function has deviant behaviors

describe('game initializes correctly', () => {
  let game = new Game({});
  
  it('has two initial cells', () => {
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
  });

});

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
