export function mapRoleToUi(role) {
  const r = (role || '').toString().toUpperCase();
  if (r === 'ADMIN') return 'admin';
  if (r === 'BRANCH_ADMIN' || r === 'BRANCH-ADMIN') return 'branch-admin';
  if (r === 'CUSTOMER') return 'customer';
  return role;
}

export function normalizeUser(apiUser) {
  if (!apiUser) return apiUser;
  const role = mapRoleToUi(apiUser.role);
  const status = (apiUser.status || '').toString().toLowerCase();
  const profile = role === 'customer'
    ? {
        name: apiUser.fullName || '',
        email: apiUser.email || '',
        phone: apiUser.phone || '',
        address: apiUser.address || '',
        licenseNumber: apiUser.licenseNumber || '',
      }
    : role === 'branch-admin'
    ? {
        branchName: apiUser.branchName || '',
        branchCode: apiUser.branchCode || '',
        managerName: apiUser.managerName || '',
        phone: apiUser.phone || '',
        address: apiUser.address || '',
      }
    : {};
  return { ...apiUser, role, status, profile };
}


