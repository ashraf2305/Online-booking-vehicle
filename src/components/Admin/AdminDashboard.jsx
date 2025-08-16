import React, { useEffect, useState } from 'react';
import { Users, Car, FileText, Plus, BarChart3, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VehicleForm } from './VehicleForm';
import { userApi } from '../../api/userApi.jsx';
import { normalizeUser } from '../../utils/userMapper';
import { vehicleApi } from '../../api/vehicleApi';

export function AdminDashboard() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchUsers = async () => {
    if (!state.authToken) return;
    setLoadingUsers(true);
    try {
      
      // First test the stats API to see if it works
      try {
        const stats = await userApi.stats(state.authToken);
      } catch (statsError) {
        console.error('Stats API failed:', statsError);
      }
      
      // Now try to get all users
      const users = await userApi.getAll(state.authToken);
      if (Array.isArray(users)) {
        dispatch({ type: 'SET_USERS', payload: users.map(normalizeUser) });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        data: error.data
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
    if (activeTab === 'vehicles') {
      fetchVehicles();
    }
  }, [activeTab]);

  const fetchVehicles = async () => {
    if (!state.authToken) return;
    try {
      const vehicles = await vehicleApi.list(state.authToken);
      if (Array.isArray(vehicles)) {
        dispatch({ type: 'SET_VEHICLES', payload: vehicles });
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  useEffect(() => {
    const boot = async () => {
      if (!state.authToken) return;
      await Promise.all([
        fetchUsers(),
        fetchVehicles(),
      ]);
    };
    boot();
  }, [state.authToken, dispatch]);

  // Light polling so new registrations appear shortly after they happen
  useEffect(() => {
    if (!state.authToken) return;
    const interval = setInterval(() => {
      fetchUsers();
    }, 10000);
    return () => clearInterval(interval);
  }, [state.authToken]);

  const pendingUsers = state.users.filter(u => {
    const status = (u.status || '').toString().toLowerCase();
    return status === 'pending';
  });
  const pendingRequests = state.vehicleRequests.filter(r => (r.status || '').toString().toLowerCase() === 'pending');

  const handleUserApproval = (userId, action) => {
    const user = state.users.find(u => u.id === userId);
    if (!user || !state.authToken) return;
    const apiCall = action === 'approve' ? userApi.approve : userApi.reject;
    apiCall(userId, state.authToken)
      .then((updated) => {
        dispatch({ type: 'UPDATE_USER', payload: updated });
      })
      .catch(() => {});
  };

  const handleVehicleRequestApproval = (requestId, action, approvedQuantity = null) => {
    const request = state.vehicleRequests.find(r => r.id === requestId);
    if (request) {
      let status = action === 'approve' ? 'approved' : 'rejected';
      let finalApprovedQuantity = approvedQuantity || request.requestedQuantity;

      if (action === 'approve' && approvedQuantity && approvedQuantity < request.requestedQuantity) {
        status = 'partially-approved';
      }

      dispatch({
        type: 'UPDATE_VEHICLE_REQUEST',
        payload: { 
          ...request, 
          status,
          approvedQuantity: finalApprovedQuantity,
          adminNotes: action === 'approve' ? 'Request approved' : 'Request rejected'
        }
      });
    }
  };

  const handleVehicleSave = (vehicleData) => {
    if (!state.authToken) return;
    const toServer = {
      name: vehicleData.name,
      type: vehicleData.type,
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: vehicleData.year,
      pricePerDay: vehicleData.pricePerDay,
      features: vehicleData.features,
      fuelType: vehicleData.fuelType,
      transmission: vehicleData.transmission,
      seatingCapacity: vehicleData.seatingCapacity,
      imageUrl: vehicleData.image,
      totalStock: vehicleData.totalStock,
    };
    const call = editingVehicle
      ? vehicleApi.update(editingVehicle.id, toServer, state.authToken)
      : vehicleApi.create(toServer, state.authToken);
    call.then((saved) => {
      if (editingVehicle) {
        dispatch({ type: 'UPDATE_VEHICLE', payload: saved });
      } else {
        dispatch({ type: 'ADD_VEHICLE', payload: saved });
      }
      setShowVehicleForm(false);
      setEditingVehicle(null);
    }).catch(() => {});
  };

  const stats = [
    {
      name: 'Total Users',
      value: state.users.length,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Vehicles',
      value: state.vehicles.length,
      icon: Car,
      color: 'bg-emerald-500'
    },
    {
      name: 'Pending Approvals',
      value: pendingUsers.length + pendingRequests.length,
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      name: 'Total Bookings',
      value: state.bookings.length,
      icon: FileText,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage users, vehicles, and system operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'users', name: 'Users' },
            { id: 'vehicles', name: 'Vehicles' },
            { id: 'requests', name: 'Vehicle Requests' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent User Registrations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent User Registrations</h2>
            <div className="space-y-3">
              {pendingUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{user.userId}</p>
                    <p className="text-sm text-gray-600">{user.role.replace('-', ' ')}</p>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Vehicle Requests */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Vehicle Requests</h2>
            <div className="space-y-3">
              {pendingRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{request.vehicleName}</p>
                    <p className="text-sm text-gray-600">{request.branchName} - Qty: {request.requestedQuantity}</p>
                  </div>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            <button
              onClick={fetchUsers}
              className="text-sm px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
              disabled={loadingUsers}
            >
              {loadingUsers ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.users.filter(u => u.role !== 'admin').map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.userId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.role.replace('-', ' ')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'approved' ? 'bg-green-100 text-green-800' :
                        user.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.status === 'pending' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleUserApproval(user.id, 'approve')}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 inline-flex items-center space-x-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleUserApproval(user.id, 'reject')}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 inline-flex items-center space-x-1"
                          >
                            <XCircle className="h-3 w-3" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'vehicles' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Vehicle Management</h2>
            <div className="flex space-x-2">
              <button
                onClick={async () => {
                  if (!state.authToken) return;
                  try {
                    const vehicles = await vehicleApi.list(state.authToken);
                    if (Array.isArray(vehicles)) {
                      dispatch({ type: 'SET_VEHICLES', payload: vehicles });
                    }
                  } catch (error) {
                    console.error('Error refreshing vehicles:', error);
                  }
                }}
                className="text-sm px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                Refresh Vehicles
              </button>
              <button
                onClick={() => setShowVehicleForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Vehicle</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{vehicle.name}</h3>
                  <p className="text-gray-600 mb-2">{vehicle.brand} {vehicle.model} • {vehicle.year}</p>
                  <p className="text-blue-600 font-medium mb-2">${vehicle.pricePerDay}/day</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Available: {vehicle.availability} / {vehicle.totalStock}
                  </p>
                  <button
                    onClick={() => {
                      setEditingVehicle(vehicle);
                      setShowVehicleForm(true);
                    }}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                  >
                    Edit Vehicle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Vehicle Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.vehicleRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.branchName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.vehicleName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.requestedQuantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        request.status === 'partially-approved' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === 'pending' && (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleVehicleRequestApproval(request.id, 'approve')}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVehicleRequestApproval(request.id, 'reject')}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {state.vehicleRequests.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No vehicle requests yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vehicle Form Modal */}
      {showVehicleForm && (
        <VehicleForm
          vehicle={editingVehicle}
          onClose={() => {
            setShowVehicleForm(false);
            setEditingVehicle(null);
          }}
          onSave={handleVehicleSave}
        />
      )}
    </div>
  );
}