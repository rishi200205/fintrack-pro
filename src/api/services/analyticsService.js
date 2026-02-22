import apiClient from '../apiClient';

export const fetchAnalyticsSummary = async () => {
  const { data } = await apiClient.get('/analytics/summary');
  return data;
};
