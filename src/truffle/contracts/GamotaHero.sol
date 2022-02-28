// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract GamotaHero is ERC1155 {
    uint256 public constant THANH = 1;
    uint256 public constant TUE = 2;
    uint256 public constant KHANG = 3;
    uint256 public constant SON = 4;
    uint256 public constant DAU = 5;
    uint256 public constant CONG = 6;
    uint256 public constant ANH = 7;
    uint256 public constant UYEN = 8;
    uint256 public constant THUY = 9;
    uint256 public constant HIEP = 10;

    uint256[] hero_ids = [THANH, TUE, KHANG, DAU, SON, CONG, ANH, UYEN, THUY, HIEP];
    uint256[] hero_amount = [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000];

    constructor() public ERC1155("https://dev.cakiem.gamota.com/token_uri/{id}.json") {
        //
    }

    function mintHero() public {
        _mintBatch(msg.sender, hero_ids, hero_amount, "");
    }

    /**
     * @dev See {IERC1155-safeTransferFrom}.
     */
    function claimHero(
        address from,
        address to,
        uint256 id,
        bytes memory data
    ) public {
        safeTransferFrom(from, to, id, 1, data);
    }

    function tokenUri(uint256 tokenId) public view returns (string memory) {
        return uri(tokenId);
    }

    function isOwnerOf(address from, uint256 tokenId) public view returns (bool) {
        return balanceOf(from, tokenId) != 0;
    }
}