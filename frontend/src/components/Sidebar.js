import React, { useState } from "react";
import {
    Flex,
    Text,
    IconButton,
    Divider,
    Avatar,
    Heading,
} from '@chakra-ui/react'

import {
    FiMenu,
    FiHome,
    FiCalendar,
    FiUser,
    FiDollarSign,
    FiBriefcase,
    FiSettings,
    FiLogOut
} from 'react-icons/fi'

import NavItem from '../components/NavItem';
import ButtonItem from '../components/ButtonItem';
import TokenProvider from './TokenProvider';

export default function Sidebar() {
    const [navSize, changeNavSize] = useState("large");
    const email = TokenProvider.getEmail();

    const getActiveSideBar = () => {
        const activePath = window.location.pathname;
        const isActive = (path) => activePath === path;

        const navItems = [
            { url: "/Dashboard", icon: FiHome, title: "Dashboard" },
            { url: "/Stocks", icon: FiDollarSign, title: "Stocks" },
            { url: "/LeaderBoard", icon: FiBriefcase, title: "LeaderBoard" },
            { url: "/Settings", icon: FiSettings, title: "Settings" },
        ];

        return navItems.map((item, index) => (
            <NavItem
                key={index}
                url={item.url}
                navSize={navSize}
                icon={item.icon}
                title={item.title}
                active={isActive(item.url)}
            />
        ));
    }

    return (
        <Flex
            pos="sticky"
            left="5"
            h="95vh"
            marginTop="2.5vh"
            boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
            borderRadius={navSize === "small" ? "15px" : "30px"}
            w={navSize === "small" ? "75px" : "200px"}
            flexDir="column"
            justifyContent="space-between"
        >
            <Flex
                p="5%"
                flexDir="column"
                w="100%"
                alignItems={navSize === "small" ? "center" : "flex-start"}
                as="nav"
            >
                <IconButton
                    background="none"
                    mt={5}
                    _hover={{ background: 'none' }}
                    icon={<FiMenu />}
                    onClick={() => {
                        changeNavSize(navSize === "small" ? "large" : "small");
                    }}
                />
                {getActiveSideBar()}
            </Flex>

            <Flex
                p="5%"
                flexDir="column"
                w="100%"
                alignItems={navSize === "small" ? "center" : "flex-start"}
                mb={4}
            >
                <Divider display={navSize === "small" ? "none" : "flex"} />
                <Flex mt={4} align="center">
                    <Avatar size="sm" src="avatar-1.jpg" />
                    <Flex flexDir="column" ml={4} display={navSize === "small" ? "none" : "flex"}>
                        <Heading as="h3" size="sm">{email}</Heading>
                        <Text color="gray">WSB Amateur</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}
