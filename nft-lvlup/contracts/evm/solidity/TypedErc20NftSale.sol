// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@paima/evm-contracts/contracts/Erc20NftSale.sol";
import "./NftTypeMapper.sol";

/// extend the base erc20 NFT sale contract to provide a type-safe function
contract TypedErc20NftSale is Erc20NftSale {
    NftTypeMapper public typeMapper;

    function initialize(
        ERC20[] memory currencies,
        address owner,
        address nft,
        uint256 price
    ) public override {
        require(!initialized, "Contract already initialized");
        // initialize state here first since parent constructor emits event
        typeMapper = new NftTypeMapper();
        super.initialize(currencies, owner, nft, price);
    }

    function buyNftType(ERC20 tokenAddress, address receiverAddress, NftType nftType) public payable returns (uint256) {
        return super.buyWithToken(tokenAddress, receiverAddress, typeMapper.getNftTypeString(nftType));
    }
}