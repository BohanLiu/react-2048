import React from 'react';
import ScorePanel from './score-panel/ScorePanel';

const ScoreBoard = (props) => {
  return (
    <div className='score-board'>
      <ScorePanel title='Score' score={props.score} hasDiffAnimation={true}/>
      <ScorePanel title='Best' score={props.bestScore}/>
    </div>
  );
}

export default ScoreBoard;