import apiClient from '../apiClient';

export const loginRequest = async ({ email, password }) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data;
};

export const logoutRequest = async () => {
  const { data } = await apiClient.post('/auth/logout');
  return data;
};
