import React, { /* useContext, */ useEffect, useState } from 'react';
import { Navbar, Nav} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './Header.css'
import { useHistory } from 'react-router';
// import Web3 from "web3";
import Web3Modal from "web3modal";

// const process = require("process");

// require('dotenv').config();


const Header = () => {
    const [currentAccount, setCurrentAccount] = useState('');
    const history = useHistory();

    useEffect(() => {
        async function init_application() {
            const { ethereum } = window;
            if (!ethereum) {
              console.log('Please install Metamask')
              return;
            }
            
            const accounts = await ethereum.request({method: 'eth_accounts'})
            console.log(accounts);
            
            if (accounts && accounts.length > 0) {
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
          console.log('Please install Metamask')
          return;
        }

      
        try {
          const web3Modal = new Web3Modal({
            network: "bsc", // optional
            cacheProvider: true, // optional
            providerOptions: {}, // required
          });
          await web3Modal.connect();
          const accounts = await ethereum.request({method: 'eth_accounts'})
          if (accounts && accounts.length > 0) {
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

    const chunkStrAccount = () => {
      return '****' + currentAccount.substring(currentAccount.length - 10);
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

                            <p className="mx-3">{chunkStrAccount()}</p>
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