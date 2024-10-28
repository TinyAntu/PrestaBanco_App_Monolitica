import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import creditService from "../services/credit.service";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

function FollowCredit() {
    const [userId, setUserId] = useState(null);
    const [credits, setCredits] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCredit, setSelectedCredit] = useState(null);
    const [evaluationResult, setEvaluationResult] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId ? Number(storedUserId) : null); // Retrieve and convert to number
    }, []);

    //Todos los creditos del usuario
    const init = () => {
        creditService
            .getAll(userId)
            .then((response) => {
                setCredits(response.data);
            })
            .catch((error) => {
                console.log("Error al obtener créditos.", error);
            });
    };

    const handleEvaluateClick = (credit) => {
        setSelectedCredit(credit);

        if (credit.level === 1) {
            // Llamar a la función del servicio para evaluar el crédito en nivel 1
            creditService.evaluateStep1(credit.idCredit)
                .then((response) => {
                    setEvaluationResult(response.data);
                    setOpenDialog(true);
                })
                .catch((error) => {
                    console.log("Error al evaluar el crédito.", error);
                });
        }
    };


    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Cantidad</TableCell>
                            <TableCell align="left">Interés</TableCell>
                            <TableCell align="right">Nivel</TableCell>
                            <TableCell align="right">Etapa</TableCell>
                            <TableCell align="right">Tipo</TableCell>
                            <TableCell align="left">Estado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {credits.map((credit) => (
                            <TableRow key={credit.idCredit}>
                                <TableCell align="left">{credit.amount}</TableCell>
                                <TableCell align="left">{credit.annual_interest}</TableCell>
                                <TableCell align="right">{credit.level}</TableCell>
                                <TableCell align="right">{credit.e}</TableCell>
                                <TableCell align="right">{credit.type}</TableCell>
                                <TableCell align="right">{credit.state ? "Aprobado" : credit.state === null ? "En Revisión" : "Rechazado"}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleEvaluateClick(credit)}
                                    >
                                        Evaluar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
                <DialogTitle>Evaluar Crédito</DialogTitle>
                <DialogContentText sx={{ padding: '20px' }}>
                    {selectedCredit && (
                        <>
                            {/* Mensajes específicos según el nivel */}
                            {selectedCredit.e === 1 && (
                                <p>
                                    {"En revision inicial"}
                                </p>
                            )}

                            {selectedCredit.e === 2 && (
                                <p>
                                    {evaluationResult
                                        ? "Se cumple con la condición específica para el Nivel 2."
                                        : "No se cumple con la condición específica para el Nivel 2."}
                                </p>
                            )}

                            {/* Agrega más evaluaciones para otros niveles aquí */}
                        </>
                    )}
                </DialogContentText>
                
            </Dialog>
        </>
    );
}

export default FollowCredit;
