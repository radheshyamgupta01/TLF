"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  ChevronDown, Plus,
  User,
  LogIn,DollarSign,
  Menu,
  X,
  Building2,
  Home,
  Key,
  TrendingUp,
} from "lucide-react";
import MobileMenu from "./MobileMenu";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUserThunk } from "@/lib/store/slices/authSlice";

const tabs = [
  { id: "buy", label: "Buy", icon: Home },
  { id: "rent", label: "Rent", icon: Key },
  { id: "sell", label: "Sell", icon: TrendingUp },
  { id: "invest", label: "Invest", icon: Building2 },
];

const locations = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
];

export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedTab, setSelectedTab] = useState("buy");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Mumbai");
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Force redirect even if logout fails
      router.push("/login");
    }
  };

  // console.log(user);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? "shadow-lg backdrop-blur-md bg-white/95" : "shadow-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Location */}
          <div className="flex items-center space-x-4">
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/"
              className="flex items-center space-x-3 group cursor-pointer"
            >
             
              <div className="block">
                <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                 <Image src="/logo/cpmarket-logo.svg" alt="CPMarket" width={200} height={60} /> 
                </h1>
               
              </div>
            </Link>

            {/* <div className="hidden lg:block relative ml-8">
              <button
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              >
                <MapPin className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">
                  {selectedLocation}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${showLocationDropdown ? "rotate-180" : ""
                    }`}
                />
              </button>

              {showLocationDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-slate-500 hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div> */}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">

            <Link href="/Homeloan"  className="   group flex items-center space-x-2 px-3 py-2 lg:px-4 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 rounded-xl" >
            
          
        
             
            
              <DollarSign className="w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
               <span className="text-sm lg:text-base">Home Loan</span> 
            
            
            
            </Link>
            

            {user ? (
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex text-slate-700 items-center cursor-pointer space-x-2 border border-slate-300 hover:border-slate-400 px-4 py-2.5 rounded-lg transition-all hover:shadow-md"
              >
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            ) : (
              <Link
                href="/login"

              >
                <button
                  className="  group flex items-center space-x-2 px-3 py-2 lg:px-4 text-gray-700 hover:text-green-600 font-medium transition-all duration-200 hover:bg-green-50 rounded-xl"
                >
                  <LogIn className="w-4 h-4 text-gray-500 group-hover:text-green-600 transition-colors duration-200" />
                  <span>Login / Sign Up</span>
                </button>
              </Link>
            )}


            <Link
              href="/post-property"

            >
              {/* Post Property Button */}
              <button className="hidden sm:flex items-center px-3 py-2 lg:px-4 lg:py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plus className="w-4 h-4 mr-2 relative z-10" />
                <span className="relative z-10 text-sm lg:text-base">
                  <span className="hidden lg:inline">Post Property </span>
                  <span className="lg:hidden">Post </span>
                  <span className="text-yellow-300 font-bold">FREE</span>
                </span>
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <MobileMenu
          handleLogout={handleLogout}
          isLoading={isLoading}
          user={user}
          setIsMenuOpen={setIsMenuOpen}
          isMenuOpen={isMenuOpen}
        />
      )}
      {/* Location Dropdown Overlay */}
      {showLocationDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowLocationDropdown(false)}
        />
      )}
    </header>
  );
}
