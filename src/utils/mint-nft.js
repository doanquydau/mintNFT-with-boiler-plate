//step 1: You define your variables from .env file
import Web3 from "web3";
import Contract from "../truffle/abis/DaudqCoin.json";

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");

require('dotenv').config();
const API_URL = process.env.REACT_APP_API_URL;
const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEYS;
const GAS_PRICE = process.env.REACT_APP_GAS_PRICE;

// const web3 = createAlchemyWeb3(API_URL);
const web3 = new Web3(new Web3.providers.HttpProvider(API_URL));

export const MintNFT = async (tokenURI) => {

    //step 2: Define our contract ABI (Application Binary Interface) & adresses
    const contractAddress = "0xbC523fb661D91E2b8616750313A81608169dD136"; // BSC-contract
    // const contractAddress = "0xef23b01628c9a8fe226f2eccec5961147934e12c"; // BSC-contract
    // const contractAddress = "0xb37841a9ea492f940b45771dd9740dfe0e7aacdd"; // Ethers-contract
    const nftContract = new web3.eth.Contract(Contract.abi, contractAddress);

    console.log(nftContract.methods)
    //step 3: Define the minting function
    // async function mint(tokenURI) {
    // }
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

    //the transaction
    const tx = {
        'from': PUBLIC_KEY,
        'to': contractAddress,
        'nonce': nonce,
        "gasPrice": web3.utils.toHex(Number(GAS_PRICE) * Math.pow(10, 9)),
        "gasLimit": web3.utils.toHex(500000), // fixed gasLimit
        "value": web3.utils.toHex(0), // fixed gasLimit
        'data': nftContract.methods.mintItem(PUBLIC_KEY, tokenURI).encodeABI()
    };

    console.log(tx)
    //step 4: Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    console.log(signedTx)
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    
    console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
    return transactionReceipt;
}