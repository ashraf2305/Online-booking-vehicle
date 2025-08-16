import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { requestApi } from '../../api/requestApi';

export function VehicleRequestForm({ branchId, branchName, onClose, onSubmit }) {
  const { state } = useApp();
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const vehicle = state.vehicles.find(v => v.id === selectedVehicle);
    if (!vehicle) return;

    if (!state.authToken) return;

    const payload = {
      branchId: Number(branchId),
      branchName,
      vehicleId: Number(selectedVehicle),
      vehicleName: vehicle.name,
      requestedQuantity: Number(quantity),
    };
    requestApi.create(payload, state.authToken)
      .then((created) => {
        onSubmit(created);
      })
      .catch(() => {});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Request Vehicles</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Vehicle
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose a vehicle</option>
              {state.vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} - ${vehicle.pricePerDay}/day (Available: {vehicle.availability})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity Requested
            </label>
            {selectedVehicle && (
              <p className="text-sm text-gray-600 mb-2">
                Available: {state.vehicles.find(v => v.id === selectedVehicle)?.availability || 0} vehicles
              </p>
            )}
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max={selectedVehicle ? state.vehicles.find(v => v.id === selectedVehicle)?.availability : undefined}
              required
            />
          </div>

          {selectedVehicle && quantity > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Request Summary</h3>
              <div className="text-sm text-blue-800">
                <p>Vehicle: {state.vehicles.find(v => v.id === selectedVehicle)?.name}</p>
                <p>Quantity: {quantity} vehicles</p>
                <p>Daily Rate: ${state.vehicles.find(v => v.id === selectedVehicle)?.pricePerDay}/day per vehicle</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}