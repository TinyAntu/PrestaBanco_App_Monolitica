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

    @PostMapping("/create")
    public ResponseEntity<CreditEntity> saveCredit(@RequestBody CreditEntity credit){
        CreditEntity Credit = creditService.saveCredit(credit.getCapital(), credit.getAnnual_interest(), credit.getYears(),
                credit.getType(), credit.getIncome(), credit.getProperty_value(), credit.getAmount(), credit.getDebt(), credit.getUserId());
        return ResponseEntity.ok(Credit);
    }


    @GetMapping("/simulate")
    public ResponseEntity<Long> simulateMonthlyPayment(@RequestParam("capital") int capital,
                                                         @RequestParam("annual_interest") double interest,
                                                         @RequestParam("years") double years) {
        Long monthlyPayment = creditService.montly_Share(capital, interest, years);
        return ResponseEntity.ok(monthlyPayment); // The value of monthly payment
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

    @GetMapping("/getAll")
    public  ResponseEntity<List<CreditEntity>> getAllCredits(){
        List<CreditEntity> Credits = creditService.getCredits();
        return ResponseEntity.ok(Credits);
    }

    @GetMapping("getAll/{id}")
    public ResponseEntity<List<CreditEntity>> getAllCreditsById(@PathVariable Long id){
        List<CreditEntity> Credits = creditService.getCredits(id);
        return ResponseEntity.ok(Credits);
    }

    @GetMapping("/R1/{id}")
    public ResponseEntity<Boolean> Step1(@PathVariable Long id){
        Boolean R1 = creditService.R1(id);
        return ResponseEntity.ok(R1);
    }

    @GetMapping("/R4/{id}")
    public ResponseEntity<Boolean> Step4(@PathVariable Long id){
        Boolean R4 = creditService.R4(id);
        return ResponseEntity.ok(R4);
    }

    @GetMapping("/R5/{id}")
    public ResponseEntity<Boolean> Step5(@PathVariable Long id){
        Boolean R5 = creditService.R5(id);
        return ResponseEntity.ok(R5);
    }

    @GetMapping("/R6/{id}")
    public ResponseEntity<Boolean> Step6(@PathVariable Long id){
        Boolean R6 = creditService.R6(id);
        return ResponseEntity.ok(R6);
    }

    @GetMapping("/E1/{id}")
    public ResponseEntity<Boolean> Follow1(@PathVariable Long id){
        Boolean E1 = creditService.E1(id);
        return ResponseEntity.ok(E1);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CreditEntity> updateCredite( @PathVariable Long id,@RequestBody CreditEntity Credit){
        CreditEntity uptodatecredit = creditService.updateCredit(id, Credit);
        return  ResponseEntity.ok(uptodatecredit);
    }



}
