// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CanvasGame is Ownable {
    address[] public canvasOwner;
    //address[][] public contributor;

    mapping(address => uint256) public rewards;

    uint256 public fee = 100; // in wei

    event NewCanvas(address indexed canvasOwner, uint256 baseCanvas);
    event Paint(address indexed contributor, uint256 canvas, uint24 color);

    constructor(address initialOwner)
        Ownable(initialOwner)
    {
        uint256 newIndex = canvasOwner.length;
        canvasOwner.push(initialOwner);
        // No emit NewCanvas. Readers are just supposed to know.
    }

    function paint(uint256 canvas, uint24 color) public payable {
        require(msg.value >= fee, "Sufficient fee required to paint");
        require(canvas < canvasOwner.length, "Canvas ID must exist");

        uint256 contractOwnerReward = msg.value / 10;
        uint256 canvasOwnerReward = msg.value - contractOwnerReward;
        rewards[owner()] += contractOwnerReward;
        rewards[canvasOwner[canvas]] += canvasOwnerReward;

        emit Paint(msg.sender, canvas, color);
    }

    function fork(uint256 canvas) public {
        require(canvas < canvasOwner.length, "Canvas ID must exist");
        //require() previous paint() call
        emit NewCanvas(msg.sender, canvas);
    }
}
