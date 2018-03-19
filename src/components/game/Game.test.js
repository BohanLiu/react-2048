import Game from './Game';

describe('game move array forward testing', function() {
  let game;
  
  beforeEach(() => {
    game = new Game();
  })
  
  it('moves cell to furthest vacancy', () => {
    let array;

    array = [2, 0, 0, 0];
    game.moveArrayForward(array);
    expect(array.toString()).toEqual('2,0,0,0');

    array = [0, 2, 0, 0];
    game.moveArrayForward(array);
    expect(array.toString()).toEqual('2,0,0,0');

    array = [0, 0, 2, 0];
    game.moveArrayForward(array);
    expect(array.toString()).toEqual('2,0,0,0');

    array = [0, 0, 0, 2];
    game.moveArrayForward(array);
    expect(array.toString()).toEqual('2,0,0,0');
  });

  it('adds equal value', () => {
    let array;

    array = [2, 2, 0, 0];
    game.moveArrayForward(array);
    expect(array.toString()).toEqual('4,0,0,0');

    array = [4, 4, 0, 0];
    game.moveArrayForward(array);
    expect(array.toString()).toEqual('8,0,0,0');
  });

  it('adds equal value and moves forward', () => {
    let array;

    array = [0, 2, 2, 0];
    game.moveArrayForward(array);
    expect(array.toString()).toEqual('4,0,0,0');

    array = [0, 0, 2, 2];
    game.moveArrayForward(array);
    expect(array.toString()).toEqual('4,0,0,0');
  });

  it('adds equal value only once', () => {
    let array;

    array = [2, 2, 4, 0];
    game.moveArrayForward(array);
    expect(array.toString()).toEqual('4,4,0,0');

    array = [2, 2, 2, 2];
    game.moveArrayForward(array);
    expect(array.toString()).toEqual('4,4,0,0');
  });

});
