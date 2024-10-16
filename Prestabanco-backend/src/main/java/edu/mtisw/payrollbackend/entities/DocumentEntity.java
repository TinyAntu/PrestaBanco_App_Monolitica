package edu.mtisw.payrollbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "docs")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class DocumentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    @Lob
    private byte[] file; // Almacenamiento del PDF

    private String filename; // Nombre del archivo

    @ManyToOne
    @JoinColumn(name = "credit_id", nullable = false) // Llave foránea hacia Credit
    private CreditEntity credit;
}
