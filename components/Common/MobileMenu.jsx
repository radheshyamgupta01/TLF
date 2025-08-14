"use client";
import { User, DollarSign, LogIn, Plus, Contact, ArrowBigDown, Home, UserCheck2 } from "lucide-react";
import Link from "next/link";

const MobileMenu = ({
  handleLogout,
  isLoading,
  user,
  setIsMenuOpen,
  isMenuOpen,
}) => {
  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-md p-4 z-50 lg:hidden">
      <ul className="space-y-2">
         <li>
          <a
            href="/"
            className="flex items-center px-4 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium group"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home className="w-5 h-5 mr-4 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
            <span>Home</span>
          </a>
        </li>
     
          <li>
          <a
            href="/about"
            className="flex items-center px-4 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium group"
            onClick={() => setIsMenuOpen(false)}
          >
            <UserCheck2 className="w-5 h-5 mr-4 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
            <span>About</span>
          </a>
        </li>
       




          <li>
          <a
            href="/contact-us"
            className="flex items-center px-4 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium group"
            onClick={() => setIsMenuOpen(false)}
          >
            <Contact className="w-5 h-5 mr-4 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
            <span>Contact</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            className="flex items-center px-4 py-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 font-medium group"
            onClick={() => setIsMenuOpen(false)}
          >
            <DollarSign className="w-5 h-5 mr-4 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
            <span>Home Loan Services</span>
          </a>
        </li>
     

          <li>

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
                onClick={() => setIsMenuOpen(false)}
                href="/login"

              >
                <button
                  className="flex items-center px-4 py-4 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 font-medium text-left w-full group"

                >
                  <LogIn className="w-5 h-5 mr-4 text-gray-500 group-hover:text-green-600 transition-colors duration-200" />
                  <span>Login / Sign Up</span>
                </button>

              </Link>
            )}



          </li>

       
      </ul>
      <hr className=" my-4" />
      <div className="">
        <Link
          onClick={() => setIsMenuOpen(false)}
          href="/post-property"

        >
          <button
            className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform relative overflow-hidden group"
            onClick={() => setShowMobileMenu(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Plus className="w-5 h-5 mr-3 relative z-10" />
            <span className="relative z-10">
              Post Your Property
              <span className="text-yellow-300 font-bold ml-2">FREE</span>
            </span>
          </button>
        </Link>

      </div>
    </div>
  );
};

export default MobileMenu;
