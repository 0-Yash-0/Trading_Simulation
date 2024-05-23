import React from 'react';
// import jwtDecode from 'jwt-decode';
import {jwtDecode} from 'jwt-decode';

const TokenProvider = {
    setTokens: function(access_token, refresh_token) {
        localStorage.setItem("ACCESS_TOKEN", access_token);
        localStorage.setItem("REFRESH_TOKEN", refresh_token);
    },

    getAccessToken: function(){
        return localStorage.getItem("ACCESS_TOKEN");
    },

    getRefreshToken: function() {
        return localStorage.getItem("REFRESH_TOKEN");
    },

    getExpirationDate: function(jwtToken) {
        if (jwtToken === null || jwtToken === 'null') {
            return null;
        }
        if (!jwtToken) {
            return null;
        }

        const jwtDecoded = jwtDecode(jwtToken);
        return jwtDecoded && jwtDecoded.exp * 1000;
    },

    isExpired: function(expirationDate) {
        if (expirationDate === null || expirationDate === 'null') {
            return true;
        }

        return Date.now() > expirationDate; // Returns true if the expiration date is invalid or expired
    },

    getToken: async function() {
        if (!localStorage.getItem("ACCESS_TOKEN")) {
            return null;
        }

        const expirationDate = this.getExpirationDate(localStorage.getItem("ACCESS_TOKEN"));

        if (this.isExpired(expirationDate)) {
            /*
               const updatedToken = await fetch('/update-token', {
                   method: 'POST',
                   // send refresh token
                   // method to update token 
               })
                   .then(r => r.json());
               */
   
               // this.setTokens(updatedToken, updatedRefreshToken);
       }
   
       return localStorage.getItem("ACCESS_TOKEN");
    },

    getEmail: function() {
        let token = localStorage.getItem("ACCESS_TOKEN");
        let decoded = jwtDecode(token);
        return decoded.sub;
    },

    isLoggedIn: function() {
        const expirationDate = this.getExpirationDate(localStorage.getItem("ACCESS_TOKEN"));
        return !this.isExpired(expirationDate);
    }
}

export default TokenProvider;
