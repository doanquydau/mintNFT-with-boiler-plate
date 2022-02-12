import React, { /* useContext, */ useEffect, useState } from 'react';
// import { Context } from '../../ContextStore';
import { Navbar, NavDropdown, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { BsFillPersonFill, BsFillEnvelopeFill, BsFillPlusCircleFill } from 'react-icons/bs';
// import { IoLogOut } from 'react-icons/io5'
import { BsFillHeartFill, BsFillGridFill } from 'react-icons/bs';
import './Header.css'
import { useHistory } from 'react-router';

import Web3 from "web3";
import Web3Modal from "web3modal";
// import { uploadFileToIPFS } from '../../utils/ipfs.js'
// import { MintNFT } from '../../utils/mint-nft.js'
// import { NFTsByOwner } from '../../utils/nft-market.js'
require('dotenv').config();
// const API_URL = process.env.REACT_APP_API_URL;
// const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;


const Header = () => {
    // const { userData, setUserData } = useContext(Context)
    const [currentAccount, setCurrentAccount] = useState('');
    // const [metadataNFT, setMetadataNFT] = useState({});
    // const [txHash, setTxHash] = useState('');
    // const [listYourNFTs, setListYourNFTs] = useState([]);
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
                    {currentAccount ?
                        (<Nav>
                            {mintNftButton()}

                            <NavDropdown title={<img id="navImg" src={'#'} alt="user-avatar"/>} drop="left" id="collasible-nav-dropdown">
                                <NavLink className="dropdown-item" to={`/profile/1`}>
                                    <BsFillPersonFill />Profile
                                </NavLink>

                                {<NavDropdown.Divider />}

                                {<NavLink className="dropdown-item" to="/your-sells">
                                    {<BsFillGridFill />}Sells
                                </NavLink>}
                                <NavLink className="dropdown-item" to="/messages">
                                    <BsFillEnvelopeFill />Messages
                                </NavLink>
                                {<NavLink className="dropdown-item" to="/wishlist">
                                    <BsFillHeartFill />Wishlist
                                </NavLink>}

                                <NavDropdown.Divider />                            
                            </NavDropdown>
                        </Nav>)
                        :
                        (<Nav>
                            {connectWalletButton()}
                        </Nav>)
                    }
                </Navbar.Collapse>
            </div>
        </Navbar>
    )
}

export default Header;