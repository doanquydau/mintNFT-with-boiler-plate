import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import { Col, Row } from 'react-bootstrap';
import '../components/Categories/Categories.css';
import '../components/ProductCard/ProductCard.css';
import { GetMarketItems, YourNFTsListing } from '../utils/nft-market.js';
import { getTokenUri, NFTsByOwner } from '../utils/mint-nft.js';
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
    const [account, setAccount] = useState('')
    const [products, setProducts] = useState([]);
    const [yourNftListing, setYourNftListing] = useState([])
    const [marketItems, setMarketItems] = useState([])

    useEffect(() => {
        let isMounted = true;  
        if (!ethereum) {
            console.log('Please install Metamask')
            return;
        }

        if (!ethereum.isConnected()) {
            return false;
        }
        
        // let your_nfts = [];
        const init_page = async () => {
            ethereum.request({method: 'eth_accounts'}).then(async (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    if (window.ethereum) {
                        web3 = new Web3(window.ethereum);
                    } else if (window.web3) {
                        web3 = new Web3(window.web3.currentProvider);
                    };
                
                    marketContract = new web3.eth.Contract(Market.abi, MARKET_CONTRACT,{from: ethereum.selectedAddress});
                    nftContract = new web3.eth.Contract(NFT.abi, NFT_CONTRACT, {from: ethereum.selectedAddress});
        
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

                        let your_listing = await YourNFTsListing(marketContract);
                        your_listing = await Promise.all(your_listing.map(async it_listing => {
                            let tokenUri = await getTokenUri(nftContract, it_listing.tokenId)
                            let item = {
                                tokenId: it_listing.tokenId.toString(),
                                tokenUri
                            }
                            return item
                        }));
                        setYourNftListing(your_listing);
        
                        let market_items =  await GetMarketItems(marketContract);
                        market_items = await Promise.all(market_items.map(async i => {
                            let tokenUri = await getTokenUri(nftContract, i.tokenId)
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
                        setMarketItems(market_items);
                    }
                }
            });

        }
        init_page();
        return () => { isMounted = false };
    }, [account])

      return (
        <>
            <div className="container">
                <hr/>
                <label>
                    Your NFT
                </label>
                <Row>
                    {products.length > 0 && web3 !== null ? products
                    .map((x_item, key) =>
                        <Col xs={12} md={6} lg={3} key={key}>
                            <ProductCard params={x_item} type="mynft" web3={web3} marketContract={marketContract} nftContract={nftContract}/>
                        </Col>
                    )
                    :
                    <Col><small>You don't have NFTs</small></Col>
                    }
                </Row>
                <hr/>
                <label>
                    Your NFT Listing on Market
                </label>
                <Row>
                    {yourNftListing.length > 0 && web3 !== null ? yourNftListing
                    .map((x_item, key) =>
                        <Col xs={12} md={6} lg={3} key={key}>
                            <ProductCard params={x_item} type="mylisting" web3={web3} marketContract={marketContract} nftContract={nftContract}/>
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
                    {marketItems.length > 0 && web3 !== null ? marketItems
                    .map((x_item, key) =>
                        <Col xs={12} md={6} lg={3} key={key}>
                            <ProductCard params={x_item} type="market" current_wallet={account} web3={web3} marketContract={marketContract} nftContract={nftContract}/>
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