import React, { useState } from 'react';
import { useStarknet } from '../hooks/useStarknet';
import { MatterType, Formula, GameState } from '../types/GameTypes'; // Ensure this path is correct or update it to the correct path
import '../styles/PuzzleCreator.css';

const GRID_SIZE = 10; // Define GRID_SIZE with an appropriate value

export interface Contract {
  // Add other methods and properties here
  create_puzzle(puzzleName: string, difficulty: number, gameState: GameState, formulas: Formula[]): Promise<{ success: boolean; puzzleId: string }>;
}

const PuzzleCreator: React.FC = () => {
  const { account, contract, isConnecting, connectWallet } = useStarknet();
  const [puzzleName, setPuzzleName] = useState('');
  const [difficulty, setDifficulty] = useState(1);
  const [grid, setGrid] = useState<MatterType[][]>(
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(MatterType.VOID))
  );
  const [selectedMatterType, setSelectedMatterType] = useState<MatterType>(MatterType.EARTH);
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [currentFormula, setCurrentFormula] = useState<{
    conditionText: string;
    resultType: MatterType;
  }>({
    conditionText: '',
    resultType: MatterType.WATER
  });
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleElementSelect = (type: MatterType) => {
    setSelectedMatterType(type);
  };

  const handleGridClick = (x: number, y: number) => {
    const newGrid = [...grid];
    newGrid[y][x] = selectedMatterType;
    setGrid(newGrid);
  };

  const getMatterSymbol = (type: MatterType): string => {
    switch (type) {
      case MatterType.EARTH: return '🟤';
      case MatterType.WATER: return '🟦';
      case MatterType.FIRE: return '🟥';
      case MatterType.AIR: return '⬜';
      case MatterType.VOID: return '⬛';
      case MatterType.STEAM: return '💨';
      case MatterType.PLANT: return '🌱';
      default: return '?';
    }
  };

  const addFormula = () => {
    try {
      if (!currentFormula.conditionText.trim()) {
        setError('Formula condition cannot be empty');
        return;
      }

      // In a real implementation, you would validate and parse the formula text
      // Here we're simplifying and assuming the text is valid
      const newFormula: Formula = {
        condition: parseCondition(currentFormula.conditionText),
        result: currentFormula.resultType
      };

      setFormulas([...formulas, newFormula]);
      setCurrentFormula({
        conditionText: '',
        resultType: MatterType.WATER
      });
      setError(null);
    } catch (err: any) {
      setError(`Invalid formula: ${err.message}`);
    }
  };

  const parseCondition = (text: string): any => {
    // This is a simplified parser for demonstration
    // In a real implementation, you'd have a more complex parser
    
    // Example: "WATER + FIRE" or "EARTH + (WATER * 3)"
    if (text.includes('+')) {
      const [left, right] = text.split('+').map(part => part.trim());
      return {
        operator: '+',
        left: parseCondition(left),
        right: parseCondition(right)
      };
    } else if (text.includes('*')) {
      const [element, quantity] = text.split('*').map(part => part.trim());
      return {
        operator: '*',
        left: parseCondition(element),
        quantity: parseInt(quantity)
      };
    } else if (text.includes('>')) {
      const [element, quantity] = text.split('>').map(part => part.trim());
      return {
        operator: '>',
        left: parseCondition(element),
        quantity: parseInt(quantity)
      };
    } else {
      // Assume it's a simple element type
      switch (text.toUpperCase()) {
        case 'EARTH': return { type: MatterType.EARTH };
        case 'WATER': return { type: MatterType.WATER };
        case 'FIRE': return { type: MatterType.FIRE };
        case 'AIR': return { type: MatterType.AIR };
        case 'VOID': return { type: MatterType.VOID };
        case 'STEAM': return { type: MatterType.STEAM };
        case 'PLANT': return { type: MatterType.PLANT };
        default: throw new Error(`Unknown element type: ${text}`);
      }
    }
  };

  const removeFormula = (index: number) => {
    const newFormulas = [...formulas];
    newFormulas.splice(index, 1);
    setFormulas(newFormulas);
  };

  const submitPuzzle = async () => {
    try {
      setError(null);
      setSuccess(null);
      setSubmitting(true);

      if (!account) {
        throw new Error('Please connect your wallet first');
      }

      if (!puzzleName.trim()) {
        throw new Error('Puzzle name cannot be empty');
      }

      if (formulas.length === 0) {
        throw new Error('Please add at least one transformation formula');
      }

      // Check if any elements are placed on the grid
      const hasElements = grid.some(row => row.some(cell => cell !== MatterType.VOID));
      if (!hasElements) {
        throw new Error('Please place at least one element on the grid');
      }

      const gameState: GameState = {
        grid,
        history: [grid],
        moves: 0,
      };

      // Send to contract
      const result = await contract.create_puzzle(
        puzzleName,
        difficulty,
        gameState,
        formulas
      );

      if (result.success) {
        setSuccess(`Puzzle created successfully! Puzzle ID: ${result.puzzleId}`);
        
        // Reset form
        setPuzzleName('');
        setDifficulty(1);
        setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(MatterType.VOID)));
        setFormulas([]);
      } else {
        throw new Error('Failed to create puzzle');
      }
    } catch (err: any) {
      console.error('Error creating puzzle:', err);
      setError(err.message || 'Failed to create puzzle');
    } finally {
      setSubmitting(false);
    }
  };

  if (!account) {
    return (
      <div className="wallet-connect-container">
        <h2>Connect Your Wallet</h2>
        <p>Please connect your Starknet wallet to create puzzles</p>
        <button 
          className="connect-button"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    );
  }

  return (
    <div className="puzzle-creator">
      <h2>Create New Puzzle</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="creator-form">
        <div className="form-group">
          <label htmlFor="puzzleName">Puzzle Name:</label>
          <input
            type="text"
            id="puzzleName"
            value={puzzleName}
            onChange={(e) => setPuzzleName(e.target.value)}
            placeholder="Enter a name for your puzzle"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty Level:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(parseInt(e.target.value))}
          >
            <option value={1}>Easy</option>
            <option value={2}>Medium</option>
            <option value={3}>Hard</option>
            <option value={4}>Expert</option>
          </select>
        </div>
      </div>
      
      <h3>Design Initial Grid</h3>
      <div className="element-selector">
        <div className="selector-label">Select Matter Type:</div>
        <div className="element-buttons">
          {[
            MatterType.VOID,
            MatterType.EARTH,
            MatterType.WATER,
            MatterType.FIRE,
            MatterType.AIR
          ].map((type) => (
            <button
              key={type}
              className={`element-button ${selectedMatterType === type ? 'selected' : ''}`}
              onClick={() => handleElementSelect(type)}
            >
              {getMatterSymbol(type)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid-creator">
        {grid.map((row, y) => (
          <div key={y} className="grid-row">
            {row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className="grid-cell"
                onClick={() => handleGridClick(x, y)}
              >
                {getMatterSymbol(cell)}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <h3>Add Transformation Formulas</h3>
      <div className="formula-creator">
        <div className="formula-input">
          <input
            type="text"
            value={currentFormula.conditionText}
            onChange={(e) => setCurrentFormula({
              ...currentFormula,
              conditionText: e.target.value
            })}
            placeholder="e.g., WATER + FIRE or EARTH + (WATER * 3)"
          />
          <span className="formula-arrow">→</span>
          <select
            value={currentFormula.resultType}
            onChange={(e) => setCurrentFormula({
              ...currentFormula,
              resultType: parseInt(e.target.value)
            })}
          >
            {[
              MatterType.EARTH,
              MatterType.WATER,
              MatterType.FIRE,
              MatterType.AIR,
              MatterType.STEAM,
              MatterType.PLANT
            ].map((type) => (
              <option key={type} value={type}>
                {getMatterSymbol(type)} {MatterType[type]}
              </option>
            ))}
          </select>
          <button onClick={addFormula} className="add-formula-button">
            Add
          </button>
        </div>
        
        <div className="formula-list">
          {formulas.length === 0 && (
            <p className="no-formulas">No formulas added yet.</p>
          )}
          {formulas.map((formula, index) => (
            <div key={index} className="formula-item">
              <span className="formula-condition">
                {/* Simplified display for demonstration */}
                {JSON.stringify(formula.condition)}
              </span>
              <span className="formula-arrow">→</span>
              <span className="formula-result">
                {typeof formula.result === 'number' ? getMatterSymbol(formula.result) : '?'}
              </span>
              <button
                onClick={() => removeFormula(index)}
                className="remove-formula-button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="submit-section">
        <button
          onClick={submitPuzzle}
          disabled={submitting}
          className="submit-button"
        >
          {submitting ? 'Creating...' : 'Create Puzzle'}
        </button>
        <p className="note">
          Note: Creating a puzzle requires a small gas fee on Starknet.
        </p>
      </div>
    </div>
  );
}

export default PuzzleCreator;