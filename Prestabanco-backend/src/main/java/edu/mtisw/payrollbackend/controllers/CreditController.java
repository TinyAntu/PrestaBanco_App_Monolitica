package edu.mtisw.payrollbackend.controllers;
import edu.mtisw.payrollbackend.entities.CreditEntity;
import edu.mtisw.payrollbackend.entities.DocumentEntity;
import edu.mtisw.payrollbackend.entities.UserEntity;
import edu.mtisw.payrollbackend.services.CreditService;
import edu.mtisw.payrollbackend.services.DocumentService;
import edu.mtisw.payrollbackend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/credits")
@CrossOrigin("*")
public class CreditController {
    @Autowired
    CreditService creditService;
    @Autowired
    UserService userService;
    @Autowired
    DocumentService documentService;


    @GetMapping("/simulate")
    public ResponseEntity<Long> simulateMonthlyPayment(@RequestParam("capital") int capital,
                                                         @RequestParam("annual_interest") double interest,
                                                         @RequestParam("years") double years) {
        Long monthlyPayment = creditService.montly_Share(capital, interest, years);
        return ResponseEntity.ok(monthlyPayment); // Devuelve el cálculo de la cuota mensual
    }


    @GetMapping("/creditlist/{id}")
    public ResponseEntity<List<CreditEntity>> listCredit(@PathVariable Long id){
        List<CreditEntity> credits = creditService.getCredits(id);
        return ResponseEntity.ok(credits);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteCreditById(@PathVariable Long id) throws Exception{
        var isDeleted = creditService.deleteCredit(id);
        return  ResponseEntity.noContent().build();
    }

    @PutMapping("/change")
    public ResponseEntity<CreditEntity> updateCredit(@RequestBody CreditEntity credit){
        CreditEntity update = creditService.updateCredit(credit);
        return ResponseEntity.ok(update);
    }

}
