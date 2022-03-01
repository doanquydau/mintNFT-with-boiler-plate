import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import { Col, Row } from 'react-bootstrap';
import '../components/Siders/SearchSider.css'
import '../components/Categories/Categories.css';
import '../components/ProductCard/ProductCard.css';
import { NFTsByOwner, GetMarketItems } from '../utils/nft-market.js';
import { getTokenUri } from '../utils/mint-nft.js';
import Web3 from "web3";

const { ethereum } = window;
const web3 = new Web3(ethereum);

function Categories( ) {
    const [account, setAccount] = useState('')
    const [products, setProducts] = useState([])
    const [marketItems, setMarketItems] = useState([])

    useEffect(() => {
        let isMounted = true;  
        if (!ethereum) {
            alert('Please install Metamask')
            return;
        }
        
        // let your_nfts = [];
        const init_page = async () => {
            const accounts = await ethereum.request({method: 'eth_accounts'})
            setAccount(accounts[0])
            if (isMounted) {
                let your_nfts = await NFTsByOwner(accounts[0]);
                console.log(your_nfts)
                your_nfts = await Promise.all(your_nfts.map(async it_tokenId => {
                    let tokenUri = await getTokenUri(it_tokenId)
                    let item = {
                      tokenId: it_tokenId.toString(),
                      tokenUri
                    }
                    return item
                }));
                setProducts(your_nfts)

                let market_items =  await GetMarketItems();
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
    }, [])

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