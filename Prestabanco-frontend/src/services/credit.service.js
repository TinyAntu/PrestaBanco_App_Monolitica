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
            //Dar conocimiento que se mandan archivos
            'Content-Type': 'multipart/form-data',
        },
    });
};

export default{simulate, remove, create};