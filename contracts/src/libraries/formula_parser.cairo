%lang starknet
// SPDX-License-Identifier: MIT

from starkware.cairo.common.alloc import alloc
from contracts.src.libraries.matter_types import MatterType
from contracts.src.libraries.grid_operations import get_element, set_element, get_adjacent_elements

// Condition types
namespace ConditionType {
    const ADJACENT = 0;      // Element is adjacent to another
    const COUNT_MIN = 1;     // Minimum count of element type
    const COUNT_MAX = 2;     // Maximum count of element type
    const POSITION = 3;      // Element is at specific position
}

// Formula condition
struct Condition {
    type: felt,              // ConditionType
    matter_type: felt,       // Target matter type
    value: felt,             // Threshold value or position
}

// Formula result
struct Result {
    matter_type: felt,       // Resulting matter type
}

// Complete formula
struct Formula {
    conditions_count: felt,  // Number of conditions
    conditions: Condition*,  // Array of conditions
    result: Result,          // Result when conditions are met
}

// Parse a formula from a flat array representation
// Format: [conditions_count, condition1_type, condition1_matter, condition1_value, ..., result_type]
func parse_formula(formula_flat: felt*) -> Formula {
    alloc_locals;
    
    let conditions_count = formula_flat[0];
    let (conditions) = alloc();
    
    // Parse conditions
    _parse_conditions(formula_flat + 1, conditions, 0, conditions_count);
    
    // Parse result (last element in the array)
    let result_idx = 1 + (conditions_count * 3); // Skip header and all conditions
    let result = Result(matter_type=formula_flat[result_idx]);
    
    return Formula(
        conditions_count=conditions_count,
        conditions=conditions,
        result=result,
    );
}

// Parse conditions recursively
func _parse_conditions(src: felt*, dst: Condition*, idx: felt, count: felt) {
    if (idx == count) {
        return ();
    }
    
    // Each condition takes 3 values: type, matter_type, value
    let offset = idx * 3;
    dst[idx] = Condition(
        type=src[offset],
        matter_type=src[offset + 1],
        value=src[offset + 2],
    );
    
    _parse_conditions(src, dst, idx + 1, count);
    return ();
}

// Apply a formula to the entire grid
func apply_formula(grid: felt*, width: felt, height: felt, formula: Formula) {
    alloc_locals;
    let (temp_grid) = alloc();
    
    // Copy original grid to temp
    _copy_grid(grid, temp_grid, width * height);
    
    // Apply formula to each cell
    _apply_to_all_cells(grid, temp_grid, width, height, 0, 0, formula);
    
    // Copy temp grid back to original
    _copy_grid(temp_grid, grid, width * height);
    return ();
}

// Apply formula to all cells recursively
func _apply_to_all_cells(
    src_grid: felt*, dst_grid: felt*, width: felt, height: felt, 
    x: felt, y: felt, formula: Formula
) {
    alloc_locals;
    
    // Handle end of row
    if (x == width) {
        _apply_to_all_cells(src_grid, dst_grid, width, height, 0, y + 1, formula);
        return ();
    }
    
    // Handle end of grid
    if (y == height) {
        return ();
    }
    
    // Check if formula applies to this cell
    let (applies) = check_formula_conditions(src_grid, width, height, x, y, formula);
    
    if (applies == 1) {
        // Apply transformation
        let element_idx = y * width + x;
        dst_grid[element_idx] = formula.result.matter_type;
    }
    
    // Continue to next cell
    _apply_to_all_cells(src_grid, dst_grid, width, height, x + 1, y, formula);
    return ();
}

// Check if formula conditions apply to a cell
func check_formula_conditions(
    grid: felt*, width: felt, height: felt, x: felt, y: felt, formula: Formula
) -> (applies: felt) {
    // Check each condition
    let all_conditions_met = _check_conditions_recursive(
        grid, width, height, x, y, formula.conditions, 0, formula.conditions_count
    );
    
    return (all_conditions_met,);
}

// Check conditions recursively
func _check_conditions_recursive(
    grid: felt*, width: felt, height: felt, x: felt, y: felt,
    conditions: Condition*, idx: felt, count: felt
) -> felt {
    if (idx == count) {
        return 1; // All conditions checked and met
    }
    
    let condition = conditions[idx];
    let (condition_met) = _check_single_condition(grid, width, height, x, y, condition);
    
    if (condition_met == 0) {
        return 0; // Condition not met
    }
    
    // Check next condition
    return _check_conditions_recursive(grid, width, height, x, y, conditions, idx + 1, count);
}

// Check if a single condition is met
func _check_single_condition(
    grid: felt*, width: felt, height: felt, x: felt, y: felt, condition: Condition
) -> (met: felt) {
    let (current_element) = get_element(grid, width, x, y);
    
    // Handle different condition types
    if (condition.type == ConditionType.ADJACENT) {
        // Check if element is adjacent to specified matter type
        let (adjacents) = get_adjacent_elements(grid, width, height, x, y);
        let (has_adjacent) = _has_element_of_type(adjacents, 0, 4, condition.matter_type);
        return (has_adjacent,);
    }
    
    if (condition.type == ConditionType.COUNT_MIN) {
        // Check if there are at least N elements of type in vicinity
        let (adjacents) = get_adjacent_elements(grid, width, height, x, y);
        let (count) = _count_elements_of_type(adjacents, 0, 4, condition.matter_type);
        return (count >= condition.value,);
    }
    
    if (condition.type == ConditionType.COUNT_MAX) {
        // Check if there are at most N elements of type in vicinity
        let (adjacents) = get_adjacent_elements(grid, width, height, x, y);
        let (count) = _count_elements_of_type(adjacents, 0, 4, condition.matter_type);
        return (count <= condition.value,);
    }
    
    if (condition.type == ConditionType.POSITION) {
        // Check if current element is of specific type
        return (current_element == condition.matter_type,);
    }
    
    return (0,); // Unknown condition type
}

// Helper to check if array has element of type
func _has_element_of_type(elements: felt*, idx: felt, count: felt, type: felt) -> (has: felt) {
    if (idx == count) {
        return (0,); // Not found
    }
    
    if (elements[idx] == type) {
        return (1,); // Found
    }
    
    return _has_element_of_type(elements, idx + 1, count, type);
}

// Helper to count elements of type
func _count_elements_of_type(elements: felt*, idx: felt, count: felt, type: felt) -> (count: felt) {
    if (idx == count) {
        return (0,);
    }
    
    let (rest_count) = _count_elements_of_type(elements, idx + 1, count, type);
    
    if (elements[idx] == type) {
        return (rest_count + 1,);
    } else {
        return (rest_count,);
    }
}

// Helper to copy grid
func _copy_grid(src: felt*, dst: felt*, size: felt) {
    if (size == 0) {
        return ();
    }
    
    dst[0] = src[0];
    _copy_grid(src + 1, dst + 1, size - 1);
    return ();
}

// Create a formula from components (for testing and puzzle creation)
func create_formula(
    conditions: Condition*, conditions_count: felt, result_type: felt
) -> Formula {
    return Formula(
        conditions_count=conditions_count,
        conditions=conditions,
        result=Result(matter_type=result_type),
    );
}

// Serialize a formula to string representation for UI
func formula_to_string(formula: Formula) -> (representation: felt*) {
    // In a real implementation, this would convert the formula to a human-readable string
    // For simplicity in this example, we return a placeholder
    let (repr) = alloc();
    return (repr,);
}
