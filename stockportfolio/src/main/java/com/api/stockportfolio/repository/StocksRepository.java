package com.api.stockportfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.api.stockportfolio.entities.UsersPositions;

@Repository
public interface StocksRepository extends JpaRepository<UsersPositions, String> {

    /** findUserByEmail method() */
    @Query("SELECT s FROM UsersPositions s WHERE s.userEmail = ?1")
    UsersPositions findUserByEmail(String email);

    @Transactional
    @Modifying
    @Query("UPDATE UsersPositions SET positions = ?1 WHERE userEmail = ?2")
    void updatePositionsByEmail(String updatedPositions, String email);

    @Transactional
    @Modifying
    @Query("UPDATE UsersPositions SET balance = ?1 WHERE userEmail = ?2")
    void updateBalanceByEmail(Integer newBalance, String email);

    @Transactional
    @Modifying
    @Query("UPDATE UsersPositions SET portfolioBalance = ?1 WHERE userEmail = ?2")
    void updatePortfolioBalanceByEmail(Integer newBalance, String email);

    @Query("SELECT s FROM UsersPositions s ORDER BY s.portfolioBalance DESC")
    List<UsersPositions> getLeaderBoard();
}
