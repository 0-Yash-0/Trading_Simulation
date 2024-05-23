import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import HomePage from "./components/HomePage";
import StocksPage from "./components/StocksPage";
import LeaderBoardPage from './components/LeaderBoardPage';
import PrivateRoute from './components/PrivateRoute';
import TokenProvider from './components/TokenProvider';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/Login" element={<LoginPage />} />
                <Route path="/Register" element={<SignUpPage />} />
                <Route path="/Leaderboard" element={<LeaderBoardPage />} />
            </Routes>    
                <Routes element={<PrivateRoute />}>
                    <Route path='/Dashboard' element={<HomePage />} />
                    <Route path='/Stocks' element={<StocksPage />} />
                </Routes>
            <Routes>    
                <Route path="*" element={<Navigate to="/Login" />} />
            </Routes>
        </Router>
    );
}

export default App;
