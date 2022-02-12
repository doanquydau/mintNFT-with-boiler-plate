import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../ContextStore';
import { Navbar, NavDropdown, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { BsFillPersonFill, BsFillEnvelopeFill, BsFillPlusCircleFill } from 'react-icons/bs';
import { IoLogOut } from 'react-icons/io5'
import './Header.css'
import { useHistory } from 'react-router';

import Web3 from "web3";
import Web3Modal from "web3modal";
// import { uploadFileToIPFS } from '../../utils/ipfs.js'
// import { MintNFT } from '../../utils/mint-nft.js'
import { NFTsByOwner } from '../../utils/nft-market.js'
require('dotenv').config();
const API_URL = process.env.REACT_APP_API_URL;
const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;


const Header = () => {
    const { userData, setUserData } = useContext(Context)
    const [currentAccount, setCurrentAccount] = useState('');
    const [metadataNFT, setMetadataNFT] = useState({});
    const [txHash, setTxHash] = useState('');
    const [listYourNFTs, setListYourNFTs] = useState([]);
    const history = useHistory();

    useEffect(() => {
        async function init_application() {
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
        
            let your_nft = await NFTsByOwner(PUBLIC_KEY)
            setListYourNFTs(your_nft)
            console.log(your_nft, listYourNFTs)
        }

        init_application();
    }, []);

    const connectWalletButton = () => {
        return (
          <button onClick={connectWalletHandler} className='btn btn-primary connect-wallet-button'>
            Connect Wallet
          </button>
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
            network: "bsc", // optional
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

    const mintNftButton = () => {
        return (
            <button onClick={()=>{history.push({ pathname: '/add-product' })}} className='btn btn-primary connect-wallet-button'>
              Mint NFT
            </button>
        )
    }

    return (
        <Navbar collapseOnSelect bg="light" variant="light">
            <div className="container">
                <Navbar.Brand>
                    <NavLink className="navbar-brand" to="/">All for you...</NavLink>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        {/* <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link> */}
                    </Nav>
                    {userData ?
                        (<Nav>
                            <NavLink className="nav-item" id="addButton" to="/add-product">
                                <OverlayTrigger key="bottom" placement="bottom"
                                    overlay={
                                        <Tooltip id={`tooltip-bottom`}>
                                            <strong>Add</strong>  a sell.
                                        </Tooltip>
                                    }
                                > 
                                    <BsFillPlusCircleFill />
                                </OverlayTrigger>
                            </NavLink>

                            <NavDropdown title={<img id="navImg" src={userData.avatar} alt="user-avatar"/>} drop="left" id="collasible-nav-dropdown">
                                <NavLink className="dropdown-item" to={`/profile/${userData._id}`}>
                                    <BsFillPersonFill />Profile
                                </NavLink>

                                {/* <NavDropdown.Divider /> */}

                                {/* <NavLink className="dropdown-item" to="/your-sells">
                                    <BsFillGridFill />Sells
                            </NavLink> */}
                                <NavLink className="dropdown-item" to="/messages">
                                    <BsFillEnvelopeFill />Messages
                            </NavLink>
                                {/* <NavLink className="dropdown-item" to="/wishlist">
                                    <BsFillHeartFill />Wishlist
                            </NavLink> */}

                                <NavDropdown.Divider />

                                <NavLink className="dropdown-item" to="/auth/logout" onClick={() => {
                                    setUserData(null)
                                }}>
                                    <IoLogOut />Log out
                                </NavLink>
                            </NavDropdown>
                        </Nav>)
                        :
                        (<Nav>
                            {currentAccount ? mintNftButton() : connectWalletButton()}
                            <NavLink className="nav-item" id="nav-sign-in" to="/auth/login">
                                Sign In
                            </NavLink>
                            <NavLink className="nav-item" id="nav-sign-up" to="/auth/register">
                                Sign Up
                            </NavLink>
                        </Nav>)
                    }
                </Navbar.Collapse>
            </div>
        </Navbar>
    )
}

export default Header;