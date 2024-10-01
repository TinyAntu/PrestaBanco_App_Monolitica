package edu.mtisw.payrollbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Ejecutivos")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class EjecutivoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private String Rut;
    private String Email;
    private String Nombre;
    private String Password;
}
