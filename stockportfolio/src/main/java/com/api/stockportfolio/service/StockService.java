package com.api.stockportfolio.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.api.stockportfolio.entities.Positions;
import com.api.stockportfolio.entities.Stocks;
import com.api.stockportfolio.entities.UsersPositions;
import com.api.stockportfolio.repository.StocksRepository;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Verification;
import com.fasterxml.jackson.databind.ObjectMapper;

import yahoofinance.Stock;
import yahoofinance.YahooFinance;
import yahoofinance.histquotes.HistoricalQuote;
import yahoofinance.quotes.stock.StockQuote;

@Service
public class StockService {

    private final StocksRepository stocksRepository;

    @Autowired
    public StockService(StocksRepository stocksRepository) {
        this.stocksRepository = stocksRepository;
    }

    public Stocks findStock(String ticker) {
        try {
            return new Stocks(YahooFinance.get(ticker));
        } catch (IOException e) {
            System.out.println("Error" + e + " " + e.getMessage());
        }
        return null;
    }

    public BigDecimal findPrice(Stocks stock) throws IOException { // retrieving information from the yahoofinance api
        return stock.getStock().getQuote(true).getPrice();
    }

    public StockQuote findQuotes(Stocks stock) throws IOException {
        return stock.getStock().getQuote(true);
    }

    public List<HistoricalQuote> findHistory(Stocks stock) throws IOException {
        return stock.getStock().getHistory();
    }

    public String findSymbol(Stocks stock) throws IOException {
        return stock.getStock().getSymbol();
    }

    public Stock findAll(Stocks stock) throws IOException {
        return stock.getStock();
    }

    public void updatePortfolioBalance(String email) {
        UsersPositions usersPositions = stocksRepository.findUserByEmail(email);
        if (usersPositions != null) {
            List<Positions> list = usersPositions.getPositions();
            int newBalance = usersPositions.getBalance();
            for (Positions position : list) {
                System.out.println("Updating Portfolio Balance...");
                int shares = position.getShares();
                try {
                    int price = findPrice(findStock(position.getSymbol())).intValue();
                    newBalance += shares * price;
                } catch (Exception e) {
                    System.out.println("Catch: " + e);
                }
            }
            stocksRepository.updatePortfolioBalanceByEmail(newBalance, email);
        }
    }

    public ResponseEntity<Exception> addNewPosition(String accessToken, String symbol, int shares, String transaction){
        String email = JWT.decode(accessToken).getSubject();
        System.out.println(transaction);
        if(transaction.matches("buy")) {
            System.out.println("Buying");
            try {
                /* verify token */
                Algorithm algorithm = Algorithm.HMAC256("secret");
                Verification verifier = JWT.require(algorithm);
                System.out.println(verifier.build().verify(accessToken));

                /* if user isnt in database, add users new positions */
                UsersPositions usersPositions = stocksRepository.findUserByEmail(email);
                if(usersPositions == null) {
                    System.out.println("Adding users positions to users_positions table");
                    int stockPrice = findPrice(findStock(symbol)).intValue();

                    /* deduct money */
                    if(shares * stockPrice <= 100000) {
                        Integer newBalance = 100000 - (shares * stockPrice);
                        List<Positions> list = new ArrayList<>();
                        Positions positions = new Positions(symbol, shares, stockPrice);
                        list.add(positions);
                        UsersPositions newUsersPositions = new UsersPositions(email, newBalance, 100000, list);
                        stocksRepository.save(newUsersPositions);
                    } else {
                        return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
                    }
                } else {
                    /* if users has positions, update position */
                    /* check balance */
                    int stockPrice = findPrice(findStock(symbol)).intValue();
                    int newBalance = usersPositions.getBalance() - (shares * stockPrice);
                    if (newBalance >= 0) {
                        System.out.println("User exists");
                        List<Positions> list = usersPositions.getPositions();
                        boolean symbolExists = false;
                        for (int i = 0; i < list.size(); i++) {
                            System.out.println("Symbol = " + list.get(i).getSymbol());
                            System.out.println("Current Shares = " + list.get(i).getShares());
                            System.out.println("Current price per share = " + list.get(i).getPrice_per_share());
                            if (list.get(i).getSymbol().matches(symbol)) { // check if position exists
                                System.out.println("Found: Position exists...");
                                System.out.println("Updating totalShares and price_per_share");
                                int totalShares = list.get(i).getShares() + shares;
                                int price_per_share = ((list.get(i).getPrice_per_share() * list.get(i).getShares()) + (shares * stockPrice)) / totalShares;
                                System.out.println("Total Shares: " + totalShares);
                                System.out.println("Price per Share = " + price_per_share);
                                System.out.println("New Balance: " + newBalance);
                                Positions updatedPosition = new Positions(symbol, totalShares, price_per_share);
                                list.set(i, updatedPosition);
                                symbolExists = true;
                            }
                        }
                        if (symbolExists) {
                            System.out.println("Found: Position Exists...");
                            System.out.println("Updating database...");
                            ObjectMapper objectMapper = new ObjectMapper();
                            String json = objectMapper.writeValueAsString(list);
                            System.out.println(json);
                            stocksRepository.updatePositionsByEmail(json, email);
                            stocksRepository.updateBalanceByEmail(newBalance, email);
                            String result = objectMapper.writeValueAsString(stocksRepository.findUserByEmail(email));
                            System.out.println(result);
                        } else {
                            System.out.println("Position Does Not Exist...");
                            Positions newPosition = new Positions(symbol, shares, stockPrice);
                            list.add(newPosition);
                            System.out.println("Updating database...");
                            ObjectMapper objectMapper = new ObjectMapper();
                            String json = objectMapper.writeValueAsString(list);
                            System.out.println(json);
                            stocksRepository.updatePositionsByEmail(json, email);
                            stocksRepository.updateBalanceByEmail(newBalance, email);
                            String result = objectMapper.writeValueAsString(stocksRepository.findUserByEmail(email));
                            System.out.println(result);
                        }
                    } else {
                        return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
                    }
                }
            } catch (Exception e) {
                System.out.println("Error: " + e);
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } else if (transaction.matches("sell")) {
            System.out.println("SELLING");
            try {
                // verify token
                Algorithm algorithm = Algorithm.HMAC256("secret");
                Verification verifier = JWT.require(algorithm);
                System.out.println(verifier.build().verify(accessToken));

                UsersPositions usersPositions = stocksRepository.findUserByEmail(email);
                if (usersPositions == null) {
                    System.out.println("Error: Cannot sell when user does not have positions");
                    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                } else {
                    int stockPrice = findPrice(findStock(symbol)).intValue();
                    int newBalance = usersPositions.getBalance() + (shares * stockPrice);
                    System.out.println("User exists");
                    List<Positions> list = usersPositions.getPositions();
                    boolean symbolExists = false;
                    for (int i = 0; i < list.size(); i++) {
                        System.out.println("Symbol = " + list.get(i).getSymbol());
                        System.out.println("Current Shares = " + list.get(i).getShares());
                        System.out.println("Current price per share = " + list.get(i).getPrice_per_share());
                        if (list.get(i).getSymbol().matches(symbol)) {
                            if (list.get(i).getShares() < shares) {
                                System.out.println("Error: can't sell more shares than you own");
                                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                            }
                            System.out.println("Found: Position Exists...");
                            System.out.println("Updating totalShares and price_per_share");
                            int totalShares = list.get(i).getShares() - shares;
                            int price_per_share;
                            if (totalShares == 0) {
                                price_per_share = 0;
                            } else {
                                price_per_share = ((list.get(i).getPrice_per_share() * list.get(i).getShares()) - (shares * stockPrice)) / totalShares;
                            }
                            System.out.println("Total Shares: " + totalShares);
                            System.out.println("Price per Share = " + price_per_share);
                            System.out.println("New Balance: " + newBalance);
                            Positions updatedPosition = new Positions(symbol, totalShares, price_per_share);
                            list.set(i, updatedPosition);
                            symbolExists = true;
                        }
                    }
                    if (symbolExists) {
                        System.out.println("Found: Position Exists...");
                        System.out.println("Updating database...");
                        ObjectMapper objectMapper = new ObjectMapper();
                        String json = objectMapper.writeValueAsString(list);
                        System.out.println(json);
                        stocksRepository.updatePositionsByEmail(json, email);
                        stocksRepository.updatePortfolioBalanceByEmail(newBalance, email);
                        String result = objectMapper.writeValueAsString(stocksRepository.findUserByEmail(email));
                        System.out.println(result);
                    } else {
                        System.out.println("Position Does Not Exist...");
                        System.out.println("Error");
                    }
                }
            } catch (Exception e) {
                System.out.println("error: " + e);
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        } else {
            System.out.println("error");
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

