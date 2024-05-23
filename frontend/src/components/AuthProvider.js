import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import TokenProvider from './TokenProvider';

const AuthProvider = {
  login: function(newTokens) {
    TokenProvider.setTokens(newTokens);
  },

  logout: function() {
    console.log("Logged Out");
    TokenProvider.setTokens(null);
    console.log("Logged in: " + TokenProvider.isLoggedIn());
    console.log("Token Expired: " + TokenProvider.isExpired(TokenProvider.getExpirationDate(localStorage.getItem("ACCESS_TOKEN"))));
  },

  useAuth: function() {
    return TokenProvider.isLoggedIn();
  }
};

export default AuthProvider;
