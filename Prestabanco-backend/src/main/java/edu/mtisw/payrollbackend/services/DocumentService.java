package edu.mtisw.payrollbackend.services;

import edu.mtisw.payrollbackend.entities.DocumentEntity;
import edu.mtisw.payrollbackend.repositories.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentService {
    @Autowired
    DocumentRepository documentRepository;

    public DocumentEntity saveDocument(DocumentEntity document) {
        return documentRepository.save(document);
    }
}
