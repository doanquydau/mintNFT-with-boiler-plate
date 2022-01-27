/* eslint-disable */
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import Contract from "../truffle/abis/DaudqCoin.json";
import style from "../assets/css/main.css";
import { ethers } from 'ethers';
import { uploadFileToIPFS } from '../utils/ipfs.js'
import { MintNFT } from '../utils/mint-nft.js'
require('dotenv').config();
const API_URL = process.env.REACT_APP_API_URL;

const loadContract = async () => {
  try {
    //THIS ALLOWS YOU TALK TO BLOCKCHAIN
    const web3Modal = new Web3Modal({
      network: "rinkeby", // optional
      cacheProvider: true, // optional
      providerOptions: {}, // required
    });
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const netId = await web3.eth.net.getId();
    //THIS WILL LOAD YOUR CONTRACT FROM BLOCKCHAIN
    console.log(Contract.abi)
    console.log(netId)
    const contract = new web3.eth.Contract(
      Contract.abi,
      // Contract.networks[netId].address
      Contract.networks[5777].address,
      {
        from: '0x1234567890123456789012345678901234567891', // default from address
        gasPrice: '20000000000', // default gas price in wei, 20 gwei in this case
        gas: '50000000'
      }
    );

    // GET THE AMOUNT OF NFTs MINTED
    const totalSupply = await contract.methods.totalSupply().call();
    console.log(`totalSupply ${totalSupply}`);

    
    //UNCOMMENT THIS BLOCK ONCE YOU HAVE MINTED AN NFT

        // THE TOKEN ID YOU WANT TO QUERY
        const tokenID = 1;

        // GET THE TOKEN URI
        // THE URI IS THE LINK TO WHERE YOUR JSON DATA LIVES
        const uri = await contract.methods.tokenURI(tokenID).call();
        console.log(uri);

        // GET THE OWNER OF A SPECIFIC TOKEN
        const owner = await contract.methods.ownerOf(tokenID).call();
        console.log(owner);

        // CHECK IF A SPECIFIC TOKEN IS SOLD
        const sold = await contract.methods.sold(tokenID).call();
        console.log(sold);
        
        // GET PRICE OF A SPECIFIC TOKEN
        const price = await contract.methods.price(tokenID).call();
        console.log(price);
    
  } catch (e) {
    console.log("error = ", e);
  }
};


const Home = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [metadataNFT, setMetadataNFT] = useState({});

  useEffect(async () => {
    // loadContract();

    const { ethereum } = window;
    if (!ethereum) {
      alert('Please install Metamask')
      return;
    }

    const accounts = await ethereum.request({method: 'eth_accounts'})
    console.log(accounts);

    if (accounts.length > 0) {
      setCurrentAccount(accounts[0])
    }
  }, []);

  const uploadFileToIpfs = async (e) => {
    console.log(e.target.files[0])
    let result = await uploadFileToIPFS(e.target.files[0], 'Demo NFT', 'Just example NFT')
    setMetadataNFT(result);
  }
   
  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }
  
  const mintNftButton = () => {
    return (
      <>
        <input type='file' onChange={(e)=>uploadFileToIpfs(e)} className="form-control"/>

        <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
          Mint NFT
        </button>
      </>
    )
  }
  
  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert('Please install Metamask')
      return;
    }
  
    try {
      const web3Modal = new Web3Modal({
        network: "rinkeby", // optional
        cacheProvider: true, // optional
        providerOptions: {}, // required
      });
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
  
      const accounts = await ethereum.request({method: 'eth_accounts'})

      console.log(accounts);

      if (accounts.length > 0) {
        setCurrentAccount(accounts[0])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const mintNftHandler = async () => {
    try {
      console.log(metadataNFT)
      console.log(API_URL)
      await MintNFT(metadataNFT.metaDataUrl);
      
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "justify",
        width: "500px",
        border: "8px gray solid",
        boxShadow: "0 0 12px rgba(0,0,0,0.5)",
        borderRadius: "20px",
        margin: "100px auto",
        fontSize: "20px",
        padding: "20px",
      }}
    >
      {currentAccount ? mintNftButton() : connectWalletButton()}
      <p>Your Address</p>
      <p>
        {currentAccount}
      </p>
    </div>
  );
};

export default Home;
