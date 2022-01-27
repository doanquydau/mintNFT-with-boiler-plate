//step 1: You define your variables from .env file
import Web3 from "web3";
import Contract from "../truffle/abis/DauDQCoin.json";
require('dotenv').config();

const API_URL = process.env.REACT_APP_API_URL;
const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEYS;
const GAS_PRICE = process.env.REACT_APP_GAS_PRICE;
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

const web3 = new Web3(new Web3.providers.HttpProvider(API_URL || 'https://data-seed-prebsc-1-s1.binance.org:8545/'));

export const MintNFT = async (tokenURI) => {

    //step 2: Define our contract ABI (Application Binary Interface) & adresses
    const nftContract = new web3.eth.Contract(Contract.abi, CONTRACT_ADDRESS);

    //step 3: Define the minting function
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); //get latest nonce

    //the transaction
    const tx = {
        'from': PUBLIC_KEY,
        'to': CONTRACT_ADDRESS,
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