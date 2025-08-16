import { http } from './http';

export const bookingApi = {
  list: (token) => http.get('/api/bookings', { token }),
  byCustomer: (customerId, token) => http.get(`/api/bookings/customer/${customerId}`, { token }),
  byBranch: (branchId, token) => http.get(`/api/bookings/branch/${branchId}`, { token }),
  create: (booking, token) => {
    const payload = {
      customerId: booking.customerId,
      customerName: booking.customerName,
      vehicleId: booking.vehicleId,
      vehicleName: booking.vehicleName,
      branchId: booking.branchId,
      branchName: booking.branchName,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalAmount: booking.totalAmount,
      status: 'pending'
    };
    return http.post('/api/bookings', { body: payload, token });
  },
  approve: (id, booking, token) => {
    console.log('Approving booking:', id, 'with body:', booking);
    const body = {
      branchAdminNotes: booking.branchAdminNotes || '',
      status: 'APPROVED',
      vehicleId: booking.vehicleId,
      updateAvailability: true
    };
    console.log('Sending approval request with body:', body);
    return http.put(`/api/bookings/${id}/approve`, { body, token });
  },
  reject: (id, booking, token) => {
    console.log('Rejecting booking:', id, 'with body:', booking);
    const body = {
      branchAdminNotes: booking.branchAdminNotes || '',
      status: 'REJECTED',
      vehicleId: booking.vehicleId,
      updateAvailability: booking.status === 'APPROVED' // Only update if previously approved
    };
    console.log('Sending reject request with body:', body);
    return http.put(`/api/bookings/${id}/reject`, { body, token });
  },
};


