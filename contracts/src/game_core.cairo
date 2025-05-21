%lang starknet
// SPDX-License-Identifier: MIT

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math import assert_le, assert_lt
from starkware.starknet.common.syscalls import get_caller_address

from contracts.src.libraries.matter_types import MatterType
from contracts.src.libraries.formula_parser import Formula, parse_formula, apply_formula
from contracts.src.libraries.grid_operations import create_grid, get_element, set_element

// Game state
struct GameState {
    grid_width: felt,
    grid_height: felt,
    grid: felt*,
    formulas_count: felt,
    formulas: Formula*,
    target_state: felt*,
    moves: felt,
    completed: felt,
}

// Storage variables
@storage_var
func puzzles_count() -> (count: felt) {
}

@storage_var
func puzzles(puzzle_id: felt) -> (puzzle: GameState) {
}

@storage_var
func player_progress(player: felt, puzzle_id: felt) -> (progress: GameState) {
}

@storage_var
func puzzle_creator(puzzle_id: felt) -> (creator: felt) {
}

// Initialize a new game
@external
func initialize_game{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    puzzle_id: felt
) -> (game_id: felt) {
    alloc_locals;
    let (caller) = get_caller_address();
    let (puzzle) = puzzles.read(puzzle_id);
    
    // Initialize player progress with the puzzle configuration
    player_progress.write(caller, puzzle_id, puzzle);
    
    return (puzzle_id,);
}

// Make a move in the game
@external
func make_move{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    puzzle_id: felt, x: felt, y: felt, direction: felt
) -> (success: felt) {
    alloc_locals;
    let (caller) = get_caller_address();
    let (game_state) = player_progress.read(caller, puzzle_id);
    
    // Validate move
    assert_lt(x, game_state.grid_width);
    assert_lt(y, game_state.grid_height);
    assert_le(direction, 4); // 0: none, 1: up, 2: right, 3: down, 4: left
    
    // Get the current element at position
    let (element) = get_element(game_state.grid, game_state.grid_width, x, y);
    
    // Check if element can be moved
    let can_move = _can_element_move(element, direction);
    if (can_move == 0) {
        return (0,); // Invalid move
    }
    
    // Update grid with the move
    let (new_grid) = _update_grid_with_move(
        game_state.grid, game_state.grid_width, game_state.grid_height, 
        x, y, direction
    );
    
    // Apply formulas to the new grid state
    let (transformed_grid) = _apply_all_formulas(
        new_grid, game_state.grid_width, game_state.grid_height,
        game_state.formulas, game_state.formulas_count
    );
    
    // Update game state
    let new_game_state = GameState(
        grid_width=game_state.grid_width,
        grid_height=game_state.grid_height,
        grid=transformed_grid,
        formulas_count=game_state.formulas_count,
        formulas=game_state.formulas,
        target_state=game_state.target_state,
        moves=game_state.moves + 1,
        completed=0, // Will be updated by check_completion
    );
    
    // Check if puzzle is completed
    let (is_completed) = _check_completion(
        transformed_grid, game_state.target_state, 
        game_state.grid_width * game_state.grid_height
    );
    
    if (is_completed == 1) {
        let new_game_state = GameState(
            grid_width=new_game_state.grid_width,
            grid_height=new_game_state.grid_height,
            grid=new_game_state.grid,
            formulas_count=new_game_state.formulas_count,
            formulas=new_game_state.formulas,
            target_state=new_game_state.target_state,
            moves=new_game_state.moves,
            completed=1,
        );
    }
    
    // Save updated game state
    player_progress.write(caller, puzzle_id, new_game_state);
    
    return (1,); // Move successful
}

// Create a new puzzle
@external
func create_puzzle{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    grid_width: felt, 
    grid_height: felt,
    initial_grid_flat: felt*,
    formulas_flat: felt*,
    formulas_count: felt,
    target_grid_flat: felt*
) -> (puzzle_id: felt) {
    alloc_locals;
    let (caller) = get_caller_address();
    
    // Create formulas from flat array
    let (formulas) = _create_formulas_from_flat(formulas_flat, formulas_count);
    
    // Create game state
    let game_state = GameState(
        grid_width=grid_width,
        grid_height=grid_height,
        grid=initial_grid_flat,
        formulas_count=formulas_count,
        formulas=formulas,
        target_state=target_grid_flat,
        moves=0,
        completed=0,
    );
    
    // Get next puzzle id
    let (current_count) = puzzles_count();
    let puzzle_id = current_count + 1;
    
    // Save puzzle
    puzzles.write(puzzle_id, game_state);
    puzzle_creator.write(puzzle_id, caller);
    puzzles_count.write(current_count + 1);
    
    return (puzzle_id,);
}

// Get current game state
@view
func get_game_state{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    player: felt, puzzle_id: felt
) -> (
    grid_width: felt, 
    grid_height: felt,
    grid_flat: felt*,
    moves: felt,
    completed: felt
) {
    let (game_state) = player_progress.read(player, puzzle_id);
    
    let (grid_flat) = alloc();
    
    // Copy grid to flat array for return
    _copy_grid(
        game_state.grid, 
        grid_flat, 
        game_state.grid_width * game_state.grid_height
    );
    
    return (
        game_state.grid_width,
        game_state.grid_height,
        grid_flat,
        game_state.moves,
        game_state.completed,
    );
}

// Get puzzle formulas
@view
func get_puzzle_formulas{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    puzzle_id: felt
) -> (formulas_flat: felt*, formulas_count: felt) {
    let (puzzle) = puzzles.read(puzzle_id);
    
    let (formulas_flat) = alloc();
    
    // Flatten formulas for return
    _flatten_formulas(
        puzzle.formulas, 
        formulas_flat, 
        puzzle.formulas_count
    );
    
    return (formulas_flat, puzzle.formulas_count);
}

// Helper functions
func _can_element_move(element: felt, direction: felt) -> (can_move: felt) {
    if (element == MatterType.EARTH) {
        return (0,); // Earth cannot move
    }
    if (element == MatterType.VOID) {
        return (0,); // Void cannot be moved directly
    }
    return (1,); // Other elements can be moved
}

func _update_grid_with_move(
    grid: felt*, width: felt, height: felt, x: felt, y: felt, direction: felt
) -> (new_grid: felt*) {
    alloc_locals;
    let (new_grid) = alloc();
    
    // Copy original grid
    _copy_grid(grid, new_grid, width * height);
    
    // Calculate new position
    let (new_x, new_y) = _get_new_position(x, y, direction);
    
    // Check bounds
    if (new_x < 0 | new_x >= width | new_y < 0 | new_y >= height) {
        return (grid,); // Out of bounds, return original grid
    }
    
    // Get elements
    let (src_element) = get_element(grid, width, x, y);
    let (dest_element) = get_element(grid, width, new_x, new_y);
    
    // Check if destination is void (can move into)
    if (dest_element != MatterType.VOID) {
        return (grid,); // Cannot move, return original grid
    }
    
    // Update grid - move element to new position
    set_element(new_grid, width, x, y, MatterType.VOID);
    set_element(new_grid, width, new_x, new_y, src_element);
    
    return (new_grid,);
}

func _get_new_position(x: felt, y: felt, direction: felt) -> (new_x: felt, new_y: felt) {
    if (direction == 1) { // Up
        return (x, y - 1);
    }
    if (direction == 2) { // Right
        return (x + 1, y);
    }
    if (direction == 3) { // Down
        return (x, y + 1);
    }
    if (direction == 4) { // Left
        return (x - 1, y);
    }
    return (x, y); // No movement
}

func _apply_all_formulas(
    grid: felt*, width: felt, height: felt, formulas: Formula*, formulas_count: felt
) -> (new_grid: felt*) {
    alloc_locals;
    let (new_grid) = alloc();
    
    // Copy original grid
    _copy_grid(grid, new_grid, width * height);
    
    // Apply each formula
    _apply_formulas_recursive(new_grid, width, height, formulas, 0, formulas_count);
    
    return (new_grid,);
}

func _apply_formulas_recursive(
    grid: felt*, width: felt, height: felt, 
    formulas: Formula*, current_idx: felt, formulas_count: felt
) {
    if (current_idx == formulas_count) {
        return ();
    }
    
    // Apply current formula
    let formula = formulas[current_idx];
    apply_formula(grid, width, height, formula);
    
    // Continue with next formula
    _apply_formulas_recursive(grid, width, height, formulas, current_idx + 1, formulas_count);
    return ();
}

func _check_completion(grid: felt*, target: felt*, size: felt) -> (completed: felt) {
    // Compare each element
    let match = _compare_grids(grid, target, 0, size);
    return (match,);
}

func _compare_grids(grid1: felt*, grid2: felt*, idx: felt, size: felt) -> felt {
    if (idx == size) {
        return 1; // All elements match
    }
    
    if (grid1[idx] != grid2[idx]) {
        return 0; // Mismatch found
    }
    
    // Continue comparison
    return _compare_grids(grid1, grid2, idx + 1, size);
}

func _copy_grid(src: felt*, dst: felt*, size: felt) {
    if (size == 0) {
        return ();
    }
    
    dst[0] = src[0];
    _copy_grid(src + 1, dst + 1, size - 1);
    return ();
}

func _create_formulas_from_flat(formulas_flat: felt*, count: felt) -> (formulas: Formula*) {
    alloc_locals;
    let (formulas) = alloc();
    
    // Parse each formula from flat array (simplified)
    // In a real implementation, this would parse the formula syntax
    // Here we just copy the raw data
    _parse_formulas_recursive(formulas_flat, formulas, 0, count);
    
    return (formulas,);
}

func _parse_formulas_recursive(src: felt*, dst: Formula*, idx: felt, count: felt) {
    if (idx == count) {
        return ();
    }
    
    // In a real implementation, we would parse the formula here
    // For simplicity, we just copy the raw data structure
    let formula_size = 10; // Size of one formula in the flat array
    let formula = parse_formula(src + (idx * formula_size));
    dst[idx] = formula;
    
    _parse_formulas_recursive(src, dst, idx + 1, count);
    return ();
}

func _flatten_formulas(formulas: Formula*, flat: felt*, count: felt) {
    // Convert formulas to flat array for return
    // Implementation simplified for brevity
    return ();
}
