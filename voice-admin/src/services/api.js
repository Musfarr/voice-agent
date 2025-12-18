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
  params.company_name = "Telenor"
  const response = await api.get('api/analytics/dashboard', { params });
  return response.data;
};

// Call Volume
export const getCallVolume = async (days = 15) => {

  const params = { days, company_name: 'Telenor' };
  const response = await api.get('api/analytics/call-volume', { params });
  return response.data;
};

// Hourly Analytics
export const getHourlyAnalytics = async () => {
  const response = await api.get('api/analytics/hourly', { params: { company_name: 'Telenor' } });
  return response.data;
};

// Filters
export const getFilters = async ({ company_name = 'Telenor' } = {}) => {
  const response = await api.get('api/filters', { params: { company_name } });
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

// User Queries
export const getUserQueries = async ({ status, city_name, limit = 10000, skip = 0 } = {}) => {
  const params = {
    company_name: 'Telenor',
    limit,
    skip,
  };
  if (status) params.status = status;
  if (city_name) params.city_name = city_name;

  const response = await api.get('api/data/queries', { params });
  return response.data;
};

// LiveKit Session
export const createSession = async () => {
  const response = await axios.post(`${AGENT_BASE_URL}sessions/create`);
  return response.data;
};

export { API_BASE_URL, AGENT_BASE_URL };
export default api;
