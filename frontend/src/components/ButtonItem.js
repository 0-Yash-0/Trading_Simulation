import React from 'react';
import {
    Flex,
    Text,
    Icon,
    Link,
    Menu,
    Button
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import authProvider from './AuthProvider';

export default function ButtonItem({ icon, title, navSize }) {
    const navigate = useNavigate();

    return (
        <Flex
            mt={30}
            flexDir="column"
            w="100%"
            alignItems={navSize === "small" ? "center" : "flex-start"}
        >
            <Menu placement="right">
                <Link
                    p={5}
                    borderRadius={8}
                    _hover={{ textDecor: 'none', backgroundColor: "#AEC8CA" }}
                    w={navSize === "large" ? "100%" : "auto"}
                    onClick={() => {
                        authProvider.logout();
                        navigate('/Login');
                    }}
                >
                    <Button w="75%" variant="ghost">
                        <Flex>
                            <Icon as={icon} fontSize="xl" color="gray.500" />
                            <Text ml={5} display={navSize === "small" ? "none" : "flex"}>
                                {title}
                            </Text>
                        </Flex>
                    </Button>
                </Link>
            </Menu>
        </Flex>
    );
}
