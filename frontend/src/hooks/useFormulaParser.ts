// src/hooks/useFormulaParser.ts
import { useState, useEffect } from 'react';
import { Formula } from '../types/GameTypes';
import { parseFormulaString } from '../utils/formulaUtils.ts';

export const useFormulaParser = (formulaStrings: string[]) => {
  const [parsedFormulas, setParsedFormulas] = useState<Formula[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      const formulas: Formula[] = [];
      
      for (const formulaStr of formulaStrings) {
        const parsed = parseFormulaString(formulaStr);
        if (parsed) {
          formulas.push(parsed);
        }
      }
      
      setParsedFormulas(formulas);
      setError(null);
    } catch (err) {
      setError(`Error parsing formulas: ${err}`);
      console.error("Formula parsing error:", err);
    }
  }, [formulaStrings]);
  
  return {
    parsedFormulas,
    error
  };
};
