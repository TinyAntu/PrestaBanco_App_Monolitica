import { useState } from 'react';
import { useParams } from 'react-router-dom';
import creditService from '../services/credit.service';
import { Box, Typography, FormControl, TextField, Button, MenuItem } from "@mui/material";

const CreditApplication = () => {
    const { userId } = useParams();
    const [capital, setCapital] = useState("");
    const [annualInterest, setAnnualInterest] = useState("");
    const [years, setYears] = useState("");
    const [type, setType] = useState("");
    const [income, setIncome] = useState("");
    const [documents, setDocuments] = useState([]);

    //Para el tipo de credito
    const handleCreditype = (event) =>{
        setType(event.target.value);
        //Borrar el interez cuando desee cambiar el tipo
        setAnnualInterest("");
    };

    //Limites de intereses en base al texto
    const getInterestLimits = () =>{
        switch (type){
            case "1":
                return { min: 3.5, max: 5}; //Primera vivienda
            case "2":
                return { min: 4, max: 6}; //Segunda vivienda
            case "3":
                return { min: 5, max: 7}; //Propiedades comerciales
            case "4":
                return { min:4.5, max: 6}; //Remodelacion
            default:
                return { min: 0, max: 0 };
        }
    };

    const interestLimits = getInterestLimits();

     // Carga de documentos
     const handleDocuments = (event) => {
        setDocuments(event.target.files);
    };

    // Manejar el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();

        const interest = parseFloat(annualInterest);
        if (interest < interestLimits.min || interest > interestLimits.max) {
            alert(`La tasa de interés debe estar entre ${interestLimits.min} y ${interestLimits.max}.`);
            return; // Stop submission if the interest is out of range
        }

        const formData = new FormData();
        formData.append("capital", capital);
        formData.append("annual_interest", annualInterest);
        formData.append("years", years);
        formData.append("type", type);
        formData.append("income", income);
        
        // Agregar cada archivo PDF al FormData
        for (let i = 0; i < documents.length; i++) {
            formData.append("documents", documents[i]);
        }

        creditService
            .create(formData, userId)
            .then((response) => {
                console.log("Crédito creado:", response.data);
                alert("Crédito creado exitosamente.");
            })
            .catch((error) => {
                console.error("Error al crear el crédito:", error);
                alert("Error al crear el crédito. Intenta de nuevo.");
            });
        // Aquí deberías llamar a la función para crear el crédito, pasando `formData` como datos.
        // Por ejemplo: await create(formData, userId);
    };

    const handleAnnualInterestChange = (e) => {
        const value = e.target.value;
        const floatValue = parseFloat(value);
        
        // Check if the value is a number and within limits
        if (!isNaN(floatValue) && (floatValue >= interestLimits.min && floatValue <= interestLimits.max)) {
            setAnnualInterest(value);
        } else if (value === "") {
            // Allow empty input to reset the field
            setAnnualInterest(value);
        } else {
            // Show an alert or warning if the input is out of bounds
            alert(`La tasa de interés debe estar entre ${interestLimits.min} y ${interestLimits.max}.`);
        }
    };
    

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            component="form"
            sx={{ width: '50%', margin: 'auto', padding: 2, boxShadow: 3 }}
        >
            <Typography variant="h4" gutterBottom>
                Solicitud de Crédito
            </Typography>
            <hr />
            
            <FormControl fullWidth>
                <TextField
                    id="tipoCredito"
                    label="Tipo de Crédito"
                    value={type}
                    select
                    variant="standard"
                    onChange={handleCreditype}
                >
                    <MenuItem value="">Selecciona un tipo</MenuItem>
                    <MenuItem value="1">Primera vivienda</MenuItem>
                    <MenuItem value="2">Segunda vivienda</MenuItem>
                    <MenuItem value="3">Propiedades comerciales</MenuItem>
                    <MenuItem value="4">Remodelación</MenuItem>
                </TextField>
            </FormControl>

            {type && (
                <>
                    <FormControl fullWidth>
                        <TextField
                            label="Capital"
                            type="number"
                            value={capital}
                            variant="standard"
                            onChange={(e) => setCapital(e.target.value)}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <TextField
                            id="annualInterest"
                            label="Tasa de interés anual (%)"
                            type="number"
                            value={annualInterest}
                            variant="standard"
                            onChange={handleAnnualInterestChange}
                            placeholder={`Entre ${interestLimits.min} y ${interestLimits.max}`}
                            inputProps={{
                                min: interestLimits.min,
                                max: interestLimits.max,
                            }}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <TextField
                            label="Años"
                            type="number"
                            value={years}
                            variant="standard"
                            onChange={(e) => setYears(e.target.value)}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <TextField
                            label="Ingresos"
                            type="number"
                            value={income}
                            variant="standard"
                            onChange={(e) => setIncome(e.target.value)}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <input
                            type="file"
                            multiple
                            accept=".pdf"
                            onChange={handleDocuments}
                            style={{ margin: '16px 0' }}
                        />
                    </FormControl>

                    <FormControl>
                        <Button
                            variant="contained"
                            color="info"
                            onClick={handleSubmit}
                            sx={{ marginTop: 2 }}
                        >
                            Solicitar Crédito
                        </Button>
                    </FormControl>
                </>
            )}
            <hr />
            <Button variant="text" href="/credits/list">
                Volver a la lista
            </Button>
        </Box>
    );
};

export default CreditApplication;