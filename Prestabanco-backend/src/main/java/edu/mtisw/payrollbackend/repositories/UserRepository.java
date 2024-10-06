package edu.mtisw.payrollbackend.repositories;

import edu.mtisw.payrollbackend.entities.UserEntity;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    //El optional es para avisar que el Rut podria no existir para asi no causar NullPointerException
    Optional<UserEntity> findByRut(String Rut);

}
