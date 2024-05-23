package com.api.stockportfolio.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.api.stockportfolio.entities.Stocks;
import com.api.stockportfolio.service.StockService;

import yahoofinance.histquotes.HistoricalQuote;
import yahoofinance.quotes.stock.StockQuote;

@RestController
@RequestMapping("/api/v1/stocks")
public class StockController {

    private final StockService stockService;

    @Autowired
    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping("/trade")
    public ResponseEntity<?> tradeStocks(@RequestParam String accessToken, 
                                         @RequestParam String symbol, 
                                         @RequestParam Integer shares, 
                                         @RequestParam String transaction) {
        return stockService.addNewPosition(accessToken, symbol, shares, transaction);
    }

    @PostMapping("/getStock")
    public Object[] getStockData(@RequestParam String symbol) throws IOException {
        Stocks stock = stockService.findStock(symbol);
        StockQuote stockQuote = stockService.findQuotes(stock);
        List<HistoricalQuote> history = stockService.findHistory(stock);
        return new Object[]{stockQuote, history};
    }
}
