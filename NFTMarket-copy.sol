// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

import "./DauDQNFT.sol";

contract NFTMarket is
    Initializable,
    IERC721Receiver,
    Ownable
{
    using SafeMath for uint256;
	using EnumerableSet for EnumerableSet.UintSet;
	using EnumerableSet for EnumerableSet.AddressSet;

    DauDQNFT public nftItem;

    function initialize(DauDQNFT _nftItem) public initializer {
        nftItem = _nftItem;
    }

    struct ListingItem {
        address seller;
        uint256 price;
    }

	bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;

	EnumerableSet.AddressSet private listedTokenTypes; // store types
	EnumerableSet.AddressSet private allowedTokenTypes;

    mapping(address => mapping(uint256 => ListingItem)) private listings;
    mapping(address => EnumerableSet.UintSet) private listedTokenIDs;

    // ############
	// Events
	// ############
	event NewListing(
		address indexed seller,
		IERC721 indexed nftAddress,
		uint256 indexed nftID,
		uint256 price
	);
	event ListingPriceChange(
		address indexed seller,
		IERC721 indexed nftAddress,
		uint256 indexed nftID,
		uint256 newPrice
	);
	event CancelledListing(
		address indexed seller,
		IERC721 indexed nftAddress,
		uint256 indexed nftID
	);
	event PurchasedListing(
		address indexed buyer,
		address seller,
		IERC721 indexed nftAddress,
		uint256 indexed nftID,
		uint256 priceTax,
		uint256 price
	);

    // ############
	// Modifiers
	// ############
	modifier isNotListed(IERC721 nftAddress, uint256 nftID) {
		require(
			!listedTokenTypes.contains(address(nftAddress)) ||
				!listedTokenIDs[address(nftAddress)].contains(nftID),
			"ntfID must not be listed"
		);
		_;
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

    function createNewListing(address from, address nftContract, uint256 tokenID, uint256 _price) 
	public
		isNotListed(IERC721(nftContract), tokenID)
	{
		IERC721 nft_token = IERC721(nftContract);

        listings[address(nft_token)][tokenID] = ListingItem(from, _price);
		listedTokenIDs[address(nft_token)].add(tokenID);

		_updateListedTokenTypes(nft_token);

		// in theory the transfer and required approval already test non-owner operations
		nft_token.safeTransferFrom(msg.sender, address(this), tokenID);
		emit NewListing(from, nft_token, tokenID, _price);
    }

	function _updateListedTokenTypes(IERC721 tokenType) private {
		if (listedTokenIDs[address(tokenType)].length() > 0) {
			_registerTokenAddress(tokenType);
		} else {
			_unregisterTokenAddress(tokenType);
		}
	}

	function _registerTokenAddress(IERC721 tokenType) private {
		if (!listedTokenTypes.contains(address(tokenType))) {
			listedTokenTypes.add(address(tokenType));
		}
	}

	function _unregisterTokenAddress(IERC721 tokenType) private {
		listedTokenTypes.remove(address(tokenType));
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