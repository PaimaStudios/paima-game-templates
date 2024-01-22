// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// define the different enums to differentiate your NFT
enum NftType {
    AIR,
    EARTH,
    FIRE,
    WATER,
    ETHER
}

/// Provide an easy-to-use mapping between the enum values and their string representation
contract NftTypeMapper {
    mapping(NftType => string) internal nftTypeToString;

    constructor() {
        nftTypeToString[NftType.AIR] = "air";
        nftTypeToString[NftType.EARTH] = "earth";
        nftTypeToString[NftType.FIRE] = "fire";
        nftTypeToString[NftType.WATER] = "water";
        nftTypeToString[NftType.ETHER] = "ether";
    }

    function getNftTypeString(NftType nftType) external view returns (string memory) {
        return nftTypeToString[nftType];
    }
}