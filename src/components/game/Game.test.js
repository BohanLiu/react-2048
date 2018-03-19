import React from 'react';
import Game from './Game';

describe('game initializes correctly', () => {
  let game = new Game({});
  
  it('has two initial cells', () => {
    let matrix = game.state.valueMatrix;
    let counter = 0;
    
    matrix.forEach((row) => {
      row.forEach((cell) => {
        if (cell > 0) {
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
    array = [2, 0, 0, 0];
    expect(game.moveArrayForward(array).changed).toEqual(false);
    expect(array.toString()).toEqual('2,0,0,0');

    array = [0, 2, 0, 0];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array.toString()).toEqual('2,0,0,0');

    array = [0, 0, 2, 0];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array.toString()).toEqual('2,0,0,0');

    array = [0, 0, 0, 2];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array.toString()).toEqual('2,0,0,0');
  });

  it('should not move cell', () => {
    array = [2, 4, 0, 0];
    expect(game.moveArrayForward(array).changed).toEqual(false);
    expect(array.toString()).toEqual('2,4,0,0');
  })

  it('adds equal value', () => {
    array = [2, 2, 0, 0];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array.toString()).toEqual('4,0,0,0');

    array = [4, 4, 0, 0];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array.toString()).toEqual('8,0,0,0');
  });

  it('adds equal value and moves forward', () => {
    array = [0, 2, 2, 0];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array.toString()).toEqual('4,0,0,0');

    array = [0, 0, 2, 2];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array.toString()).toEqual('4,0,0,0');
  });

  it('adds equal value only once', () => {
    array = [2, 2, 4, 0];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array.toString()).toEqual('4,4,0,0');

    array = [2, 2, 2, 2];
    expect(game.moveArrayForward(array).changed).toEqual(true);
    expect(array.toString()).toEqual('4,4,0,0');
  });

});
