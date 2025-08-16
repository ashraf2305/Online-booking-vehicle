import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  currentUser: null,
  authToken: null,
  users: [],
  vehicles: [],
  vehicleRequests: [],
  bookings: []
};

const AppContext = createContext(null);

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, currentUser: action.payload.user, authToken: action.payload.token };
    case 'LOGOUT':
      return { ...state, currentUser: null, authToken: null };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser
      };
    case 'SET_VEHICLES':
      return { ...state, vehicles: action.payload };
    case 'ADD_VEHICLE':
      return { ...state, vehicles: [...state.vehicles, action.payload] };
    case 'UPDATE_VEHICLE':
      return {
        ...state,
        vehicles: state.vehicles.map(vehicle =>
          vehicle.id === action.payload.id ? action.payload : vehicle
        )
      };
    case 'SET_VEHICLE_REQUESTS':
      return { ...state, vehicleRequests: action.payload };
    case 'ADD_VEHICLE_REQUEST':
      return { ...state, vehicleRequests: [...state.vehicleRequests, action.payload] };
    case 'UPDATE_VEHICLE_REQUEST':
      return {
        ...state,
        vehicleRequests: state.vehicleRequests.map(request =>
          request.id === action.payload.id ? action.payload : request
        ),
        // Update vehicle availability when request is approved
        vehicles: action.payload.status === 'approved' || action.payload.status === 'partially-approved'
          ? state.vehicles.map(vehicle => 
              vehicle.id === action.payload.vehicleId 
                ? { ...vehicle, availability: vehicle.availability - (action.payload.approvedQuantity || 0) }
                : vehicle
            )
          : state.vehicles
      };
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload };
    case 'ADD_BOOKING':
      return { ...state, bookings: [...state.bookings, action.payload] };
    case 'UPDATE_BOOKING':
      const updatedBooking = action.payload;
      const oldBooking = state.bookings.find(b => b.id === updatedBooking.id);
      const wasApproved = oldBooking?.status !== 'approved' && updatedBooking.status === 'approved';
      const wasRejected = oldBooking?.status !== 'rejected' && updatedBooking.status === 'rejected';
      
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === updatedBooking.id ? updatedBooking : booking
        ),
        // Update vehicle availability and total_stock when booking is approved or rejected
        vehicles: state.vehicles.map(vehicle => {
          if (vehicle.id === updatedBooking.vehicleId) {
            const newVehicle = {
              ...vehicle,
              // Update availability based on the booking status
              availability: updatedBooking.vehicleAvailability !== undefined 
                ? updatedBooking.vehicleAvailability 
                : wasApproved 
                  ? Math.max(0, vehicle.availability - 1)
                  : wasRejected 
                    ? Math.min(vehicle.availability + 1, vehicle.total_stock)
                    : vehicle.availability,
              // Ensure total_stock stays unchanged
              total_stock: updatedBooking.vehicleTotalStock || vehicle.total_stock
            };
            console.log('Updating vehicle in state:', newVehicle);
            return newVehicle;
          }
          return vehicle;
        })
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Restore session from storage
  React.useEffect(() => {
    const raw = localStorage.getItem('auth');
    if (raw) {
      try {
        const { token, user } = JSON.parse(raw);
        if (token && user) {
          // Validate the token before restoring the session
          const validateSession = async () => {
            try {
              const response = await fetch('http://localhost:8080/api/auth/validate', {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              if (response.ok) {
                dispatch({ type: 'SET_AUTH', payload: { token, user } });
              } else {
                // Token is invalid, clear the session
                localStorage.removeItem('auth');
                dispatch({ type: 'LOGOUT' });
              }
            } catch (error) {
              // Network error or invalid token, clear the session
              localStorage.removeItem('auth');
              dispatch({ type: 'LOGOUT' });
            }
          };
          validateSession();
        }
      } catch {}
    }
  }, []);

  // Persist session
  React.useEffect(() => {
    if (state.authToken && state.currentUser) {
      localStorage.setItem('auth', JSON.stringify({ token: state.authToken, user: state.currentUser }));
    } else {
      localStorage.removeItem('auth');
    }
  }, [state.authToken, state.currentUser]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}