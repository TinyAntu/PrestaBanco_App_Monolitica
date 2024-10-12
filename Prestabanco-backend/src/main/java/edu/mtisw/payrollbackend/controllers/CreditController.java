package edu.mtisw.payrollbackend.controllers;

import edu.mtisw.payrollbackend.entities.CreditEntity;
import edu.mtisw.payrollbackend.entities.UserEntity;
import edu.mtisw.payrollbackend.services.CreditService;
import edu.mtisw.payrollbackend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/credits")
@CrossOrigin("*")
public class CreditController {
    @Autowired
    CreditService creditService;
    @Autowired
    private UserService userService;

    @PostMapping("/simulate")
    public ResponseEntity<Double> simulateMonthlyPayment(@RequestBody CreditEntity credit){
        Double monthlypayment = creditService.montly_Share(
                credit.getCapital(),
                credit.getAnnual_interest(),
                credit.getYears());
        return  ResponseEntity.ok(monthlypayment);
    }

    @PostMapping("/create")
    public ResponseEntity<CreditEntity> createCredit(@RequestBody CreditEntity credit, @RequestParam Long userId){
        UserEntity user = userService.findUserById(userId);
        credit.setUser(user); //Asociacion del Usuario o cliente a su credito
        CreditEntity newCredit = creditService.saveCredit(credit);
        return ResponseEntity.ok(newCredit);
    }
}
