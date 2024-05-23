import React, { useState, useEffect } from "react";
import { Button, useColorMode, useColorModeValue } from '@chakra-ui/react';

export const DarkMode = () => {
    const { toggleColorMode, colorMode } = useColorMode(); // Use colorMode to determine the current mode
    const formBackground = useColorModeValue("gray.100", "gray.700"); // Light mode gray 100 and dark mode gray 700
    const [modeName, setModeName] = useState('Dark Mode'); // Determines light or dark mode

    useEffect(() => {
        // Update modeName based on the current colorMode
        if (colorMode === 'light') {
            setModeName('Dark Mode');
        } else {
            setModeName('Light Mode');
        }
    }, [colorMode]); // Dependency array to update on colorMode change

    const handleModeName = () => {
        toggleColorMode();
    };

    return (
        <Button onClick={handleModeName} m={6} size="xs">
            {modeName}
        </Button>
    );
};
