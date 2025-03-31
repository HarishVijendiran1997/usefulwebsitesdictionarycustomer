import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // Import FontAwesome Search Icon

const NavBar = () => {
    const [count, setCount] = useState(0)
    function getRandomValue() {
        return Math.floor(Math.random() * (1200 - 1000 + 1)) + 1000;
    }
    useEffect(() => {
        const timeout = setTimeout(
            () => setCount(prev => prev + 1),
            getRandomValue()
        )
        return () => clearTimeout(timeout);
    }, [count])


    return (
        <nav className="sticky top-0 z-50 bg-black text-white shadow-md px-6 py-4">
            {/* Mobile Layout: Title on Top */}
            <div className="flex sm:hidden justify-center w-full">
                <h1 className="text-xl font-light text-center">Useful Websites Dictionary</h1>
            </div>

            {/* Desktop Layout: Title, Search Bar, and Visit Count */}
            <div className="hidden sm:flex justify-between items-center w-full">
                <h1 className="text-2xl font-light">Useful Websites Dictionary</h1>

                {/* Centered Search Bar with Icon Inside */}
                <div className="relative flex-1 flex justify-center max-w-[400px]">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-700 rounded-full py-2 px-4 pr-12 w-full focus:outline-none focus:border-blue-500"
                    />
                    <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
                </div>

                <span className="text-lg">Users Site Visit: {count}</span>
            </div>

            {/* Mobile Layout: Search Bar and Visit Count */}
            <div className="sm:hidden flex flex-col gap-2 mt-3">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded-md p-2 pr-12 w-full focus:outline-none focus:border-blue-500"
                    />
                    <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer" />
                </div>
                <span className="text-lg text-center">Users Site Visit: {count}</span>
            </div>
        </nav>
    );
};

export default NavBar;
