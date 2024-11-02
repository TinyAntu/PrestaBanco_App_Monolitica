package tinyantu.prestabancobackend.services;

import tinyantu.prestabancobackend.entities.UserEntity;
import tinyantu.prestabancobackend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    public UserEntity findUserById(Long Id){
        return userRepository.findById(Id)
                .orElseThrow(() -> new RuntimeException("User Not Found"));
    }

    public UserEntity saveUser(UserEntity user){
        return userRepository.save(user);
    }

    public UserEntity authenticateUser(String Rut, String Password) {
        Optional<UserEntity> user = userRepository.findByRut(Rut);

        if (user.isPresent()) {
            if (user.get().getPassword().equals(Password)) {
                return user.get();
            } else {

                System.out.println("Incorrect password for user with Rut: " + Rut);
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong password");
            }
        } else {

            System.out.println("User not found for Rut: " + Rut);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    public int AgeInYears(Date birthdate) {
        LocalDate Local_birthdate;
        if (birthdate instanceof java.sql.Date) {
            Local_birthdate = ((java.sql.Date) birthdate).toLocalDate();
        } else {
            Local_birthdate = birthdate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }
        LocalDate Actual_date = LocalDate.now();
        return Period.between(Local_birthdate, Actual_date).getYears();
    }
}
