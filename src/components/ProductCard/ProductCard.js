import { Button, Card, FormControl, InputGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Web3 from "web3";
import { Link, /* useHistory */ } from 'react-router-dom';
import { AddNewListing, BuyNFT } from '../../utils/nft-market.js';

function ProductCard({ params, on_market = false, current_wallet = '', web3, marketContract }) {
    // let history = useHistory ();
    const [nftData, setNftData] = useState({})
    const [priceSell, setPriceSell] = useState(0)

    if (web3 === null || web3 === '') {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider);
        };
    }

    useEffect(() => {
        async function getNFTData() {
            if (params.tokenUri !== null && params.tokenUri !== '') {
                return await fetch(params.tokenUri, {method: "GET"})
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
        }

        getNFTData()
    },[params.tokenUri]);

    const changePrice = (e) => {
        setPriceSell(e.target.value)
    }

    const onSubmitSellNFT = async (e) => {
        console.log(params.tokenId, priceSell)
        if (priceSell > 0) {
            await AddNewListing(marketContract, web3, params.tokenId, priceSell)
        } else {
            console.log('Price > 0')
        }
    }

    const onSubmitBuyNFT = async () => {
        await BuyNFT(marketContract, web3, params.tokenId, params.price)
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
                        params.price && web3 !== null ?
                        <small className='text-sm'>Price: {web3.utils.fromWei(params.price.toString(),'ether')} BNB</small>
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
                                <InputGroup.Text id="basic-addon2">BNB</InputGroup.Text>
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