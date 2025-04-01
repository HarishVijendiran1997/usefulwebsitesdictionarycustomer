import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useWebsites } from '../contexts/WebsitesContext';
import heroLogo from '../assets/LOOKLINKSLOGO.png';

const NavBar = ({ searchQuery, setSearchQuery }) => {
    const { websites } = useWebsites();
    const [totalVisits, setTotalVisits] = useState(0);

    useEffect(() => {
        if (websites?.length > 0) {
            const sum = websites.reduce((total, website) => total + (website.visitedCount || 0), 0);
            setTotalVisits(sum);
        }
    }, [websites]);

    return (
        <nav className="bg-black text-white shadow-md px-4 sm:px-6 sticky top-0 z-50">
            {/* Mobile Layout */}
            <div className="flex sm:hidden flex-col items-center">
                <div className="flex flex-col items-center py-2">
                    <img
                        src={heroLogo}
                        className="h-8 mb-2 w-auto object-contain"
                    />
                    <span className="text-sm font-light text-neutral-300">
                        Discover the Best Online Resources
                    </span>
                </div>

                <div className="flex justify-between items-center w-full gap-4 mt-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border border-gray-400 rounded-full py-2 px-4 pr-10 w-full focus:outline-none focus:border-red-500 text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>
                    <span className="text-sm font-light pr-2 whitespace-nowrap">
                        Visits: <strong>{totalVisits.toLocaleString()}</strong>
                    </span>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex justify-between items-center w-full gap-4">
                <div className="flex items-center gap-2 min-w-[100px]">
                    <div className='flex flex-col items-center justify-center mt-3'>

                        <img
                            src={heroLogo}
                            className="h-8 w-auto object-contain text-center"
                        />
                        <p className='text-xs text-neutral-400'>Discover. Explore. Connect.</p>
                    </div>
                </div>

                <div className="relative flex-1 max-w-2xl mx-4 ">
                    <input
                        type="text"
                        placeholder="Search by title, category or tags..."
                        className="border border-gray-700 rounded-full py-2 px-4 pr-10 w-full focus:outline-none focus:border-red-500 text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>

                <div className="min-w-[150px] text-right">
                    <span className="text-sm sm:text-base font-light whitespace-nowrap">
                        <strong>{totalVisits.toLocaleString()}</strong> Total Visits
                    </span>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;