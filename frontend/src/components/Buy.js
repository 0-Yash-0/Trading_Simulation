import React, { useState } from 'react';
import axios from 'axios'; // API 
import { useDisclosure } from '@chakra-ui/react';
import TokenProvider from './TokenProvider';
import {
    Button,
    Input,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';

export default function Buy({ symbol }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [shares, setShares] = useState('');

    const handleShares = (e) => {
        setShares(e.target.value);
    };

    const handleSubmit = () => {
        const accessToken = TokenProvider.getAccessToken();
        axios.post(`http://localhost:8080/api/v1/stocks/Trade`, {
            accessToken: accessToken,
            symbol: symbol,
            shares: shares,
            transaction: 'buy',
        })
        .then((response) => {  
            console.log(response);
            onClose(); // Close the modal after successful submission
        })
        .catch((err) => {
            console.log(err);
        });
    };

    return (
        <>
            <Button onClick={onOpen}>Buy</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Buy {symbol}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input 
                            type="number" 
                            value={shares} 
                            onChange={handleShares} 
                            placeholder="Number of shares" 
                            variant="filled" 
                            mb={3}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Buy
                        </Button>
                        <Button colorScheme="gray" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

