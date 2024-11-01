package edu.mtisw.payrollbackend.services;

import edu.mtisw.payrollbackend.entities.CreditEntity;
import edu.mtisw.payrollbackend.entities.DocumentEntity;
import edu.mtisw.payrollbackend.repositories.DocumentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class DocumentService {
    @Autowired
    DocumentRepository documentRepository;

    public DocumentEntity saveDocument (DocumentEntity document){
        if (document == null) {
            throw new IllegalArgumentException("The Document can't be null.");
        }
        return documentRepository.save(document);
    }

    @Transactional
    public List<DocumentEntity> getDocuments(Long id){
        if (id == null) {
            throw new IllegalArgumentException("The ID can't be Null.");
        }
        return documentRepository.findByIdCredit(id);
    }

    public DocumentEntity getDocumentById(Long id) {
        return documentRepository.findById(id).orElse(null);
    }
}
