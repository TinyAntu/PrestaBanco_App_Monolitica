import httpClient from "../http-common";

const register = () => {
    return httpClient.post("/api/v1/users/register");
}

const login = () => {
    return httpClient.post("/api/v1/users/login");
}

export default { register, login };