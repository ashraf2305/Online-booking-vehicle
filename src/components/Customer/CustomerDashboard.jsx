import React, { useState, useEffect } from 'react';
import { Search, Car, Calendar, User, Edit, Filter } from 'lucide-react';;
import { useApp } from '../../context/AppContext';
import { VehicleCard } from './VehicleCard';
import { BookingForm } from './BookingForm';
import { ProfileSetupForm } from './ProfileSetupForm';
import { vehicleApi } from '../../api/vehicleApi';
import { bookingApi } from '../../api/bookingApi';
import { userApi } from '../../api/userApi.jsx';
import { normalizeUser } from '../../utils/userMapper';

export function CustomerDashboard() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [vehicleType, setVehicleType] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);

  const currentUser = state.currentUser;
  const customerProfile = currentUser?.profile;
  
  // Check if profile setup is needed
  const needsProfileSetup = !customerProfile;

  // Get customer bookings
  const customerBookings = state.bookings.filter(b => b.customerId === currentUser?.id);

  useEffect(() => {
    if (needsProfileSetup) {
      setShowProfileForm(true);
    }
  }, [needsProfileSetup]);

  // Function to load the latest data
  const loadLatestData = async (force = false) => {
    if (!state.authToken) return;
    try {
      // Load vehicles first
      const vehicles = await vehicleApi.list(state.authToken);
      
      if (Array.isArray(vehicles)) {
        // Check if vehicles data has actually changed before updating state
        const processedVehicles = vehicles.map(vehicle => ({
          ...vehicle,
          availability: parseInt(vehicle.availability) || 0
        }));
        
        const hasVehicleChanges = JSON.stringify(processedVehicles) !== JSON.stringify(state.vehicles);
        if (hasVehicleChanges) {
          dispatch({ type: 'SET_VEHICLES', payload: processedVehicles });
        }
      }

      // Then load bookings if user is logged in
      if (currentUser?.id) {
        const bookings = await bookingApi.byCustomer(currentUser.id, state.authToken);
        if (Array.isArray(bookings)) {
          // Check if bookings have changed before updating state
          const hasBookingChanges = JSON.stringify(bookings) !== JSON.stringify(state.bookings);
          if (hasBookingChanges) {
            dispatch({ type: 'SET_BOOKINGS', payload: bookings });
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Initial load when component mounts
  useEffect(() => {
    // Load data on initial mount
    loadLatestData(false);
    
    // Set up periodic refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      // Only refresh if the tab is visible
      if (!document.hidden) {
        loadLatestData(false);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [state.authToken, currentUser?.id]);

  // Filter vehicles based on search criteria
  const filteredVehicles = state.vehicles.filter(vehicle => {
    // Ensure availability is a number
    const currentAvailability = parseInt(vehicle.availability) || 0;
    
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vehicle.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = vehicle.pricePerDay >= priceRange.min && vehicle.pricePerDay <= priceRange.max;
    const matchesType = !vehicleType || vehicle.type === vehicleType;
    
    return matchesSearch && matchesPrice && matchesType && currentAvailability > 0;
  });

  const handleBooking = (bookingData) => {
    if (!state.authToken) {
      alert('Please log in to make a booking');
      return;
    }

    // Get customer's full name from profile
    const customerFullName = currentUser?.profile?.name || currentUser?.profile?.fullName || currentUser.userId;
    
    console.log('Creating booking with data:', bookingData);
    const payload = {
      customerId: bookingData.customerId,
      customerName: customerFullName, // Use the actual customer name from profile
      vehicleId: bookingData.vehicleId,
      vehicleName: bookingData.vehicleName,
      branchId: bookingData.branchId,
      branchName: bookingData.branchName,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      totalAmount: bookingData.totalAmount,
      status: 'pending'
    };
    console.log('Submitting booking payload:', payload);
    bookingApi.create(payload, state.authToken)
      .then((created) => {
        console.log('Booking created successfully:', created);
        dispatch({ type: 'ADD_BOOKING', payload: created });
        setShowBookingForm(false);
        setSelectedVehicle(null);
        alert('Booking request submitted successfully!');
      })
      .catch((error) => {
        console.error('Failed to create booking:', error);
        alert('Failed to submit booking request. Please try again. ' + (error.message || ''));
      });
  };

  const stats = [
    {
      name: 'Available Vehicles',
      value: state.vehicles.filter(v => v.availability > 0).length,
      icon: Car,
      color: 'bg-blue-500'
    },
    {
      name: 'My Bookings',
      value: customerBookings.length,
      icon: Calendar,
      color: 'bg-emerald-500'
    },
    {
      name: 'Pending Approval',
      value: customerBookings.filter(b => b.status === 'pending').length,
      icon: User,
      color: 'bg-orange-500'
    }
  ];

  if (needsProfileSetup && showProfileForm) {
    return (
      <ProfileSetupForm
        onSave={async (profile) => {
          try {
            // Ensure name is properly set in the profile
            const profileData = {
              ...profile,
              name: profile.fullName, // Set the name field from fullName
            };
            
            const updatedProfile = await userApi.updateProfile(currentUser.id, profileData, state.authToken);
            
            // Update both profile and top-level user data
            dispatch({
              type: 'UPDATE_USER',
              payload: {
                ...currentUser,
                name: profile.fullName,
                profile: updatedProfile
              }
            });
            setShowProfileForm(false);
          } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
          }
        }}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {customerProfile?.name || currentUser.userId}
            </p>
          </div>
          <button
            onClick={() => setShowProfileForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            { id: 'search', name: 'Search & Book' },
            { id: 'bookings', name: 'My Bookings' }
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
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Search className="h-5 w-5 text-gray-400" />
              <h2 className="text-xl font-semibold text-gray-900">Find Your Perfect Vehicle</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search vehicles..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 500 })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onBook={(vehicle) => {
                  setSelectedVehicle(vehicle);
                  setShowBookingForm(true);
                }}
              />
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 mb-2">No vehicles found</p>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customerBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.vehicleName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.branchName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${booking.totalAmount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                        booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        booking.status === 'in-process' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {customerBookings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No bookings yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && selectedVehicle && (
        <BookingForm
          vehicle={selectedVehicle}
          customer={currentUser}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedVehicle(null);
          }}
          onSubmit={handleBooking}
        />
      )}

      {/* Profile Setup Form Modal */}
      {showProfileForm && !needsProfileSetup && (
        <ProfileSetupForm
          initialProfile={customerProfile}
          onSave={async (profile) => {
            try {
              // Add name field explicitly for consistency
              const profileWithName = {
                ...profile,
                name: profile.fullName // Ensure name field is set
              };
              const updatedProfile = await userApi.updateProfile(currentUser.id, profileWithName, state.authToken);
              
              // Update user with both profile and top-level name
              dispatch({
                type: 'UPDATE_USER',
                payload: {
                  ...currentUser,
                  profile: updatedProfile,
                  name: profile.fullName // Also set at top level
                }
              });
              setShowProfileForm(false);
            } catch (error) {
              console.error('Error updating profile:', error);
              alert('Failed to update profile. Please try again.');
            }
          }}
          onCancel={() => setShowProfileForm(false)}
        />
      )}
    </div>
  );
}