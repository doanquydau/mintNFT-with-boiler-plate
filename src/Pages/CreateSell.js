import Web3 from "web3";
import React, { useEffect, useState } from "react";
import { Form, Button, Col} from 'react-bootstrap';
import '../components/CreateSell/CreateSell.css';
import NFT from "../truffle/abis/DauDQNFT.json";
import { uploadFileToIPFS } from '../utils/ipfs.js';
import { MintNFT } from '../utils/mint-nft.js';

const { ethereum } = window;
const NFT_CONTRACT = process.env.REACT_APP_NFT_CONTRACT;

let web3;
let nftContract;

require('dotenv').config();

function AddProduct() {
    const [submitForm, setSubmitForm] = useState(false);
    const [nftImage, setNftImage] = useState('');
    const [nftTitle, setNftTitle] = useState('');
    const [nftDescription, setNftDescription] = useState('');

    useEffect(() => { 
        if (!ethereum || !ethereum.isConnected()) {
            console.log('Please install Metamask')
            return;
        }        
        
        const init_page = async () => {
            ethereum.request({method: 'eth_accounts'}).then(async (accounts) => {
                if (accounts.length > 0) {
                    if (window.ethereum) {
                        web3 = new Web3(window.ethereum);
                    } else if (window.web3) {
                        web3 = new Web3(window.web3.currentProvider);
                    };
                    nftContract = new web3.eth.Contract(NFT.abi, NFT_CONTRACT);
                }
            });
        }
        init_page();
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
        if (!nftImage || !nftTitle || !nftDescription) {
            alert('Please fill info');
            return false;
        }
        setSubmitForm(true);
        uploadFileToIPFS(nftImage, nftTitle, nftDescription).then(async (response) => {
            console.log(response);
            let result = await MintNFT(nftContract, web3, response.metaDataUrl);
            console.log(result);
            if (result.status === true || result.status === 'true') {
                alert('Success');
            }
            setSubmitForm(false);
        });
    }

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
                    </Form.Row>

                    <Form.Group controlId="formGridDescription.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} name="description" required onChange={(e) => {onChangeHandler(e, 'description')}} />
                    </Form.Group>

                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridImage" >
                            <Form.Label>Image</Form.Label>
                            <Form.Control name="image" accept="image/*" type="file" required onChange={(e) => {onChangeHandler(e, 'image')}} />
                        </Form.Group>
                    </Form.Row>
                    <Button className="col-lg-12" variant="dark" type="button" onClick={(e) => {onSubmitHandler()}} disabled={submitForm}>Add product</Button>
                {/* </Form> */}
            </div>
        </>
    )
}

export default AddProduct;