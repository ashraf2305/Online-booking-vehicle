import { http } from './http';

export const userApi = {
  login: ({ userId, password }) => {
    console.log('Calling login API with:', { userId, password: '***' });
    return http.post('/api/auth/login', { body: { userId, password } });
  },
  validate: (token) => {
    console.log('Calling validate API with token:', token?.substring(0, 20) + '...');
    return http.post('/api/auth/validate', { token });
  },
  register: ({ userId, password, role }) => {
    console.log('Calling register API with:', { userId, role });
    return http.post('/api/users/register', { body: { userId, password, role } });
  },
  getAll: (token) => {
    console.log('Calling getAll users API with token:', token?.substring(0, 20) + '...');
    return http.get('/api/users', { token });
  },
  approve: (id, token) => {
    console.log('Calling approve user API for ID:', id);
    return http.put(`/api/users/${id}/approve`, { token });
  },
  reject: (id, token) => {
    console.log('Calling reject user API for ID:', id);
    return http.put(`/api/users/${id}/reject`, { token });
  },
  stats: (token) => {
    console.log('Calling user stats API');
    return http.get('/api/users/stats', { token });
  },
  updateProfile: (id, profile, token) => {
    console.log('Calling update profile API for ID:', id);
    console.log('Profile data:', profile);
    return http.put(`/api/users/${id}/profile`, { body: profile, token })
      .then(response => {
        console.log('Profile update response:', response);
        return response;
      });
  },
  branchAdmins: (token) => {
    console.log('Calling branch admins API');
    return http.get('/api/users/branch-admins', { token });
  },
};


