import { useState } from 'react';
import creditService from '../services/credit.service';

const CreditApplication = () => {
    const [capital, setCapital] = useState("");
    const [annualInterest, setAnnuaInterest] = useState("");
    const [years, setYears] = useState("");
    const [type, setType] = useState("");
    const [income, setIncome] = useState("");
    const [documents, setDocuments] = useState([]);

    //Para el tipo de credito
    const handleCreditype = (event) =>{
        setType(event.target.value);
        //Borrar el interez cuando desee cambiar el tipo
        setAnnuaInterest("");
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
    const handleSubmit = async () => {
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

    return (
        <div>
            <h2>Solicitud de Crédito</h2>
            <div>
                <label>Tipo de Crédito:</label>
                <select value={type} onChange={handleCreditype}>
                    <option value="">Selecciona un tipo</option>
                    <option value="1">Primera vivienda</option>
                    <option value="2">Segunda vivienda</option>
                    <option value="3">Propiedades comerciales</option>
                    <option value="4">Remodelación</option>
                </select>
            </div>

            {type && (
                <div>
                    <div>
                        <label>Capital:</label>
                        <input
                            type="number"
                            value={capital}
                            onChange={(e) => setCapital(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Tasa de interés anual (%):</label>
                        <input
                            type="number"
                            value={annualInterest}
                            onChange={(e) => setAnnuaInterest(e.target.value)}
                            min={interestLimits.min}
                            max={interestLimits.max}
                            placeholder={`Entre ${interestLimits.min} y ${interestLimits.max}`}
                        />
                    </div>

                    <div>
                        <label>Años:</label>
                        <input
                            type="number"
                            value={years}
                            onChange={(e) => setYears(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Ingresos:</label>
                        <input
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Documentos (PDF):</label>
                        <input
                            type="file"
                            multiple
                            accept=".pdf"
                            onChange={handleDocuments}
                        />
                    </div>

                    <button onClick={handleSubmit}>Solicitar Crédito</button>
                </div>
            )}
        </div>
    );
}

export default CreditApplication;