package com.api.stockportfolio.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.api.stockportfolio.entities.Users;
import com.api.stockportfolio.entities.UsersPositions;
import com.api.stockportfolio.repository.StocksRepository;
import com.api.stockportfolio.repository.UserRepository;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.Verification;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final StocksRepository stocksRepository;
    private final PasswordEncoder passwordEncoder;
    private final StockService stockService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("Fetching user by email: {}", email);
        Users user = userRepository.findByEmail(email);
        if (user == null) {
            log.error("User not found in the DB");
            throw new UsernameNotFoundException("User not found in the DB");
        } else {
            log.info("User found in the database: {}", email);
        }
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        // Assuming a role-based system. Modify as per your requirements
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
    }

    public Users getUserDetailsByAccessToken(String accessToken) {
        try {
            Algorithm algorithm = Algorithm.HMAC256("secret");
            DecodedJWT jwt = JWT.decode(accessToken);

            String email = jwt.getSubject();
            Verification verifier = JWT.require(algorithm);
            verifier.build().verify(accessToken);
            return userRepository.findByEmail(email);
        } catch (Exception e) {
            log.error("Error fetching user details from access token: {}", e.getMessage());
        }
        return null;
    }

    public UsersPositions getUserPositionsByAccessToken(String accessToken) {
        try {
            Algorithm algorithm = Algorithm.HMAC256("secret");
            DecodedJWT jwt = JWT.decode(accessToken);

            String email = jwt.getSubject();
            Verification verifier = JWT.require(algorithm);
            verifier.build().verify(accessToken);
            stockService.updatePortfolioBalance(email);
            return stocksRepository.findUserByEmail(email);
        } catch (Exception e) {
            log.error("Error fetching user positions from access token: {}", e.getMessage());
        }
        return null;
    }

    public List<Users> getUsers() {
        return userRepository.findAll();
    }

    public List<UsersPositions> getLeaderBoard() {
        return stocksRepository.getLeaderBoard();
    }

    public Users getUser(String email) {
        return userRepository.findByEmail(email);
    }

    public void addNewUser(Users user) {
        Users existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            throw new IllegalStateException("Email already taken");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public String authenticateUser(Users user) {
        Users existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            String savedPassword = existingUser.getPassword();
            String inputtedPassword = user.getPassword();
            if (passwordEncoder.matches(inputtedPassword, savedPassword)) {
                return "Authentication Success";
            } else {
                return "Incorrect Password";
            }
        }
        return "User Not Found";
    }
}
