import React from 'react';
import { assets } from '../../assets/assets';
import SearchBar from './SearchBar';

const Hero = () => {
    return (
        <section className="flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/100">

            {/* Main Heading */}
            <h1 className="relative font-bold text-gray-800 md:text-home-heading-large text-home-heading-small max-w-3xl mx-auto">
                Empower your future with the courses designed to{" "}
                <span className="text-blue-600">fit your choice</span>
                <img
                    src={assets.sketch}
                    alt="sketch underline"
                    className="hidden md:block absolute -bottom-7 right-0"
                />
            </h1>

            {/* Paragraph for large screens */}
            <p className="hidden md:block text-gray-500 max-w-2xl mx-auto">
                Join thousands of learners and educators on our platform to unlock your potential and achieve your goals.
            </p>

            {/* Paragraph for small screens */}
            <p className="block md:hidden text-gray-500 max-w-sm mx-auto">
                Join thousands of learners and educators on our platform to unlock your potential and achieve your goals.
            </p>
            <SearchBar />

        </section>
    );
};

export default Hero;
