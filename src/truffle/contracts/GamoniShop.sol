// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GamoniShop is
	ReentrancyGuard, Ownable
{
    using Counters for Counters.Counter;
	Counters.Counter private _itemIds;

	uint256 priceTax = 0;

	constructor() {
		//
	}

	struct MarketItem {
		address nftContract;
		uint256 tokenId;
		address payable seller;
		address payable owner;
		uint256 price;
		bool sold;
	}

	/* Array of items that listing on market */
	mapping(uint256 => MarketItem) private marketItems;

	/* Sequence array of token IDs */
	mapping(uint256 => uint256) private marketTokenIDs;

	event NewListingEvent (
		address indexed nftContract,
		uint256 indexed tokenId,
		address seller,
		address owner,
		uint256 price,
		bool sold
	);

	event UpdateListingEvent (
		uint256 indexed tokenId,
		uint256 price
	);

	event PurchasedListingEvent (
		address indexed nftContract,
		uint256 indexed tokenID,
		address indexed buyer,
		address seller,
		uint256 price,
		uint256 priceTax
	);

	event CancelListingEvent (
		address indexed nftContract,
		uint256 indexed tokenID,
		address indexed owner,
		address seller
	);

	/* Places an item for sale on the marketplace */
	function addListing(
		address nftContract,
		uint256 tokenId,
		uint256 amount,
		uint256 price
	) public payable nonReentrant {
		require(price > 0, "Price must be at least 1 wei");

		addMarketTokenIDs(tokenId);
	
		marketItems[tokenId] =  MarketItem(
			nftContract,
			tokenId,
			payable(msg.sender),
			payable(address(this)),
			price,
			false
		);

		IERC1155(nftContract).safeTransferFrom(msg.sender, address(this), tokenId, amount, "");

		emit NewListingEvent(
			nftContract,
			tokenId,
			msg.sender,
			address(this),
			price,
			false
		);
	}

	function updateListing(uint256 tokenId, uint256 price) public payable {
		require(marketItems[tokenId].seller == msg.sender, "Only item seller can perform this operation");
		require(marketItems[tokenId].sold == false, "Item sold. Can not update listing!");

		marketItems[tokenId].price = price;

		emit UpdateListingEvent(
			tokenId,
			price
		);
    }

	function cancelListing(address nftContract, uint256 tokenId, uint256 amount) public payable {
		require(marketItems[tokenId].seller == msg.sender, "Only item seller can perform this operation");
		require(marketItems[tokenId].sold == false, "Item sold. Can not cancel listing!");

		IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, amount, "");
		removeMarketTokenIDs(tokenId);

		emit CancelListingEvent(
			nftContract,
			tokenId,
			msg.sender,
			address(this)
		);
    }

	/* Transfers ownership of the item, as well as funds between parties */
	function buyItem(
		address nftContract,
		uint256 tokenId,
		uint256 amount
	) public payable nonReentrant {
		uint price = marketItems[tokenId].price;
		require(msg.value >= price, "Please submit the asking price in order to complete the purchase");

		payable(marketItems[tokenId].seller).transfer(msg.value);
		IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, amount, "");

		removeMarketTokenIDs(tokenId);
		
		emit PurchasedListingEvent(nftContract, tokenId, msg.sender, marketItems[tokenId].seller, price, priceTax);
	}

	/* Returns all unsold market items */
	function fetchMarketItems() public view returns (MarketItem[] memory) {
		uint totalItemCount = _itemIds.current();
		uint currentIndex = 0;
		uint tokenId = 0;	

		MarketItem[] memory items = new MarketItem[](totalItemCount);
		for (uint i = 1; i <= totalItemCount; i++) {
			tokenId = marketTokenIDs[i];
			if (marketItems[tokenId].owner == address(this)) {
				MarketItem storage currentItem = marketItems[tokenId];
				items[currentIndex] = currentItem;
				currentIndex += 1;
			}
		}
		return items;
	}

	function fetchMyNFTsListingOnMarket() public view returns (MarketItem[] memory) {
		uint totalItemCount = _itemIds.current();
		uint itemCount = 0;
		uint currentIndexItem = 0;
		uint tokenId = 0;

		for (uint i = 1; i <= totalItemCount; i++) {
			tokenId = marketTokenIDs[i];
			if (marketItems[tokenId].seller == msg.sender) {
				itemCount += 1;
			}
		}

		MarketItem[] memory items = new MarketItem[](itemCount);
		for (uint i = 0; i <= totalItemCount; i++) {
			tokenId = marketTokenIDs[i + 1];
			if (marketItems[tokenId].seller == msg.sender) {
				MarketItem storage currentItem = marketItems[tokenId];
				items[currentIndexItem] = currentItem;
				currentIndexItem += 1;
			}
		}
		return items;
	}

	function addMarketTokenIDs(uint tokenId) private {
		_itemIds.increment();
		uint currentItemId = _itemIds.current();
		marketTokenIDs[currentItemId] = tokenId;
	}

	function removeMarketTokenIDs(uint tokenId) private {
		uint totalItemCount = _itemIds.current();

		for (uint i = 1; i < totalItemCount; i++) {
			if (marketTokenIDs[i] == tokenId) {
				reorganizeMarketTokenIds(i, totalItemCount);
				break;
			}
		}

		delete marketItems[tokenId];

		if (_itemIds.current() > 0) {
			_itemIds.decrement();
		}
	}

	function reorganizeMarketTokenIds (uint index, uint totalItemCount) private {
		if (index > totalItemCount) return;

		if (index < totalItemCount) {
			for (uint i = index; i <= totalItemCount - 1; i++){
				marketTokenIDs[i] = marketTokenIDs[i+1];
			}
		}
        delete marketTokenIDs[totalItemCount];
	}

    function onERC1155Received(address, address, uint256, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }

	// function onERC1155Received(
    //     address operator,
    //     address from,
    //     uint256 id,
    //     uint256 value,
    //     bytes calldata data
    // ) external override returns (bytes4) {
    //     return
    //         bytes4(
    //             keccak256(
    //                 "onERC1155Received(address,address,uint256,uint256,bytes)"
    //             )
    //         );
    // }

    // function onERC1155BatchReceived(
    //     address operator,
    //     address from,
    //     uint256[] calldata ids,
    //     uint256[] calldata values,
    //     bytes calldata data
    // ) external override returns (bytes4) {
    //     return
    //         bytes4(
    //             keccak256(
    //                 "onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"
    //             )
    //         );
    // }
}