require('dotenv').config();

const { ethereum } = window;

const NFT_CONTRACT = process.env.REACT_APP_NFT_CONTRACT;
const MARKET_CONTRACT = process.env.REACT_APP_MARKET_CONTRACT;
const GAS_PRICE = process.env.REACT_APP_GAS_PRICE;

const GetMarketItems = async (marketContract) => {
    return await marketContract.methods.fetchMarketItems().call();
}

const YourNFTsListing = async (marketContract) => {
    return await marketContract.methods.fetchMyNFTsListingOnMarket().call();
}

const AddNewListing = async (marketContract, web3, tokenId, price) => {
    let priceToWei = web3.utils.toWei(price.toString(), 'ether');
    if (tokenId > 0 ) {
        const tx = {
            'from': ethereum.selectedAddress,
            'to': MARKET_CONTRACT,
            "gasPrice": web3.utils.toHex(Number(GAS_PRICE) * Math.pow(10, 9)),
            "gasLimit": web3.utils.toHex(500000), // fixed gasLimit
            "value": web3.utils.toHex(0), // fixed gasLimit
            'data': marketContract.methods.addListing(NFT_CONTRACT, tokenId, priceToWei).encodeABI(),
        };
        return await confirmMetamask(tx);
    } else {
        alert('Token ID invalid');
        return false;
    }
}

const UpdateListing = async (marketContract, web3, tokenId, price) => {
    let priceToWei = web3.utils.toWei(price.toString(), 'ether');
    if (tokenId > 0 ) {
        const tx = {
            'from': ethereum.selectedAddress,
            'to': MARKET_CONTRACT,
            "value": web3.utils.toHex(0), // fixed gasLimit
            'data': marketContract.methods.updateListing(tokenId, priceToWei).encodeABI(),
        };
        return await confirmMetamask(tx);
    } else {
        alert('Token ID invalid');
        return false;
    }
}

const CancelListing = async (marketContract, web3, tokenId) => {
    if (tokenId > 0 ) {
        const tx = {
            'from': ethereum.selectedAddress,
            'to': MARKET_CONTRACT,
            "value": web3.utils.toHex(0), // fixed gasLimit
            'data': marketContract.methods.cancelListing(NFT_CONTRACT, tokenId).encodeABI(),
        };
        return await confirmMetamask(tx);
    } else {
        alert('Token ID invalid');
        return false;
    }
}

const BuyNFT = async (marketContract, web3, tokenId, price) => {
    console.log(price.toString())
    if (tokenId > 0 ) {
        const tx = {
            from: ethereum.selectedAddress,
            to: MARKET_CONTRACT,
            value: web3.utils.toHex(price.toString()),
            data: marketContract.methods.buyItem(NFT_CONTRACT, tokenId).encodeABI(),
        };
        return await confirmMetamask(tx);
    } else {
        alert('Token ID invalid');
        return false;
    }
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

export {AddNewListing, GetMarketItems, BuyNFT, YourNFTsListing, UpdateListing, CancelListing}