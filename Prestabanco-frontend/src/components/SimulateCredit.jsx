import { useState } from 'react';
import {
  Box,
  FormControl,
  TextField,
  MenuItem,
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
          setMonthlyPayment(`La cuota mensual es: ${response.data}`);
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
        <Typography variant="h5">Simulación de Crédito</Typography>
        <FormControl fullWidth margin="normal">
          <TextField
            id="capital"
            label="Capital"
            type="number"
            value={capital}
            variant="outlined"
            onChange={(e) => setCapital(e.target.value)}
          />
        </FormControl>
  
        <FormControl fullWidth margin="normal">
          <TextField
            id="interest"
            label="Interés Anual (%)"
            type="number"
            value={interest}
            variant="outlined"
            onChange={(e) => setInterest(e.target.value)}
          />
        </FormControl>
  
        <FormControl fullWidth margin="normal">
          <TextField
            id="years"
            label="Años"
            type="number"
            value={years}
            variant="outlined"
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