%lang starknet
// SPDX-License-Identifier: MIT

from starkware.cairo.common.alloc import alloc
from contracts.src.libraries.matter_types import MatterType
from contracts.src.libraries.grid_operations import create_grid, set_element, get_element
from contracts.src.libraries.formula_parser import (
    create_formula, Condition, ConditionType,
    check_formula_conditions, apply_formula
)

// Test create_formula and its fields
@external
func test_create_formula_fields() {
    alloc_locals;

    // Create a condition: ADJACENT to FIRE
    let (conditions) = alloc();
    conditions[0] = Condition(
        type=ConditionType.ADJACENT,
        matter_type=MatterType.FIRE,
        value=0
    );

    // Build the formula
    let formula = create_formula(conditions, 1, MatterType.STEAM);

    // Validate formula struct
    assert formula.conditions_count = 1;
    assert formula.conditions[0].type = ConditionType.ADJACENT;
    assert formula.conditions[0].matter_type = MatterType.FIRE;
    assert formula.conditions[0].value = 0;
    assert formula.result.matter_type = MatterType.STEAM;

    return ();
}

// Test check_formula_conditions for adjacent logic
@external
func test_check_formula_adjacent_condition() {
    alloc_locals;

    // Prepare a 3x3 grid
    let (grid) = create_grid(3, 3);

    // Position WATER at (0,0) and FIRE at (1,0)
    set_element(grid, 3, 0, 0, MatterType.WATER);
    set_element(grid, 3, 1, 0, MatterType.FIRE);

    // Formula: if adjacent to FIRE, transform to STEAM
    let (conditions) = alloc();
    conditions[0] = Condition(
        type=ConditionType.ADJACENT,
        matter_type=MatterType.FIRE,
        value=0
    );
    let formula = create_formula(conditions, 1, MatterType.STEAM);

    // Condition met at (0,0)
    let (result_true) = check_formula_conditions(grid, 3, 3, 0, 0, formula);
    assert result_true = 1;

    // Condition not met at (2,2)
    let (result_false) = check_formula_conditions(grid, 3, 3, 2, 2, formula);
    assert result_false = 0;

    return ();
}

// Test apply_formula transforms the grid correctly
@external
func test_apply_formula_effect() {
    alloc_locals;

    let (grid) = create_grid(3, 3);
    set_element(grid, 3, 0, 0, MatterType.WATER);
    set_element(grid, 3, 1, 0, MatterType.FIRE);

    // Build formula: WATER + FIRE -> STEAM
    let (conditions) = alloc();
    conditions[0] = Condition(
        type=ConditionType.ADJACENT,
        matter_type=MatterType.FIRE,
        value=0
    );
    let formula = create_formula(conditions, 1, MatterType.STEAM);

    apply_formula(grid, 3, 3, formula);

    // Verify transformation
    let (elem1) = get_element(grid, 3, 0, 0);
    assert elem1 = MatterType.STEAM;
    let (elem2) = get_element(grid, 3, 1, 0);
    assert elem2 = MatterType.VOID;

    return ();
}
