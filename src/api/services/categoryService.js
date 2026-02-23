import apiClient from '../apiClient';

export const fetchCategories = async () => {
  const { data } = await apiClient.get('/categories');
  return data;
};

export const createCategory = async (payload) => {
  const { data } = await apiClient.post('/categories', payload);
  return data;
};
