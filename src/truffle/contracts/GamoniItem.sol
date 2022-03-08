// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GamotaItem is ERC1155, Ownable {
	using Counters for Counters.Counter;
	Counters.Counter private _countItem;

    uint256 private constant PREMIUM_CARD = 1;

	struct Items {
		string name;
		uint256 item_id;
		uint256 amount;
		string status;
	}

	mapping(uint256 => Items) private ListItems;

    constructor(address marketContract) public ERC1155("https://dev.cakiem.gamota.com/token_uri/{id}.json") {
        _countItem.increment();
		uint currentItemId = _countItem.current();
		uint256 amount = 10000;

		ListItems[currentItemId] = Items(
			'PREMIUM_CARD',
			PREMIUM_CARD,
			amount,
			'active'
		);
		_mint(msg.sender, PREMIUM_CARD, amount, "");
		setApprovalForAll(marketContract, true);
    }

	function getListItem() public view returns(Items[] memory) 
	{
		uint currentItemId = _countItem.current();
		uint currentIndex = 0;
		Items[] memory items = new Items[](currentItemId);

		for (uint i = 0; i < currentItemId; i++) {
			items[currentIndex] = ListItems[i+1];
		}
		return  items;
	}

    function mintItem(string memory item_name, uint256 item_id, uint256 amount) public {
		uint currentItemId = _countItem.current();
        _mint(msg.sender, item_id, amount, "");
    }

	function setUri(string memory uri_) public returns (bool)
	{
		_setURI(uri_);
	}

    function getUri(uint256 tokenId) public view returns (string memory) {
        return uri(tokenId);
    }	
}
