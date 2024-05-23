import React, { useState, useEffect } from 'react';
import {
    Flex, Heading, useColorModeValue, Container, Table, Thead, Tbody, TableCaption, Tr, Th, Td,
    useDisclosure
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TokenProvider from './TokenProvider';
import axios from 'axios';

function Home() {
    const formBackground = useColorModeValue("gray.100", "gray.700");
    const [modeName, setModeName] = useState('Dark Mode');
    const [userDetails, setUserDetails] = useState({
        email: '',
        firstName: '',
        lastName: '',
        balance: '100000',
        portfolioBalance: '100000',
        positions: []
    });

    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = TokenProvider.getAccessToken();
        axios.post(`http://localhost:8080/api/v1/user/UserDetails?accessToken=${accessToken}`)
            .then((response) => {
                const { email, firstName, lastName } = response.data;
                setUserDetails(prevState => ({ ...prevState, email, firstName, lastName }));
            })
            .then(() => {
                return axios.post(`http://localhost:8080/api/v1/user/PositionDetails?accessToken=${accessToken}`);
            })
            .then((response) => {
                const { balance, portfolioBalance, positions } = response.data;
                setUserDetails(prevState => ({
                    ...prevState,
                    balance: balance || prevState.balance,
                    portfolioBalance: portfolioBalance || prevState.portfolioBalance,
                    positions: positions || []
                }));
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const { email, firstName, lastName, balance, portfolioBalance, positions } = userDetails;

    function getTable(data) {
        if (!data.length) {
            return (
                <Table>
                    <TableCaption>Your Positions</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Symbol</Th>
                            <Th>Shares</Th>
                            <Th>Price</Th>
                        </Tr>
                    </Thead>
                </Table>
            );
        }

        return (
            <Table>
                <TableCaption>Your Positions</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Symbol</Th>
                        <Th>Shares</Th>
                        <Th>Price</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((position, index) => (
                        <Tr key={index}>
                            <Td>{position.symbol}</Td>
                            <Td>{position.shares}</Td>
                            <Td>{position.price_per_share}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        );
    }

    return (
        <Flex width="100%">
            <Sidebar />
            <Flex height="100vh" mt={6} direction="column" flex="1" p={4}>
                <Heading ml={8} mb={4}>Dashboard</Heading>
                <Container ml={5} mt={6} background={formBackground} p={4} borderRadius="md">
                    <Heading size="md">Hello {firstName} {lastName},</Heading>
                    <p>Email: {email}</p>
                    <p>Balance: {balance}</p>
                    <p>Portfolio Balance: {portfolioBalance}</p>
                    {getTable(positions)}
                </Container>
            </Flex>
        </Flex>
    );
}

export default Home;
