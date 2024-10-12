package edu.mtisw.payrollbackend.services;

import edu.mtisw.payrollbackend.entities.UserEntity;
import edu.mtisw.payrollbackend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public UserEntity authenticateUser(String Rut, String Password){
        Optional<UserEntity> user = userRepository.findByRut(Rut);

        if(user.isPresent() && user.get().getPassword().equals(Password)){
            return  user.get();
        }else{
            throw new RuntimeException("Rut o Contraseña incorrectos");
        }
    }
}
