package edu.mtisw.payrollbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "credits")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class CreditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private Integer capital;
    private Double annual_interest;
    private Double years;
    // 1 = Primera vivienda, 2 = Segunda vivienda, 3 = Propiedades comerciles, 4 = Remodelacion
    private Integer type;
}
