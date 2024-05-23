package com.api.stockportfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.api.stockportfolio.entities.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, String> {
    Users findByEmail(String email);
    
    @Query("SELECT s FROM Users s WHERE s.email = ?1")
    Users findUserByEmail(String email);
    
    @Query("SELECT s.password FROM Users s WHERE s.email = ?1")
    String findUsersPassword(String email);
}
