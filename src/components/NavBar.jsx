import React, { useEffect, useState } from 'react';
import { FaSearch, FaBook } from 'react-icons/fa';
import { useWebsites } from '../contexts/WebsitesContext';

const NavBar = ({ searchQuery, setSearchQuery }) => {
    const { websites } = useWebsites();
    const [totalVisits, setTotalVisits] = useState(0);

    useEffect(() => {
        if (websites && websites.length > 0) {
            const sum = websites.reduce((total, website) => total + (website.visitedCount || 0), 0);
            setTotalVisits(sum);
        }
    }, [websites]);

    return (
        <nav className="bg-black text-white shadow-md px-6 py-2">
            {/* Mobile Layout */}
            <div className="flex sm:hidden flex-col items-center">
                <div className="flex items-center gap-2">
                    <div className="relative -translate-y-3 flex items-center">
                        <FaBook className="text-white relative" size={30} />
                        <FaBook className="text-red-500 absolute -translate-x-[2px]" size={30} />
                    </div>

                    {/* Wrapping the title and subtitle in a flex column */}
                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-light text-center mt-2">
                            Useful Websites Dictionary
                        </h1>
                        <span className="text-md font-light text-neutral-300 text-center mb-2">
                            Discover the Best Online Resources
                        </span>
                    </div>
                </div>
                <div className="flex justify-between items-center w-full gap-5 mt-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border border-gray-300 rounded-full py-2 px-4 pr-10 w-full focus:outline-none focus:border-red-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                    <span className="text-md font-light pr-2">Visits: <strong>{totalVisits.toLocaleString()}</strong></span>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                    <FaBook className="text-white relative" size={28} />
                    <FaBook className="text-red-500 absolute -translate-[2px]" size={28} />
                    <h1 className="text-2xl font-light py-2">Useful Websites Dictionary</h1>
                </div>
                <div className="relative flex-1 max-w-xl mx-4">
                    <input
                        type="text"
                        placeholder="Search by title, category or tags..."
                        className="border border-gray-700 rounded-full py-2 px-4 pr-10 w-full focus:outline-none focus:border-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                <span className="text-lg"><strong>{totalVisits.toLocaleString()}</strong> : Total Visits</span>
            </div>
        </nav>
    );
};

export default NavBar;
