//step 1: You define your variables from .env file
import Web3 from "web3";
import Market from "../truffle/abis/NFTMarket.json";
import NFT from "../truffle/abis/DauDQNFT.json";
require('dotenv').config();

const { ethereum } = window;
const web3 = new Web3(ethereum);

const NFT_CONTRACT = process.env.REACT_APP_NFT_CONTRACT;
const MARKET_CONTRACT = process.env.REACT_APP_MARKET_CONTRACT;

const marketContract = new web3.eth.Contract(Market.abi, MARKET_CONTRACT);
const nftContract = new web3.eth.Contract(NFT.abi, NFT_CONTRACT);

const GetMarketItems = async (tokenID, price) => {
    return await marketContract.methods.fetchMarketItems().call();
}

const NFTsByOwner = async (owner_address) => {
    return await nftContract.methods.getNFTsByOwner(owner_address).call();
}

const AddNewListing = async (tokenID, price) => {
    // await nftContract.methods.isApprovedForAll(PUBLIC_KEY, MARKET_CONTRACT).call().then(console.log);

    let priceToWei = web3.utils.toWei(price.toString(), 'ether');

    const tx = {
        'from': ethereum.selectedAddress,
        'to': MARKET_CONTRACT,
        "value": web3.utils.toHex(0), // fixed gasLimit
        'data': marketContract.methods.addListing(NFT_CONTRACT, tokenID, priceToWei).encodeABI(),
        chainId: '0x3'
    };
    return await confirmMetamask(tx);
}

const BuyNFT = async (itemID, price) => {
    const tx = {
        'from': ethereum.selectedAddress,
        'to': MARKET_CONTRACT,
        "value": web3.utils.toHex(price.toString()), // fixed gasLimit 
        'data': marketContract.methods.transferItem(NFT_CONTRACT, itemID).encodeABI(),
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