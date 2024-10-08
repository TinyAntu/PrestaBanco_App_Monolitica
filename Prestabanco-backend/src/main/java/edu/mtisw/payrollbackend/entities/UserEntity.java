package edu.mtisw.payrollbackend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor


public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Long id;

    private String Rut;
    private String Email;
    private String Name;
    private String Password;
    //Id de rol 1 = Usuario, 2 = Ejecutivo, 3 = super admin
    private Integer Role;
    private Integer Income;

}
