import { http } from './http';

export const requestApi = {
  list: (token) => http.get('/api/requests', { token }),
  create: (payload, token) => http.post('/api/requests', { body: payload, token }),
  approve: (id, payload, token) => http.put(`/api/requests/${id}/approve`, { body: payload, token }),
  reject: (id, payload, token) => http.put(`/api/requests/${id}/reject`, { body: payload, token }),
};


