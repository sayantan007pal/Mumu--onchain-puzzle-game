import React from 'react';
import { MatterType } from '../types/GameTypes.ts';
import '../styles/MatterElement.css';

interface MatterElementProps {
  type: MatterType;
  x: number;
  y: number;
  isSelected: boolean;
  onClick: () => void;
}

const MatterElement: React.FC<MatterElementProps> = ({
  type,
  x,
  y,
  isSelected,
  onClick
}) => {
  const getElementClass = (): string => {
    switch (type) {
      case MatterType.EARTH:
        return 'element-earth';
      case MatterType.WATER:
        return 'element-water';
      case MatterType.FIRE:
        return 'element-fire';
      case MatterType.AIR:
        return 'element-air';
      case MatterType.VOID:
      default:
        return 'element-void';
    }
  };

  const getElementSymbol = (): string => {
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
      default:
        return '⬛';
    }
  };

  return (
    <div 
      className={`matter-element ${getElementClass()} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      data-x={x}
      data-y={y}
    >
      <span className="element-symbol">{getElementSymbol()}</span>
    </div>
  );
};

export default MatterElement;