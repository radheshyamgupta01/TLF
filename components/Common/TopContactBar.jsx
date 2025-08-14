"use client";
import { Phone, Mail, Globe } from "lucide-react";

export default function TopContactBar() {
  return (
    <div className="bg-slate-800 text-white py-2 hidden lg:block">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400">1800-XXX-XXXX</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400">hello@cpmarket.in</span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-blue-400">🏆 #1 Property Platform</span>
          <div className="flex items-center space-x-1">
            <Globe className="w-4 h-4" />
            <span className="text-blue-400">Available in 50+ Cities</span>
          </div>
        </div>
      </div>
    </div>
  );
}
