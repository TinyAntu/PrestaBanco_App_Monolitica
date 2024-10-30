import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import creditService from "../services/credit.service";
import documentService from '../services/document.service';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const CreditEvaluation = () => {
  const [credits, setCredits] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  const init = () => {
    creditService
      .getAll()
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
      creditService.evaluateStep1(credit.idCredit)
        .then((response) => {
          setEvaluationResult(response.data);
          setOpenDialog(true);
        })
        .catch((error) => {
          console.log("Error al evaluar el crédito.", error);
        });
    }
    
    if (credit.level === 2) {
          setOpenDialog(true);
          setEvaluationResult(true);
    }
    if (credit.level === 3) {
          setOpenDialog(true);
          setEvaluationResult(true);
    }

    if (credit.level === 4) {
      creditService.evaluateStep4(credit.idCredit)
        .then((response) => {
          setEvaluationResult(response.data);
          setOpenDialog(true);
        })
        .catch((error) => {
          console.log("Error al evaluar el crédito.", error);
        });
    }

    if (credit.level === 5) {
      creditService.evaluateStep5(credit.idCredit)
        .then((response) => {
          setEvaluationResult(response.data);
          setOpenDialog(true);
        })
        .catch((error) => {
          console.log("Error al evaluar el crédito.", error);
        });
    }

    if (credit.level === 6) {
      creditService.evaluateStep6(credit.idCredit)
        .then((response) => {
          setEvaluationResult(response.data);
          setOpenDialog(true);
        })
        .catch((error) => {
          console.log("Error al evaluar el crédito.", error);
        });
    }
  };

  const handleViewMoreClick = (credit) => {
    setSelectedCredit(credit);
    setOpenDetailsDialog(true);
  };

  const fetchDocuments = (creditId) => {
    documentService.getDocumentsByCreditId(creditId)
        .then(response => {
            setDocuments(response.data);
        })
        .catch(error => {
            console.log("Error Consiguiendo los Documentos:", error);
        });
  };

  const handleDownloadDocument = (documentId) => {
    documentService.downloadDocument(documentId)
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'document.pdf'); // Cambiar si se desea usar el nombre real del archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        console.log("Error al descargar el documento.", error);
      });
  };

  const handleLevelUp = () => {
    if (selectedCredit && evaluationResult === true) {
      const updatedCredit = { ...selectedCredit, level: selectedCredit.level + 1 };

      creditService.update(selectedCredit.idCredit, updatedCredit)
        .then(() => {
          console.log("Nivel del crédito incrementado");
          init();
          setOpenDialog(false);
        })
        .catch((error) => {
          console.log("Error al intentar incrementar el nivel del crédito.", error);
        });
    }
  };

  const handleReject = () =>{
    if (selectedCredit) {
      const updatedCredit = { ...selectedCredit, state: false, e: 7 };
      

      creditService.update(selectedCredit.idCredit, updatedCredit)
        .then(() => {
          console.log("Crédito rechazado");
          init();
          setOpenDialog(false);
        })
        .catch((error) => {
          console.log("Error al intentar rechazar el crédito.", error);
        });
    }
  };

  const handleRevision = () =>{
    if (selectedCredit) {
      const updatedCredit = { ...selectedCredit, state: null };

      creditService.update(selectedCredit.idCredit, updatedCredit)
        .then(() => {
          console.log("Credito en revision");
          init();
          setOpenDialog(false);
        })
        .catch((error) => {
          console.log("Error al intentar revisar el credito.", error);
        });
    }
  };

  useEffect(() => {
    if (selectedCredit) {
      fetchDocuments(selectedCredit.idCredit);
    }
  }, [selectedCredit]);

  useEffect(() => {
    const userTypeId = localStorage.getItem("userTypeId");
    if (userTypeId !== "2") {
      navigate("/home");
      alert("Esta es una zona solo para ejecutivos");
    } else {
      init();
    }
  }, [navigate]);

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
                  <Button variant="contained" color="primary" size="small" onClick={() => handleEvaluateClick(credit)}>
                    Evaluar
                  </Button>

                  <Button 
                    variant="outlined" 
                    sx={{ color: "white", backgroundColor: "#333", "&:hover": { backgroundColor: "#555" } }} 
                    size="small" 
                    onClick={() => handleViewMoreClick(credit)}
                  >
                    Ver Más
                  </Button>

                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false) } fullWidth>
        <DialogTitle>Evaluar Crédito</DialogTitle>
        <DialogContentText sx={{ padding: '20px' }} >
            {selectedCredit && (
                <> 
                    {/* Mensajes específicos según el nivel */}
                    {evaluationResult !== null && selectedCredit.level === 1 && (
                        <p>
                            {evaluationResult
                                ? "Se cumple con el requerimiento de cuota/ingreso <= 35%."
                                : "No se cumple con el requerimiento de cuota/ingreso <= 35%."}
                        </p>
                    )}

                    {evaluationResult !== null && selectedCredit.level === 2 && (
                        <p>
                            {"Determine el estado de DICOM con el historial crediticio"}
                        </p>
                    )}

                    {evaluationResult !== null && selectedCredit.level === 3 && (
                        <p>
                            {"Determine la estabilidad laboral con el documento pertinente"}
                        </p>
                    )}

                    {evaluationResult !== null && selectedCredit.level === 4 && (
                        <p>
                            {evaluationResult
                                ? "Se cumple con el requerimiento de suma de deudas es menor al 50% de los ingresos."
                                : "La suma de las deudas excede el 50% del ingresos."}
                        </p>
                    )}

                    {evaluationResult !== null && selectedCredit.level === 5 && (
                        <p>
                            {evaluationResult
                                ? "El monto de financiamineto no excede el maximo designado para el tipo de credito."
                                : "El monto de financiamineto excede el maximo designado para el tipo de credito."}
                        </p>
                    )}

                    {evaluationResult !== null && selectedCredit.level === 6 && (
                        <p>
                            {evaluationResult
                                ? "No se encuentra cerca a la edad maxima '75 años'."
                                : "Se encuentra muy cercano a la edad maxima '75 años'."}
                        </p>
                    )}

                    <div>
                        <h4>Documentos Asociados:</h4>
                          {documents.map(doc => (
                          <Button
                          key={doc.id}
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleDownloadDocument(doc.id)}
                          >
                            Descargar {doc.filename}
                          </Button>
                      ))}
                    </div>
                    {/* Agrega más evaluaciones para otros niveles aquí */}
                </>
            )}
        </DialogContentText>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancelar
          </Button>

          <Button
            onClick={handleLevelUp}
            color="primary"
            variant="contained"
            disabled={!evaluationResult} // Deshabilitar si no se cumple la condición
          >
            Incrementar Nivel
          </Button>

          <Button
            onClick={handleReject}
            color="primary"
            variant="contained"
          >
            Rechazar
          </Button>

          <Button
            onClick={handleRevision}
            color="primary"
            variant="contained"
          >
            En revision
          </Button>

        </DialogActions>
      </Dialog>
      
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} fullWidth>
        <DialogTitle>Detalles del Crédito</DialogTitle>
        <DialogContent>
          {selectedCredit && (
            <>
              <p><strong>Id Crédito:</strong> {selectedCredit.idCredit}</p>
              <p><strong>Cantidad:</strong> {selectedCredit.amount}</p>
              <p><strong>Capital:</strong> {selectedCredit.capital}</p>
              <p><strong>Ingresos:</strong> {selectedCredit.income}</p>
              <p><strong>Valor de la Propiedad:</strong> {selectedCredit.property_value}</p>
              <p><strong>Deuda:</strong> {selectedCredit.debt}</p>
              <p><strong>Interés Anual:</strong> {selectedCredit.annual_interest}</p>
              <p><strong>Años:</strong> {selectedCredit.years}</p>
              <p><strong>Tipo:</strong> {
                selectedCredit.type === 1 ? "Primera Vivienda" :
                selectedCredit.type === 2 ? "Segunda Vivienda" :
                selectedCredit.type === 3 ? "Propiedades Comerciales" :
                selectedCredit.type === 4 ? "Remodelación" :
                "Tipo Desconocido"
              }</p>
              <p><strong>Estado:</strong> {selectedCredit.state ? "Aprobado" : selectedCredit.state === null ? "En Revisión" : "Rechazado"}</p>
              {/* Add more fields as necessary */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default CreditEvaluation;