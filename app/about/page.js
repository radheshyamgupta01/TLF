import React from "react";

export default function AboutPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <section className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8 md:p-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                    About Us
                </h1>
                <p className="text-gray-600 text-base md:text-lg mb-6">
                    Welcome to our Real Estate platform! We are dedicated to helping you find your dream property with ease and confidence. Our team combines years of experience with the latest technology to provide you with the best listings and support.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm md:text-base">
                    <li>Wide range of properties for every budget</li>
                    <li>Expert advice and personalized service</li>
                    <li>Secure and transparent transactions</li>
                    <li>Responsive support team</li>
                </ul>
            </section>
        </main>
    );
}