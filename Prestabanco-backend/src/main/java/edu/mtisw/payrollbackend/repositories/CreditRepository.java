package edu.mtisw.payrollbackend.repositories;


import edu.mtisw.payrollbackend.entities.CreditEntity;
import edu.mtisw.payrollbackend.services.CreditService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface CreditRepository extends JpaRepository<CreditEntity, Long> {
}
