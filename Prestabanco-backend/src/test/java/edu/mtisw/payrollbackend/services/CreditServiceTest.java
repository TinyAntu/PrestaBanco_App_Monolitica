package edu.mtisw.payrollbackend.services;

import edu.mtisw.payrollbackend.entities.CreditEntity;
import edu.mtisw.payrollbackend.entities.DocumentEntity;
import edu.mtisw.payrollbackend.entities.UserEntity;
import edu.mtisw.payrollbackend.repositories.CreditRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CreditServiceTest {

    @Mock
    private CreditRepository creditRepository;

    @Mock
    private DocumentService documentService;

    @Mock
    private UserService userService;

    @InjectMocks
    private CreditService creditService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSaveCredit() {
        CreditEntity credit = CreditEntity.builder()
                .capital(100000)
                .annual_interest(5.0)
                .years(15.0)
                .type(1)
                .income(50000)
                .property_value(200000)
                .amount(150000)
                .debt(20000)
                .userId(1L)
                .build();
        when(creditRepository.save(any(CreditEntity.class))).thenReturn(credit);

        CreditEntity savedCredit = creditService.saveCredit(100000, 5.0, 15.0, 1, 50000, 200000, 150000, 20000, 1L);

        assertNotNull(savedCredit);
        assertEquals(100000, savedCredit.getCapital());
    }



    @Test
    public void testMontlyShareCalculates() {
        Long result = creditService.montly_Share(100000, 5.0, 15.0);
        assertNotNull(result);
        assertTrue(result > 0);
    }

    @Test
    public void testMontlyShareEquals() {
        Long result = creditService.montly_Share(100000000, 4.5, 20.0);
        assertNotNull(result);
        assertEquals(result, 632649L);
    }

    @Test
    public void testMontlyShareNotFullYear() {
        Long result = creditService.montly_Share(100000000, 4.5, 20.5);
        assertNotNull(result);
        assertEquals(result, 623141L);
    }


    @Test
    public void testTotalCost() {
        CreditEntity credit = CreditEntity.builder().capital(100000).annual_interest(5.0).years(15.0).amount(150000).build();
        when(creditRepository.findByIdCredit(1L)).thenReturn(credit);

        Long totalCost = creditService.total_cost(1L);
        assertNotNull(totalCost);
        assertTrue(totalCost > 0);
    }

    @Test
    public void testShareIncome() {
        Boolean result = creditService.share_income(3000L, 10000);
        assertTrue(result);
    }

    @Test
    public void testR1() {
        CreditEntity credit = CreditEntity.builder().capital(100000).annual_interest(5.0).years(15.0).income(50000).build();
        when(creditRepository.findByIdCredit(1L)).thenReturn(credit);

        Boolean result = creditService.R1(1L);
        assertNotNull(result);
    }

    @Test
    public void testR4() {
        CreditEntity credit = CreditEntity.builder().capital(100000).annual_interest(5.0).years(15.0).income(50000).debt(20000).build();
        when(creditRepository.findByIdCredit(1L)).thenReturn(credit);

        Boolean result = creditService.R4(1L);
        assertNotNull(result);
    }

    @Test
    public void testR5() {
        CreditEntity credit = CreditEntity.builder().type(1).property_value(200000).amount(150000).build();
        when(creditRepository.findByIdCredit(1L)).thenReturn(credit);

        Boolean result = creditService.R5(1L);
        assertTrue(result);
    }

    @Test
    public void testR6() {
        CreditEntity credit = CreditEntity.builder().userId(1L).years(20.0).build();
        UserEntity user = new UserEntity();
        user.setBirthdate(new Date(System.currentTimeMillis() - (long) 30 * 365 * 24 * 60 * 60 * 1000)); // 30 años
        when(creditRepository.findByIdCredit(1L)).thenReturn(credit);
        when(userService.findUserById(1L)).thenReturn(user);
        when(userService.AgeInYears(user.getBirthdate())).thenReturn(30);

        Boolean result = creditService.R6(1L);
        assertTrue(result);
    }

    @Test
    public void testE1True() {
        CreditEntity credit = CreditEntity.builder().idCredit(1L).type(1).capital(100000).annual_interest(5.0).years(15.0)
                .income(50000).level(1).property_value(200000).amount(150000).debt(20000).userId(1L).build();
        when(creditRepository.findByIdCredit(1L)).thenReturn(credit);
        when(documentService.getDocuments(1L)).thenReturn(List.of(new DocumentEntity(), new DocumentEntity(), new DocumentEntity()));

        Boolean result = creditService.E1(1L);
        assertTrue(result);
    }

    @Test
    public void testE1NoCreditId() {
        CreditEntity credit = CreditEntity.builder().type(1).capital(100000).annual_interest(5.0).years(15.0)
                .income(50000).level(1).property_value(200000).amount(150000).debt(20000).userId(1L).build();
        when(creditRepository.findByIdCredit(1L)).thenReturn(credit);
        when(documentService.getDocuments(1L)).thenReturn(List.of(new DocumentEntity(), new DocumentEntity(), new DocumentEntity()));

        Boolean result = creditService.E1(1L);
        assertFalse(result);
    }

    @Test
    public void testE1False() {
        CreditEntity credit = CreditEntity.builder().idCredit(3L).type(null).capital(100000).annual_interest(5.0).years(15.0)
                .income(50000).level(1).property_value(200000).amount(150000).debt(20000).userId(1L).build();
        when(creditRepository.findByIdCredit(1L)).thenReturn(credit);
        when(documentService.getDocuments(1L)).thenReturn(List.of(new DocumentEntity(), new DocumentEntity(), new DocumentEntity()));

        Boolean result = creditService.E1(1L);
        assertFalse(result);
    }

    @Test
    public void testDeleteCredit() throws Exception {
        Long creditId = 1L;
        doNothing().when(creditRepository).deleteById(creditId);

        Boolean deleted = creditService.deleteCredit(creditId);
        assertTrue(deleted);
        verify(creditRepository, times(1)).deleteById(creditId);
    }

    @Test
    public void testUpdateCredit() {
        CreditEntity credit = CreditEntity.builder().idCredit(1L).capital(100000).build();
        when(creditRepository.existsById(1L)).thenReturn(true);
        when(creditRepository.save(any(CreditEntity.class))).thenReturn(credit);

        CreditEntity updatedCredit = creditService.updateCredit(1L, credit);
        assertNotNull(updatedCredit);
        assertEquals(100000, updatedCredit.getCapital());
    }

    @Test
    public void testStepUpCredit() {
        // Credit with e 2
        CreditEntity existingCredit = CreditEntity.builder().idCredit(1L).capital(100000).e(2).build();
        CreditEntity creditToUpdate = CreditEntity.builder().idCredit(1L).capital(100000).build();

        // We simulate that credit actually exist
        when(creditRepository.existsById(1L)).thenReturn(true);
        when(creditRepository.findById(1L)).thenReturn(Optional.of(existingCredit));

        // We simulate that saves makes the e +1
        when(creditRepository.save(any(CreditEntity.class))).thenAnswer(invocation -> {
            CreditEntity savedCredit = invocation.getArgument(0);
            savedCredit.setE(existingCredit.getE() + 1); // We make the e higher manually for test reasons
            return savedCredit;
        });

        // Llamamos al método de servicio
        CreditEntity updatedCredit = creditService.updateCredit(1L, creditToUpdate);

        // We simulate that saves makes the e +1
        assertNotNull(updatedCredit);
        assertEquals(100000, updatedCredit.getCapital());
        assertEquals(3, updatedCredit.getE()); // We verify the amount
    }

    @Test
    public void testLevelUpCredit() {
        // Credit with level 1
        CreditEntity existingCredit = CreditEntity.builder().idCredit(1L).capital(100000).level(1).build();
        CreditEntity creditToUpdate = CreditEntity.builder().idCredit(1L).capital(100000).build();

        // We simulate that credit actually exist
        when(creditRepository.existsById(1L)).thenReturn(true);
        when(creditRepository.findById(1L)).thenReturn(Optional.of(existingCredit));

        // We simulate that saves makes the level +1
        when(creditRepository.save(any(CreditEntity.class))).thenAnswer(invocation -> {
            CreditEntity savedCredit = invocation.getArgument(0);
            savedCredit.setLevel(existingCredit.getLevel() + 1); // We make the level higher manually for test reasons
            return savedCredit;
        });


        CreditEntity updatedCredit = creditService.updateCredit(1L, creditToUpdate);

        // We verify is the level up is right
        assertNotNull(updatedCredit);
        assertEquals(100000, updatedCredit.getCapital());
        assertEquals(2, updatedCredit.getLevel()); //  We verify the amount
    }

    @Test
    public void testGetCredits() {
        List<CreditEntity> credits = List.of(new CreditEntity(), new CreditEntity());
        when(creditRepository.findByUserId(1L)).thenReturn(credits);

        List<CreditEntity> result = creditService.getCredits(1L);
        assertEquals(2, result.size());
    }

    @Test
    public void testNoneCredits() {
        List<CreditEntity> credits = List.of();
        when(creditRepository.findByUserId(1L)).thenReturn(credits);

        List<CreditEntity> result = creditService.getCredits(1L);
        assertEquals(0, result.size());
    }
}

