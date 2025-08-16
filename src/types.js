// Type definitions for the application (using JSDoc comments for type hints)

/**
 * @typedef {'admin' | 'branch-admin' | 'customer'} UserRole
 */

/**
 * @typedef {'pending' | 'approved' | 'rejected'} UserStatus
 */

/**
 * @typedef {Object} BranchProfile
 * @property {string} branchName
 * @property {string} branchCode
 * @property {string} address
 * @property {string} phone
 * @property {string} email
 * @property {string} managerName
 */

/**
 * @typedef {Object} CustomerProfile
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} address
 * @property {string} licenseNumber
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} userId
 * @property {string} password
 * @property {UserRole} role
 * @property {UserStatus} status
 * @property {string} createdAt
 * @property {BranchProfile | CustomerProfile} [profile]
 */

/**
 * @typedef {Object} Vehicle
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {string} brand
 * @property {string} model
 * @property {number} year
 * @property {number} pricePerDay
 * @property {string[]} features
 * @property {string} fuelType
 * @property {string} transmission
 * @property {number} seatingCapacity
 * @property {string} image
 * @property {number} availability
 * @property {number} totalStock
 */

/**
 * @typedef {'pending' | 'approved' | 'rejected' | 'partially-approved'} RequestStatus
 */

/**
 * @typedef {Object} VehicleRequest
 * @property {string} id
 * @property {string} branchId
 * @property {string} branchName
 * @property {string} vehicleId
 * @property {string} vehicleName
 * @property {number} requestedQuantity
 * @property {number} [approvedQuantity]
 * @property {RequestStatus} status
 * @property {string} requestDate
 */

/**
 * @typedef {'pending' | 'approved' | 'rejected' | 'in-process'} BookingStatus
 */

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} customerId
 * @property {string} customerName
 * @property {string} vehicleId
 * @property {string} vehicleName
 * @property {string} branchId
 * @property {string} branchName
 * @property {string} startDate
 * @property {string} endDate
 * @property {number} totalAmount
 * @property {BookingStatus} status
 * @property {string} bookingDate
 * @property {string} [branchAdminNotes]
 */

/**
 * @typedef {Object} AppState
 * @property {User | null} currentUser
 * @property {User[]} users
 * @property {Vehicle[]} vehicles
 * @property {VehicleRequest[]} vehicleRequests
 * @property {Booking[]} bookings
 */