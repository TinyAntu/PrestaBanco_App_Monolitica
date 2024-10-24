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


    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CreditEntity> createCredit(
            @RequestParam("capital") Integer capital,
            @RequestParam("annual_interest") Double annualInterest,
            @RequestParam("years") Double years,
            @RequestParam("type") Integer type_credit,
            @RequestParam("income") Integer income,
            @RequestParam("userId") Long userId,
            @RequestParam("documents") List<MultipartFile> documents,
            @RequestParam("doc_types") List<String> docTypes) throws IOException {

        // Find the user based on the userId
        UserEntity user = userService.findUserById(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body(null); // Handle error if user is not found
        }

        // Create the CreditEntity
        CreditEntity credit = new CreditEntity();
        credit.setCapital(capital);
        credit.setAnnual_interest(annualInterest);
        credit.setYears(years);
        credit.setType(type_credit);
        credit.setIncome(income);
        credit.setUser(user); // Assign the user to the credit

        // Save the CreditEntity first to get an ID
        CreditEntity newCredit = creditService.saveCredit(credit);

        List<DocumentEntity> savedDocuments = new ArrayList<>();
        for (int i = 0; i < documents.size(); i++) {
            MultipartFile file = documents.get(i);
            String docType = docTypes.get(i); // Ensure docTypes is the same size as documents

            // Create DocumentEntity and associate it with the saved CreditEntity
            DocumentEntity savedDocument = documentService.saveDocument(file, docType, newCredit);
            savedDocuments.add(savedDocument);
        }

        newCredit.setDocuments(savedDocuments); // Optionally set documents back to the CreditEntity if needed
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


            documentService.saveDocument(document);

            return ResponseEntity.status(HttpStatus.CREATED).body("Document uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading document");
        }
    }

}
