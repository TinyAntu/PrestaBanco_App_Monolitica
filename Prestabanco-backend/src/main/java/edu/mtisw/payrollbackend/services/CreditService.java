package edu.mtisw.payrollbackend.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreditService {
    @Autowired
    CreditService creditService;

    //Descripcion: Realiza el calculo de la cuota mensual del prestamo
    public Double montly_Share(Integer Capital, Double Annual_interest, Double Years){
        Double M = 0.0;
        Double Montly_interest = Annual_interest/12/100;
        Double Total_payments = Years*12;
        M = Capital*(Montly_interest*(Math.pow(1+Montly_interest,Total_payments)))/Math.pow(1+Montly_interest, Total_payments)-1;
        return M;
    }
}