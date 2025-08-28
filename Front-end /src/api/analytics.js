import API from "./axios";

// Analytics
export const getRevenue = () => API.get("/analytics/revenue");
export const getTopDatasets = () => API.get("/analytics/top-datasets");
export const getTopUsers = () => API.get("/analytics/top-users");
export const getStats = () => API.get("/analytics/stats");
