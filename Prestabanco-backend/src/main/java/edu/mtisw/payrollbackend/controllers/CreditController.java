package edu.mtisw.payrollbackend.controllers;
import edu.mtisw.payrollbackend.entities.CreditEntity;
import edu.mtisw.payrollbackend.entities.DocumentEntity;
import edu.mtisw.payrollbackend.entities.UserEntity;
import edu.mtisw.payrollbackend.services.CreditService;
import edu.mtisw.payrollbackend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/credits")
@CrossOrigin("*")
public class CreditController {
    @Autowired
    CreditService creditService;
    @Autowired
    UserService userService;


    @GetMapping("/simulate")
    public ResponseEntity<Double> simulateMonthlyPayment(@RequestParam("capital") int capital,
                                                         @RequestParam("annual_interest") double interest,
                                                         @RequestParam("years") double years) {
        Double monthlyPayment = creditService.montly_Share(capital, interest, years);
        return ResponseEntity.ok(monthlyPayment); // Devuelve el cálculo de la cuota mensual
    }

    @PostMapping("/create")
    public ResponseEntity<CreditEntity> createCredit(@RequestBody CreditEntity creditRequest, @RequestParam Long userId) {
        UserEntity user = userService.findUserById(userId);

        CreditEntity credit = new CreditEntity();
        credit.setCapital(creditRequest.getCapital());
        credit.setYears(creditRequest.getYears());
        credit.setAnnual_interest(creditRequest.getAnnual_interest());
        credit.setType(creditRequest.getType());
        credit.setIncome(creditRequest.getIncome());
        credit.setUser(user); // Asociación del Usuario o cliente a su crédito

        // Asignar documentos
        if (creditRequest.getDocuments() != null) {
            for (DocumentEntity document : creditRequest.getDocuments()) {
                document.setCredit(credit); // Asocia cada documento al crédito
            }
            credit.setDocuments(creditRequest.getDocuments());
        }

        CreditEntity newCredit = creditService.saveCredit(credit);
        return ResponseEntity.ok(newCredit);
    }

    @GetMapping("/{id}/documents")
    public ResponseEntity<List<DocumentEntity>> getDocuments(@PathVariable Long id) {
        List<DocumentEntity> documents = creditService.getDocumentsByCreditId(id);
        return ResponseEntity.ok(documents);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteCreditById(@PathVariable Long id) throws Exception{
        var isDeleted = creditService.deleteCredit(id);
        return  ResponseEntity.noContent().build();
    }
}
