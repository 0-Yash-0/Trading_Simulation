import React, { useState } from 'react';
import axios from 'axios'; // API 
import { useDisclosure, Button, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import TokenProvider from './TokenProvider';

export default function Sell({ symbol }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [shares, setShares] = useState('');

    const handleShares = (e) => {
        setShares(e.target.value);
    };

    const handleSubmit = () => {
        const accessToken = TokenProvider.getAccessToken();
        axios.post(`http://localhost:8080/api/v1/stocks/Trade?accessToken=${accessToken}&symbol=${symbol}&shares=${shares}&transaction=sell`, {
            accessToken: accessToken,
            symbol: symbol,
            shares: shares,
            transaction: 'sell',
        })
        .then((response) => {  
            console.log(response);
            // Handle success, maybe close the modal
            onClose();
        })
        .catch((err) => {
            console.error(err);
            // Handle error, maybe show an error message to the user
        });
    };

    return (
        <>
            <Button width="100%" onClick={onOpen}>Sell</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Sell {symbol}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input type="text" onChange={handleShares} placeholder="Number of shares" variant="filled" mb={3}></Input>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Sell
                        </Button>
                        <Button colorScheme="blue" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
