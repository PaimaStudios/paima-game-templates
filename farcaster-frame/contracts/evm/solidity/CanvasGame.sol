// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract CanvasGame is Ownable {
    uint256 constant public fee = 0.00002651 ether; // about $0.10 USD at time of writing
    uint256 constant public paintLimit = 48;

    address[] private canvasOwner;
    mapping(uint256 canvasId => uint256 paintCount) private paintCount;
    mapping(uint256 canvasId => mapping(address user => bool hasPainted)) private painted;
    mapping(uint256 canvasId => mapping(address user => bool hasForked)) private forked;

    mapping(address => uint256) public rewards;

    event NewCanvas(address indexed canvasOwner, uint256 id, uint256 copyFrom);
    event Paint(address indexed contributor, uint256 canvas, uint24 color);

    error InsufficientFee(uint256 got, uint256 wanted);
    error CanvasDoesNotExist(uint256 requested, uint256 max);
    error CanvasFull(uint256 canvas, uint256 paintLimit);
    error InvalidFork(uint256 canvas);

    constructor(address initialOwner)
        Ownable(initialOwner)
    {
        // Generate 16 seed canvases. If id == copyFrom, it's a seed canvas.
        for (uint256 id; id < 16; ++id) {
            _newCanvas(initialOwner, id);
        }
    }

    function _newCanvas(address owner, uint256 copyFrom) private {
        uint256 id = canvasOwner.length;
        canvasOwner.push(owner);
        emit NewCanvas(owner, id, copyFrom);
    }

    function paint(uint256 canvas, uint24 color) public payable {
        if (!(msg.value >= fee)) revert InsufficientFee(msg.value, fee); // Sufficient fee required to paint
        if (!(canvas < canvasOwner.length)) revert CanvasDoesNotExist(canvas, canvasOwner.length); // Canvas ID must exist
        if (!(paintCount[canvas] < paintLimit)) revert CanvasFull(canvas, paintLimit); // Canvas must not be full

        uint256 contractOwnerReward = msg.value / 10;
        uint256 canvasOwnerReward = msg.value - contractOwnerReward;
        rewards[owner()] += contractOwnerReward;
        rewards[canvasOwner[canvas]] += canvasOwnerReward;

        painted[canvas][msg.sender] = true;
        ++paintCount[canvas];

        emit Paint(msg.sender, canvas, color);
    }

    function fork(uint256 canvas) public {
        if (!(canvas < canvasOwner.length)) revert CanvasDoesNotExist(canvas, canvasOwner.length); // Canvas ID must exist
        if (!(painted[canvas][msg.sender])) revert InvalidFork(canvas); // Must not have painted to this canvas before
        if (!(canvasOwner[canvas] != msg.sender)) revert InvalidFork(canvas); // Must not fork your own canvas
        if (!(!forked[canvas][msg.sender])) revert InvalidFork(canvas); // Must not have forked this canvas already
        forked[canvas][msg.sender] = true;
        _newCanvas(msg.sender, canvas);
    }

    function withdraw() public {
        require(rewards[msg.sender] > 0, "Nothing to withdraw");
        uint256 amount = rewards[msg.sender];
        delete rewards[msg.sender];

        // Library reverts on failure. Must be last to avoid reentrancy vulnerability.
        Address.sendValue(payable(msg.sender), amount);
    }
}
