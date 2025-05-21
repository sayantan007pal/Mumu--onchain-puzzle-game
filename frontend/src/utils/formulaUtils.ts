// src/utils/formulaUtils.ts
import { MatterType, FormulaCondition, Formula } from '../types/GameTypes';

/**
 * Evaluate a formula condition against a matter type and its adjacent cells
 * @param condition The formula condition to evaluate
 * @param matterType The current matter type
 * @param adjacentCells Array of adjacent matter types
 * @returns boolean indicating if the condition is satisfied
 */
export const evaluateFormula = (
  condition: FormulaCondition, 
  matterType: MatterType, 
  adjacentCells: MatterType[]
): boolean => {
  // If condition has a direct type, check if it matches the matter type
  if (condition.type !== undefined) {
    return matterType === condition.type;
  }
  
  // Handle operators
  if (condition.operator === '+') {
    // For addition, both left and right conditions must be satisfied
    const leftResult = evaluateFormula(condition.left!, matterType, adjacentCells);
    const rightResult = evaluateFormula(condition.right!, matterType, adjacentCells);
    return leftResult && rightResult;
  }
  
  if (condition.operator === '*') {
    // For multiplication, check if the element appears the specified number of times
    const elemType = condition.left!.type!;
    const count = adjacentCells.filter(cell => cell === elemType).length;
    return count === condition.quantity!;
  }
  
  if (condition.operator === '>') {
    // For greater than, check if the element appears more than the specified number of times
    const elemType = condition.left!.type!;
    const count = adjacentCells.filter(cell => cell === elemType).length;
    return count > condition.quantity!;
  }
  
  if (condition.operator === '<') {
    // For less than, check if the element appears less than the specified number of times
    const elemType = condition.left!.type!;
    const count = adjacentCells.filter(cell => cell === elemType).length;
    return count < condition.quantity!;
  }
  
  return false;
};

/**
 * Gets the symbol for a given matter type
 * @param type MatterType enum value
 * @returns Symbol string (emoji)
 */
export const getMatterSymbol = (type: MatterType): string => {
  switch (type) {
    case MatterType.EARTH: return '🟤';
    case MatterType.WATER: return '🟦';
    case MatterType.FIRE: return '🔥';
    case MatterType.AIR: return '💨';
    case MatterType.AETHER: return '🟣';
    case MatterType.STEAM: return '💭';
    case MatterType.PLANT: return '🌱';
    case MatterType.VOID: return '⬛';
    default: return '❓';
  }
};
