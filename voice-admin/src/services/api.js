import axios from 'axios';
import {API_BASE_URL , AGENT_BASE_URL}  from '../services/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Dashboard Analytics
export const getDashboardAnalytics = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  const response = await api.get('api/analytics/dashboard', { params });
  return response.data;
};

// Call Volume
export const getCallVolume = async (days = 15) => {
  const response = await api.get('api/analytics/call-volume', { params: { days } });
  return response.data;
};

// Hourly Analytics
export const getHourlyAnalytics = async () => {
  const response = await api.get('api/analytics/hourly');
  return response.data;
};

// Filters
export const getFilters = async () => {
  const response = await api.get('api/filters');
  return response.data;
};

// Lead Data Table
export const getLeads = async ({ status, industry_type, organization, limit = 10000, skip = 0 } = {}) => {
  const params = { limit, skip };
  if (status) params.status = status;
  if (industry_type) params.industry_type = industry_type;
  if (organization) params.organization = organization;
  const response = await api.get('api/data/leads', { params });
  return response.data;
};

// Issues Data Table
export const getIssues = async ({ status, industry_type, organization, limit = 10000, skip = 0 } = {}) => {
  const params = { limit, skip };
  if (status) params.status = status;
  if (industry_type) params.industry_type = industry_type;
  if (organization) params.organization = organization;
  const response = await api.get('api/data/issues', { params });
  return response.data;
};

// LiveKit Session
export const createSession = async () => {
  const response = await axios.post(`${AGENT_BASE_URL}sessions/create`);
  return response.data;
};

export { API_BASE_URL, AGENT_BASE_URL };
export default api;
