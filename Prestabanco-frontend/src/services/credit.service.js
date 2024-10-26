import httpClient from "../http-common";

const simulate = (capital, interest, years) => {
    return httpClient.get("/api/v1/credits/simulate", {
        params: {
            capital,
            annual_interest: interest, // Make sure this matches the backend parameter name
            years,
        },
    });
};

const remove = (id) => {
    return httpClient.delete(`/api/v1/credits/${id}`)
}

const create = (data, userId) => {
    return httpClient.post(`/api/v1/credits/create?userId=${userId}`, data, {
        headers: {
            'Content-Type': 'application/json', // Usar 'application/json' para enviar el objeto JSON
        },
    });
};

const getAll = () => {
    return httpClient.get('/api/v1/credits/getAll');
}

const evaluateStep1 = (creditId) => {
    return httpClient.get(`/api/v1/credits/R1/${creditId}`);
  };

  const update = (id, creditData) => {
    return httpClient.put(`/api/v1/credits/update/${id}`, creditData);
};


export default{simulate, remove, create, getAll, evaluateStep1, update};