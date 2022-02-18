//step 1: You define your variables from .env file
import Web3 from "web3";
import Market from "../truffle/abis/NFTMarket.json";
import NFT from "../truffle/abis/DauDQNFT.json";
require('dotenv').config();


const API_URL = process.env.REACT_APP_API_URL;
const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEYS;
const GAS_PRICE = process.env.REACT_APP_GAS_PRICE;
const NFT_CONTRACT = process.env.REACT_APP_NFT_CONTRACT;
const MARKET_CONTRACT = process.env.REACT_APP_MARKET_CONTRACT;
// const NFT_CONTRACT = "0x5913c4b476649928B342bEf219C22F319B392F01";
// const MARKET_CONTRACT = "0xa2d6816cd8e09b1f2c370e7044e03c0ab230C790";

const web3 = new Web3(new Web3.providers.HttpProvider(API_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/'));
const marketContract = new web3.eth.Contract(Market.abi, MARKET_CONTRACT);
const nftContract = new web3.eth.Contract(NFT.abi, NFT_CONTRACT);

const GetMarketItems = async (tokenID, price) => {
    return await marketContract.methods.fetchMarketItems().call();
}

const ListNFTMarket = async () => {
    // await marketContract.methods.createNewListing(PUBLIC_KEY, NFT_CONTRACT, 1, 3000).call();
}

const NFTsByOwner = async (owner_address) => {
    return await nftContract.methods.getNFTsByOwner(owner_address).call();
}

const initialize = async (web3, marketContract) => {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

    //the transaction
    const tx = {
        'from': PUBLIC_KEY,
        'to': MARKET_CONTRACT,
        'nonce': nonce,
        "gasPrice": web3.utils.toHex(Number(GAS_PRICE) * Math.pow(10, 9)),
        "gasLimit": web3.utils.toHex(500000), // fixed gasLimit
        "value": web3.utils.toHex(0), // fixed gasLimit
        'data': marketContract.methods.initialize(NFT_CONTRACT).encodeABI()
    };

    console.log(tx)
    //step 4: Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    console.log(signedTx)
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return transactionReceipt;
}

const AddNewListing = async (tokenID, price) => {
    await nftContract.methods.isApprovedForAll(PUBLIC_KEY, MARKET_CONTRACT).call().then(console.log);

    let priceToWei = web3.utils.toWei(price.toString(), 'ether');
    // const auctionPrice = web3.utils.toWei('1', 'ether');

    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

    //the transaction
    const tx = {
        'from': PUBLIC_KEY,
        'to': MARKET_CONTRACT,
        'nonce': nonce,
        "gasPrice": web3.utils.toHex(Number(GAS_PRICE) * Math.pow(10, 9)),
        "gasLimit": web3.utils.toHex(500000), // fixed gasLimit
        "value": web3.utils.toHex(0), // fixed gasLimit
        'data': marketContract.methods.createMarketItem(NFT_CONTRACT, tokenID, priceToWei).encodeABI()
    };

    console.log(tx)
    //step 4: Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(transactionReceipt)
    return transactionReceipt;
}

const BuyNFT = async (tokenID) => {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

    //the transaction
    const tx = {
        'from': PUBLIC_KEY,
        'to': MARKET_CONTRACT,
        'nonce': nonce,
        "gasPrice": web3.utils.toHex(Number(GAS_PRICE) * Math.pow(10, 9)),
        "gasLimit": web3.utils.toHex(500000), // fixed gasLimit
        "value": web3.utils.toHex(0), // fixed gasLimit
        'data': marketContract.methods.createMarketSale(NFT_CONTRACT, tokenID).encodeABI()
    };

    console.log(tx)
    //step 4: Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(transactionReceipt)
    return transactionReceipt;
}

export {NFTsByOwner, ListNFTMarket, AddNewListing, GetMarketItems, BuyNFT}