package com.api.stockportfolio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.api.stockportfolio.entities.UsersPositions;
import com.api.stockportfolio.repository.StocksRepository;

public class UsersPositionsService {
	private final StocksRepository stocksRepository;
	
	@Autowired
	public UsersPositionsService(StocksRepository stocksRepository) {
		this.stocksRepository = stocksRepository;
	}
	
	public List<UsersPositions> getPositions(){
		return stocksRepository.findAll();
	}
	
	public void addNewPosition(String email) {
		stocksRepository.findUserByEmail(email);
	}
}
