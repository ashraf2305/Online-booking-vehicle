import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { userApi } from '../../api/userApi.jsx';

export function BookingForm({ vehicle, customer, onClose, onSubmit }) {
  const { state, dispatch } = useApp();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch branch admins when component mounts
  useEffect(() => {
    const fetchBranches = async () => {
      if (!state.authToken) {
        setLoading(false);
        return;
      }

      try {
        // Get branch admins from the API using the specific endpoint
        const branchAdmins = await userApi.branchAdmins(state.authToken);
        console.log('Raw branch admins response:', branchAdmins);
        
        if (!Array.isArray(branchAdmins)) {
          console.error('Expected array of branch admins, got:', typeof branchAdmins);
          throw new Error('Invalid response format');
        }
        
        // Log each branch admin and why they might be filtered out
          const approvedBranches = branchAdmins.filter(admin => {
          const isApproved = (admin.status || '').toLowerCase() === 'approved';
          const profile = admin.profile || {};
          const hasBranchName = !!profile.branchName;
          const hasAddress = !!profile.address;
          
          console.log('Branch admin details:', {
            id: admin.id,
            userId: admin.userId,
            status: admin.status,
            hasBranchName,
            hasAddress,
            branchName: profile.branchName,
            address: profile.address,
            willBeIncluded: isApproved && hasBranchName && hasAddress,
            fullProfile: profile
          });
          
          return isApproved && hasBranchName && hasAddress;
        });        console.log('Available branches:', approvedBranches);
        setBranches(approvedBranches);
      } catch (error) {
        console.error('Error loading branches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, [state.authToken]);

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * vehicle.pricePerDay : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Selected branch ID:', selectedBranch);
    console.log('Available branches:', branches);
    
    const branch = branches.find(b => String(b.id) === String(selectedBranch));
    if (!branch) {
      console.error('Branch not found. Selected:', selectedBranch, 'Available:', branches.map(b => b.id));
      alert('Please select a valid branch');
      return;
    }

    const customerName = customer.profile?.name || customer.profile?.fullName || customer.name || customer.userId;
    
    const booking = {
      customerId: customer.id,
      customerName: customerName,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      branchId: selectedBranch,
      branchName: branch.profile.branchName,
      startDate,
      endDate,
      totalAmount: calculateTotal()
    };

    onSubmit(booking);
  };

  const totalAmount = calculateTotal();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Book Vehicle</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Vehicle Summary */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3>
              <p className="text-gray-600">{vehicle.brand} {vehicle.model} • {vehicle.year}</p>
              <p className="text-blue-600 font-medium">${vehicle.pricePerDay}/day</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={today}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={startDate || today}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Select Branch
              </label>
              {loading ? (
                <div className="w-full px-4 py-3 text-gray-500 bg-gray-50 border border-gray-300 rounded-lg">
                  Loading branches...
                </div>
              ) : (
                <div>
                  <select
                    value={selectedBranch}
                    onChange={(e) => {
                      console.log('Selected value:', e.target.value);
                      console.log('Selected option:', e.target.options[e.target.selectedIndex].text);
                      setSelectedBranch(e.target.value);
                    }}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a branch</option>
                    {branches.map((branch) => {
                      console.log('Branch option:', { id: branch.id, name: branch.profile.branchName });
                      return (
                        <option key={branch.id} value={String(branch.id)}>
                          {branch.profile.branchName} - {branch.profile.address}
                          {branch.profile.phone ? ` - ${branch.profile.phone}` : ''}
                        </option>
                      );
                    })}
                  </select>
                  {branches.length === 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-red-600">
                        No branches are currently available for booking.
                      </p>
                      <p className="text-sm text-gray-600">
                        Branch administrators are still setting up their profiles. Please try again later.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>            {/* Booking Summary */}
            {totalAmount > 0 && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-medium">{vehicle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">
                      {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span className="font-medium">${vehicle.pricePerDay}/day</span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                      <span className="text-lg font-bold text-blue-600">${totalAmount}</span>
                    </div>
                  </div>
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
                disabled={!totalAmount}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Submit Booking Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}