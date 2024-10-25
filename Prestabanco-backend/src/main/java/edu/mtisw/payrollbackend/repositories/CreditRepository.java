package edu.mtisw.payrollbackend.repositories;


import edu.mtisw.payrollbackend.entities.CreditEntity;
import edu.mtisw.payrollbackend.services.CreditService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CreditRepository extends JpaRepository<CreditEntity, Long> {

    List<CreditEntity> findByUserId(Long ID);
    CreditEntity findByIdCredit(Long id);


}
