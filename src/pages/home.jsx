/* eslint-disable */
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import style from "../assets/css/main.css";
import { uploadFileToIPFS } from '../utils/ipfs.js'
import { MintNFT } from '../utils/mint-nft.js'
require('dotenv').config();
const API_URL = process.env.REACT_APP_API_URL;

const Home = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [metadataNFT, setMetadataNFT] = useState({});
  const [txHash, setTxHash] = useState('');

  useEffect(async () => {
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
      let result_mint = await MintNFT(metadataNFT.metaDataUrl);
      if (result_mint.status) {
        setTxHash(result_mint.transactionHash)
      }
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
      <p>Transaction hash: </p>
      <p>{txHash}</p>
    </div>
  );
};

export default Home;
