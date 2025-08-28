import API from "./axios";

// Datasets
export const getDatasets = () => API.get("/datasets");
export const createDataset = (data) => API.post("/datasets", data);
