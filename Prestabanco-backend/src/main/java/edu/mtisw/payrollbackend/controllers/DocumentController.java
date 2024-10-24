package edu.mtisw.payrollbackend.controllers;

import edu.mtisw.payrollbackend.entities.DocumentEntity;
import edu.mtisw.payrollbackend.services.DocumentService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/docs")
@CrossOrigin("*")
public class DocumentController {

    @Autowired
    DocumentService documentService;

    @GetMapping("/Documentlist/{id}")
    public ResponseEntity<List<DocumentEntity>> listDocuments(@PathVariable Long id){
        List<DocumentEntity> Docs = documentService.getDocuments(id);
        return ResponseEntity.ok(Docs);
    }

    @PostMapping("/create")
    public ResponseEntity<DocumentEntity> saveDocument(@RequestBody DocumentEntity document){
        DocumentEntity Doc = documentService.saveDocument(document);
        return ResponseEntity.ok(Doc);
    }
}
