import { Button, Card, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

function ProductCard({ params, on_market = false }) {
    const [nftData, setNftData] = useState({})
    
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
                        <small className='text-sm'>Price: {(params.price)}</small>
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
                    <Button className="w-100">Buy</Button>
                    : 
                    <small className="text-muted">
                        <Moment format="d MMM YYYY (dddd) HH:mm">
                            {Date()}
                        </Moment>   
                    </small>
                }
            </Card.Footer>
        </Card>
    )
}

export default ProductCard;