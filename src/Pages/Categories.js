import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import { Col, Row } from 'react-bootstrap';
import '../components/Siders/SearchSider.css'
import '../components/Categories/Categories.css';
import '../components/ProductCard/ProductCard.css';
import { useHistory } from 'react-router-dom';
import { NFTsByOwner, GetMarketItems } from '../utils/nft-market.js';
import { getTokenUri } from '../utils/mint-nft.js';
import Market from "../truffle/abis/NFTMarket.json";
import NFT from "../truffle/abis/DauDQNFT.json";
import Web3 from "web3";

const { ethereum } = window;
const NFT_CONTRACT = process.env.REACT_APP_NFT_CONTRACT;
const MARKET_CONTRACT = process.env.REACT_APP_MARKET_CONTRACT;

let web3;
let marketContract;
let nftContract;

function Categories( ) {
    let history = useHistory ();
    const [account, setAccount] = useState('')
    const [products, setProducts] = useState([])
    const [marketItems, setMarketItems] = useState([])

    useEffect(() => {
        let isMounted = true;  
        if (!ethereum) {
            console.log('Please install Metamask')
            return;
        }

        if (!ethereum.isConnected() || account === '') {
            return false;
        }
        
        
        // let your_nfts = [];
        const init_page = async () => {
            const accounts = await ethereum.request({method: 'eth_accounts'})
            setAccount(accounts[0]);
            
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
            } else if (window.web3) {
                web3 = new Web3(window.web3.currentProvider);
            };
        
            marketContract = new web3.eth.Contract(Market.abi, MARKET_CONTRACT);
            nftContract = new web3.eth.Contract(NFT.abi, NFT_CONTRACT);

            if (isMounted) {
                let your_nfts = await NFTsByOwner(nftContract, accounts[0]);
                your_nfts = await Promise.all(your_nfts.map(async it_tokenId => {
                    let tokenUri = await getTokenUri(nftContract, it_tokenId)
                    let item = {
                        tokenId: it_tokenId.toString(),
                        tokenUri
                    }
                    return item
                }));
                setProducts(your_nfts)
                console.log(your_nfts)

                let market_items =  await GetMarketItems(marketContract);
                console.log(market_items);
                market_items = await Promise.all(market_items.map(async i => {
                    let tokenUri = await getTokenUri(i.tokenId)
                    let item = {
                      price: i.price.toString(),
                      tokenId: i.tokenId.toString(),
                      seller: i.seller,
                      owner: i.owner,
                      tokenUri,
                      sold: i.sold,
                      itemId: i.itemId
                    }
                    return item
                }))
                setMarketItems(market_items)
                console.log(market_items);
            }
        }
        init_page();
        return () => { isMounted = false };
    }, [account])

    ethereum.on('accountsChanged', (accounts) => {
        history.go(0);
    });

      return (
        <>
            <div className="container">
                <hr/>
                <label>
                    Your NFT
                </label>
                <Row>
                    {products.length > 0 ? products
                    .map((x_item, key) =>
                        <Col xs={12} md={6} lg={3} key={key}>
                            <ProductCard params={x_item}/>
                        </Col>
                    )
                    :
                    <Col><small>You don't have NFTs</small></Col>
                    }
                </Row>
                <hr/>
                <label>
                    Marketplace
                </label>
                <Row>
                    {marketItems.length > 0 ? marketItems
                    .map((x_item, key) =>
                        <Col xs={12} md={6} lg={3} key={key}>
                            <ProductCard params={x_item} on_market={true} current_wallet={account} web3={web3}/>
                        </Col>
                    )
                    :
                    <Col><small>No NFTs on marketplace</small></Col>
                    }
                </Row>
            </div>
        </>
    )
}

export default Categories;