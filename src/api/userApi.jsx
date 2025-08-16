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
    // Map managerName to fullName for the API
    const apiProfile = {
      ...profile,
      fullName: profile.managerName || profile.fullName, // Send managerName as fullName to API
    };
    console.log('Profile data to be sent:', JSON.stringify(apiProfile, null, 2));
    return http.put(`/api/users/${id}/profile`, { body: apiProfile, token })
      .then(response => {
        console.log('Profile update raw response:', response);
        
        // Since the backend returns flat structure, create a profile object
        const normalizedProfile = {
          branchName: response.branchName || profile.branchName,
          branchCode: response.branchCode || profile.branchCode,
          address: response.address || profile.address,
          managerName: response.fullName || response.managerName || profile.managerName, // Map fullName from API to managerName
          phone: response.phone || profile.phone,
          email: response.email || profile.email,
          role: response.role?.toLowerCase() || profile.role
        };
        console.log('Normalized profile data:', JSON.stringify(normalizedProfile, null, 2));
        return normalizedProfile;
      });
  },
  branchAdmins: (token) => {
    console.log('Calling branch admins API with token:', token ? 'present' : 'missing');
    return http.get('/api/users/branch-admins', { token })
      .then(response => {
        console.log('Branch admins raw response:', response);
        console.log('Response type:', typeof response);
        
        if (!Array.isArray(response)) {
          console.error('Expected array response from branch-admins endpoint, got:', typeof response);
          // If it's a single object, wrap it in an array
          response = Array.isArray(response) ? response : [response];
        }

        return response.map(admin => {
          console.log('Processing admin:', admin);
          
          // Extract profile data from either profile object or root level
          const profile = {
            ...(admin.profile || {}),
            branchName: admin.profile?.branchName || admin.branchName,
            branchCode: admin.profile?.branchCode || admin.branchCode,
            address: admin.profile?.address || admin.address,
            phone: admin.profile?.phone || admin.phoneNumber || admin.contact,
            email: admin.profile?.email || admin.email,
            fullName: admin.profile?.fullName || admin.fullName || admin.name
          };

          const processedAdmin = {
            ...admin,
            id: admin.id || admin.userId || admin._id,
            status: (admin.status || '').toLowerCase(),
            profile: profile
          };

          console.log('Processed admin:', processedAdmin);
          return processedAdmin;
        });
      })
      .catch(error => {
        console.error('Failed to fetch branch admins:', error);
        throw error;
      });
  }
};
