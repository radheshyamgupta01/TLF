"use client";
import { User } from "lucide-react";
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
        <li onClick={() => setIsMenuOpen(false)}>
          <a href="/" className="block text-slate-700">
            Home
          </a>
        </li>
        <li onClick={() => setIsMenuOpen(false)}>
          <a href="/about" className="block text-slate-700">
            About
          </a>
        </li>
        <li onClick={() => setIsMenuOpen(false)}>
          <a href="/contact-us" className="block text-slate-700">
            Contact
          </a>
        </li>
      </ul>
      <hr className=" my-4" />
      <div className="flex justify-between items-center space-x-4">
        <Link
          onClick={() => setIsMenuOpen(false)}
          href="/post-property"
          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2.5 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
        >
          Post Property
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
            onClick={() => setIsMenuOpen(false)}
            href="/login"
            className="cursor-pointer flex items-center space-x-2 border border-slate-300 hover:border-slate-400 px-4 py-2.5 rounded-lg transition-all hover:shadow-md"
          >
            <User className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Sign In</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
