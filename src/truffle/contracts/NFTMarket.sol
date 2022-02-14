// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

import "./DauDQCoin.sol";

contract NFTMarket is
    Initializable,
    IERC721Receiver,
    Ownable
{
    using SafeMath for uint256;
	using EnumerableSet for EnumerableSet.UintSet;
	using EnumerableSet for EnumerableSet.AddressSet;

    DauDQCoin public nftItem;

    function initialize(DauDQCoin _nftItem) public initializer {
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

	modifier isListed(IERC721 nftAddress, uint256 nftID) {
		require(
			listedTokenTypes.contains(address(nftAddress)) &&
				listedTokenIDs[address(nftAddress)].contains(nftID),
			"nftID not listed"
		);
		_;
	}

	modifier isNotListed(IERC721 nftAddress, uint256 nftID) {
		require(
			!listedTokenTypes.contains(address(nftAddress)) ||
				!listedTokenIDs[address(nftAddress)].contains(nftID),
			"ntfID must not be listed"
		);
		_;
	}

	modifier isSeller(IERC721 nftAddress, uint256 nftID) {
		require(
			listings[address(nftAddress)][nftID].seller == msg.sender,
			"You are not seller"
		);
		_;
	}

	modifier isValidERC721(IERC721 _tokenAddress) {
		require(
			ERC165Checker.supportsInterface(
				address(_tokenAddress),
				_INTERFACE_ID_ERC721
			),
			"Not supported interface"
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

    function createNewListing(address from, IERC721 nftAddress, uint256 tokenID, uint256 _price) 
	public
		isValidERC721(nftAddress)
		isNotListed(nftAddress, tokenID)
	{
		// require(
		// 	nftItem.ownerOf(tokenID) == from,
		// 	"not owner"
		// );
        listings[address(nftAddress)][tokenID] = ListingItem(from, _price);
		listedTokenIDs[address(nftAddress)].add(tokenID);

		_updateListedTokenTypes(nftAddress);

		// in theory the transfer and required approval already test non-owner operations
		nftItem.safeTransferFrom(from, address(this), tokenID);
		emit NewListing(from, nftAddress, tokenID, _price);
        
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