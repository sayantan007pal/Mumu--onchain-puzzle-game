%lang starknet
// SPDX-License-Identifier: MIT

from starkware.cairo.common.alloc import alloc
from contracts.src.libraries.matter_types import MatterType
from contracts.src.libraries.grid_operations import create_grid, get_element, set_element
from contracts.src.game_core import (
    _get_new_position,
    _can_element_move,
    _update_grid_with_move,
    _apply_all_formulas,
    _check_completion
)

// Test computation of new positions for each direction
@external
func test_get_new_position() {
    alloc_locals;

    // Up (direction 1)
    let (x1, y1) = _get_new_position(1, 1, 1);
    assert x1 = 1;
    assert y1 = 0;

    // Right (2)
    let (x2, y2) = _get_new_position(1, 1, 2);
    assert x2 = 2;
    assert y2 = 1;

    // Down (3)
    let (x3, y3) = _get_new_position(1, 1, 3);
    assert x3 = 1;
    assert y3 = 2;

    // Left (4)
    let (x4, y4) = _get_new_position(1, 1, 4);
    assert x4 = 0;
    assert y4 = 1;

    return ();
}

// Test whether elements are movable
@external
func test_can_element_move() {
    alloc_locals;

    let (res1) = _can_element_move(MatterType.EARTH, 0);
    assert res1 = 0;
    let (res2) = _can_element_move(MatterType.WATER, 0);
    assert res2 = 1;
    let (res3) = _can_element_move(MatterType.VOID, 0);
    assert res3 = 0;

    return ();
}

// Test moving an element within the grid
@external
func test_update_grid_with_move() {
    alloc_locals;

    let (grid) = create_grid(3, 3);
    set_element(grid, 3, 0, 0, MatterType.WATER);
    
    // Move right (2)
    let (new_grid) = _update_grid_with_move(grid, 3, 3, 0, 0, 2);
    let (old_e) = get_element(new_grid, 3, 0, 0);
    let (new_e) = get_element(new_grid, 3, 1, 0);
    assert old_e = MatterType.VOID;
    assert new_e = MatterType.WATER;

    return ();
}

// Test applying formulas when none are provided (grid remains unchanged)
@external
func test_apply_all_formulas_empty() {
    alloc_locals;

    let (grid) = create_grid(2, 2);
    // formulas pointer = 0, count = 0
    let (result_grid) = _apply_all_formulas(grid, 2, 2, 0, 0);
    let (e) = get_element(result_grid, 2, 0, 0);
    assert e = MatterType.VOID;

    return ();
}

// Test completion check for matching and non-matching grids
@external
func test_check_completion() {
    alloc_locals;

    let (grid) = create_grid(2, 2);
    let (target) = create_grid(2, 2);
    set_element(grid, 2, 0, 0, MatterType.FIRE);
    set_element(target, 2, 0, 0, MatterType.FIRE);

    let (match1) = _check_completion(grid, target, 4);
    assert match1 = 1;

    set_element(target, 2, 1, 1, MatterType.WATER);
    let (match2) = _check_completion(grid, target, 4);
    assert match2 = 0;

    return ();
}
