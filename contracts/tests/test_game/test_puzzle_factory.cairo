%lang starknet
// SPDX-License-Identifier: MIT

from starkware.cairo.common.alloc import alloc
from contracts.src.libraries.matter_types import MatterType
from contracts.src.libraries.grid_operations import get_element
from contracts.src.puzzle_factory import (
    constructor,
    get_puzzle_template,
    get_template_initial_state,
    get_template_target_state,
    get_template_formulas,
    create_custom_puzzle
)

// Test that constructor initializes puzzle templates and getters work
@external
func test_constructor_and_template_access() {
    alloc_locals;

    // Initialize factory templates
    constructor();

    // Verify template metadata
    let (name, width, height, difficulty) = get_puzzle_template(1);
    assert width = 3;
    assert height = 3;
    assert difficulty = 1;

    // Verify initial grid state
    let (init_grid, iw, ih) = get_template_initial_state(1);
    assert iw = width;
    assert ih = height;
    let (e1) = get_element(init_grid, width, 0, 0);
    assert e1 = MatterType.EARTH;

    // Verify target grid state
    let (target_grid, tw, th) = get_template_target_state(1);
    assert tw = width;
    assert th = height;
    let (e2) = get_element(target_grid, width, 0, 0);
    assert e2 = MatterType.PLANT;

    // Verify formulas count
    let (formulas, count) = get_template_formulas(1);
    assert count = 1;

    return ();
}

// Test create_custom_puzzle returns placeholder ID without error
@external
func test_create_custom_puzzle() {
    alloc_locals;

    // Prepare a single modification [x, y, new_value]
    let (mods) = alloc();
    mods[0] = 0;
    mods[1] = 0;
    mods[2] = MatterType.WATER;

    // Create custom puzzle from template 1
    let (pid) = create_custom_puzzle(1, mods, 1);
    assert pid = 100;

    return ();
}
