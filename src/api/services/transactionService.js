import apiClient from '../apiClient';

export const fetchTransactions = async () => {
  const { data } = await apiClient.get('/transactions');
  return data;
};

export const createTransaction = async (payload) => {
  const { data } = await apiClient.post('/transactions', payload);
  return data;
};

export const updateTransaction = async (id, payload) => {
  const { data } = await apiClient.put(`/transactions/${id}`, payload);
  return data;
};

export const deleteTransaction = async (id) => {
  await apiClient.delete(`/transactions/${id}`);
};
