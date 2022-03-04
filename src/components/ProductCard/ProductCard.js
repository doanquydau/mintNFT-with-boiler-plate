import { Button, Card, FormControl, InputGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Web3 from "web3";
import { Link, /* useHistory */ } from 'react-router-dom';
import { AddNewListing, BuyNFT, UpdateListing, CancelListing } from '../../utils/nft-market.js';

function ProductCard({ params, type, current_wallet = '', web3, marketContract, nftContract }) {
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
                    return responseJson;
                })
                .catch((error) => {
                  console.error(error);
                });
            }
        }

        getNFTData()
    },[params.tokenUri, web3]);

    const changePrice = (e) => {
        setPriceSell(e.target.value)
    }

    const onSubmitSellNFT = async (e) => {
        if (priceSell > 0 && params.tokenId > 0) {
            await AddNewListing(marketContract, web3, params.tokenId, priceSell)
        } else {
            alert('Price > 0');
        }
        setPriceSell(0)
    }

    const onSubmitUpdatePriceNFT = async (e) => {
        if (priceSell > 0 && params.tokenId > 0) {
            await UpdateListing(marketContract, web3, params.tokenId, priceSell)
        } else {
            alert('Price > 0')
        }
        setPriceSell(0);
    }

    const onSubmitBuyNFT = async () => {
        if (params.tokenId > 0) {
            let result = await BuyNFT(marketContract, web3, params.tokenId, params.price);
            if (result) {
                alert('Please wait confirmation from Metamask');
            }
        }
    }

    const onSubmitCancelSellNFT = async () => {
        if (params.tokenId > 0) {
            let result = await CancelListing(marketContract, web3, params.tokenId)
            if (result) {
                alert('Please wait confirmation from Metamask');
            }
        }
    }

    const handleButtonWithType = () => {
        if (type === 'mynft') {
            return (
                <div>
                    <InputGroup className="mb-3">
                        <FormControl type="number" min="0"  placeholder="Price" onChange={(e) => changePrice(e)} aria-describedby="basic-addon2"/> 
                        <InputGroup.Text id="basic-addon2">BNB</InputGroup.Text>
                    </InputGroup>
                    <Button className="w-100" onClick={() => onSubmitSellNFT()}>Sell</Button>
                </div>
            );
        } else if (type === 'mylisting') {
            return (
                <div>
                    <InputGroup className="mb-3">
                        <FormControl type="number" min="0"  placeholder="Price" onChange={(e) => changePrice(e)} aria-describedby="basic-addon2"/> 
                        <InputGroup.Text id="basic-addon2">BNB</InputGroup.Text>
                    </InputGroup>
                    <Button className="w-100" onClick={() => onSubmitUpdatePriceNFT()}>Update Price</Button>
                    <hr />
                    <Button className="w-100 bg-danger text-white" onClick={() => onSubmitCancelSellNFT()}>Cancel Listing</Button>
                </div>
            );
        } else if (type === 'market') {
            return (
                <Button className="w-100" onClick={() => onSubmitBuyNFT()}>Buy</Button>
            );
        }
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
                { handleButtonWithType() }
            </Card.Footer>
        </Card>
    )
}

export default ProductCard;