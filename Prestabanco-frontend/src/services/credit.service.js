import httpClient from "../http-common";

const simulate = (capital, interest, years) => {
    return httpClient.post("/api/v1/credits/simulate", {capital,interest,years,});
}

const remove = id => {
    return httpClient.delete(`/api/v1/credits/${id}`)
}

export default{simulate, remove};