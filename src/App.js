import React, { Component } from 'react';
import './App.css';

function Square(props) {
  return (
    <button
      className="square"
      style={props.bgStyle}
      onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends Component {
  renderSquare(i) {
    const bgStyle = {
      'background': this.props.winning_squares.includes(i) ? '#ff0' : null,
    }
    return <Square
      key={i}
      value={this.props.squares[i]}
      bgStyle={bgStyle}
      onClick={() => this.props.onClick(i)} />;
  }
  render() {
    const rows = [];
    for (let r=0; r<3; r++) {
      const cols = [];
      for (let c=0; c<3; c++) {
        cols.push(this.renderSquare(r * 3 + c));
      }
      rows.push(<div key={r} className="board-row">{cols}</div>);
    }
    return <div>{rows}</div>;
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: null,
        note: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      sortMovesAscending: true,
    };
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    })
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];

    const squares = current.squares.slice();
    let {winner: original_winner, _} = calculateWinner(squares)
    if (original_winner || squares[i])
      return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // generate status and note
    const isCatsGame = allFull(squares);
    const {winner, } = calculateWinner(squares);
    let note;

    if (winner) {
      note = 'Winner: ' + winner;
    } else if (isCatsGame) {
      note  = 'Cats game.';
    }

    this.setState({
      history: history.concat([{
        squares: squares,
        move: i,
        note: note,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  toggle() {
    this.setState({});
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    // get move history
    const moves = history.map((frame, idx) => {
      const desc = idx ?
        `Move ${Math.floor(frame.move / 3) + 1}, ${frame.move % 3 + 1} ${frame.note ? ' - ' + frame.note : ''}` :
        'Game start';
      const liStyle = {
        'fontWeight': this.state.stepNumber === idx ? 'bold' : 'normal',
      }
      return (
        <li key={idx}>
          <a
            href="#"
            style={liStyle}
            onClick={() => this.jumpTo(idx)}>{desc}</a>
        </li>
      );
    });

    // get status
    const isCatsGame = allFull(current.squares);
    const {winner, winning_squares} = calculateWinner(current.squares);
    let status;

    if (winner) {
      status = 'Winner: ' + winner;
    } else if (isCatsGame) {
      status = 'Cats game.';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const onReverseMoveList = () => this.setState({sortMovesAscending: !this.state.sortMovesAscending})

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winning_squares={winning_squares}
            onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>
            <a
              href="#"
              onClick={onReverseMoveList}>Reverse Moves</a>
          </div>
          <div>{status}</div>
          <ol reversed={!this.state.sortMovesAscending}>{this.state.sortMovesAscending ? moves : moves.slice().reverse()}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], winning_squares: lines[i]}
    }
  }
  return {winner: null, winning_squares: []};
}

function allFull(squares) {
  return squares.every((i) => i != null);
}

export default App;
