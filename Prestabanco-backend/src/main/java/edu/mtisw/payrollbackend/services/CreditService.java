package edu.mtisw.payrollbackend.services;
import edu.mtisw.payrollbackend.entities.CreditEntity;
import edu.mtisw.payrollbackend.entities.DocumentEntity;
import edu.mtisw.payrollbackend.repositories.CreditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CreditService {
    @Autowired
    CreditRepository creditRepository;


    //Crear un credito con los datos del front end
    public CreditEntity saveCredit(Integer capital, Double annual_interest, Double years, Integer type,
                                   Integer income, Integer property_value, Integer amount, Integer debt, Long userId) {
        CreditEntity credit = CreditEntity.builder()
                .capital(capital)
                .annual_interest(annual_interest)
                .years(years)
                .type(type)
                .income(income)
                .property_value(property_value)
                .amount(amount)
                .debt(debt)
                .userId(userId)
                .build();
        credit.setLevel(1);
        return creditRepository.save(credit);
    }

    //Descripcion: Realiza el calculo de la cuota mensual del prestamo
    public Long montly_Share(Integer Capital, Double Annual_interest, Double Years){
        Double M = 0.0;
        Double r = Annual_interest/100/12;
        Double n = Years*12;
        M = Capital*r* Math.pow(1+r,n) / (Math.pow(1 + r, n) -1);
        return Math.round(M);
    }

    public Boolean share_income(Long share, Integer income){
        Long relation = (share/income)*100;
        return relation <= 35;
    }

    public void R1(Long id){
        CreditEntity Credit = creditRepository.findByIdCredit(id);
        Long Share = montly_Share(Credit.getCapital(), Credit.getAnnual_interest(), Credit.getYears());
        if(share_income(Share, Credit.getIncome())){
            //Pasa a a la siguiente fase
            Credit.setLevel(2);
        }else{
            //Se rechaza la peticion
            Credit.setState(false);
        }
    }

    public Integer financing(Integer value, Integer amount ){
        return  (value/amount)*100;
    }

    public void R5(Long id){
        CreditEntity Credit = creditRepository.findByIdCredit(id);
        Integer Credit_type = Credit.getType();
        Integer Financing = financing(Credit.getProperty_value(), Credit.getAmount());
        if(Credit_type == 1 && Financing <= 80 ){
            Credit.setLevel(5);
        }else {
            Credit.setState(false);
        }

        if(Credit_type == 2 && Financing <= 70 ){
            Credit.setLevel(5);
        }else {
            Credit.setState(false);
        }

        if(Credit_type == 3 && Financing <= 60 ){
            Credit.setLevel(5);
        }else {
            Credit.setState(false);
        }


        if(Credit_type == 4 && Financing <= 50 ){
            Credit.setLevel(5);
        }else {
            Credit.setState(false);
        }
    }


    public boolean deleteCredit(Long id) throws Exception{
        try{
            creditRepository.deleteById(id);
            return true;
        } catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }

    public List<CreditEntity> getCredits(Long id){
        return creditRepository.findByUserId(id);
    }

    public CreditEntity updateCredit(CreditEntity credit){
        return creditRepository.save(credit);
    }

}
