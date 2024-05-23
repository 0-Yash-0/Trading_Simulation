package com.api.stockportfolio.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.api.stockportfolio.entities.Users;
import com.api.stockportfolio.repository.StocksRepository;
import com.api.stockportfolio.repository.UserRepository;

@Configuration
public class UserConfig {
	
	 /* executes method & registers the return value as Bean in the container */
    /* Creates Users in DB */
	@Bean
	CommandLineRunner commandLineRunner(UserRepository usersRepository, StocksRepository positionsRepository) {
		return args ->{
			Users yash = new Users(
				"Yash",
				"Tomar",
				"yash@gmail.com",
				"dummy"
			);
			
			Users annanya = new Users(
				"Annaya",
				"Kundu",
				"annanya@gmail.com",
				"dummy"
			);
			usersRepository.saveAll(List.of(yash, annanya));
			
		};
	}
}
