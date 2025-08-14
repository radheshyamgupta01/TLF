"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Phone,
  Mail,
  X,
  Star,
  Heart,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { FormatPrice } from "@/utils/formatPrice";
import InquiryForm from "@/components/property/InquiryForm";
import { property } from "zod";
import Link from "next/link";
import MainLoader from "../Loaders/MainLoader";

const PropertyDetails = ({ params }) => {
  const [propDetails, setPropDetails] = useState(null);
  const [relatedProperties, setRelatedProperties] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPropertyDetails = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/listings/${params.id}`, {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch property: ${res.status}`);
        }

        const data = await res.json();
        // console.log(data);

        setPropDetails(data?.data?.listing);
        setRelatedProperties(data?.data?.relatedListings);
      } catch (error) {
        console.error("Failed to fetch property details:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      getPropertyDetails();
    }
  }, [params.id]);

  if (isLoading) {
    return <MainLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!propDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-600">
            The property you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  // console.log(propDetails, relatedProperties);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contact Form Modal */}
      {isFormOpen && (
        <InquiryForm listingId={params.id} setIsFormOpen={setIsFormOpen} />
      )}

      {/* <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              cpmarket
            </h1>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-500 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="lg:col-span-2">
            <Image
              width={500}
              height={500}
              src={propDetails?.images[0]?.url}
              alt="Property main view"
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {propDetails?.images.slice(1).map((img, index) => (
              <Image
                width={500}
                height={500}
                key={index}
                src={img?.url}
                alt={`Property view ${index + 2}`}
                className="w-full h-32 sm:h-40 lg:h-44 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
                  {propDetails?.title}
                </h2>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                  ₹ {FormatPrice(propDetails?.price)}
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm sm:text-base">
                  {propDetails?.address}
                </span>
              </div>

              <div className="flex items-center space-x-4 sm:space-x-6 text-gray-700">
                <div className="flex items-center">
                  <Bed className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="text-sm sm:text-base">
                    {propDetails?.bedrooms} Beds
                  </span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="text-sm sm:text-base">
                    {propDetails?.bathrooms} Baths
                  </span>
                </div>
                <div className="flex items-center">
                  <Square className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="text-sm sm:text-base">
                    {propDetails?.area}
                  </span>
                </div>
                <div className="flex items-center">
                  <Car className="w-5 h-5 mr-2 text-blue-500" />
                  <span className="text-sm sm:text-base">
                    {propDetails?.parking} Cars
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border-slate-200 shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {propDetails?.description}
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 border-slate-200 shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Features
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {propDetails?.amenities.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-sm sm:text-base text-gray-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border-slate-200 shadow sticky top-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Interested in this property?
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Get in touch with us for more details and schedule a viewing.
              </p>

              <button
                onClick={() => setIsFormOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
              >
                Contact Agent
              </button>

              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>{propDetails?.phoneNumber || "+91 XXXX XXXXXX"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-3" />
                  <span>{propDetails?.email || "XXXXXXXXXXXX@XXXXX.XXX"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        <section className="mt-12 sm:mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Similar Properties
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Property 1 */}
            {propDetails?.data?.relatedListings?.length ? (
              propDetails?.data?.relatedListings?.map((propterty) => (
                <div
                  key={property._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    <Image
                      width={500}
                      height={500}
                      src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=250&fit=crop"
                      alt="Modern Family Home"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-semibold text-blue-600">
                      For Sale
                    </div>
                    <button className="absolute top-3 left-3 p-2 bg-white rounded-full text-gray-600 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Modern Family Home
                      </h3>
                      <span className="text-xl font-bold text-blue-600">
                        $720,000
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">Manhattan, NY</span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-700 mb-4">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1 text-blue-500" />
                        <span>3 Beds</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1 text-blue-500" />
                        <span>2 Baths</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1 text-blue-500" />
                        <span>2,400 sq ft</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      Beautiful family home with spacious rooms, modern kitchen,
                      and private garden. Perfect for growing families.
                    </p>

                    <button
                      onClick={() => setIsFormOpen(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xl text-gray-700 mb-2">
                No Related Properties Found
              </p>
            )}
          </div>

          {/* Show More Button */}
          <div className="text-center mt-8">
            <Link
              href={`/properties`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              View More Properties
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PropertyDetails;
