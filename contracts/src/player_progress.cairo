// SPDX-License-Identifier: MIT
%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.starknet.common.syscalls import get_caller_address

// Player achievement struct
struct Achievement {
    id: felt,
    name: felt,
    description: felt,
    unlocked: felt,
}

// Player stats
struct PlayerStats {
    puzzles_completed: felt,
    total_moves: felt,
    optimal_solutions: felt,
    custom_puzzles_created: felt,
}

// Storage variables
@storage_var
func player_puzzles_completed(player: felt, puzzle_id: felt) -> (completed: felt) {
}

@storage_var
func player_puzzle_moves(player: felt, puzzle_id: felt) -> (moves: felt) {
}

@storage_var
func player_stats(player: felt) -> (stats: PlayerStats) {
}

@storage_var
func player_achievements(player: felt) -> (achievements: Achievement*) {
}

@storage_var
func player_achievements_count(player: felt) -> (count: felt) {
}

@storage_var
func available_achievements_count() -> (count: felt) {
}

// Initialize player profile
@external
func initialize_player{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}() {
    alloc_locals;
    let (caller) = get_caller_address();
    
    // Check if player already initialized
    let (stats) = player_stats.read(caller);
    
    // If not initialized yet
    if (stats.puzzles_completed == 0) {
        // Create initial stats
        let initial_stats = PlayerStats(
            puzzles_completed=0,
            total_moves=0,
            optimal_solutions=0,
            custom_puzzles_created=0
        );
        
        player_stats.write(caller, initial_stats);
        
        // Initialize achievements
        _initialize_achievements(caller);
    }
    
    return ();
}

// Initialize default achievements
func _initialize_achievements{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    player: felt
) {
    alloc_locals;
    let (achievements) = alloc();
    
    // Define basic achievements
    achievements[0] = Achievement(
        id=1,
        name='First Steps',
        description='Complete your first puzzle',
        unlocked=0
    );
    
    achievements[1] = Achievement(
        id=2,
        name='Puzzle Master',
        description='Complete 10 puzzles',
        unlocked=0
    );
    
    achievements[2] = Achievement(
        id=3,
        name='Efficient Solver',
        description='Solve a puzzle with minimum moves',
        unlocked=0
    );
    
    achievements[3] = Achievement(
        id=4,
        name='Creator',
        description='Create your first custom puzzle',
        unlocked=0
    );
    
    // Save achievements
    player_achievements.write(player, achievements);
    player_achievements_count.write(player, 4);
    
    return ();
}

// Update player progress when puzzle completed
@external
func update_puzzle_completion{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    player: felt, puzzle_id: felt, moves: felt
) {
    alloc_locals;
    
    // Update puzzle completion status
    player_puzzles_completed.write(player, puzzle_id, 1);
    player_puzzle_moves.write(player, puzzle_id, moves);
    
    // Update player stats
    let (stats) = player_stats.read(player);
    
    let new_stats = PlayerStats(
        puzzles_completed=stats.puzzles_completed + 1,
        total_moves=stats.total_moves + moves,
        optimal_solutions=stats.optimal_solutions,
        custom_puzzles_created=stats.custom_puzzles_created
    );
    
    // Check if solution was optimal
    let (optimal_moves) = _get_optimal_moves(puzzle_id);
    if (moves <= optimal_moves) {
        let new_stats = PlayerStats(
            puzzles_completed=new_stats.puzzles_completed,
            total_moves=new_stats.total_moves,
            optimal_solutions=new_stats.optimal_solutions + 1,
            custom_puzzles_created=new_stats.custom_puzzles_created
        );
    }
    
    player_stats.write(player, new_stats);
    
    // Check and update achievements
    _check_achievements(player, new_stats);
    
    return ();
}

// Increment custom puzzle creation count
@external
func increment_puzzle_creation{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    player: felt
) {
    alloc_locals;
    
    // Update player stats
    let (stats) = player_stats.read(player);
    
    let new_stats = PlayerStats(
        puzzles_completed=stats.puzzles_completed,
        total_moves=stats.total_moves,
        optimal_solutions=stats.optimal_solutions,
        custom_puzzles_created=stats.custom_puzzles_created + 1
    );
    
    player_stats.write(player, new_stats);
    
    // Check and update achievements
    _check_achievements(player, new_stats);
    
    return ();
}

// Check if player unlocked new achievements
func _check_achievements{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    player: felt, stats: PlayerStats
) {
    alloc_locals;
    
    let (achievements) = player_achievements.read(player);
    let (count) = player_achievements_count.read(player);
    
    // Check each achievement
    _check_achievements_recursive(player, achievements, stats, 0, count);
    
    return ();
}

// Check achievements recursively
func _check_achievements_recursive{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    player: felt, achievements: Achievement*, stats: PlayerStats, idx: felt, count: felt
) {
    if (idx == count) {
        return ();
    }
    
    let achievement = achievements[idx];
    
    // If already unlocked, skip
    if (achievement.unlocked == 1) {
        _check_achievements_recursive(player, achievements, stats, idx + 1, count);
        return ();
    }
    
    // Check achievement conditions
    if (achievement.id == 1) { // First Steps
        if (stats.puzzles_completed >= 1) {
            achievements[idx].unlocked = 1;
        }
    } else if (achievement.id == 2) { // Puzzle Master
        if (stats.puzzles_completed >= 10) {
            achievements[idx].unlocked = 1;
        }
    } else if (achievement.id == 3) { // Efficient Solver
        if (stats.optimal_solutions >= 1) {
            achievements[idx].unlocked = 1;
        }
    } else if (achievement.id == 4) { // Creator
        if (stats.custom_puzzles_created >= 1) {
            achievements[idx].unlocked = 1;
        }
    }
    
    // Update achievements
    player_achievements.write(player, achievements);
    
    // Continue with next achievement
    _check_achievements_recursive(player, achievements, stats, idx + 1, count);
    return ();
}

// Get optimal moves for a puzzle (placeholder)
func _get_optimal_moves(puzzle_id: felt) -> (moves: felt) {
    // In a real implementation, this would retrieve the optimal move count from storage
    return (10,); // Placeholder value
}

// Get player stats
@view
func get_player_stats{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    player: felt
) -> (
    puzzles_completed: felt,
    total_moves: felt,
    optimal_solutions: felt,
    custom_puzzles_created: felt
) {
    let (stats) = player_stats.read(player);
    
    return (
        stats.puzzles_completed,
        stats.total_moves,
        stats.optimal_solutions,
        stats.custom_puzzles_created,
    );
}

// Get player achievements
@view
func get_player_achievements{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    player: felt
) -> (achievements: Achievement*, count: felt) {
    let (achievements) = player_achievements.read(player);
    let (count) = player_achievements_count.read(player);
    
    return (achievements, count);
}

// Check if player has completed a puzzle
@view
func has_completed_puzzle{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    player: felt, puzzle_id: felt
) -> (completed: felt) {
    let (completed) = player_puzzles_completed.read(player, puzzle_id);
    return (completed,);
}