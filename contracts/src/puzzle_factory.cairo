%lang starknet
# SPDX-License-Identifier: MIT
from matter_types import EARTH, WATER, FIRE, PLANT, VOID
from grid_operations import create_grid, get_element, set_element
from formula_parser import Formula, create_formula

# Storage for a single puzzle (for demo)
@storage_var
func puzzle_grid(idx: felt) -> (cell: felt):
end

@external
func set_demo_grid{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}():
    let width = 2
    let height = 2
    let (grid) = create_grid(width, height)
    set_element(grid, width, 0, 0, EARTH)
    set_element(grid, width, 1, 0, WATER)
    set_element(grid, width, 0, 1, FIRE)
    set_element(grid, width, 1, 1, PLANT)
    # Store grid in storage
    puzzle_grid.write(0, EARTH)
    puzzle_grid.write(1, WATER)
    puzzle_grid.write(2, FIRE)
    puzzle_grid.write(3, PLANT)
    return ()
end

@view
func get_demo_grid{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() -> (a: felt, b: felt, c: felt, d: felt):
    let (a) = puzzle_grid.read(0)
    let (b) = puzzle_grid.read(1)
    let (c) = puzzle_grid.read(2)
    let (d) = puzzle_grid.read(3)
    return (a, b, c, d)
end
