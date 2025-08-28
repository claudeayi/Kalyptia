import API from "./axios";

// Auth
export const login = (data) => API.post("/auth/login", data);
export const register = (data) => API.post("/auth/register", data);
export const getProfile = () => API.get("/auth/me");
