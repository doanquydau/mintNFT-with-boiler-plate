// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./DauDQCoin.sol";

contract NFTMarket is
    Initializable,
    IERC721Receiver,
    Ownable
{
    using SafeMath for uint256;

    DauDQCoin public nftItem;

    function initialize(DauDQCoin _nftItem) public initializer {
        nftItem = _nftItem;
    }

    
    // ############
    // Views
    // ############
    
	function getTokenIDsByOwner(address owner_addr)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory tokenIDs = nftItem.getNFTsByOwner(owner_addr);
        return (tokenIDs);
    }

	function getTokenUriByID(uint256 tokenID)
        public
        view
        returns (string memory)
    {
        string memory tokenUri = nftItem.tokenURI(tokenID);
        return (tokenUri);
    }

    function onERC721Received(
		address, /* operator */
		address, /* from */
		uint256 _id,
		bytes calldata /* data */
	) external view override returns (bytes4) {
		return IERC721Receiver.onERC721Received.selector;
	}
}