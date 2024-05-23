import React, { useState } from 'react';
import Axios from 'axios'; // API 
import { Button, Flex, Heading, Input, useColorModeValue, Text, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // Updated import
import { DarkMode } from './DarkMode';
import authProvider from './AuthProvider';
import TokenProvider from './TokenProvider';
const validator = require("email-validator");
const passwordValidator = require('password-validator');

function SignUpPage() {
    const formBackground = useColorModeValue("gray.100", "gray.700"); /** Light Mode = gray.100, Dark Mode = gray.700 */
    const navigate = useNavigate(); // Updated from useHistory

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailTakenAlert, setEmailTakenAlert] = useState(false);
    const [emailInvalidAlert, setEmailInvalidAlert] = useState(false);
    const [passwordInvalidAlert, setPasswordInvalidAlert] = useState(false);

    function register() {
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (isEmailValid && isPasswordValid) {
            Axios.post('http://localhost:8080/api/signup', {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            }).then((response) => {
                console.log(response.status, response, response.data);
                navigate(`/Login`); // Updated from history.push
            }).catch((err) => {
                console.log("Promise Rejected", err.message, err.response.data);
                setEmailTakenAlert(true);
            });
        }
    }

    /** check if password is valid */
    const validatePassword = (password) => {
        const schema = new passwordValidator();
        schema.is().min(8).has().uppercase().has().lowercase().has().digits(1).has().not().spaces();
        
        if (!schema.validate(password)) {
            setPasswordInvalidAlert(true);
            return false;
        }

        setPasswordInvalidAlert(false);
        return true;
    };

    /** check if email is valid */
    const validateEmail = (email) => {
        if (!validator.validate(email)) {
            setEmailInvalidAlert(true);
            return false;
        }

        setEmailInvalidAlert(false);
        return true;
    };

    const handleFirstName = (e) => {
        setFirstName(e.target.value);
    };

    const handleLastName = (e) => {
        setLastName(e.target.value);
    };

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const HandleEmailTakenAlert = () => {
        if (emailTakenAlert) {
            return (
                <EmailTakenAlert />
            );
        } else {
            return null;
        }
    };

    const HandleEmailInvalidAlert = () => {
        if (emailInvalidAlert) {
            return (
                <EmailInvalidAlert />
            );
        } else {
            return null;
        }
    };

    const HandlePasswordInvalidAlert = () => {
        if (passwordInvalidAlert) {
            return (
                <PasswordInvalidAlert />
            );
        } else {
            return null;
        }
    };

    const EmailTakenAlert = () => (
        <Alert status="error" mb={3}>
            <AlertIcon />
            <AlertTitle mr={2}></AlertTitle>
            <AlertDescription>Email is Taken</AlertDescription>
            <CloseButton position="absolute" onClick={() => setEmailTakenAlert(false)} right="6px" top="8px" />
        </Alert>
    );

    const EmailInvalidAlert = () => (
        <Alert status="error" mb={3}>
            <AlertIcon />
            <AlertTitle mr={2}></AlertTitle>
            <AlertDescription>Email is Invalid</AlertDescription>
            <CloseButton position="absolute" onClick={() => setEmailInvalidAlert(false)} right="6px" top="8px" />
        </Alert>
    );

    const PasswordInvalidAlert = () => (
        <Alert status="error" mb={3}>
            <AlertIcon />
            <AlertTitle mr={2}></AlertTitle>
            <AlertDescription>Password weak</AlertDescription>
            <CloseButton position="absolute" onClick={() => setPasswordInvalidAlert(false)} right="6px" top="8px" />
        </Alert>
    );

    return (
        <Flex height="100vh" alignItems="center" justifyContent="center">
            <Flex direction="column" background={formBackground} p={12} rounded={6}>
                <Heading mb={6}>Sign up
                    <DarkMode />
                </Heading>
                <Input type="text" value={firstName} onChange={handleFirstName} placeholder="first name" variant="filled" mb={3}></Input>
                <Input type="text" value={lastName} onChange={handleLastName} placeholder="last name" variant="filled" mb={3}></Input>
                <HandleEmailTakenAlert />
                <HandleEmailInvalidAlert />
                <Input type="text" value={email} onChange={handleEmail} placeholder="email" variant="filled" mb={3}></Input>
                <HandlePasswordInvalidAlert/>
                <Input type="password" value={password} onChange={handlePassword} placeholder="*********" variant="filled" mb={3}></Input>
                <Button onClick={register} mb={6} colorScheme="teal">Register</Button>
                <Text>Already have an account?</Text>
                <Button onClick={() => navigate(`/Login`)} mb={6} size="md" colorScheme="red">Sign in</Button> {/* Updated from history.push */}
            </Flex>
        </Flex>
    );
}

export default SignUpPage;
