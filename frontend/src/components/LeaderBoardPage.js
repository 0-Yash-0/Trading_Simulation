import React, { useState, useEffect } from 'react';
import { Flex, Heading, useColorModeValue, Table, Thead, Tbody, Tr, Th, Td, TableCaption, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import TokenProvider from './TokenProvider';

function LeaderBoard() {
    const formBackground = useColorModeValue("gray.100", "gray.700");
    const [leaderBoardData, setLeaderBoardData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/LeaderBoard/GetLeaderBoard')
            .then((response) => {
                console.log(response.data);
                setLeaderBoardData(response.data);
            })
            .catch((error) => {
                if (error.message === 'Request failed with status code 500') {
                    // Handle specific error
                } else {
                    console.log(error.message);
                }
            });
    }, []);

    function getTable(data) {
        if (!data.length) {
            return (
                <Table>
                    <TableCaption>Rankings</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Rank</Th>
                            <Th>Email</Th>
                            <Th>Net Balance</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td colSpan="3">No data available</Td>
                        </Tr>
                    </Tbody>
                </Table>
            );
        }

        return (
            <Table>
                <TableCaption>Rankings</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Rank</Th>
                        <Th>Email</Th>
                        <Th>Net Balance</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map((item, index) => (
                        <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td>{item.user_email}</Td>
                            <Td>{item.portfolioBalance}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        );
    }

    return (
        <Flex width="100%">
            <Sidebar />
            <Flex height="100vh" mt={6} flex="1" direction="column">
                <Heading ml={8}>LeaderBoard</Heading>
                <Container ml={5} mt={6} background={formBackground} p={4} borderRadius="md">
                    {getTable(leaderBoardData)}
                </Container>
            </Flex>
        </Flex>
    );
}

export default LeaderBoard;
