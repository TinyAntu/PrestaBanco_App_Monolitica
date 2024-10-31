package edu.mtisw.payrollbackend.services;

import edu.mtisw.payrollbackend.entities.UserEntity;
import edu.mtisw.payrollbackend.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testFindUserByIdSuccess() {
        UserEntity user = new UserEntity();
        user.setId(1L);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UserEntity result = userService.findUserById(1L);
        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    public void testFindUserByIdNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> userService.findUserById(1L));
        assertEquals("User Not Found", exception.getMessage());
    }

    @Test
    public void testSaveUser() {
        UserEntity user = new UserEntity();
        user.setRut("12345678-9");
        user.setPassword("password");
        when(userRepository.save(user)).thenReturn(user);

        UserEntity savedUser = userService.saveUser(user);
        assertNotNull(savedUser);
        assertEquals("12345678-9", savedUser.getRut());
    }

    @Test
    public void testAuthenticateUserSuccess() {
        UserEntity user = new UserEntity();
        user.setRut("12345678-9");
        user.setPassword("password");
        when(userRepository.findByRut("12345678-9")).thenReturn(Optional.of(user));

        UserEntity authenticatedUser = userService.authenticateUser("12345678-9", "password");
        assertNotNull(authenticatedUser);
        assertEquals("12345678-9", authenticatedUser.getRut());
    }

    @Test
    public void testAuthenticateUserIncorrectPassword() {
        UserEntity user = new UserEntity();
        user.setRut("12345678-9");
        user.setPassword("password");
        when(userRepository.findByRut("12345678-9")).thenReturn(Optional.of(user));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                userService.authenticateUser("12345678-9", "wrongpassword"));
        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatusCode());
        assertEquals("Wrong password", exception.getReason());
    }

    @Test
    public void testAuthenticateUserNotFound() {
        when(userRepository.findByRut("12345678-9")).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () ->
                userService.authenticateUser("12345678-9", "password"));
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        assertEquals("User not found", exception.getReason());
    }


    @Test
    public void testAgeInYears() {
        LocalDate birthDate = LocalDate.of(1990, 1, 1);
        Date date = Date.from(birthDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

        int age = userService.AgeInYears(date);
        int expectedAge = LocalDate.now().getYear() - birthDate.getYear();

        assertEquals(expectedAge, age);
    }
}

