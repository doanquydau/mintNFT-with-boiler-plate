// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract DauDQCoin is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

    Counters.Counter private _tokenIds;

    mapping(address => EnumerableSet.UintSet) private ListNFTIDs;

    constructor() ERC721("DauDQ Coin", "DQDC") {}

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function mintItem(address player, address contractAddress, string memory uri)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        _setTokenURI(newItemId, uri);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
    
    function getNFTsByOwner(address owner_add) 
        public 
        view 
        returns (uint256[] memory) 
    {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 1; i <= totalItemCount; i++) {
            if (_exists(i) && ownerOf(i) == owner_add) {
                itemCount += 1;
            }
        }

        uint256[] memory tokenIDs = new uint256[](itemCount);
        for (uint i = 1; i <= totalItemCount; i++) {
            if (_exists(i) && ownerOf(i) == owner_add) {
                tokenIDs[currentIndex] = i;
                currentIndex += 1;
            }
        }
    
        return tokenIDs;
    }
}