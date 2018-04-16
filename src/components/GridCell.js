import React from 'react';
import PropTypes from 'prop-types';

class GridCell extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isNew) {
      return true;
    }
    if (this.props.hasValueChanged !== nextProps.hasValueChanged) {
      return true;
    }
    if (this.props.value !== nextProps.value) {
      return true;
    }
    if (this.props.pos[0] !== nextProps.pos[0] || this.props.pos[1] !== nextProps.pos[1]) {
      return true;
    }
    return false;
  }

  render() {
    // cell style
    let className = 'grid-cell cell-' + (this.props.value > 2048 ? 'exceeded' : this.props.value);
    if (this.props.hasValueChanged) {
      className += ' cell-value-changed';
    }
    if (this.props.isNew) {
      className += ' cell-newly-spawned';
    }
    // cell position
    className += ' pos-' + this.props.pos[0] + '-' + this.props.pos[1]
    return (
      <div className={className}>{this.props.value > 0 ? this.props.value : ''}</div>
    );
  }
}

GridCell.propTypes = {
  isNew: PropTypes.bool,
  hasValueChanged: PropTypes.bool,
  value: PropTypes.number.isRequired,
}

export default GridCell;
