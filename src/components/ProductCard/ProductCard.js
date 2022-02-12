import { Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

function ProductCard({ params }) {
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
                    <Card.Text>{(320).toFixed(2)}€</Card.Text>
                    <Card.Text>{nftData.description}</Card.Text>
                </Card.Body>
            </Link>
            <Card.Footer>
                <small className="text-muted">
                    <Moment format="d MMM YYYY (dddd) HH:mm">
                        {/* {params.addedAt} */}
                    </Moment>
                </small>
            </Card.Footer>
        </Card>
    )
}

export default ProductCard;