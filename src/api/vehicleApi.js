import { http } from './http';

export const vehicleApi = {
  list: async (token) => {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await http.get(`/api/vehicles?_t=${timestamp}`, { token });
    console.log('Fresh vehicle list fetched:', response);
    return response;
  },
  available: async (token) => {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await http.get(`/api/vehicles/available?_t=${timestamp}`, { token });
    console.log('Fresh available vehicles fetched:', response);
    return response;
  },
  getById: async (id, token) => {
    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    const response = await http.get(`/api/vehicles/${id}?_t=${timestamp}`, { token });
    console.log('Fresh vehicle data fetched for ID:', id, response);
    return response;
  },
  create: (vehicle, token) => http.post('/api/vehicles', { body: vehicle, token }),
  update: (id, vehicle, token) => http.put(`/api/vehicles/${id}`, { body: vehicle, token }),
  updateAvailability: async (id, change, token) => {
    try {
      // First get the current vehicle data
      const currentVehicle = await http.get(`/api/vehicles/${id}`, { token });
      console.log('Current vehicle data:', currentVehicle);

      // When approving: decrease availability by 1 (change will be -1)
      // When rejecting: increase availability by 1 (change will be +1)
      // Never exceed total_stock or go below 0
      const newAvailability = Math.min(
        Math.max(0, currentVehicle.availability + change),
        currentVehicle.total_stock
      );

      console.log(`Updating only availability from ${currentVehicle.availability} to ${newAvailability}`);
      console.log(`Total stock remains unchanged at ${currentVehicle.total_stock}`);

      // Update only the availability, keeping total_stock and all other fields unchanged
      return await http.put(`/api/vehicles/${id}`, { 
        body: { 
          ...currentVehicle,
          availability: newAvailability
        }, 
        token 
      });
    } catch (error) {
      console.error('Error in updateStock:', error);
      throw error;
    }
  },
};


