import React, { useEffect, useState } from "react";

import { Form, Button, Col} from 'react-bootstrap';
import '../components/CreateSell/CreateSell.css';

import { uploadFileToIPFS } from '../utils/ipfs.js';
import { MintNFT } from '../utils/mint-nft.js';

require('dotenv').config();

function AddProduct() {
    const [metadataNft, setMetadataNft] = useState({});
    const [txHash, setTxHash] = useState('');
    const [nftImage, setNftImage] = useState('');
    const [nftTitle, setNftTitle] = useState('');
    const [nftDescription, setNftDescription] = useState('');

    useEffect(() => {
        //
    }, []);

    const onChangeHandler = (e, name) =>  {
        switch (name) {
            case 'image':
                setNftImage(e.target.files[0]);
                console.log('set image');
                break;
            case 'title':
                setNftTitle(e.target.value);
                console.log('set title');
                break;
            case 'description':
                setNftDescription(e.target.value);
                console.log('set description');
                break;
        
            default:
                break;
        }
    }

    const onSubmitHandler = async (e) => {
        await uploadFileToIpfs();
        await mintNftHandler()
    }
    
    const uploadFileToIpfs = async () => {
        if (!nftImage || !nftTitle || !nftDescription) {
            return false;
        }
        let result = await uploadFileToIPFS(nftImage, nftTitle, nftDescription)
        
        setMetadataNft(result);
    }

    const mintNftHandler = async () => {
        try {
          let result_mint = await MintNFT(metadataNft.metaDataUrl);
          if (result_mint.status) {
            setTxHash(result_mint.transactionHash)
            console.log(txHash);
          }
        } catch (error) {
          console.log(error)
        }
    };

    return (
        <>
            <div className='container'>
                <h1 className="heading">Add a Product</h1>
                {/* <Form onSubmit={onSubmitHandler()}> */}
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter title" name="title" required onChange={(e) => {onChangeHandler(e, 'title')}} />
                        </Form.Group>
{/* 
                        <Form.Group as={Col} controlId="formGridPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" step="0.01" placeholder="Price" name="price" required onChange={onChangeHandler} />
                        </Form.Group> */}
                    </Form.Row>

                    <Form.Group controlId="formGridDescription.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} name="description" required onChange={(e) => {onChangeHandler(e, 'description')}} />
                    </Form.Group>

                    <Form.Row>
                        {/* <Form.Group as={Col} controlId="formGridCity">
                            <Form.Label>City</Form.Label>
                            <Form.Control name="city" placeholder="Sofia" required onChange={onChangeHandler} />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridCategory">
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" defaultValue="Choose..." name="category" required onChange={onChangeHandler}>
                                <option>Choose...</option>
                                <option>properties</option>
                                <option>auto</option>
                                <option>electronics</option>
                                <option>clothes</option>
                                <option>toys</option>
                                <option>home</option>
                                <option>garden</option>
                            </Form.Control>
                        </Form.Group> */}

                        <Form.Group as={Col} controlId="formGridImage" >
                            <Form.Label>Image</Form.Label>
                            <Form.Control name="image" type="file" required onChange={(e) => {onChangeHandler(e, 'image')}} />
                        </Form.Group>
                    </Form.Row>
                    <Button className="col-lg-12" variant="dark" type="button" onClick={(e) => {onSubmitHandler()}}>Add product</Button>
                {/* </Form> */}
            </div>
        </>
    )
}

export default AddProduct;