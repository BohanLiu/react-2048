import React from 'react';
import PropTypes from 'prop-types';
import './ScorePanel.css';

class ScorePanel extends React.Component {
  constructor(props) {
    super(props);
    this.diff = 0;
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.diff = nextProps.score - this.props.score;
    // if (this.diff !== 0) {
    if (this.props.score !== nextProps.score) {
      return true;
    }
    return false;
  }

  render() {
    let scoreDiff = null;
    if (this.props.hasDiffAnimation) {
      scoreDiff = this.diff > 0 ?
          <div key={this.props.score} className='score-diff'>+ {this.diff}</div>
          : null;
    }
    return (
      <div className='score-panel'>
        <div className='panel-title'>
          {this.props.title}
        </div>
        <div className='panel-score'>
          {this.props.score}
        </div>
        {scoreDiff}
      </div>
    )
  }
}

ScorePanel.defaultProps = {
  title: 'Score',
  score: 0,
  hasDiffAnimation: false
}

ScorePanel.protoTypes = {
  title: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  hasDiffAnimation: PropTypes.bool
}

export default ScorePanel;