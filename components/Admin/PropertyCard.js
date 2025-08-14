"use client";
import { Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <Image
        width={500}
        height={500}
        src={property.image}
        alt={property.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{property.title}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              property.status === "Active"
                ? "bg-green-100 text-green-800"
                : property.status === "Sold"
                ? "bg-gray-100 text-gray-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {property.status}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-2">{property.location}</p>
        <p className="text-lg font-bold text-blue-600 mb-3">
          ${property.price.toLocaleString()}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{property.bedrooms} bed</span>
          <span>{property.bathrooms} bath</span>
          <span>{property.area} sqft</span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center gap-1">
            <Eye size={14} />
            View
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Edit size={14} />
          </button>
          <button
            className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            onClick={() => deleteProperty(property.id)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
