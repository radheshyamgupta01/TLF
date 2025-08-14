
'use client'
import React, { useState } from 'react';
import { X, Star, Phone, Mail, MapPin, CreditCard, Clock, Shield, Calculator, TrendingUp, Award, Users } from 'lucide-react';

// Hero Component
const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your Dream Home
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Awaits You
                </span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                Compare home loans from top banks and find the perfect match for your needs. 
                Get instant approvals with competitive rates starting from 6.5% per annum.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[150px]">
                <div className="text-2xl font-bold text-yellow-400">6.5%</div>
                <div className="text-sm text-blue-200">Starting Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[150px]">
                <div className="text-2xl font-bold text-green-400">30 Years</div>
                <div className="text-sm text-blue-200">Max Tenure</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[150px]">
                <div className="text-2xl font-bold text-purple-400">₹5 Cr</div>
                <div className="text-sm text-blue-200">Max Loan</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300">
                Compare Loans
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300">
                Calculate EMI
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <CreditCard className="w-10 h-10 text-gray-900" />
                </div>
                <h3 className="text-2xl font-bold">Quick Loan Approval</h3>
                <p className="text-blue-200">Get pre-approved in just 5 minutes with our digital process</p>
                <div className="flex justify-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">5 Min</div>
                    <div className="text-sm">Approval</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">24 Hr</div>
                    <div className="text-sm">Disbursal</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Component
const Features = () => {
  const features = [
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "EMI Calculator",
      description: "Calculate your monthly EMI with our advanced calculator"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick Processing",
      description: "Get your loan approved in as fast as 24 hours"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Process",
      description: "Bank-grade security for all your financial information"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Best Rates",
      description: "Compare and choose from the most competitive rates"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We make home loan approval simple, fast, and transparent with our cutting-edge technology
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
              <div className="text-blue-600 mb-4 group-hover:text-blue-700 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Bank Card Component
const BankCard = ({ bank, onClick }) => {
  return (
    <div 
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group overflow-hidden"
      onClick={() => onClick(bank)}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{bank.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{bank.name}</h3>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < bank.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">({bank.reviews} reviews)</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{bank.interestRate}%</div>
            <div className="text-sm text-gray-600">Interest Rate</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <div className="font-semibold text-gray-900">{bank.maxLoan}</div>
            <div className="text-xs text-gray-600">Max Loan</div>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <div className="font-semibold text-gray-900">{bank.tenure}</div>
            <div className="text-xs text-gray-600">Max Tenure</div>
          </div>
          <div className="text-center bg-gray-50 rounded-lg p-3">
            <div className="font-semibold text-gray-900">{bank.processingFee}</div>
            <div className="text-xs text-gray-600">Processing Fee</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {bank.features.map((feature, index) => (
            <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
              {feature}
            </span>
          ))}
        </div>
        
        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 group-hover:shadow-lg">
          Apply Now
        </button>
      </div>
    </div>
  );
};

// User Details Modal Component
const UserDetailsModal = ({ bank, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    loanAmount: '',
    income: '',
    employmentType: 'salaried',
    city: ''
  });

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Apply to {bank?.name}</h3>
              <p className="text-gray-600">Fill in your details to get started</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desired Loan Amount</label>
              <input
                type="number"
                required
                placeholder="e.g. 2500000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.loanAmount}
                onChange={(e) => setFormData({...formData, loanAmount: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
              <input
                type="number"
                required
                placeholder="e.g. 50000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.income}
                onChange={(e) => setFormData({...formData, income: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.employmentType}
                onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
              >
                <option value="salaried">Salaried</option>
                <option value="self-employed">Self Employed</option>
                <option value="business">Business Owner</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Banks Listing Component
const BanksListing = ({ onBankClick }) => {
  const banks = [
    {
      id: 1,
      name: "HDFC Bank",
      interestRate: "6.70",
      maxLoan: "₹5 Cr",
      tenure: "30 Years",
      processingFee: "0.50%",
      rating: 4.5,
      reviews: 2847,
      features: ["No Prepayment Penalty", "Doorstep Service", "Quick Approval"]
    },
    {
      id: 2,
      name: "State Bank of India",
      interestRate: "6.85",
      maxLoan: "₹10 Cr",
      tenure: "30 Years",
      processingFee: "0.35%",
      rating: 4.2,
      reviews: 3921,
      features: ["Lowest Processing Fee", "Flexi Pay Option", "Women Special Rates"]
    },
    {
      id: 3,
      name: "ICICI Bank",
      interestRate: "6.90",
      maxLoan: "₹5 Cr",
      tenure: "25 Years",
      processingFee: "0.50%",
      rating: 4.4,
      reviews: 1832,
      features: ["Digital Process", "Instant Approval", "Balance Transfer"]
    },
    {
      id: 4,
      name: "Axis Bank",
      interestRate: "6.75",
      maxLoan: "₹7.5 Cr",
      tenure: "30 Years",
      processingFee: "1.00%",
      rating: 4.3,
      reviews: 1653,
      features: ["Power Advantage", "Salary Account Benefits", "Top-up Loans"]
    },
    {
      id: 5,
      name: "Bank of Baroda",
      interestRate: "6.95",
      maxLoan: "₹3 Cr",
      tenure: "30 Years",
      processingFee: "0.25%",
      rating: 4.1,
      reviews: 943,
      features: ["PSU Bank", "Government Employee Benefits", "Low Interest"]
    },
    {
      id: 6,
      name: "Kotak Mahindra Bank",
      interestRate: "6.65",
      maxLoan: "₹5 Cr",
      tenure: "20 Years",
      processingFee: "0.50%",
      rating: 4.6,
      reviews: 721,
      features: ["Net Banking", "Quick Disbursal", "Relationship Benefits"]
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Compare Home Loans</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from India's leading banks and get the best home loan deals
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {banks.map((bank) => (
            <BankCard 
              key={bank.id} 
              bank={bank} 
              onClick={onBankClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Component
const Stats = () => {
  const stats = [
    { icon: <Users className="w-8 h-8" />, number: "50,000+", label: "Happy Customers" },
    { icon: <Award className="w-8 h-8" />, number: "25+", label: "Partner Banks" },
    { icon: <CreditCard className="w-8 h-8" />, number: "₹10,000 Cr", label: "Loans Disbursed" },
    { icon: <Clock className="w-8 h-8" />, number: "24 Hours", label: "Average Approval Time" }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Our Achievement</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Trusted by thousands of customers across India
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-white">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white/20 rounded-full">
                  {stat.icon}
                </div>
              </div>
              <div className="text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main App Component
const HomeLoanApp = () => {
  const [selectedBank, setSelectedBank] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBankClick = (bank) => {
    setSelectedBank(bank);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    console.log('Application submitted:', formData);
    alert(`Thank you! Your application for ${selectedBank.name} has been submitted. We'll contact you soon.`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <BanksListing onBankClick={handleBankClick} />
      <Stats />
      
      <UserDetailsModal 
        bank={selectedBank}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default HomeLoanApp;