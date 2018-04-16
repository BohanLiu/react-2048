import React from 'react';
import PropTypes from 'prop-types';

const GameOverCover = (props) => {
  return (
    <div className='grid-board gameover-cover'>
      <span>GAME OVER</span>
      <button className='new-game-btn' onClick={props.handleNewGame}>NEW GAME</button>
    </div>
  );
}

GameOverCover.propTypes = {
  handleNewGame: PropTypes.func.isRequired
}

export default GameOverCover;
