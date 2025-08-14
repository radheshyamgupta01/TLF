"use client";
import React from "react";
import { Heart, MapPin, Bed, Bath, Square, Car, Share2 } from "lucide-react";
import Image from "next/image";
import { FormatPrice } from "@/utils/formatPrice";
import Link from "next/link";
import ShareButton from "@/utils/ShareButton";

export default function PropertyCard({ property, isFavorite, toggleFavorite }) {
  // console.log(property);

  return (
    <div className="flex-none w-80 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group/card">
      <div className="relative">
        <Image
          width={500}
          height={500}
          src={property.images?.[0]?.url}
          alt={property.title}
          className="w-full h-48 object-cover group-hover/card:scale-105 transition-transform duration-300"
        />
        {property.featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </div>
        )}
        <button
          onClick={() => toggleFavorite(property.id)}
          className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "text-red-500 fill-current" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg line-clamp-2 font-bold text-gray-900 group-hover/card:text-blue-600 transition-colors">
            {property.title}
          </h3>
          <span className="text-xl font-bold text-blue-600">
            {FormatPrice(property.price)}
          </span>
        </div>

        <p className="text-gray-600 mb-4 flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{property.address}</span>
        </p>

        <div className="grid grid-cols-5 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            {property.bedrooms}
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            {property.bathrooms}
          </div>
          <div className="flex items-center truncate col-span-2">
            <Square className="w-4 h-4 mr-1" />
            {property.area} {property.areaUnit}
          </div>
          <div className="flex items-center">
            <Car className="w-4 h-4 mr-1" />
            {property.parking}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="bg-blue-100 uppercase text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {property.propertyType}
          </span>
          <div className="flex space-x-2">
            <Link
              href={`/properties/${property?._id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              View Details
            </Link>
            <ShareButton
              title={property.title}
              text="Check out this awesome page!"
              url={`/properties/${property?._id}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
