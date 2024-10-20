import { useState } from 'react';
import {
  Box,
  FormControl,
  TextField,
  Button,
  Typography
} from '@mui/material';
import creditService from '../services/credit.service';

const SimulateCredit = () => {
    const [capital, setCapital] = useState("");
    const [interest, setInterest] = useState("");
    const [years, setYears] = useState("");
    const [monthlyPayment, setMonthlyPayment] = useState(null);

    const simulateCredit = (e) => {
      e.preventDefault();
      console.log("Solicitar simulación de crédito.", capital, "-", interest, "-", years);
      creditService
        .simulate(capital, interest, years)
        .then(response => {
          console.log("Resultado de la simulación:", response.data);
          setMonthlyPayment(`La cuota mensual es aproximadamente: ${response.data} pesos`);
        })
        .catch(error => {
          console.error("Error al realizar la simulación:", error);
          setMonthlyPayment("Error al realizar la simulación. Intenta de nuevo.");
        });
    };

    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        component="form"
        onSubmit={simulateCredit}
      >
        <Typography variant="h4" sx={{ 
          marginTop: '30px', // Increase this value to move the text lower
          marginBottom: '20px', // Space below the title
          textAlign: 'center', // Center the text
        }}>Simulación de Crédito
        </Typography>

        <FormControl  margin="normal">
          <TextField
            id="capital"
            label="Capital"
            type="number"
            value={capital}
            variant="outlined"
            sx={{ width: '650px'  }}
            onChange={(e) => setCapital(e.target.value)}
          />
        </FormControl>

        <FormControl  margin="normal">
          <TextField
            id="interest"
            label="Interés Anual (%)"
            type="number"
            value={interest}
            variant="outlined"
            sx={{ width: '650px' }}
            onChange={(e) => setInterest(e.target.value)}
          />
        </FormControl>

        <FormControl  margin="normal">
          <TextField
            id="years"
            label="Años"
            type="number"
            value={years}
            variant="outlined"
            sx={{ width: '650px' }}
            onChange={(e) => setYears(e.target.value)}
          />
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={{ marginTop: "1rem" }}
        >
          Simular Crédito
        </Button>

        {monthlyPayment && (
          <Typography variant="h6" style={{ marginTop: "1rem" }}>
            {monthlyPayment}
          </Typography>
        )}
      </Box>
    );
};

export default SimulateCredit;
