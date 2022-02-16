//step 1: You define your variables from .env file
import Web3 from "web3";
import Market from "../truffle/abis/NFTMarket.json";
import nft from "../truffle/abis/DauDQCoin.json";
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
// const nftContract = new web3.eth.Contract(nft.abi, NFT_CONTRACT);

const setApprovalForAll = async () => {
    // await nftContract.methods.setApprovalForAll(MARKET_CONTRACT, true);
}

const ListNFTMarket = async () => {
    await marketContract.methods.createNewListing(PUBLIC_KEY, NFT_CONTRACT, 1, 3000).call();
}

const NFTsByOwner = async (owner_address) => {
    let your_list_nft = [];
    
    const listing = await marketContract.methods.getTokenIDsByOwner(owner_address).call();
    if (listing.length > 0) {
    }
    listing.forEach(async (element) => {
        let tokenUri = await marketContract.methods.getTokenUriByID(element).call();
        your_list_nft.push({"tokenID": element, "tokenUri": tokenUri});
        console.log(tokenUri);
    });
    return your_list_nft;
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

export {NFTsByOwner, ListNFTMarket, setApprovalForAll}