%lang starknet
// SPDX-License-Identifier: MIT

from starkware.cairo.common.alloc import alloc
from starkware.starknet.common.syscalls import get_caller_address
from contracts.src.player_progress import (
    initialize_player,
    update_puzzle_completion,
    increment_puzzle_creation,
    get_player_stats,
    get_player_achievements,
    has_completed_puzzle
)

// Test initialize_player and related getters
@external
func test_initialize_player_and_getters() {
    alloc_locals;

    let player = get_caller_address();
    initialize_player();

    // Verify initial stats
    let (pc, tm, os, cpc) = get_player_stats(player);
    assert pc = 0;
    assert tm = 0;
    assert os = 0;
    assert cpc = 0;

    // Verify achievements are initialized and locked
    let (achievements, count) = get_player_achievements(player);
    assert count = 4;
    assert achievements[0].unlocked = 0;
    assert achievements[1].unlocked = 0;
    assert achievements[2].unlocked = 0;
    assert achievements[3].unlocked = 0;

    // No puzzle completed initially
    let (done) = has_completed_puzzle(player, 1);
    assert done = 0;

    return ();
}

// Test update_puzzle_completion updates stats and achievements
@external
func test_update_puzzle_completion_and_achievements() {
    alloc_locals;
    let player = get_caller_address();

    initialize_player();
    update_puzzle_completion(player, 1, 5);

    // After one completion, stats should reflect it
    let (pc, tm, os, cpc) = get_player_stats(player);
    assert pc = 1;
    assert tm = 5;
    assert os = 0;
    assert cpc = 0;

    // 'First Steps' achievement should unlock
    let (achievements1, _) = get_player_achievements(player);
    assert achievements1[0].unlocked = 1;
    assert achievements1[1].unlocked = 0;

    // Optimal completion scenario (moves <= optimal placeholder)
    update_puzzle_completion(player, 2, 8);
    let (pc2, tm2, os2, cpc2) = get_player_stats(player);
    assert pc2 = 2;
    assert tm2 = 13;
    assert os2 = 1;
    assert cpc2 = 0;

    return ();
}

// Test increment_puzzle_creation updates stats and unlocks 'Creator'
@external
func test_increment_puzzle_creation() {
    alloc_locals;
    let player = get_caller_address();

    initialize_player();
    increment_puzzle_creation(player);

    let (pc, tm, os, cpc) = get_player_stats(player);
    assert pc = 0;
    assert tm = 0;
    assert os = 0;
    assert cpc = 1;

    let (achievements, _) = get_player_achievements(player);
    assert achievements[3].unlocked = 1;

    return ();
}
