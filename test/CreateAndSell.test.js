require('dotenv').config();
// const { ethereum } = window;
const NFTMarket = artifacts.require("NFTMarket");
const DauDQNFT = artifacts.require("DauDQNFT");
const MAIN_ADDRESS = process.env.REACT_APP_MAIN_ADDRESS;

contract("DauDQNFT and NFTMarket", async accounts => {
    const account_one = accounts[0];
    const account_two = accounts[1];

    let marketInstance;
    let nftInstance;

    let tokenIds  = [1,2];

    before(async() => {
        await NFTMarket.deployed().then((instance) => {
            marketInstance = instance;
            DauDQNFT.deployed(marketInstance.address).then( async (nft_instance) => {
                nftInstance = nft_instance;
            });
        });
    });

    it("Create 2 nft tokens", async function() {

        await nftInstance.mintItem(account_one, 'https://ipfs.infura.io/ipfs/QmYe5PvUc7sieCTUv3dGV1fkxvun7bZD8U7WdwgFvHSP1K');
        await nftInstance.mintItem(account_one, 'https://ipfs.infura.io/ipfs/QmYe5PvUc7sieCTUv3dGV1fkxvun7bZD8U7WdwgFvHSP1K');

        let getNFTsByOwner = await nftInstance.getNFTsByOwner(account_one);
        tokenIds = getNFTsByOwner;

        assert.equal(
            getNFTsByOwner,
            tokenIds,
            "AN error occur when mint nft"
        )
    });

    it("Sell a nft to market", async function() {
        let getNFTsByOwner = await nftInstance.getNFTsByOwner(account_one);
        await marketInstance.addListing(nftInstance.address, getNFTsByOwner[1], '1000000');

        let getNftsOnMarket = await marketInstance.fetchMarketItems();
        
        console.log(getNftsOnMarket);
        assert.equal(
            getNftsOnMarket[0].tokenId,
            getNFTsByOwner[1],
            "Can not sell nft"
        )
    });

    it("Buy a nft from market", async function() {
        let getNftsOnMarket = await marketInstance.fetchMarketItems();

        await marketInstance.buyItem(nftInstance.address, getNftsOnMarket[0].tokenId, {from:account_two, value: web3.utils.toHex('1000000')});

        let getNFTsBybuyer = await nftInstance.getNFTsByOwner(account_two);
        console.log(getNFTsBybuyer[0].toNumber())
        assert.equal(
            getNFTsBybuyer[0].toNumber(),
            tokenIds[1],
            "Can not buy nft"
        )
    });

    it("Re-Sell a nft to market from account 2", async function() {
        let getNFTsBybuyer = await nftInstance.getNFTsByOwner(account_two);

        await marketInstance.addListing(nftInstance.address, getNFTsBybuyer[0].toNumber(), '1000000', {from:account_two});

        let getNftsOnMarket = await marketInstance.fetchMarketItems();
        
        console.log(getNftsOnMarket);
        assert.equal(
            getNftsOnMarket[0].tokenId,
            getNFTsBybuyer[0].toNumber(),
            "Can not re-sell nft"
        )
    });

    it("Update price a nft on market from account 2", async function() {
        let price_update = '2000000';
        let getNftsOnMarket = await marketInstance.fetchMarketItems();
        console.log("Before: ", getNftsOnMarket);
        console.log(getNftsOnMarket[0]);
        await marketInstance.updateListing(getNftsOnMarket[0].tokenId, (price_update), {from:account_two});

        let after_getNftsOnMarket = await marketInstance.fetchMarketItems();
        
        console.log("After", after_getNftsOnMarket);
        assert.equal(
            after_getNftsOnMarket[0].price,
            price_update,
            "Can not update price nft"
        )
    });

    it("Cancel listing a nft on market from account 2", async function() {
        let getNftsOnMarket = await marketInstance.fetchMarketItems();
        console.log("Before: ", getNftsOnMarket);
        console.log(getNftsOnMarket[0]);
        await marketInstance.cancelListing(nftInstance.address, getNftsOnMarket[0].tokenId, {from:account_two});

        let after_getNftsOnMarket = await marketInstance.fetchMarketItems();
        console.log("After", after_getNftsOnMarket);

        let getNFTsBybuyer = await nftInstance.getNFTsByOwner(account_two);
        console.log(getNFTsBybuyer[0].toNumber());

        assert.equal(
            getNFTsBybuyer[0].toNumber(),
            tokenIds[1],
            "Can not cancel listing"
        )
    });
});