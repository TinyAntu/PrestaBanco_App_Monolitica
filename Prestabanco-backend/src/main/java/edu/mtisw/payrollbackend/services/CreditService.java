package edu.mtisw.payrollbackend.services;
import edu.mtisw.payrollbackend.entities.CreditEntity;
import edu.mtisw.payrollbackend.entities.DocumentEntity;
import edu.mtisw.payrollbackend.repositories.CreditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CreditService {
    @Autowired
    CreditRepository creditRepository;


    public CreditEntity saveCredit(CreditEntity credit) {
        return creditRepository.save(credit);
    }

    //Descripcion: Realiza el calculo de la cuota mensual del prestamo
    public Long montly_Share(Integer Capital, Double Annual_interest, Double Years){
        Double M = 0.0;
        Double r = Annual_interest/100/12;
        Double n = Years*12;
        M = Capital*r* Math.pow(1+r,n) / (Math.pow(1 + r, n) -1);
        return Math.round(M);
    }

    public List<DocumentEntity> getDocumentsByCreditId(Long creditId) {
        CreditEntity credit = creditRepository.findById(creditId)
                .orElseThrow(() -> new RuntimeException("Documents Not found with the Credit ID: " + creditId));
        return credit.getDocuments();
    }

    public boolean deleteCredit(Long id) throws Exception{
        try{
            creditRepository.deleteById(id);
            return true;
        } catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }

    public CreditEntity findById(Long id) {
        return creditRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credit not found with ID: " + id));
    }

    public List<CreditEntity> getCredits(Long id){
        return creditRepository.findByUserId(id);
    }

}
