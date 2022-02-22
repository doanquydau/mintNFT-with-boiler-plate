// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./DauDQNFT.sol";

contract NFTMarket is
	ReentrancyGuard
{
    using Counters for Counters.Counter;
	Counters.Counter private _itemIds;

	address payable owner;

	constructor() {
		owner = payable(msg.sender);
	}

	struct MarketItem {
		uint itemId;
		address nftContract;
		uint256 tokenId;
		address payable seller;
		address payable owner;
		uint256 price;
		bool sold;
	}

	mapping(uint256 => MarketItem) private idToMarketItem;

	event newListing (
		uint indexed itemId,
		address indexed nftContract,
		uint256 indexed tokenId,
		address seller,
		address owner,
		uint256 price,
		bool sold
	);

	event PurchasedListing(
		address indexed nftContract,
		uint256 indexed tokenID,
		address indexed buyer,
		address seller,
		uint256 price,
		uint256 priceTax
	);

	
	/* Places an item for sale on the marketplace */
	function addListing(
		address nftContract,
		uint256 tokenId,
		uint256 price
	) public payable nonReentrant {
		require(price > 0, "Price must be at least 1 wei");

		_itemIds.increment();
		uint256 itemId = _itemIds.current();
	
		idToMarketItem[itemId] =  MarketItem(
			itemId,
			nftContract,
			tokenId,
			payable(msg.sender),
			payable(address(this)),
			price,
			false
		);

		ERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

		emit newListing(
			itemId,
			nftContract,
			tokenId,
			msg.sender,
			address(this),
			price,
			false
		);
	}

	/* Creates the sale of a marketplace item */
	/* Transfers ownership of the item, as well as funds between parties */
	function transferItem(
		address nftContract,
		uint256 itemId
	) public payable nonReentrant {
		uint price = idToMarketItem[itemId].price;
		require(msg.value >= price, "Please submit the asking price in order to complete the purchase");

		uint256 tokenId = idToMarketItem[itemId].tokenId;
		uint256 taxAmount = 0;

		payable(idToMarketItem[itemId].seller).transfer(msg.value);

		ERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
		// ERC721(nftContract).approve(msg.sender, tokenId);
		remove(itemId);
		
		emit PurchasedListing(nftContract, tokenId, msg.sender, idToMarketItem[itemId].seller, price, taxAmount);
	}

	/* Returns all unsold market items */
	function fetchMarketItems() public view returns (MarketItem[] memory) {
		uint itemCount = _itemIds.current();
		uint unsoldItemCount = _itemIds.current();
		uint currentIndex = 0;

		MarketItem[] memory items = new MarketItem[](unsoldItemCount);
		for (uint i = 0; i < itemCount; i++) {
			if (idToMarketItem[i + 1].owner == address(this)) {
				uint currentId =  i + 1;
				MarketItem storage currentItem = idToMarketItem[currentId];
				items[currentIndex] = currentItem;
				currentIndex += 1;
			}
		}
		return items;
	}

	/* Returns only items that a user has purchased */
	function fetchMyNFTs() public view returns (MarketItem[] memory) {
		uint totalItemCount = _itemIds.current();
		uint itemCount = 0;
		uint currentIndex = 0;

		for (uint i = 0; i < totalItemCount; i++) {
			if (idToMarketItem[i + 1].owner == msg.sender) {
				itemCount += 1;
			}
		}

		MarketItem[] memory items = new MarketItem[](itemCount);
		for (uint i = 0; i < totalItemCount; i++) {
			if (idToMarketItem[i + 1].owner == msg.sender) {
				uint currentId =  i + 1;
				MarketItem storage currentItem = idToMarketItem[currentId];
				items[currentIndex] = currentItem;
				currentIndex += 1;
			}
		}
		return items;
	}

	/* Returns only items a user has created */
	function fetchItemsCreated() public view returns (MarketItem[] memory) {
		uint totalItemCount = _itemIds.current();
		uint itemCount = 0;
		uint currentIndex = 0;

		for (uint i = 0; i < totalItemCount; i++) {
			if (idToMarketItem[i + 1].seller == msg.sender) {
				itemCount += 1;
			}
		}

		MarketItem[] memory items = new MarketItem[](itemCount);
		for (uint i = 0; i < totalItemCount; i++) {
			if (idToMarketItem[i + 1].seller == msg.sender) {
				uint currentId = i + 1;
				MarketItem storage currentItem = idToMarketItem[currentId];
				items[currentIndex] = currentItem;
				currentIndex += 1;
			}
		}
		return items;
	}

	function remove(uint index) public {
		delete idToMarketItem[index];
		_itemIds.decrement();

		// uint countItem = _itemIds.current();
        // if (index >= countItem) return;

        // for (uint i = index; i < countItem - 1; i++){
        //     idToMarketItem[i] = idToMarketItem[i+1];
        // }
        // delete idToMarketItem[countItem-1];

		// _itemIds.decrement();
    }
}