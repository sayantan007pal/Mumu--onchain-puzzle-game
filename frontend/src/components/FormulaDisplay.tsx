import React from 'react';
import { Formula, MatterType } from '../types/GameTypes'; // Ensure this path is correct
import '../styles/FormulaDisplay.css';

interface FormulaDisplayProps {
  formula: Formula;
}

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ formula }) => {
  const getMatterSymbol = (type: MatterType): string => {
    switch (type) {
      case MatterType.EARTH:
        return '🟤';
      case MatterType.WATER:
        return '🟦';
      case MatterType.FIRE:
        return '🟥';
      case MatterType.AIR:
        return '⬜';
      case MatterType.VOID:
        return '⬛';
      default:
        return '?';
    }
  };

  const renderCondition = (condition: any) => {
    if (condition.type !== undefined) {
      return <span className="matter-symbol">{getMatterSymbol(condition.type)}</span>;
    } else if (condition.operator) {
      return (
        <div className="formula-group">
          {renderCondition(condition.left)}
          <span className="operator">{condition.operator}</span>
          {condition.quantity && (
            <span className="quantity">{condition.quantity}</span>
          )}
          {condition.right && renderCondition(condition.right)}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="formula-display">
      <div className="formula-condition">
        {renderCondition(formula.condition)}
      </div>
      <div className="formula-arrow">→</div>
      <div className="formula-result">
        <span className="matter-symbol">{getMatterSymbol(formula.result as MatterType)}</span>
      </div>
    </div>
  );
};

export default FormulaDisplay;