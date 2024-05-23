package com.api.stockportfolio.entities;
import java.io.Serializable;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "users_positions") // Adjust table name if needed
public class UsersPositions implements Serializable {

    @Id
    @Column(name = "user_email", nullable = false, length = 255) // Adjust length if needed
    private String userEmail;

    @Column(name = "balance")
    private Integer balance;

    @Column(name = "portfolio_balance")
    private Integer portfolioBalance;

    @Lob
    @Column(name = "positions", columnDefinition = "json") // Change column type to 'json'
    private List<Positions> positions;

    public UsersPositions() {

    }

    public UsersPositions(String user_email, Integer balance, Integer portfolioBalance, List<Positions> positions) {
        this.userEmail = user_email; // Adjust variable name
        this.balance = balance;
        this.portfolioBalance = portfolioBalance;
        this.positions = positions;
    }

    public Integer getBalance() {
        return balance;
    }

    public void setBalance(Integer balance) {
        this.balance = balance;
    }

    public String getUser_email() {
        return userEmail;
    }

    public void setUser_email(String userEmail) {
        this.userEmail = userEmail;
    }

    public List<Positions> getPositions() {
        return positions;
    }

    public void setPositions(List<Positions> positions) {
        this.positions = positions;
    }

    public Integer getPortfolioBalance() {
        return portfolioBalance;
    }

    public void setPortfolioBalance(Integer portfolioBalance) {
        this.portfolioBalance = portfolioBalance;
    }

    // Getters and setters...
}
