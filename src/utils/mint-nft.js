require('dotenv').config();

const MAIN_ADDRESS = process.env.REACT_APP_MAIN_ADDRESS;
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEYS;
const GAS_PRICE = process.env.REACT_APP_GAS_PRICE;
const NFT_CONTRACT = process.env.REACT_APP_NFT_CONTRACT;

// const { ethereum } = window;

const MintNFT = async (nftContract, web3, tokenURI) => {
    //step 3: Define the minting function
    const nonce = await web3.eth.getTransactionCount(MAIN_ADDRESS, 'latest'); //get latest nonce

    //the transaction
    const tx = {
        'from': MAIN_ADDRESS,
        'to': NFT_CONTRACT,
        'nonce': nonce,
        "gasPrice": web3.utils.toHex(Number(GAS_PRICE) * Math.pow(10, 9)),
        "gasLimit": web3.utils.toHex(500000), // fixed gasLimit
        "value": web3.utils.toHex(0), // fixed gasLimit
        'data': nftContract.methods.mintItem(MAIN_ADDRESS, tokenURI).encodeABI()
    };

    console.log(tx)
    //step 4: Sign the transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    console.log(signedTx)
    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    
    console.log(`Transaction receipt: ${JSON.stringify(transactionReceipt)}`);
    return transactionReceipt;
}

const getTokenUri = async (nftContract, tokenID) => {
    return await nftContract.methods.tokenURI(tokenID).call();
}

export {MintNFT, getTokenUri}