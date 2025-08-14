import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-4">
              cpmarket
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner in finding the perfect property. We connect
              buyers, sellers, and renters with verified listings and expert
              agents.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/people/Cpmarket/61573889295847/"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <span className="text-lg font-bold">l</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/cp-market-00b809356"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <span className="text-lg font-bold">f</span>
              </Link>
              <Link
                href="https://www.instagram.com/cpmarket.in"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <span className="text-lg font-bold">i</span>
              </Link>
              <Link
                href="https://x.com/MarketCp80282"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <span className="text-lg font-bold">x</span>
              </Link>
              <Link
                href="https://www.threads.com/@cpmarket.in"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <span className="text-lg font-bold">t</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Buy Property
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Rent Property
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sell Property
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  New Projects
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Property Services
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Cities</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Mumbai
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Delhi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Bangalore
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pune
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Chennai
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@cpmarket.in</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1" />
                <span>123 Business District, Mumbai, Maharashtra 400001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2025 cpmarket. All rights reserved. |
            <a href="/privacy-policy" className="hover:underline mx-1">
              Privacy Policy
            </a>{" "}
            |
            <a href="/terms-and-conditions" className="hover:underline mx-1">
              Terms & Conditions
            </a>
          </p>
        
        </div>
      </div>
    </footer>
  );
};

export default Footer;
