package edu.mtisw.payrollbackend.controllers;
import edu.mtisw.payrollbackend.entities.CreditEntity;
import edu.mtisw.payrollbackend.entities.DocumentEntity;
import edu.mtisw.payrollbackend.entities.UserEntity;
import edu.mtisw.payrollbackend.services.CreditService;
import edu.mtisw.payrollbackend.services.DocumentService;
import edu.mtisw.payrollbackend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @PostMapping("/{creditId}/uploadDocument")
    public ResponseEntity<String> uploadDocument(@PathVariable Long creditId, @RequestParam("file") MultipartFile file) {
        try {
            CreditEntity credit = creditService.findById(creditId);
            DocumentEntity document = new DocumentEntity();
            document.setFilename(file.getOriginalFilename());
            document.setFile(file.getBytes());
            document.setCredit(credit);

            documentService.saveDocument(document);

            return ResponseEntity.status(HttpStatus.CREATED).body("Document uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading document");
        }
    }

}
