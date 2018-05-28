import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
var classNames = require('classnames');

function Square(props) {
  let activeClass = classNames(props.className, 
    {'square active': props.isActive, 'square': !props.isActive}
  );
  return (
    <button className={activeClass} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, isActive) {
    return (
      <Square
        value={this.props.squares[i]}
        isActive={isActive}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    /** 3.Rewrite Board to use two loops to make the squares instead of hardcoding them */
    const n = Math.sqrt(this.props.scales);
    const policy = this.props.policy;
    let isActive = false;
    let content = (n) => {
      let res = [];
      for(let i=0; i<n; i++) {
        let cell = [];
        for(let j=0; j<n; j++){
          /** 5.When someone wins, highlight the three squares that caused the win. */
          var number = j+i*3;
          if(policy && (policy[0]==number || policy[1]==number || policy[2]==number)) {
            isActive = true;
          } else {
            isActive = false;
          }
          let value = this.renderSquare(number, isActive);
          cell.push(<span key={j}>{value}</span>);
        }
        res.push(<div className='board-row' key={i}>{cell}</div>);
      }
      return res;
    }
    return (<div>{content(n)}</div>);
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      sortValue: 'asc'  //默认升序排列
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  handleToggleClick(){
    this.setState({
      sortValue: this.state.sortValue=='asc' ? 'desc' : 'asc'
    })
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const result = calculateWinner(current.squares);
    const scales = 9; //游戏规模，默认3*3
    const policy = result ? result.policy : undefined;

    const moves = history.map((step, move) => {
      /** 1. Display the location in the format (col, row) instead of number. */
      const describle = move ?
        'Go to move #(' + (Math.floor(move/3)+1) +','+ (move%3 + 1) +')' :
        'Go to game start';
      var activeClass = classNames(this.props.className, 
        {'active': move===(this.state.history.length-1)}
      );
      return (
        /** 2. Bold the currently selected item in the move list. */
        <li key={move} className={activeClass}>
          <button className={activeClass} onClick={() => this.jumpTo(move)}>{describle}</button>
        </li>
      );
    });

    /** 4. Add a toggle button that lets you sort the moves in either ascending or descending order. */
    if(this.state.sortValue=='desc') {
      const _moves = moves.reverse();
    }

    let status;
    /** 6.When no one wins, display a message about the result being a draw. */
    if (result) {
      status = "Winner: " + result.winner;
    } else if(this.state.stepNumber==scales) {
      status = 'This is a draw.';
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            scales={scales}
            policy={policy}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {/** 4. Add a toggle button that lets you sort the moves in either ascending or descending order. */}
          <button onClick={()=>this.handleToggleClick()}>{this.state.sortValue}</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      /** 5.When someone wins, highlight the three squares that caused the win. */
      return {winner: squares[a], policy: lines[i]};
    }
  }
  return null;
}
