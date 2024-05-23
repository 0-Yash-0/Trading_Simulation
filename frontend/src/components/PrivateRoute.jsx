import React, { useEffect, useState } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import authProvider from './AuthProvider';

const PrivateRoute = ({ element: Element, ...rest }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            const authenticated = await authProvider.useAuth();
            console.log("Logged in: " + authenticated);
            setIsAuthenticated(authenticated);
        };

        checkAuthentication();
    }, []);

    if (isAuthenticated === null) {
        return null; // Or any other loading indicator
    }

    if (!isAuthenticated) {
        return <Navigate to="/Login" />;
    }

    return <Route {...rest} element={<Element />} />;
};

export default PrivateRoute;
