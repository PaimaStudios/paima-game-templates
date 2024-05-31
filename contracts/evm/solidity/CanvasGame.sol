// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CanvasGame is Ownable {
    address[] public canvasOwner;
    //address[][] public contributor;

    mapping(address => uint256) public rewards;

    uint256 public fee = 100; // in wei

    event NewCanvas(address indexed canvasOwner, uint256 id, uint256 copyFrom);
    event Paint(address indexed contributor, uint256 canvas, uint24 color);

    constructor(address initialOwner)
        Ownable(initialOwner)
    {
        // Generate 16 seed canvases. If id == copyFrom, it's a seed canvas.
        for (uint256 id = 0; id < 16; ++id) {
            _newCanvas(initialOwner, id);
        }
    }

    function _newCanvas(address owner, uint256 copyFrom) private {
        uint256 id = canvasOwner.length;
        canvasOwner.push(owner);
        emit NewCanvas(owner, id, copyFrom);
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
        _newCanvas(msg.sender, canvas);
    }

    function withdraw() public {
        require(rewards[msg.sender] > 0, "Nothing to withdraw");
        uint256 amount = rewards[msg.sender];
        payable(msg.sender).transfer(amount);
        delete rewards[msg.sender];
    }
}
