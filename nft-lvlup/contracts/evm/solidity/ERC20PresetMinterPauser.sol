// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// created using https://wizard.openzeppelin.com/
contract ERC20PresetMinterPauser is ERC20, Ownable, ERC20Permit {
    constructor(address initialOwner)
        ERC20("Test ERC20", "TERC20")
        Ownable()
        // Ownable(initialOwner)
        ERC20Permit("Test ERC20")
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}