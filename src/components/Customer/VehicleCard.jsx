import React from 'react';
import { Calendar, Users, Fuel, Settings, Star } from 'lucide-react';

export function VehicleCard({ vehicle, onBook }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={vehicle.image || vehicle.imageUrl}
          alt={vehicle.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 shadow-lg">
          <span className={`text-sm font-medium ${
            vehicle.availability > 2 ? 'text-emerald-600' : 
            vehicle.availability > 0 ? 'text-orange-600' : 
            'text-red-600'
          }`}>
            {vehicle.availability} available
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <Star className="h-4 w-4 text-gray-300" />
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          {vehicle.brand} {vehicle.model} • {vehicle.year}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{vehicle.seatingCapacity} seats</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Fuel className="h-4 w-4" />
            <span>{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Settings className="h-4 w-4" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{vehicle.type}</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
          <div className="flex flex-wrap gap-1">
            {vehicle.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {feature}
              </span>
            ))}
            {vehicle.features.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{vehicle.features.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-bold text-blue-600">
              ${vehicle.pricePerDay}
            </span>
            <span className="text-gray-600 ml-2">/day</span>
          </div>
          <button
            onClick={() => onBook(vehicle)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}