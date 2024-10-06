package edu.mtisw.payrollbackend.controllers;


import edu.mtisw.payrollbackend.entities.UserEntity;
import edu.mtisw.payrollbackend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin("*")
public class UserController {
    @Autowired
    UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserEntity> saveUser(@RequestBody UserEntity user) {
        UserEntity UserNew = userService.saveUser(user);
        return ResponseEntity.ok(UserNew);
    }

    @PostMapping("/login")
    public UserEntity loginUser(@RequestBody UserEntity user){
        return userService.authenticateUser(user.getRut(), user.getPassword());
    }
}
