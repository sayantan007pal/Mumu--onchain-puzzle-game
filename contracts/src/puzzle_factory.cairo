// SPDX-License-Identifier: MIT
%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.starknet.common.syscalls import get_caller_address

from contracts.src.libraries.matter_types import MatterType
from contracts.src.libraries.formula_parser import Formula, create_formula, Condition, ConditionType
from contracts.src.libraries.grid_operations import create_grid, get_element, set_element

// Predefined puzzle templates
struct PuzzleTemplate {
    id: felt,
    name: felt,
    width: felt,
    height: felt,
    difficulty: felt,
}

// Storage variables
@storage_var
func puzzle_templates_count() -> (count: felt) {
}

@storage_var
func puzzle_templates(template_id: felt) -> (template: PuzzleTemplate) {
}

@storage_var
func template_init_state(template_id: felt) -> (grid: felt*) {
}

@storage_var
func template_target_state(template_id: felt) -> (grid: felt*) {
}

@storage_var
func template_formulas(template_id: felt) -> (formulas: Formula*) {
}

@storage_var
func template_formulas_count(template_id: felt) -> (count: felt) {
}

// Initialize the puzzle factory with some template puzzles
@constructor
func constructor{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    // Create some predefined puzzles
    _create_beginner_puzzle();
    _create_intermediate_puzzle();
    _create_advanced_puzzle();
    return ();
}

// Create a beginner-level puzzle template
func _create_beginner_puzzle{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    alloc_locals;
    
    // Define simple 3x3 grid
    let width = 3;
    let height = 3;
    
    // Create initial state: some water and earth elements
    let (init_grid) = create_grid(width, height);
    set_element(init_grid, width, 0, 0, MatterType.EARTH);
    set_element(init_grid, width, 1, 1, MatterType.WATER);
    set_element(init_grid, width, 2, 2, MatterType.FIRE);
    
    // Create target state: plant at position (0,0)
    let (target_grid) = create_grid(width, height);
    set_element(target_grid, width, 0, 0, MatterType.PLANT);
    set_element(target_grid, width, 1, 1, MatterType.VOID);
    set_element(target_grid, width, 2, 2, MatterType.VOID);
    
    // Create formulas
    let (conditions) = alloc();
    conditions[0] = Condition(
        type=ConditionType.POSITION,
        matter_type=MatterType.EARTH,
        value=0
    );
    conditions[1] = Condition(
        type=ConditionType.ADJACENT,
        matter_type=MatterType.WATER,
        value=0
    );
    
    let formula = create_formula(conditions, 2, MatterType.PLANT);
    
    let (formulas) = alloc();
    formulas[0] = formula;
    
    // Save the template
    let template = PuzzleTemplate(
        id=1,
        name='Water and Earth',
        width=width,
        height=height,
        difficulty=1
    );
    
    puzzle_templates.write(1, template);
    template_init_state.write(1, init_grid);
    template_target_state.write(1, target_grid);
    template_formulas.write(1, formulas);
    template_formulas_count.write(1, 1);
    
    let (count) = puzzle_templates_count();
    puzzle_templates_count.write(count + 1);
    
    return ();
}

// Create an intermediate-level puzzle template
func _create_intermediate_puzzle{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    // Similar implementation to beginner puzzle but with more complex rules
    return ();
}

// Create an advanced-level puzzle template
func _create_advanced_puzzle{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    // Similar implementation to beginner puzzle but with complex rules and larger grid
    return ();
}

// Get a puzzle template by id
@view
func get_puzzle_template{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    template_id: felt
) -> (
    name: felt,
    width: felt,
    height: felt,
    difficulty: felt
) {
    let (template) = puzzle_templates.read(template_id);
    
    return (
        template.name,
        template.width,
        template.height,
        template.difficulty,
    );
}

// Get initial state for a puzzle template
@view
func get_template_initial_state{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    template_id: felt
) -> (grid: felt*, width: felt, height: felt) {
    let (template) = puzzle_templates.read(template_id);
    let (grid) = template_init_state.read(template_id);
    
    return (grid, template.width, template.height);
}

// Get target state for a puzzle template
@view
func get_template_target_state{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    template_id: felt
) -> (grid: felt*, width: felt, height: felt) {
    let (template) = puzzle_templates.read(template_id);
    let (grid) = template_target_state.read(template_id);
    
    return (grid, template.width, template.height);
}

// Get formulas for a puzzle template
@view
func get_template_formulas{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    template_id: felt
) -> (formulas: Formula*, count: felt) {
    let (formulas) = template_formulas.read(template_id);
    let (count) = template_formulas_count.read(template_id);
    
    return (formulas, count);
}

// Create a custom puzzle by cloning and modifying a template
@external
func create_custom_puzzle{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    template_id: felt,
    modifications: felt*,  // Array of [x, y, new_value] triplets
    modifications_count: felt
) -> (puzzle_id: felt) {
    alloc_locals;
    let (caller) = get_caller_address();
    
    // Get template data
    let (template) = puzzle_templates.read(template_id);
    let (init_grid) = template_init_state.read(template_id);
    let (target_grid) = template_target_state.read(template_id);
    let (formulas) = template_formulas.read(template_id);
    let (formulas_count) = template_formulas_count.read(template_id);
    
    // Create a copy of the initial grid
    let (new_grid) = alloc();
    _copy_grid(init_grid, new_grid, template.width * template.height);
    
    // Apply modifications
    _apply_modifications(new_grid, template.width, modifications, 0, modifications_count);
    
    // Create puzzle using game_core contract
    // This would call the create_puzzle function in game_core.cairo
    // For simplicity, we return a placeholder puzzle ID
    return (100,);
}

// Apply modifications to a grid
func _apply_modifications(
    grid: felt*, width: felt, mods: felt*, idx: felt, count: felt
) {
    if (idx == count) {
        return ();
    }
    
    // Each modification is a triplet [x, y, new_value]
    let x = mods[idx * 3];
    let y = mods[idx * 3 + 1];
    let value = mods[idx * 3 + 2];
    
    // Update grid
    set_element(grid, width, x, y, value);
    
    // Continue with next modification
    _apply_modifications(grid, width, mods, idx + 1, count);
    return ();
}

// Copy grid helper
func _copy_grid(src: felt*, dst: felt*, size: felt) {
    if (size == 0) {
        return ();
    }
    
    dst[0] = src[0];
    _copy_grid(src + 1, dst + 1, size - 1);
    return ();
}