package edu.mtisw.payrollbackend.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Builder
@Entity
@Table(name = "credits")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class CreditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long idCredit;

    private Integer capital;
    private Double annual_interest;
    private Double years;
    // 1 = Primera vivienda, 2 = Segunda vivienda, 3 = Propiedades comerciles, 4 = Remodelacion
    private Integer type;
    private Integer income;
    //El estado null porque debe ser rechazado o aprovado
    @Column
    private Boolean state = null;

    private Integer level;

    private Integer property_value;

    private Integer amount;

    private Integer debt;

    //Un credito debe tener su usario
    private Long userId;
}
