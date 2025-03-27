import React, { useState, useEffect, useCallback } from 'react';
import { corporateJargonData } from '../data/jargonData';
import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';
import './JargonBingo.css';

const BOARD_SIZES = {
  EASY: 3,
  MEDIUM: 4
};

const POWER_UPS = {
  HINT: 'hint',
  UNDO: 'undo',
  AUTO_MARK: 'auto-mark'
};

const VIBRANT_COLORS = {
  EASY: {
    primary: '#FF6B6B',
    secondary: '#FF8E8E',
    accent: '#FFD93D'
  },
  MEDIUM: {
    primary: '#4ECDC4',
    secondary: '#45B7D1',
    accent: '#96CEB4'
  }
};

const JargonBingo = () => {
  const [board, setBoard] = useState([]);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [gamesWon, setGamesWon] = useState(0);
  const [streak, setStreak] = useState(0);
  const [boardSize, setBoardSize] = useState(BOARD_SIZES.EASY);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isPlaying, setIsPlaying] = useState(false);
  const [powerUps, setPowerUps] = useState({
    [POWER_UPS.HINT]: 3,
    [POWER_UPS.UNDO]: 3,
    [POWER_UPS.AUTO_MARK]: 2
  });
  const [cellHistory, setCellHistory] = useState([]);
  const [winningLine, setWinningLine] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const generateBingoBoard = useCallback(() => {
    const size = boardSize;
    const phrases = [...corporateJargonData];
    const newBoard = [];
    const usedPhrases = new Set();

    // Generate board with free space in center
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        if (i === Math.floor(size / 2) && j === Math.floor(size / 2)) {
          row.push({
            phrase: 'FREE SPACE',
            category: 'Special',
            isFreeSpace: true
          });
        } else {
          let phrase;
          do {
            phrase = phrases[Math.floor(Math.random() * phrases.length)];
          } while (usedPhrases.has(phrase.phrase));
          usedPhrases.add(phrase.phrase);
          row.push(phrase);
        }
      }
      newBoard.push(row);
    }

    setBoard(newBoard);
    setSelectedCells(new Set());
    setWinningLine(null);
    setIsGameOver(false);
    setTimeLeft(180);
    setIsPlaying(true);
    setCellHistory([]);
  }, [boardSize]);

  const checkWin = useCallback(() => {
    const size = board.length;
    const selected = new Set(selectedCells);

    // Check rows
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        const cell = `${i}-${j}`;
        if (selected.has(cell) || board[i][j].isFreeSpace) {
          row.push(cell);
        }
      }
      if (row.length === size) {
        setWinningLine({ type: 'row', cells: row });
        return true;
      }
    }

    // Check columns
    for (let j = 0; j < size; j++) {
      const col = [];
      for (let i = 0; i < size; i++) {
        const cell = `${i}-${j}`;
        if (selected.has(cell) || board[i][j].isFreeSpace) {
          col.push(cell);
        }
      }
      if (col.length === size) {
        setWinningLine({ type: 'column', cells: col });
        return true;
      }
    }

    // Check diagonals
    const diagonal1 = [];
    const diagonal2 = [];
    for (let i = 0; i < size; i++) {
      const cell1 = `${i}-${i}`;
      const cell2 = `${i}-${size - 1 - i}`;
      if (selected.has(cell1) || board[i][i].isFreeSpace) {
        diagonal1.push(cell1);
      }
      if (selected.has(cell2) || board[i][size - 1 - i].isFreeSpace) {
        diagonal2.push(cell2);
      }
    }
    if (diagonal1.length === size) {
      setWinningLine({ type: 'diagonal', cells: diagonal1 });
      return true;
    }
    if (diagonal2.length === size) {
      setWinningLine({ type: 'diagonal', cells: diagonal2 });
      return true;
    }

    return false;
  }, [board, selectedCells]);

  const handleCellClick = (rowIndex, colIndex) => {
    if (!isPlaying || isGameOver) return;

    const cellKey = `${rowIndex}-${colIndex}`;
    if (selectedCells.has(cellKey)) return;

    const newSelectedCells = new Set(selectedCells);
    newSelectedCells.add(cellKey);
    setSelectedCells(newSelectedCells);
    setCellHistory([...cellHistory, cellKey]);

    // Play click sound
    const audio = new Audio('/click.mp3');
    audio.play().catch(() => {});

    // Add particle effect
    createParticleEffect(rowIndex, colIndex);

    if (checkWin()) {
      setIsGameOver(true);
      setIsPlaying(false);
      setGamesWon(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      // Enhanced confetti effect
      const colors = ['#FF6B6B', '#4ECDC4', '#FFD93D', '#FF8E8E', '#45B7D1'];
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: colors
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: colors
        });
      }, 250);

      toast.success('🎉 BINGO! You won!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const createParticleEffect = (rowIndex, colIndex) => {
    const colors = board[rowIndex][colIndex].isFreeSpace 
      ? ['#FFD700', '#FFA500']
      : [VIBRANT_COLORS[boardSize === BOARD_SIZES.EASY ? 'EASY' : 'MEDIUM'].primary];
    
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { x: 0.5, y: 0.5 },
      colors: colors,
      shapes: ['circle', 'square'],
      scalar: 0.5
    });
  };

  const handlePowerUp = (type) => {
    if (powerUps[type] <= 0 || !isPlaying || isGameOver) return;

    switch (type) {
      case POWER_UPS.HINT:
        // Find an unselected cell that would help win
        const hintCell = findHintCell();
        if (hintCell) {
          toast.info('💡 Hint: Try marking this cell!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        break;
      case POWER_UPS.UNDO:
        if (cellHistory.length > 0) {
          const lastCell = cellHistory[cellHistory.length - 1];
          const newSelectedCells = new Set(selectedCells);
          newSelectedCells.delete(lastCell);
          setSelectedCells(newSelectedCells);
          setCellHistory(cellHistory.slice(0, -1));
          toast.info('↩️ Undo successful!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        break;
      case POWER_UPS.AUTO_MARK:
        // Mark a random unselected cell
        const unselectedCells = [];
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].length; j++) {
            const cellKey = `${i}-${j}`;
            if (!selectedCells.has(cellKey) && !board[i][j].isFreeSpace) {
              unselectedCells.push({ row: i, col: j });
            }
          }
        }
        if (unselectedCells.length > 0) {
          const randomCell = unselectedCells[Math.floor(Math.random() * unselectedCells.length)];
          handleCellClick(randomCell.row, randomCell.col);
          toast.info('✨ Auto-marked a cell!', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
        break;
    }

    setPowerUps(prev => ({
      ...prev,
      [type]: prev[type] - 1
    }));
  };

  const findHintCell = () => {
    const size = board.length;
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const cellKey = `${i}-${j}`;
        if (!selectedCells.has(cellKey) && !board[i][j].isFreeSpace) {
          // Simulate selecting this cell
          const newSelectedCells = new Set(selectedCells);
          newSelectedCells.add(cellKey);
          const newBoard = [...board];
          newBoard[i][j] = { ...newBoard[i][j], isHint: true };
          setBoard(newBoard);
          setSelectedCells(newSelectedCells);
          
          // Check if this would create a win
          const wouldWin = checkWin();
          
          // Revert changes
          setBoard(board);
          setSelectedCells(selectedCells);
          
          if (wouldWin) {
            return { row: i, col: j };
          }
        }
      }
    }
    return null;
  };

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            setIsGameOver(true);
            setStreak(0);
            toast.error('⏰ Time\'s up! Game Over!', {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    generateBingoBoard();
  }, [generateBingoBoard, boardSize]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bingo-container">
      <div className="bingo-header">
        <h1 className="bingo-title">Jargon Bingo</h1>
        <p className="bingo-subtitle">Mark the corporate jargon you hear!</p>
      </div>

      <div className="bingo-stats">
        <div className="games-won">
          <span className="award-icon">🏆</span>
          <div className="stats-content">
            <p className="stats-label">Games Won</p>
            <p className="stats-value">{gamesWon}</p>
          </div>
        </div>
        <div className="streak-counter">
          <span className="award-icon">🔥</span>
          <div className="stats-content">
            <p className="stats-label">Current Streak</p>
            <p className="stats-value">{streak}</p>
          </div>
        </div>
        <div className="timer">
          <span className="award-icon">⏱️</span>
          <div className="stats-content">
            <p className="stats-label">Time Left</p>
            <p className="stats-value">{formatTime(timeLeft)}</p>
          </div>
        </div>
      </div>

      <div className="difficulty-selector">
        <button
          className={`difficulty-btn ${boardSize === BOARD_SIZES.EASY ? 'active' : ''}`}
          onClick={() => setBoardSize(BOARD_SIZES.EASY)}
        >
          Easy (3x3)
        </button>
        <button
          className={`difficulty-btn ${boardSize === BOARD_SIZES.MEDIUM ? 'active' : ''}`}
          onClick={() => setBoardSize(BOARD_SIZES.MEDIUM)}
        >
          Medium (4x4)
        </button>
      </div>

      <div className="power-ups">
        <button
          className="power-up-btn"
          onClick={() => handlePowerUp(POWER_UPS.HINT)}
          disabled={powerUps[POWER_UPS.HINT] <= 0 || !isPlaying || isGameOver}
        >
          💡 Hint ({powerUps[POWER_UPS.HINT]})
        </button>
        <button
          className="power-up-btn"
          onClick={() => handlePowerUp(POWER_UPS.UNDO)}
          disabled={powerUps[POWER_UPS.UNDO] <= 0 || !isPlaying || isGameOver}
        >
          ↩️ Undo ({powerUps[POWER_UPS.UNDO]})
        </button>
        <button
          className="power-up-btn"
          onClick={() => handlePowerUp(POWER_UPS.AUTO_MARK)}
          disabled={powerUps[POWER_UPS.AUTO_MARK] <= 0 || !isPlaying || isGameOver}
        >
          ✨ Auto-Mark ({powerUps[POWER_UPS.AUTO_MARK]})
        </button>
      </div>

      <div 
        className="bingo-board" 
        data-size={boardSize}
      >
        {board.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((cell, colIndex) => {
              const cellKey = `${rowIndex}-${colIndex}`;
              const isSelected = selectedCells.has(cellKey);
              const isWinning = winningLine?.cells.includes(cellKey);
              const isFreeSpace = cell.isFreeSpace;
              const categoryColor = VIBRANT_COLORS[boardSize === BOARD_SIZES.EASY ? 'EASY' : 'MEDIUM'].primary;
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`bingo-cell ${isSelected ? 'selected' : ''} ${isWinning ? 'winning' : ''} ${isFreeSpace ? 'free-space' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  style={{
                    '--category-color': categoryColor,
                    '--category-color-light': VIBRANT_COLORS[boardSize === BOARD_SIZES.EASY ? 'EASY' : 'MEDIUM'].secondary,
                    '--category-color-dark': VIBRANT_COLORS[boardSize === BOARD_SIZES.EASY ? 'EASY' : 'MEDIUM'].accent
                  }}
                >
                  <div className="cell-content">
                    <p className="phrase-text">{cell.phrase}</p>
                    {isFreeSpace && <span className="free-space-icon">🎁</span>}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div className="bingo-controls">
        <button className="new-board-btn" onClick={generateBingoBoard}>
          🎲 New Board
        </button>
      </div>

      {isGameOver && (
        <div className="winner-overlay">
          <h2 className="winner-title">Game Over!</h2>
          <p className="winner-message">
            {timeLeft === 0 ? 'Time\'s up!' : 'Congratulations on winning!'}
          </p>
          <button className="play-again-btn" onClick={generateBingoBoard}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default JargonBingo;
