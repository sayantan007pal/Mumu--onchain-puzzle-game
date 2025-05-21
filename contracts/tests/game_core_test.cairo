%lang starknet
// SPDX-License-Identifier: MIT

from starkware.cairo.common.alloc import alloc
from contracts.src.game_core import _update_grid_with_move

@external
func test_update_grid_with_move_in_bounds() -> () {
    alloc_locals;
    let width = 3;
    let height = 3;
    let (grid) = alloc();
    // Initialize grid with all zeros (VOID)
    let i = 0;
    tempvar size = width * height;
    // Fill grid with VOID
    if (i == size) {
        // Place an element at (1,1)
        grid[1 * width + 1] = 2; // e.g., WATER
        let (new_grid) = _update_grid_with_move(grid, width, height, 1, 1, 2); // Move right
        // No assertion, just check for compilation
        return ();
    }
    grid[i] = 0;
    tempvar next = i + 1;
    // Recursively fill
    return test_update_grid_with_move_in_bounds_rec(grid, width, height, next, size);
}

func test_update_grid_with_move_in_bounds_rec(grid: felt*, width: felt, height: felt, i: felt, size: felt) -> () {
    if (i == size) {
        // Place an element at (1,1)
        grid[1 * width + 1] = 2; // e.g., WATER
        let (new_grid) = _update_grid_with_move(grid, width, height, 1, 1, 2); // Move right
        // No assertion, just check for compilation
        return ();
    }
    grid[i] = 0;
    tempvar next = i + 1;
    return test_update_grid_with_move_in_bounds_rec(grid, width, height, next, size);
} 
