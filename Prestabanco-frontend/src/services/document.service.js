import httpClient from "../http-common";

const create = (data) => {
    return httpClient.post("/api/v1/docs/create", data, {
        headers: {
            "Content-Type": "application/json"
        }
    });
};

export default{create}