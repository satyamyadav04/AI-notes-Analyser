import api from "./api";

const login = (payload) => api.post("/auth/login", payload);
const register = (payload) => api.post("/auth/register", payload);

export { login, register };
