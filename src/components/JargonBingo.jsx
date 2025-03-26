import React, { useState, useEffect, useCallback } from 'react';
import { Gamepad2, Trophy, RefreshCw } from 'lucide-react';

const JargonBingo = ({ data }) => {
  const [board, setBoard] = useState([]);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [score, setScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const BOARD_SIZE = 5;

  const generateBoard = useCallback(() => {
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    const newBoard = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      newBoard.push(shuffled.slice(i * BOARD_SIZE, (i + 1) * BOARD_SIZE));
    }
    return newBoard;
  }, [data]);

  const checkWin = (selectedCells) => {
    // Check rows
    for (let i = 0; i < BOARD_SIZE; i++) {
      let rowComplete = true;
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (!selectedCells.has(`${i}-${j}`)) {
          rowComplete = false;
          break;
        }
      }
      if (rowComplete) return true;
    }

    // Check columns
    for (let j = 0; j < BOARD_SIZE; j++) {
      let colComplete = true;
      for (let i = 0; i < BOARD_SIZE; i++) {
        if (!selectedCells.has(`${i}-${j}`)) {
          colComplete = false;
          break;
        }
      }
      if (colComplete) return true;
    }

    // Check diagonals
    let diagonal1Complete = true;
    let diagonal2Complete = true;
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (!selectedCells.has(`${i}-${i}`)) diagonal1Complete = false;
      if (!selectedCells.has(`${i}-${BOARD_SIZE - 1 - i}`)) diagonal2Complete = false;
    }

    return diagonal1Complete || diagonal2Complete;
  };

  const calculateScore = () => {
    let newScore = 0;
    selectedCells.forEach(cell => {
      const [row, col] = cell.split('-').map(Number);
      const phrase = board[row][col];
      newScore += phrase.bsLevel * 2;
    });
    return newScore;
  };

  const handleCellClick = (rowIndex, colIndex) => {
    if (gameWon) return;

    const cellKey = `${rowIndex}-${colIndex}`;
    const newSelectedCells = new Set(selectedCells);

    if (selectedCells.has(cellKey)) {
      newSelectedCells.delete(cellKey);
    } else {
      newSelectedCells.add(cellKey);
    }

    setSelectedCells(newSelectedCells);
    setScore(calculateScore());

    if (checkWin(newSelectedCells)) {
      setGameWon(true);
      setScore(prev => prev + 50); // Bonus for winning
    }
  };

  const resetGame = useCallback(() => {
    setBoard(generateBoard());
    setSelectedCells(new Set());
    setScore(0);
    setGameWon(false);
  }, [generateBoard]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const getScoreMessage = () => {
    if (score >= 500) return "🎓 Non-sensical Level: PhD!";
    if (score >= 300) return "🌟 Non-sensical Expert! Keep it up!";
    if (score >= 200) return "🎯 Professional Jargonist!";
    if (score >= 100) return "👍 Getting more Non-sensical!";
    return "Keep collecting Non-sensical phrases!";
  };

  return (
    <div className="bingo-container">
      <div className="bingo-header">
        <h2 className="bingo-title">
          <Gamepad2 className="header-icon" />
          Corporate Jargon Bingo
        </h2>
        <p className="bingo-subtitle">Mark phrases as you hear them in meetings!</p>
      </div>

      <div className="game-stats">
        <div className="score-display">
          <Trophy className="score-icon" />
          <span>Score: {score}</span>
        </div>
        <button className="reset-button" onClick={resetGame}>
          <RefreshCw size={16} />
          New Game
        </button>
      </div>

      <div className="score-message">{getScoreMessage()}</div>

      <div className="bingo-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="bingo-row">
            {row.map((phrase, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`bingo-cell ${selectedCells.has(`${rowIndex}-${colIndex}`) ? 'selected' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                <div className="phrase-text">{phrase.phrase}</div>
                <div className="complexity-indicator">NS Level: {phrase.bsLevel}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {gameWon && (
        <div className="win-message">
          🎉 BINGO! You've mastered the art of Non-sensical speak!
        </div>
      )}
    </div>
  );
};

export default JargonBingo;
