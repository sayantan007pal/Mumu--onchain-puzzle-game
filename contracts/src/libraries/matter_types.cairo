// SPDX-License-Identifier: MIT
%lang starknet

// Matter type definitions
namespace MatterType {
    const VOID = 0;
    const EARTH = 1;
    const WATER = 2;
    const FIRE = 3;
    const AIR = 4;
    const STEAM = 5;
    const PLANT = 6;
    const ICE = 7;
    const LAVA = 8;
    const METAL = 9;
    // Add more matter types as needed
}

// Matter properties
struct MatterProperties {
    movable: felt,
    weight: felt,
    lifespan: felt,
}

// Get properties for a matter type
func get_matter_properties(matter_type: felt) -> (properties: MatterProperties) {
    if (matter_type == MatterType.VOID) {
        return (MatterProperties(movable=0, weight=0, lifespan=0),);
    }
    
    if (matter_type == MatterType.EARTH) {
        return (MatterProperties(movable=0, weight=10, lifespan=0),);
    }
    
    if (matter_type == MatterType.WATER) {
        return (MatterProperties(movable=1, weight=5, lifespan=0),);
    }
    
    if (matter_type == MatterType.FIRE) {
        return (MatterProperties(movable=1, weight=1, lifespan=10),);
    }
    
    if (matter_type == MatterType.AIR) {
        return (MatterProperties(movable=1, weight=1, lifespan=0),);
    }
    
    if (matter_type == MatterType.STEAM) {
        return (MatterProperties(movable=1, weight=1, lifespan=5),);
    }
    
    if (matter_type == MatterType.PLANT) {
        return (MatterProperties(movable=0, weight=6, lifespan=0),);
    }
    
    if (matter_type == MatterType.ICE) {
        return (MatterProperties(movable=1, weight=7, lifespan=0),);
    }
    
    if (matter_type == MatterType.LAVA) {
        return (MatterProperties(movable=1, weight=8, lifespan=15),);
    }
    
    if (matter_type == MatterType.METAL) {
        return (MatterProperties(movable=0, weight=12, lifespan=0),);
    }
    
    // Default for unknown types
    return (MatterProperties(movable=0, weight=0, lifespan=0),);
}

// Check if two matter types can interact
func can_interact(type1: felt, type2: felt) -> (can_interact: felt) {
    // Define interaction rules
    if (type1 == MatterType.WATER && type2 == MatterType.FIRE) {
        return (1,); // Can interact
    }
    
    if (type1 == MatterType.EARTH && type2 == MatterType.WATER) {
        return (1,); // Can interact
    }
    
    // Add more interaction rules as needed
    
    return (0,); // Cannot interact by default
}