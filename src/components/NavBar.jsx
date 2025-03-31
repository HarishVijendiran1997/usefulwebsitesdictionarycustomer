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
                    <FaBook className="text-blue-500" size={24} />
                    <h1 className="text-xl font-light text-center py-2">Useful Websites Dictionary</h1>
                </div>
                <div className="flex justify-between items-center w-full mt-2">
                    <div className="relative flex-1 mr-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border border-gray-700 rounded-full py-2 px-4 pr-10 w-full focus:outline-none focus:border-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                    <span className="text-md font-light">Visits: <strong>{totalVisits.toLocaleString()}</strong></span>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                    <FaBook className="text-blue-500" size={28} />
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
                <span className="text-lg">{totalVisits.toLocaleString()} : Total Visits</span>
            </div>
        </nav>
    );
};

export default NavBar;
