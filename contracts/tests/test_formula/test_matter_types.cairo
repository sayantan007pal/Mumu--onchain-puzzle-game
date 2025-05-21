%lang starknet
// SPDX-License-Identifier: MIT

from starkware.cairo.common.alloc import alloc
from contracts.src.libraries.matter_types import MatterType, get_matter_properties, can_interact

// Test get_matter_properties returns correct values for various matter types
@external
func test_matter_properties() {
    alloc_locals;

    // Earth properties
    let (p1) = get_matter_properties(MatterType.EARTH);
    assert p1.movable = 0;
    assert p1.weight = 10;
    assert p1.lifespan = 0;

    // Water properties
    let (p2) = get_matter_properties(MatterType.WATER);
    assert p2.movable = 1;
    assert p2.weight = 5;
    assert p2.lifespan = 0;

    // Fire properties
    let (p3) = get_matter_properties(MatterType.FIRE);
    assert p3.movable = 1;
    assert p3.weight = 1;
    assert p3.lifespan = 10;

    return ();
}

// Test can_interact allows water-fire and earth-water, but not others
@external
func test_can_interact() {
    alloc_locals;

    // Water and Fire can interact
    let (r1) = can_interact(MatterType.WATER, MatterType.FIRE);
    assert r1 = 1;

    // Earth and Water can interact
    let (r2) = can_interact(MatterType.EARTH, MatterType.WATER);
    assert r2 = 1;

    // Reverse order: Fire and Water should not interact by default
    let (r3) = can_interact(MatterType.FIRE, MatterType.WATER);
    assert r3 = 0;

    // Unrelated types cannot interact
    let (r4) = can_interact(MatterType.AIR, MatterType.EARTH);
    assert r4 = 0;

    return ();
}
