import { useState, useEffect } from "react";
import creditService from "../services/credit.service";
import documentService from '../services/document.service';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, Typography, DialogContentText, DialogTitle, TextField } from "@mui/material";

function FollowCredits() {
    const [userId, setUserId] = useState(null);
    const [credits, setCredits] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCredit, setSelectedCredit] = useState(null);
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [documents, setDocuments] = useState({
        file1: null,
        file2: null,
        file3: null,
    });

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId ? Number(storedUserId) : null);
    }, []);
    
    useEffect(() => {
        if (userId) {
            init(); // Fetch credits when userId is set
        }
    }, [userId]);

    const init = () => {
        if (!userId) return; 
        creditService
            .getAllById(userId)
            .then((response) => {
                setCredits(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener créditos.", error);
            });
    };

    const handleDocumentChange = (e, docType) => {
        const file = e.target.files[0];
        if (docType === 'file1') {
            setDocuments((prev) => ({ ...prev, file1: file }));
        } else if (docType === 'file2') {
            setDocuments((prev) => ({ ...prev, file2: file }));
        } else if (docType === 'file3') {
            setDocuments((prev) => ({ ...prev, file3: file }));
        }
    };

    const handleFollowClick = (credit) => {
        setSelectedCredit(credit);

        if (credit.e === 1) {
            creditService.follow1(credit.idCredit)
                .then((response) => {
                    setEvaluationResult(response.data);
                    setOpenDialog(true);
                })
                .catch((error) => {
                    console.log("Error al evaluar el crédito.", error);
                });
        } else if (credit.e === 2) {
            setOpenDialog(true); // Open dialog for uploading documents
        } else if (credit.e === 3) {
            setOpenDialog(true); // Open dialog for the wait till e == 4
            setEvaluationResult(false); // Set to false to disable the "Pasar de etapa" button
        }

    };

    const handleStageUp = () => {
        if (selectedCredit && evaluationResult === true) {
            const updatedCredit = { ...selectedCredit, e: selectedCredit.e + 1 };
    
            creditService.update(selectedCredit.idCredit, updatedCredit)
                .then(() => {
                    console.log("Etapa del credito aumentada");
                    init();
                    setOpenDialog(false);
                })
                .catch((error) => {
                    console.log("Error al intentar incrementar la etapa del crédito.", error);
                });
        }
    };

    const uploadDocuments = async (creditId) => {
        const { file1, file2, file3 } = documents;

        if (file1 && file2 && file3) {
            const documentData1 = {
                file: await convertToBase64(file1),
                doc_type: 'comprobante_ingresos',
                filename: file1.name,
                idCredit: creditId,
            };

            const documentData2 = {
                file: await convertToBase64(file2),
                doc_type: 'certificado_avaluo',
                filename: file2.name,
                idCredit: creditId,
            };

            const documentData3 = {
                file: await convertToBase64(file3),
                doc_type: 'capacidad_ahorro',
                filename: file3.name,
                idCredit: creditId,
            };

            try {
                await Promise.all([
                    documentService.create(documentData1),
                    documentService.create(documentData2),
                    documentService.create(documentData3),
                ]);
                alert("Documents uploaded successfully.");
                setEvaluationResult(true);
            } catch (error) {
                console.error("Error uploading documents:", error);
                alert("Error uploading documents. Please try again.");
            }
        } else {
            alert("Please upload both documents.");
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => resolve(reader.result.split(',')[1]); // Base64
            reader.onerror = reject;
        });
    };

    const handleSubmitDocuments = () => {
        if (selectedCredit) {
            uploadDocuments(selectedCredit.idCredit);
            setOpenDialog(false); // Close dialog after submission
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
                            <TableCell align="right">Estado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {credits.map((credit) => (
                            <TableRow key={credit.idCredit}>
                                <TableCell align="left">{credit.amount}</TableCell>
                                <TableCell align="left">{credit.annual_interest}</TableCell>
                                <TableCell align="right">{credit.level}</TableCell>

                                <TableCell align="right">
                                {credit.e === 1 && "Revision Inicial"}
                                {credit.e === 2 && "Pendiente de Documentacion"}
                                {credit.e === 3 && "En Evaluacion"}
                                {credit.e === 4 && "Pre-Aprobada"}
                                {credit.e === 5 && "En Aprobacion Final"}
                                {credit.e === 6 && "Aprobada"}
                                {credit.e === 7 && "Rechazada"}
                                {credit.e === 8 && "Cancelada por el Cliente"}
                                {credit.e === 9 && "En Desembolso"}
                                {![1, 2, 3, 4,5,6,7,8,9].includes(credit.e) && "Etapa Desconocida"}
                                </TableCell>
                                
                                <TableCell align="right">
                                {credit.type == 1 && "Primer Vivienda"}
                                {credit.type == 2 && "Segunda Vivienda"}
                                {credit.type == 3 && "Propiedades Comerciales"}
                                {credit.type == 4 && "Remodelacion"}
                                {![1, 2, 3, 4].includes(credit.type) && "Tipo Desconocido"}
                                </TableCell>


                                <TableCell align="right">{credit.state ? "Aprobado" : credit.state === null ? "En Revisión" : "Rechazado"}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleFollowClick(credit)}
                                    >
                                        Consultar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
                <DialogTitle>Consultar credito</DialogTitle>
                <DialogContentText sx={{ padding: '20px' }}>
                    {selectedCredit && (
                        <>
                            {/* Messages specific to the evaluation result */}
                            {evaluationResult !== null && selectedCredit.e === 1 && (
                                <p>
                                    {evaluationResult
                                        ? "Se completaron los campos requeridos."
                                        : "No se completaron los campos requeridos."}
                                </p>
                            )}

                            {selectedCredit.e === 2 && (
                                <>
                                    <TextField
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleDocumentChange(e, 'file1')}
                                        style={{ margin: '16px 0' }}
                                    />
                                    <Typography>Comprobante de ingresos</Typography>

                                    <TextField
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleDocumentChange(e, 'file2')}
                                        style={{ margin: '16px 0' }}
                                    />
                                    <Typography>Certificado de avalúo</Typography>

                                    <TextField
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => handleDocumentChange(e, 'file3')}
                                        style={{ margin: '16px 0' }}
                                    />
                                    <Typography>Capacidad de ahorro</Typography>
                                </>
                            )}

                            {selectedCredit.e === 3 && (
                                <p>
                                    {"Espere hasta que un ejecutivo realize las comprobaciones necesarias."}
                                </p>
                            )}
                        </>
                    )}
                </DialogContentText>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancelar
                    </Button>

                    {selectedCredit && selectedCredit.e === 2 && (
                        <Button
                            onClick={handleSubmitDocuments}
                            color="primary"
                            variant="contained"
                        >
                            Subir Documentos
                        </Button>
                    )}

                    <Button
                        onClick={handleStageUp}
                        color="primary"
                        variant="contained"
                        disabled={!evaluationResult} // Disable if evaluation condition is not met
                    >
                        Pasar de etapa
                    </Button>
                </DialogActions>          
            </Dialog>
        </>
    );
}

export default FollowCredits;

