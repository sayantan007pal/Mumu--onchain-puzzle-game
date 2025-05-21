%lang starknet
// SPDX-License-Identifier: MIT

from starkware.cairo.common.alloc import alloc
from contracts.src.libraries.grid_operations import create_grid, get_element, set_element
from contracts.src.libraries.grid_operations import get_adjacent_elements, copy_region, are_grids_equal

// Test creating a grid
@external
func test_create_grid() {
    // Create a 3x3 grid
    let (grid) = create_grid(3, 3);
    
    // Verify all elements are initialized to 0 (VOID)
    let (element) = get_element(grid, 3, 0, 0);
    assert element = 0;
    
    let (element) = get_element(grid, 3, 1, 1);
    assert element = 0;
    
    let (element) = get_element(grid, 3, 2, 2);
    assert element = 0;
    
    return ();
}

// Test setting and getting elements
@external
func test_set_get_element() {
    // Create a 3x3 grid
    let (grid) = create_grid(3, 3);
    
    // Set elements
    set_element(grid, 3, 0, 0, 1);
    set_element(grid, 3, 1, 1, 2);
    set_element(grid, 3, 2, 2, 3);
    
    // Verify elements
    let (element) = get_element(grid, 3, 0, 0);
    assert element = 1;
    
    let (element) = get_element(grid, 3, 1, 1);
    assert element = 2;
    
    let (element) = get_element(grid, 3, 2, 2);
    assert element = 3;
    
    return ();
}

// Test getting adjacent elements
@external
func test_get_adjacent_elements() {
    // Create a 3x3 grid with specific values
    let (grid) = create_grid(3, 3);
    set_element(grid, 3, 0, 0, 1);  // Top-left
    set_element(grid, 3, 1, 0, 2);  // Top-middle
    set_element(grid, 3, 2, 0, 3);  // Top-right
    set_element(grid, 3, 0, 1, 4);  // Middle-left
    set_element(grid, 3, 1, 1, 5);  // Center
    set_element(grid, 3, 2, 1, 6);  // Middle-right
    set_element(grid, 3, 0, 2, 7);  // Bottom-left
    set_element(grid, 3, 1, 2, 8);  // Bottom-middle
    set_element(grid, 3, 2, 2, 9);  // Bottom-right
    
    // Test center position (1,1) - should have all adjacents
    let (adjacents) = get_adjacent_elements(grid, 3, 3, 1, 1);
    assert adjacents[0] = 2;  // Up: (1,0) = 2
    assert adjacents[1] = 6;  // Right: (2,1) = 6
    assert adjacents[2] = 8;  // Down: (1,2) = 8
    assert adjacents[3] = 4;  // Left: (0,1) = 4
    
    // Test top-left corner (0,0) - should have right and down adjacents, and -1 for out of bounds
    let (adjacents) = get_adjacent_elements(grid, 3, 3, 0, 0);
    assert adjacents[0] = -1;  // Up: out of bounds
    assert adjacents[1] = 2;   // Right: (1,0) = 2
    assert adjacents[2] = 4;   // Down: (0,1) = 4
    assert adjacents[3] = -1;  // Left: out of bounds
    
    return ();
}

// Test grid copying
@external
func test_copy_region() {
    // Create source grid 3x3
    let (src_grid) = create_grid(3, 3);
    set_element(src_grid, 3, 0, 0, 1);
    set_element(src_grid, 3, 1, 0, 2);
    set_element(src_grid, 3, 0, 1, 3);
    set_element(src_grid, 3, 1, 1, 4);
    
    // Create destination grid 4x4
    let (dst_grid) = create_grid(4, 4);
    
    // Copy 2x2 region from (0,0) in source to (1,1) in destination
    copy_region(
        src_grid, 3, dst_grid, 4,
        0, 0, 1, 1,
        2, 2
    );
    
    // Verify destination grid
    let (element) = get_element(dst_grid, 4, 1, 1);
    assert element = 1;  // From src (0,0)
    
    let (element) = get_element(dst_grid, 4, 2, 1);
    assert element = 2;  // From src (1,0)
    
    let (element) = get_element(dst_grid, 4, 1, 2);
    assert element = 3;  // From src (0,1)
    
    let (element) = get_element(dst_grid, 4, 2, 2);
    assert element = 4;  // From src (1,1)
    
    return ();
}

// Test grid equality
@external
func test_are_grids_equal() {
    // Create two identical 2x2 grids
    let (grid1) = create_grid(2, 2);
    let (grid2) = create_grid(2, 2);
    
    set_element(grid1, 2, 0, 0, 1);
    set_element(grid1, 2, 1, 0, 2);
    set_element(grid1, 2, 0, 1, 3);
    set_element(grid1, 2, 1, 1, 4);
    
    set_element(grid2, 2, 0, 0, 1);
    set_element(grid2, 2, 1, 0, 2);
    set_element(grid2, 2, 0, 1, 3);
    set_element(grid2, 2, 1, 1, 4);
    
    // Grids should be equal
    let (equal) = are_grids_equal(grid1, grid2, 2, 2);
    assert equal = 1;
    
    // Make them different
    set_element(grid2, 2, 1, 1, 5);
    
    // Grids should not be equal
    let (equal) = are_grids_equal(grid1, grid2, 2, 2);
    assert equal = 0;
    
    return ();
}
