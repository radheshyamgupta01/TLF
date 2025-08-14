"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Image,
  MapPin,
  Home,
  User,
  DollarSign,
  Calendar,
  CheckCircle,
  X,
  Menu,
  Bell,
  Search,
  ChevronDown,
  ArrowLeft,
  Building,
  Phone,
  Mail,
  Star,
  Camera,
  Trash2,
  Plus,
  Check,
} from "lucide-react";
import { useSelector } from "react-redux";

import Link from "next/link";
import axiosInstance from "@/lib/axios";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const PropertyPostComponent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const entireState = useSelector((state) => state.users);

  // console.log("entireState", entireState);

  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    description: "",
    propertyType: "",
    listingType: "", // sale, rent, lease

    // Location
    address: "",
    city: "",
    state: "",
    pincode: "",
    locality: "",

    // Details
    bedrooms: "",
    bathrooms: "",
    area: "",
    areaUnit: "sqft",
    furnishing: "",
    parking: "",
    floor: "",
    totalFloors: "",

    // Pricing
    price: "",
    priceType: "", // fixed, negotiable
    maintenanceCharges: "",
    securityDeposit: "",

    // Images
    images: [],

    // Contact & User Info
    contactPerson: "",
    phoneNumber: "",
    email: "",
    userType: "", // owner, agent, developer, admin

    // Additional Features
    amenities: [],
    nearbyPlaces: [],

    // Status
    isActive: true,
    isVerified: false,
  });

  const [imagePreview, setImagePreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const propertyTypes = [
    "apartment",
    "house",
    "villa",
    "plot",
    "commercial",
    "office",
    "shop",
    "warehouse",
  ];

  const listingTypes = [
    { value: "sale", label: "For Sale" },
    { value: "rent", label: "For Rent" },
    { value: "lease", label: "For Lease" },
  ];

  const furnishingTypes = ["fully-furnished", "semi-furnished", "unfurnished"];

  const userTypes = [
    { value: "seller", label: "Seller" },
    { value: "broker", label: "Broker" },
    { value: "developer", label: "Developer" },
  ];

  const amenitiesList = [
    "swimming Pool",
    "gym",
    "garden",
    "security",
    "lift",
    "power backup",
    "parking",
    "internet",
    "ac",
    "modular Kitchen",
    "balcony",
    "terrace",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 10;
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (files.length + formData.images.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      if (file.size > maxSize) {
        invalidFiles.push(file.name);
      } else if (!file.type.startsWith("image/")) {
        invalidFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      setError(
        `Invalid files: ${invalidFiles.join(
          ", "
        )}. Each image must be less than 5MB.`
      );
    }

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview((prev) => [...prev, e.target.result]);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, file],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) errors.title = "Title is required";
        if (!formData.propertyType)
          errors.propertyType = "Property type is required";
        if (!formData.listingType)
          errors.listingType = "Listing type is required";
        if (!formData.description)
          errors.description = "Description type is required";

        break;
      case 2:
        if (!formData.address.trim()) errors.address = "Address is required";
        if (!formData.city.trim()) errors.city = "City is required";
        if (!formData.state.trim()) errors.state = "State is required";
        if (!formData.pincode.trim()) errors.pincode = "Pincode is required";
        if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
          errors.pincode = "Pincode must be 6 digits";
        }
        if (!formData.locality.trim()) errors.locality = "locality is required";
        if (!formData.bedrooms.trim()) errors.bedrooms = "Bedrooms is required";
        if (!formData.bathrooms.trim())
          errors.bathrooms = "Bathrooms is required";
        if (!formData.area.trim()) errors.area = "Area is required";
        if (!formData.furnishing.trim())
          errors.furnishing = "Furnishing is required";

        if (!formData.parking.trim()) errors.parking = "parking is required";

        if (!formData.floor.trim()) errors.floor = "floor is required";
        if (!formData.totalFloors.trim())
          errors.totalFloors = "TotalFloors is required";

        if (!formData.amenities || formData.amenities.length === 0) {
          errors.amenities = "At least one amenity is required";
        }

        break;
      case 3:
        if (!formData.price) errors.price = "Price is required";
        if (!formData.priceType) errors.priceType = "PriceType is required";
        if (!formData.maintenanceCharges)
          errors.maintenanceCharges = "maintenanceCharges is required";
        if (!formData.securityDeposit)
          errors.securityDeposit = "securityDeposit is required";
        if (!formData.userType) errors.userType = "userType is required";

        if (!formData.contactPerson.trim())
          errors.contactPerson = "Contact person is required";
        if (!formData.phoneNumber.trim())
          errors.phoneNumber = "Phone number is required";
        if (
          formData.phoneNumber &&
          !/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ""))
        ) {
          errors.phoneNumber = "Phone number must be 10 digits";
        }
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = "Invalid email format";
        }
        break;
      case 4:
        if (formData.images.length === 0)
          errors.images = "At least one image is required";
        break;
      default:
        break;
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      setError(""); // Clear any previous errors
    } else {
      setError("Please fix the Above  validation errors");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setValidationErrors({});
    setError("");
  };

  //   const handleSubmit = async () => {
  //     if (!validateStep(4)) {
  //       setError('Please complete all required fields');
  //       return;
  //     }

  //     try {
  //       setLoading(true);

  //     // First, upload all images and get their URLs
  //     const uploadedImages = [];

  //     console.log('FormData entries:');
  // for (let [key, value] of formData.entries()) {
  //   console.log(key, value);

  //    console.log('FormData entries:');
  // }

  //     for (const imageFile of formData.images) {
  //       const formDataForUpload = new FormData();
  //       formDataForUpload.append('image', imageFile);

  //       const uploadResponse = await fetch('/api/upload', {
  //         method: 'POST',
  //         body: formDataForUpload,
  //       });

  //       const uploadResult = await uploadResponse.json();

  //       console.log("uploadResult",uploadResult)

  //       if (uploadResult.error) {
  //         throw new Error(uploadResult.error);
  //       }

  //       uploadedImages.push({
  //         url: uploadResult.url,
  //         public_id: uploadResult.public_id
  //       });
  //     }

  //     // Now submit the form data with image URLs instead of File objects
  //     const submissionData = {
  //       ...formData,
  //       images: uploadedImages // Replace File objects with URLs
  //     };

  //     console.log("submissionData",submissionData)

  //       // Simulate API call
  //       const response = await fetch('/api/properties', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(formData), // Convert object to JSON string
  //       });

  //       const result = await response.json();

  //       // Success simulation
  //       alert('Property posted successfully!');
  //       console.log('Form data:', formData);

  //       if (result?.error) {
  //         setErrors({ submit: result.error });
  //       } else {
  //         setIsSuccess(true);
  //         // Reset form
  //         setFormData({
  //           title: '',
  //           description: '',
  //           propertyType: '',
  //           listingType: '',
  //           address: '',
  //           city: '',
  //           state: '',
  //           pincode: '',
  //           locality: '',
  //           bedrooms: '',
  //           bathrooms: '',
  //           area: '',
  //           areaUnit: 'sqft',
  //           furnishing: '',
  //           parking: '',
  //           floor: '',
  //           totalFloors: '',
  //           price: '',
  //           priceType: '',
  //           maintenanceCharges: '',
  //           securityDeposit: '',
  //           images: [],
  //           contactPerson: '',
  //           phoneNumber: '',
  //           email: '',
  //           userType: '',
  //           amenities: [],
  //           nearbyPlaces: [],
  //           isActive: true,
  //           verified: false
  //         });
  //         setImagePreview([]);
  //         setCurrentStep(1);
  //       }

  //     } catch (error) {
  //       setError('Failed to post property. Please try again.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      setError("Please complete all required fields");
      return;
    }

    try {
      setLoading(true);

      // First, upload all images and get their URLs
      const uploadedImages = [];

      // Debug: Check what's in formData (regular object)
      // console.log("Form data object:", formData);
      // console.log("Images array:", formData.images);

      // Loop through the images array (this is correct)

      for (const imageFile of formData.images) {
        const formDataForUpload = new FormData();

        formDataForUpload.append("image", imageFile);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formDataForUpload,
        });

        const uploadResult = await uploadResponse.json();
        // console.log(
        //   "uploadResult00000000000000000000000000000000000000000000000000000000000000000000000",
        //   uploadResult
        // );

        if (uploadResult.error) {
          throw new Error(uploadResult.error);
        }

        uploadedImages.push({
          url: uploadResult.files[0].url,
          public_id: uploadResult.files[0].public_id,
        });
      }

      // Now submit the form data with image URLs instead of File objects
      const submissionData = {
        ...formData,
        images: uploadedImages, // Replace File objects with URLs
      };

      // console.log("submissionData", submissionData);

      // Submit the form data
      const response = await axiosInstance.post("/listings", submissionData); // Use submissionData, not formData

      // const result = await response.json();
      // console.log("API result:", response);

      if (response?.data?.success) {
        router.push("/thank-you"); // or navigate somewhere
      } else if (response?.data?.error) {
        setErrors({ submit: response?.data?.error });
      } else {
        setIsSuccess(true);
        alert("Property posted successfully!");

        // Reset form
        setFormData({
          title: "",
          description: "",
          propertyType: "",
          listingType: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          locality: "",
          bedrooms: "",
          bathrooms: "",
          area: "",
          areaUnit: "sqft",
          furnishing: "",
          parking: "",
          floor: "",
          totalFloors: "",
          price: "",
          priceType: "",
          maintenanceCharges: "",
          securityDeposit: "",
          images: [],
          contactPerson: "",
          phoneNumber: "",
          email: "",
          userType: "",
          amenities: [],
          nearbyPlaces: [],
          isActive: true,
          isVerified: false,
        });
        setImagePreview([]);
        setCurrentStep(1);
      }
    } catch (error) {
      console.error("Error posting property:", error);
      setError("Failed to post property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            congratules !
          </h2>
          <p className="text-gray-600 mb-6">Your property post succesfully !</p>
          <Link href="/post-property" className="w-full" prefetch={true}>
            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
              Continue
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Home className="w-16 h-16 text-blue-600 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
        <p className="text-gray-600">Tell us about your property</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Title *
          </label>
          <input
            type="text"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., Beautiful 3BHK Apartment in Prime Location"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
          {validationErrors.title && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.title}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type *
          </label>
          <select
            className={`w-full capitalize p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.propertyType
                ? "border-red-500"
                : "border-gray-300"
            }`}
            value={formData.propertyType}
            onChange={(e) => handleInputChange("propertyType", e.target.value)}
          >
            <option value="">Select Type</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {validationErrors.propertyType && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.propertyType}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Listing Type *
          </label>
          <select
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.listingType
                ? "border-red-500"
                : "border-gray-300"
            }`}
            value={formData.listingType}
            onChange={(e) => handleInputChange("listingType", e.target.value)}
          >
            <option value="">Select Listing Type</option>
            {listingTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {validationErrors.listingType && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.listingType}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="4"
            placeholder="Describe your property features, location benefits, etc."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">Location & Details</h2>
        <p className="text-gray-600">Property location and specifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <input
            type="text"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.address ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Complete address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
          {validationErrors.address && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.address}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.city ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="City"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
          />
          {validationErrors.city && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="State"
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode *
          </label>
          <input
            type="text"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.pincode ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Pincode"
            value={formData.pincode}
            onChange={(e) => handleInputChange("pincode", e.target.value)}
          />
          {validationErrors.pincode && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.pincode}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Locality *
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Locality/Area"
            value={formData.locality}
            onChange={(e) => handleInputChange("locality", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms *
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.bedrooms}
            onChange={(e) => handleInputChange("bedrooms", e.target.value)}
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} BHK
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms *
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.bathrooms}
            onChange={(e) => handleInputChange("bathrooms", e.target.value)}
          >
            <option value="">Select</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Area *
          </label>
          <div className="flex">
            <input
              type="number"
              className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Area"
              value={formData.area}
              onChange={(e) => handleInputChange("area", e.target.value)}
            />
            <select
              className="w-20 p-3 border-l-0 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.areaUnit}
              onChange={(e) => handleInputChange("areaUnit", e.target.value)}
            >
              <option value="sqft">Sq.Ft</option>
              <option value="sqm">Sq.M</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Furnishing *
          </label>
          <select
            className="capitalize w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.furnishing}
            onChange={(e) => handleInputChange("furnishing", e.target.value)}
          >
            <option value="">Select</option>
            {furnishingTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parking *
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.parking}
            onChange={(e) => handleInputChange("parking", e.target.value)}
          >
            <option value="">Select</option>
            <option value="0">No Parking</option>
            <option value="1">1 Car</option>
            <option value="2">2 Cars</option>
            <option value="3">3 Cars</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Floor *
          </label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Floor number"
            value={formData.floor}
            onChange={(e) => handleInputChange("floor", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Floors *
          </label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Total floors in building"
            value={formData.totalFloors}
            onChange={(e) => handleInputChange("totalFloors", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Amenities *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {amenitiesList.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <DollarSign className="w-16 h-16 text-blue-600 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">Pricing & Contact</h2>
        <p className="text-gray-600">Set your price and contact details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price *
          </label>
          <input
            type="number"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.price ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter amount"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
          />
          {validationErrors.price && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.price}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Type *
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.priceType}
            onChange={(e) => handleInputChange("priceType", e.target.value)}
          >
            <option value="">Select</option>
            <option value="fixed">Fixed</option>
            <option value="negotiable">Negotiable</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maintenance Charges *
          </label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Monthly maintenance"
            value={formData.maintenanceCharges}
            onChange={(e) =>
              handleInputChange("maintenanceCharges", e.target.value)
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Security Deposit *
          </label>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Security deposit amount"
            value={formData.securityDeposit}
            onChange={(e) =>
              handleInputChange("securityDeposit", e.target.value)
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Person *
          </label>
          <input
            type="text"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.contactPerson
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Your name"
            value={formData.contactPerson}
            onChange={(e) => handleInputChange("contactPerson", e.target.value)}
          />
          {validationErrors.contactPerson && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.contactPerson}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.phoneNumber
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Your phone number"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          />
          {validationErrors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.phoneNumber}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              validationErrors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Your email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            You are a *
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.userType}
            onChange={(e) => handleInputChange("userType", e.target.value)}
          >
            <option value="">Select</option>
            {userTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Image className="w-16 h-16 text-blue-600 mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">Property Images *</h2>
        <p className="text-gray-600">Upload photos of your property</p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">
          Upload property images (Max 10 images, 5MB each)
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
        >
          Choose Images
        </label>
      </div>

      {validationErrors.images && (
        <p className="text-red-500 text-sm">{validationErrors.images}</p>
      )}

      {imagePreview.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagePreview.map((image, index) => (
            <div key={index} className="relative group">
              <Image
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <ProtectedRoute className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div
                    className={`w-20 sm:w-32 h-1 ${
                      step < currentStep ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Location</span>
            <span>Pricing</span>
            <span>Images</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-600 text-white hover:bg-gray-700"
              }`}
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Posting..." : "Post Property"}
              </button>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PropertyPostComponent;
