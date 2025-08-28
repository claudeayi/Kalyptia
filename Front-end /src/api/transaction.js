import API from "./axios";

// Transactions
export const buyDataset = (datasetId, data) =>
  API.post(`/transactions/buy/${datasetId}`, data);

export const getMyTransactions = () => API.get("/transactions");
