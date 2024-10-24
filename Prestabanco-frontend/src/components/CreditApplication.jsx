import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import creditService from '../services/credit.service';
import { Box, Typography, FormControl, TextField, Button, MenuItem } from "@mui/material";

const CreditApplication = () => {
    const [userId, setUserId] = useState(null);
    console.log("User ID:", userId);
    const [capital, setCapital] = useState("");
    const [annualInterest, setAnnualInterest] = useState("");
    const [years, setYears] = useState("");
    const [type, setType] = useState("");
    const [income, setIncome] = useState("");
    const [documents, setDocuments] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId ? Number(storedUserId) : null); // Retrieve and convert to number
    }, []);

    const handleCreditype = (event) => {
        setType(event.target.value);
        setAnnualInterest("");
        setDocuments({}); // Reset documents when changing credit type
    };

    const getInterestLimits = () => {
        switch (type) {
            case "1":
                return { min: 3.5, max: 5 }; // First home
            case "2":
                return { min: 4, max: 6 }; // Second home
            case "3":
                return { min: 5, max: 7 }; // Commercial properties
            case "4":
                return { min: 4.5, max: 6 }; // Remodeling
            default:
                return { min: 0, max: 0 };
        }
    };

    const interestLimits = getInterestLimits();

    const handleDocumentChange = (e, docType) => {
        const file = e.target.files[0]; // Get the first selected file
        setDocuments((prevDocs) => ({ ...prevDocs, [docType]: file }));
    };

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
        formData.append("userId", userId); 

        Object.entries(documents).forEach(([docType, file]) => {
            formData.append("documents", file); // Append the file
            formData.append("doc_types", docType); // Append the corresponding document type
        });

        try {
            const response = await creditService.create(formData);
            console.log("Crédito creado:", response.data);
            alert("Crédito creado exitosamente.");
        } catch (error) {
            console.error("Error al crear el crédito:", error);
            alert("Error al crear el crédito. Intenta de nuevo.");
        }
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

                    {/* Campos de carga de documentos basados en el tipo de crédito */}    
                    {/* Primera vivienda */}          
                    {type === "1" && (
                        <>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleDocumentChange(e, 'comprobante_ingresos')}
                                style={{ margin: '16px 0' }}
                            />
                            <Typography>Comprobante de Ingresos</Typography>

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleDocumentChange(e, 'certificado_avaluo')}
                                style={{ margin: '16px 0' }}
                            />
                            <Typography>Certificado de avaluo</Typography>

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleDocumentChange(e, 'historial_credito')}
                                style={{ margin: '16px 0' }}
                            />
                            <Typography>Historial de crediticio</Typography>
                        </>
                    )}
                    {/* Segunda vivienda */}  
                    {type === "2" && (
                        <>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleDocumentChange(e, 'comprobante_ingresos')}
                                style={{ margin: '16px 0' }}
                            />
                            <Typography>Comprobante de ingresos</Typography>

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleDocumentChange(e, 'certificado_avaluo')}
                                style={{ margin: '16px 0' }}
                            />
                            <Typography>Certificado de avaluo</Typography>

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleDocumentChange(e, 'escritura_primera_vivienda')}
                                style={{ margin: '16px 0' }}
                            />
                            <Typography>Escritura de la primera vivienda</Typography>

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleDocumentChange(e, 'historial_credito')}
                                style={{ margin: '16px 0' }}
                            />
                            <Typography>Historial de crediticio</Typography>
                        </>
                    )}
                    {/* Propiedades comerciales */}  
                    {type === "3" && (
                        <>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleDocumentChange(e, 'estado_financiero')}
                                style={{ margin: '16px 0' }}
                            />
                            <Typography>Estado financiero del negocio</Typography>

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleDocumentChange(e, 'comprobante_ingresos')}
                                style={{ margin: '16px 0' }}
                            />
                            <Typography>Comprobantes de ingresos</Typography>

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleDocumentChange(e, 'certificado_avaluo')}
                                style={{ margin: '16px 0' }}
                            />
                            <Typography>Certificado de avaluo</Typography>

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleDocumentChange(e, 'plan_negocio')}
                                style={{ margin: '16px 0' }}
                            />
                            <Typography>Plan de negocios</Typography>
                        </>
                    )}

                    {/* Remodelacion */}  
                    {type === "4" && (
                        <>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleDocumentChange(e, 'comprobante_ingresos')}
                                style={{ margin: '16px 0' }}
                            />
                            <Typography>Comprobante de ingresos</Typography>

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleDocumentChange(e, 'presupuesto_remodelacion')}
                                style={{ margin: '16px 0' }}
                            />
                            <Typography>Presupuesto de la remodelacion</Typography>

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleDocumentChange(e, 'certificado_avaluo')}
                                style={{ margin: '16px 0' }}
                            />
                            <Typography>Certificado del avaluo actualizado</Typography>
                        </>
                    )}

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
