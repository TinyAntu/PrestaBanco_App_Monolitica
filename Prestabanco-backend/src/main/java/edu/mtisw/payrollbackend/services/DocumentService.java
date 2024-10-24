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
        return documentRepository.save(document);
    }

    @Transactional
    public List<DocumentEntity> getDocuments(Long id){
        return documentRepository.findByIdCredit(id);
    }

}
