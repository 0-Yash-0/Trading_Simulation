package com.api.stockportfolio.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.api.stockportfolio.entities.Users;
import com.api.stockportfolio.entities.UsersPositions;
import com.api.stockportfolio.service.UserService;

@RestController
@RequestMapping(path = "/api/v1/user")
public class UserDetailsController {

    private final UserService userService;

    @Autowired
    public UserDetailsController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/UserDetails")
    public Users getUserDetails(@RequestParam String accessToken) {
        return userService.getUserDetailsByAccessToken(accessToken);
    }

    @PostMapping("/PositionDetails")
    public UsersPositions getUserPositionsDetails(@RequestParam String accessToken) {
        return userService.getUserPositionsByAccessToken(accessToken);
    }
}
