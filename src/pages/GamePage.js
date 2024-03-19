import React, { useState, useCallback, useEffect, useRef } from 'react';
import './GamePage.css';
import { useGrid } from './GridContext';

const createEmptyGrid = (rows, cols) => {
  return Array.from({ length: rows }).map(() => Array.from({ length: cols }).fill({ alive: 0, generation: 0 }));
};

const createClusteredGrid = (rows, cols, targetAlivePercentage = 0.075) => {
    const grid = createEmptyGrid(rows, cols);
    let totalCells = rows * cols;
    let targetAliveCells = Math.floor(totalCells * targetAlivePercentage);

    let currentAliveCount = 0;

    while (currentAliveCount < targetAliveCells) {
        let row = Math.floor(Math.random() * rows);
        let col = Math.floor(Math.random() * cols);
        
        if (grid[row][col].alive === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let newRow = row + i;
                    let newCol = col + j;
                    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && currentAliveCount < targetAliveCells) {
                        if (Math.random() > 0.5) {
                            if (grid[newRow][newCol].alive === 0) {
                                grid[newRow][newCol] = { alive: 1, generation: 1 };
                                currentAliveCount++;
                            }
                        }
                    }
                }
            }
        }
    }

    return { grid, livingCellsCount: currentAliveCount };
};

const Cell = ({ cell, onClick }) => {
    // 设置HSL颜色的基础值
    const hue = 331; // 约等于#e0b1cb的色相
    const saturation = 60; // 饱和度
    let lightness = 83; // 亮度
  
    // 如果细胞活着，根据其generation减少亮度，以实现颜色加深的效果
    if (cell.alive) {
      // 每代使颜色更暗5%，但不低于30%的亮度
      lightness = Math.max(lightness - cell.generation * 5, 30);
    }
  
    const backgroundColor = cell.alive ? `hsl(${hue}, ${saturation}%, ${lightness}%)` : "#eee";
  
    return (
      <div
        onClick={onClick}
        className={`cell ${cell.alive ? 'alive' : 'dead'}`}
        style={{ backgroundColor }}
      />
    );
  };
  
const Grid = ({ grid, toggleCellState }) => (
  <div className="game-board" style={{ gridTemplateColumns: `repeat(${grid[0].length}, 20px)` }}>
    {grid.map((row, i) =>
      row.map((cell, j) => (
        <Cell key={`${i}-${j}`} cell={cell} onClick={() => toggleCellState(i, j)} />
      ))
    )}
  </div>
);

const LivingCellsCounter = ({ count }) => (
  <div className="living-cells-count">Living Cells: {count}</div>
);

const ControlPanel = ({ onStartStop, onNext, onReset, isPlaying }) => (
  <div className="buttons-row">
    <button onClick={onStartStop}>{isPlaying ? "Stop" : "Autoplay"}</button>
    <button onClick={onNext}>Next Frame</button>
    <button onClick={onReset}>Reset Grid</button>
  </div>
);

const GamePage = () => {
    const { gridSize, setGridSize } = useGrid();
    const [inputValues, setInputValues] = useState({ rows: '', cols: '' });
    
    const initialGridData = createClusteredGrid(gridSize.rows, gridSize.cols);
    const [gridState, setGridState] = useState(initialGridData.grid);
    const [livingCount, setLivingCount] = useState(initialGridData.livingCellsCount);
    
    const [inputError, setInputError] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const playRef = useRef(isPlaying);
    playRef.current = isPlaying;

    const handleSizeChange = (e, dimension) => {
        setInputValues({ ...inputValues, [dimension]: e.target.value });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        const rows = parseInt(inputValues.rows, 10) || 20;
        const cols = parseInt(inputValues.cols, 10) || 20;
        if (rows >= 3 && rows <= 40 && cols >= 3 && cols <= 40) {
          setGridSize({ rows, cols });
          const newGridData = createClusteredGrid(rows, cols);
          setGridState(newGridData.grid);
          setLivingCount(newGridData.livingCellsCount);
          setInputError('');
        } else {
          setInputError('Please enter numbers between 3 and 40 for both rows and cols.');
        }
      };
    

      const toggleCellState = (row, col) => {
        const newGrid = JSON.parse(JSON.stringify(gridState));
        newGrid[row][col].alive = gridState[row][col].alive ? 0 : 1;
        newGrid[row][col].generation = newGrid[row][col].alive ? 1 : 0; // Reset generation when toggling
        setGridState(newGrid);
        setLivingCount(newGrid.flat().filter(cell => cell.alive).length);
      };
    
      const nextGeneration = useCallback(() => {
        setGridState((currentGrid) => {
          const newGrid = createEmptyGrid(gridSize.rows, gridSize.cols);
          let newLivingCellsCount = 0;
          for (let i       = 0; i < gridSize.rows; i++) {
            for (let j = 0; j < gridSize.cols; j++) {
              let liveNeighbors = 0;
              const neighbors = [
                [i - 1, j - 1], [i - 1, j], [i - 1, j + 1],
                [i, j - 1], [i, j + 1],
                [i + 1, j - 1], [i + 1, j], [i + 1, j + 1],
              ];
              neighbors.forEach(([x, y]) => {
                if (x >= 0 && x < gridSize.rows && y >= 0 && y < gridSize.cols) {
                  liveNeighbors += currentGrid[x][y].alive;
                }
              });
              const cell = currentGrid[i][j];
              if (cell.alive) {
                if (liveNeighbors < 2 || liveNeighbors > 3) {
                  newGrid[i][j] = { alive: 0, generation: 0 };
                } else {
                  newGrid[i][j] = { alive: 1, generation: cell.generation + 1 };
                  newLivingCellsCount++;
                }
              } else {
                if (liveNeighbors === 3) {
                  newGrid[i][j] = { alive: 1, generation: 1 };
                  newLivingCellsCount++;
                } else {
                  newGrid[i][j] = cell;
                }
              }
            }
          }
          setLivingCount(newLivingCellsCount);
          return newGrid;
        });
      }, [gridSize]);
    
      useEffect(() => {
        if (isPlaying) {
          const interval = setInterval(nextGeneration, 100);
          return () => clearInterval(interval);
        }
      }, [isPlaying, nextGeneration]);
    
      const resetGrid = () => {
        const { grid, livingCellsCount } = createClusteredGrid(gridSize.rows, gridSize.cols);
        setGridState(grid);
        setLivingCount(livingCellsCount);
      };

      return (
        <div className="game-page">
          <div className="form-group">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Rows (default size: 20)"
                value={inputValues.rows}
                onChange={e => handleSizeChange(e, 'rows')}
              />
              <input
                type="text"
                placeholder="Cols (default size: 20)"
                value={inputValues.cols}
                onChange={e => handleSizeChange(e, 'cols')}
              />
              <button type="submit">Update Grid Size</button>
            </form>
            {inputError && <div className="error-message">{inputError}</div>}
          </div>
          <LivingCellsCounter count={livingCount} />
          <Grid grid={gridState} toggleCellState={toggleCellState} />
          <ControlPanel onStartStop={() => setIsPlaying(!isPlaying)} onNext={nextGeneration} onReset={resetGrid} isPlaying={isPlaying} />
        </div>
      );
    };
    
    export default GamePage;
