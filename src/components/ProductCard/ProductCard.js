import { Button, Card, FormControl, InputGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AddNewListing, BuyNFT } from '../../utils/nft-market.js';

function ProductCard({ params, on_market = false, current_wallet = '' }) {
    let history = useHistory ();
    const [nftData, setNftData] = useState({})
    const [priceSell, setPriceSell] = useState(0)
    
    useEffect(() => {
        async function getNFTData() {
            return await fetch(params.tokenUri)
            .then((response) => response.json())
            .then((responseJson) => {
                setNftData(responseJson);
                console.log(responseJson)
              return responseJson;
            })
            .catch((error) => {
              console.error(error);
            });
        }

        getNFTData()
    },[]);

    const changePrice = (e) => {
        setPriceSell(e.target.value)
    }

    const onSubmitSellNFT = (e) => {
        console.log(params.tokenId, priceSell)
        if (priceSell > 0) {
            AddNewListing(params.tokenId, priceSell)
            history.go(0)
        } else {
            console.log('Price > 0')
        }
    }

    const onSubmitBuyNFT = async () => {
        await BuyNFT(current_wallet, params.tokenId)
        // history.go(0)
    }

    return (
        <Card>
            <Link to={`#`}>
                <Card.Img variant="top" src={nftData.image} />
                <Card.Body>
                    <Card.Title>{nftData.name}</Card.Title>
                    <small className="text-muted">{nftData.description}</small>
                    <br />
                    {
                        params.price ?
                        <small className='text-sm'>Price: {(params.price)} ETH</small>
                        :
                        ''
                    }
                </Card.Body>
            </Link>
            <Card.Footer>
                <small className="text-muted">
                    {params.seller ? params.seller : ''}
                </small>
                {
                    on_market ?
                    <Button className="w-100" onClick={() => onSubmitBuyNFT()}>Buy</Button>
                    : 
                    (
                        <div>
                            <InputGroup className="mb-3">
                                <FormControl type="number" min="0"  placeholder="Price" onChange={(e) => changePrice(e)} aria-describedby="basic-addon2"/> 
                                <InputGroup.Text id="basic-addon2">ETH</InputGroup.Text>
                            </InputGroup>
                            <Button className="w-100" onClick={() => onSubmitSellNFT()}>Sell</Button>
                        </div>
                    )
                }
            </Card.Footer>
        </Card>
    )
}

export default ProductCard;