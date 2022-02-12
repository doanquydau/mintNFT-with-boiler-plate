import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import { Col, Row } from 'react-bootstrap';
import '../components/Siders/SearchSider.css'
import '../components/Categories/Categories.css';
import '../components/ProductCard/ProductCard.css';
import { NFTsByOwner } from '../utils/nft-market.js';

const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;

function Categories( ) {
    const [products, setProducts] = useState([])

    useEffect(() => {
        let isMounted = true;  
        // let your_nfts = [];
        const init_page = async () => {
            if (isMounted) {
                let your_nfts = await NFTsByOwner(PUBLIC_KEY);
                setTimeout(() => {
                    // console.log(1);
                    setProducts(your_nfts)
                }, 5000);
                // console.log(products);
            }
        }
        init_page();

        return () => { isMounted = false };
    }, [])

      return (
        <>
            <div className="container">
                <Row>
                    {products.length > 0 ? products
                    .map((x_item, key) =>
                        <Col xs={12} md={6} lg={3} key={key}>
                            <ProductCard params={x_item} />
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