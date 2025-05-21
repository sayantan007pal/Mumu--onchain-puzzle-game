%lang starknet
# SPDX-License-Identifier: MIT
from matter_types import EARTH, WATER, FIRE, PLANT, VOID
from starkware.cairo.common.alloc import alloc

# Create an empty grid (all VOID)
func create_grid(width: felt, height: felt) -> (grid: felt*):
    alloc_locals
    let (grid) = alloc()
    _init_grid(grid, 0, width * height)
    return (grid,)
end

func _init_grid(grid_ptr: felt*, idx: felt, size: felt):
    if idx == size:
        return ()
    end
    assert [grid_ptr] = 0
    _init_grid(grid_ptr + 1, idx + 1, size)
    return ()
end

# Get element at (x, y)
func get_element(grid: felt*, width: felt, x: felt, y: felt) -> (element: felt):
    let offset = y * width + x
    let ptr = grid + offset
    let element = [ptr]
    return (element,)
end

# Set element at (x, y)
func set_element(grid: felt*, width: felt, x: felt, y: felt, value: felt):
    let offset = y * width + x
    let ptr = grid + offset
    assert [ptr] = value
    return ()
end
