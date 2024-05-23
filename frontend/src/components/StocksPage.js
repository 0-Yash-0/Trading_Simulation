import React, { useState } from 'react';
import Axios from 'axios'; // API 
import { useDisclosure, Flex, Input, Container, Text, Button, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, Grid, GridItem, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import Sidebar from './Sidebar';
import GetGraph from './GetGraph';
import Buy from './Buy';
import Sell from './Sell';

function StocksPage() {
    const [symbol, setSymbol] = useState('');
    const [GRAPH, setGRAPH] = useState('');
    const [symbolAlert, setSymbolAlert] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    let symbolResponse = '';
    let price = 0;
    let changeInPercent = 0;
    let HISTORY = [];

    function handleSetSymbol(e) {
        setSymbol(e.target.value);
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    }

    async function handleSubmit() {
        try {
            const response = await Axios.post('http://localhost:8080/api/v1/stocks/GetStock?symbol=' + symbol, {
                symbol: symbol,
            });
            symbolResponse = response.data[0].symbol;
            price = response.data[0].price;
            changeInPercent = response.data[0].changeInPercent;
            for (let i = 0; i < response.data[1].length; i++) {
                HISTORY.push(response.data[1][i].close);
            }
            setGRAPH(getGraph(HISTORY, symbolResponse));
        } catch (error) {
            if (error.message === 'Request failed with status code 500') {
                setSymbolAlert(true);
            } else {
                console.log(error.message);
            }
        }
    }

    function getGraph(data, label) {
        // Your implementation of getGraph function
    }

    const SymbolAlert = () => (
        <Alert status="error" mt={3} ml={6} mb={3}>
            <AlertIcon />
            <AlertTitle mr={2}></AlertTitle>
            <AlertDescription>Symbol does not exist</AlertDescription>
            <CloseButton position="absolute" onClick={() => setSymbolAlert(false)} right="6px" top="8px" />
        </Alert>
    );

    return (
        <Flex height="100vh">
            <Sidebar />
            <Container maxW="container.xl">
                <Input mt={3} ml={6} placeholder="Type ticker here..." value={symbol} onChange={handleSetSymbol} onKeyPress={handleKeyPress} />
                {symbolAlert && <SymbolAlert />}
                {GRAPH}
            </Container>
        </Flex>
    );
}

export default StocksPage;
