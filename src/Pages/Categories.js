import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import { Col, Row } from 'react-bootstrap';
import '../components/Siders/SearchSider.css'
import '../components/Categories/Categories.css';
import '../components/ProductCard/ProductCard.css';
import { NFTsByOwner, AddNewListing, GetMarketItems } from '../utils/nft-market.js';
import { getTokenUri } from '../utils/mint-nft.js';

const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;
const MARKET_CONTRACT = process.env.REACT_APP_MARKET_CONTRACT;

function Categories( ) {
    const [products, setProducts] = useState([])
    const [marketItems, setMarketItems] = useState([])

    useEffect(() => {
        let isMounted = true;  
        // let your_nfts = [];
        const init_page = async () => {
            if (isMounted) {
                const your_nfts = await NFTsByOwner(PUBLIC_KEY);
                const market_token_ids =  await NFTsByOwner(MARKET_CONTRACT);
                let market_items =  await GetMarketItems();

                market_items = await Promise.all(market_items.map(async i => {
                    const tokenUri = await getTokenUri(i.tokenId)
                    let item = {
                      price: i.price.toString(),
                      tokenId: i.tokenId.toString(),
                      seller: i.seller,
                      owner: i.owner,
                      tokenUri
                    }
                    return item
                }))

                console.log(market_token_ids, '111');
                console.log(market_items, '2222');
                setMarketItems(market_items)
                // market_items.map((x_item, key) => {
                //     // let tokenURIData = market_token_ids.find(it => it.tokenID === x_item['tokenID'])
                //     console.log(x_item)
                // })

                setTimeout(() => {
                    setProducts(your_nfts)

                    // console.log('1111')
                    // if (market_items.length > 0) {
                        // market_items.map((x_item, key) => {
                        //     let tokenURIData = market_token_ids.find(it => it.tokenID === x_item['tokenID'])
                        //     console.log(x_item['tokenID'])
                        //     // setMarketItems(...market_token_ids, ...tokenURIData)
                        // })
                    // }
                }, 5000);
                
                // console.log(products);
            }
        }
        init_page();
        return () => { isMounted = false };
    }, [])

    const btnApprovalAll = () => {
        return (
            <button type="button" className="btn btn-primary" onClick={() => {AddNewListing(2, 0.025)}}>
                Add New Listing
            </button>
        )
    }

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
                    <Col></Col>
                    }
                </Row>
                <Row>
                    {btnApprovalAll()}
                </Row>
                <hr/>
                <label>
                    Marketplace
                </label>
                <Row>
                    {marketItems.length > 0 ? marketItems
                    .map((x_item, key) =>
                        <Col xs={12} md={6} lg={3} key={key}>
                            <ProductCard params={x_item} on_market={true}/>
                        </Col>
                    )
                    :
                    <Col></Col>
                    }
                </Row>
            </div>
        </>
    )
}

export default Categories;