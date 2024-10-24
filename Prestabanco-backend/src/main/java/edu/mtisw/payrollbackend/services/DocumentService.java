package edu.mtisw.payrollbackend.services;

import edu.mtisw.payrollbackend.entities.CreditEntity;
import edu.mtisw.payrollbackend.entities.DocumentEntity;
import edu.mtisw.payrollbackend.repositories.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class DocumentService {
    @Autowired
    DocumentRepository documentRepository;

    public DocumentEntity saveDocument(byte[] file, String doc_type, String filename, Long id_credit){
        DocumentEntity Doc = new DocumentEntity(null, file, doc_type, filename, id_credit );
        return documentRepository.save(Doc);
    }



}
