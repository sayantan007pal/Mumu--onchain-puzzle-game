%lang starknet
// SPDX-License-Identifier: MIT

from starkware.cairo.common.alloc import alloc

// Create an empty grid of specified dimensions
func create_grid(width: felt, height: felt) -> (grid: felt*) {
    let (grid) = alloc();
    
    // Initialize all cells to 0 (VOID)
    _init_grid(grid, 0, width * height);
    
    return (grid,);
}

// Initialize grid recursively
func _init_grid(grid: felt*, idx: felt, size: felt) {
    if (idx == size) {
        return ();
    }
    
    grid[idx] = 0; // Initialize to VOID
    _init_grid(grid, idx + 1, size);
    return ();
}

// Get element at coordinates
func get_element(grid: felt*, width: felt, x: felt, y: felt) -> (element: felt) {
    let idx = y * width + x;
    return (grid[idx],);
}

// Set element at coordinates
func set_element(grid: felt*, width: felt, x: felt, y: felt, value: felt) {
    let idx = y * width + x;
    grid[idx] = value;
    return ();
}

// Get adjacent elements (up, right, down, left)
func get_adjacent_elements(
    grid: felt*, width: felt, height: felt, x: felt, y: felt
) -> (adjacent: felt*) {
    let (adjacent) = alloc();
    
    // Up
    if (y > 0) {
        let (elem) = get_element(grid, width, x, y - 1);
        adjacent[0] = elem;
    } else {
        adjacent[0] = -1; // Out of bounds
    }
    
    // Right
    if (x < width - 1) {
        let (elem) = get_element(grid, width, x + 1, y);
        adjacent[1] = elem;
    } else {
        adjacent[1] = -1; // Out of bounds
    }
    
    // Down
    if (y < height - 1) {
        let (elem) = get_element(grid, width, x, y + 1);
        adjacent[2] = elem;
    } else {
        adjacent[2] = -1; // Out of bounds
    }
    
    // Left
    if (x > 0) {
        let (elem) = get_element(grid, width, x - 1, y);
        adjacent[3] = elem;
    } else {
        adjacent[3] = -1; // Out of bounds
    }
    
    return (adjacent,);
}

// Copy a region from source grid to destination grid
func copy_region(
    src_grid: felt*, src_width: felt,
    dst_grid: felt*, dst_width: felt,
    src_x: felt, src_y: felt,
    dst_x: felt, dst_y: felt,
    width: felt, height: felt
) {
    // Copy each row
    _copy_region_rows(
        src_grid, src_width, dst_grid, dst_width, 
        src_x, src_y, dst_x, dst_y, width, height, 0
    );
    return ();
}

// Copy region rows recursively
func _copy_region_rows(
    src_grid: felt*, src_width: felt,
    dst_grid: felt*, dst_width: felt,
    src_x: felt, src_y: felt,
    dst_x: felt, dst_y: felt,
    width: felt, height: felt,
    current_y: felt
) {
    if (current_y == height) {
        return ();
    }
    
    // Copy current row
    _copy_region_cols(
        src_grid, src_width, dst_grid, dst_width,
        src_x, src_y + current_y, dst_x, dst_y + current_y,
        width, 0
    );
    
    // Continue with next row
    _copy_region_rows(
        src_grid, src_width, dst_grid, dst_width,
        src_x, src_y, dst_x, dst_y,
        width, height, current_y + 1
    );
    return ();
}

// Copy region columns recursively
func _copy_region_cols(
    src_grid: felt*, src_width: felt,
    dst_grid: felt*, dst_width: felt,
    src_x: felt, src_y: felt,
    dst_x: felt, dst_y: felt,
    width: felt, current_x: felt
) {
    if (current_x == width) {
        return ();
    }
    
    // Copy current cell
    let (elem) = get_element(src_grid, src_width, src_x + current_x, src_y);
    set_element(dst_grid, dst_width, dst_x + current_x, dst_y, elem);
    
    // Continue with next cell in row
    _copy_region_cols(
        src_grid, src_width, dst_grid, dst_width,
        src_x, src_y, dst_x, dst_y,
        width, current_x + 1
    );
    return ();
}

// Check if two grids are equal
func are_grids_equal(
    grid1: felt*, grid2: felt*, width: felt, height: felt
) -> (equal: felt) {
    return _compare_grids(grid1, grid2, 0, width * height);
}

// Compare grids recursively
func _compare_grids(grid1: felt*, grid2: felt*, idx: felt, size: felt) -> (equal: felt) {
    if (idx == size) {
        return (1,); // All elements are equal
    }
    
    if (grid1[idx] != grid2[idx]) {
        return (0,); // Mismatch found
    }
    
    return _compare_grids(grid1, grid2, idx + 1, size);
}
