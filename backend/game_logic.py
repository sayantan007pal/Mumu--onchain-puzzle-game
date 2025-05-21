import copy

# Matter types
VOID = 0
EARTH = 1
WATER = 2
FIRE = 3
AIR = 4
STEAM = 5
PLANT = 6
ICE = 7
LAVA = 8
METAL = 9

# Directions
UP = 1
RIGHT = 2
DOWN = 3
LEFT = 4

def can_element_move(element):
    if element == EARTH or element == VOID:
        return False
    return True

def get_new_position(x, y, direction):
    if direction == UP:
        return x, y - 1
    if direction == RIGHT:
        return x + 1, y
    if direction == DOWN:
        return x, y + 1
    if direction == LEFT:
        return x - 1, y
    return x, y

def in_bounds(x, y, width, height):
    return 0 <= x < width and 0 <= y < height

def update_grid_with_move(grid, width, height, x, y, direction):
    new_grid = copy.deepcopy(grid)
    new_x, new_y = get_new_position(x, y, direction)
    if not in_bounds(new_x, new_y, width, height):
        return grid  # Out of bounds
    src_element = grid[y][x]
    dest_element = grid[new_y][new_x]
    if not can_element_move(src_element):
        return grid
    if dest_element != VOID:
        return grid
    # Move element
    new_grid[y][x] = VOID
    new_grid[new_y][new_x] = src_element
    return new_grid

def apply_formula(grid, width, height, formula):
    # Example: formula = {'input': EARTH, 'output': PLANT}
    for y in range(height):
        for x in range(width):
            if grid[y][x] == formula['input']:
                grid[y][x] = formula['output']
    return grid

def check_completion(grid, target):
    return grid == target

# Example usage
if __name__ == '__main__':
    width, height = 3, 3
    grid = [
        [EARTH, VOID, VOID],
        [VOID, WATER, VOID],
        [VOID, VOID, FIRE],
    ]
    print('Initial grid:')
    for row in grid:
        print(row)
    # Try to move WATER right
    new_grid = update_grid_with_move(grid, width, height, 1, 1, RIGHT)
    print('After move:')
    for row in new_grid:
        print(row)
    # Apply a formula
    formula = {'input': EARTH, 'output': PLANT}
    new_grid = apply_formula(new_grid, width, height, formula)
    print('After formula:')
    for row in new_grid:
        print(row) 