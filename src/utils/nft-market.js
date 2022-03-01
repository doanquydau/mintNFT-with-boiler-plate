require('dotenv').config();

const { ethereum } = window;

const NFT_CONTRACT = process.env.REACT_APP_NFT_CONTRACT;
const MARKET_CONTRACT = process.env.REACT_APP_MARKET_CONTRACT;
const GAS_PRICE = process.env.REACT_APP_GAS_PRICE;

const GetMarketItems = async (marketContract) => {
    return await marketContract.methods.fetchMarketItems().call();
}

const NFTsByOwner = async (nftContract, owner_address) => {
    return await nftContract.methods.getNFTsByOwner(owner_address).call();
}

const AddNewListing = async (marketContract, web3, tokenID, price) => {
    let priceToWei = web3.utils.toWei(price.toString(), 'ether');

    const tx = {
        'from': ethereum.selectedAddress,
        'to': MARKET_CONTRACT,
        "gasPrice": web3.utils.toHex(Number(GAS_PRICE) * Math.pow(10, 9)),
        "gasLimit": web3.utils.toHex(500000), // fixed gasLimit
        "value": web3.utils.toHex(0), // fixed gasLimit
        'data': marketContract.methods.addListing(NFT_CONTRACT, tokenID, priceToWei).encodeABI(),
        chainId: '0x3'
    };
    return await confirmMetamask(tx);
}

const BuyNFT = async (marketContract, web3, itemID, price) => {
    console.log(price.toString())
    const tx = {
        from: ethereum.selectedAddress,
        to: MARKET_CONTRACT,
        value: web3.utils.toHex(price.toString()),
        data: marketContract.methods.transferItem(NFT_CONTRACT, itemID).encodeABI(),
        chainId: '0x3'
    };
    return await confirmMetamask(tx);
}

const confirmMetamask = async (tx) => {
    console.log(tx)
    const transactionReceipt = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
            tx
        ]
    }).then(console.log);

    return transactionReceipt;
}

export {NFTsByOwner, AddNewListing, GetMarketItems, BuyNFT}