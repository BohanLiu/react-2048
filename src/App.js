import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function GridCell(props) {
  return (
    <div className="grid-cell">{props.value}</div>
  );
}

function GridRow(props) {
  let cells = props.cells.map((cellValue, index) => {
    return <GridCell key={index} value={cellValue}/>;
  });

  return (
    <div className="grid-row">
      {cells}
    </div>
  );
}

function GridBoard(props) {
  let rows = props.matrix.map((row, rowIndex) => {
    return <GridRow key={'row-'+rowIndex} cells={row}/>;
  });

  return (
    <div className="grid-board">
      {rows}
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matrix: new Array(4).fill(new Array(4).fill(0))
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(e) {
    switch(e.key) {
      case 'ArrowUp':
        this.setState({
          matrix: new Array(4).fill(new Array(4).fill('⬆'))
        });
        break;
      case 'ArrowDown':
        this.setState({
          matrix: new Array(4).fill(new Array(4).fill('⬇'))
        });
        break;
      case 'ArrowLeft':
        this.setState({
          matrix: new Array(4).fill(new Array(4).fill('⬅'))
        });
        break;
      case 'ArrowRight':
        this.setState({
          matrix: new Array(4).fill(new Array(4).fill('➡'))
        });
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div onKeyDown={this.handleKeyDown} tabIndex="0">
        <GridBoard matrix={this.state.matrix}/>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React 2048</h1>
        </header>
        <Game/>
      </div>
    );
  }
}

export default App;
