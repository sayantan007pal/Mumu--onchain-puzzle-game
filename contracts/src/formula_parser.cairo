%lang starknet
# SPDX-License-Identifier: MIT
from matter_types import EARTH, WATER, FIRE, PLANT, VOID

# A formula is a simple rule: if (input == A) then output = B
struct Formula:
    member input: felt
    member output: felt
end

# Create a formula
func create_formula(input: felt, output: felt) -> (formula: Formula):
    let formula = Formula(input=input, output=output)
    return (formula,)
end
