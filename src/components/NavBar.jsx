import React, { useEffect, useState } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

const NavBar = ({ searchQuery, onSearchChange, isSearching }) => {  // Changed to onSearchChange
    const [totalVisits, setTotalVisits] = useState(0);
    const [isOpen, setIsOpen] = useState(true);

    // Load total visits
    useEffect(() => {
        const websitesRef = collection(db, "websites");
        const unsubscribe = onSnapshot(websitesRef, (snapshot) => {
            const sum = snapshot.docs.reduce((total, doc) => {
                return total + (doc.data().visitedCount || 0);
            }, 0);
            setTotalVisits(sum);
        });
        return () => unsubscribe();
    }, []);

    // Eye blinking animation
    useEffect(() => {
        let timeout;
        let interval;

        const blink = () => {
            setIsOpen(false);
            timeout = setTimeout(() => {
                setIsOpen(true);
            }, 200);
        };

        const startBlinking = () => {
            timeout = setTimeout(() => {
                blink();
                interval = setInterval(blink, 5000);
            }, 3000);
        };

        startBlinking();

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, []);

    const LoadingIndicator = () => (
        <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <FaSpinner className="animate-spin text-gray-400" />
        </div>
    );

    return (
        <nav className="bg-black text-white shadow-md px-4 sm:px-6 sticky top-0 z-50">
            {/* Mobile Layout */}
            <div className="flex sm:hidden flex-col items-center">
                <div className="flex flex-col items-center py-2">
                    <img
                        src={isOpen ? "/looklinksopen.webp" : "/looklinksclosed.webp"}
                        alt="LookLinks Logo"
                        className="h-10 w-auto transition-all duration-200 ease-in-out"
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
                            className="border border-gray-400 rounded-full py-2 px-4 pr-10 w-full focus:outline-none focus:border-red-500 text-white bg-gray-900"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}  // Changed to onSearchChange
                            aria-label="Search websites"
                        />
                        {isSearching ? (
                            <LoadingIndicator />
                        ) : (
                            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        )}
                    </div>
                    <span className="text-sm font-light pr-2 whitespace-nowrap">
                        Visits: <strong>{totalVisits.toLocaleString()}</strong>
                    </span>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex justify-between items-center w-full gap-4">
                <div className="flex items-center gap-2 min-w-[100px]">
                    <div className="flex flex-col items-center justify-center mt-3">
                        <img
                            src={isOpen ? "/looklinksopen.webp" : "/looklinksclosed.webp"}
                            alt="LookLinks Logo"
                            className="h-12 w-auto transition-all duration-200 ease-in-out"
                        />
                        <p className="text-xs text-neutral-400">Discover. Explore. Connect.</p>
                    </div>
                </div>

                <div className="relative flex-1 max-w-2xl mx-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by title, category or tags..."
                            className="border border-gray-700 rounded-full py-2 px-4 pr-10 w-full focus:outline-none focus:border-red-500 text-white bg-gray-900"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}  // Changed to onSearchChange
                            aria-label="Search websites"
                        />
                        {isSearching ? (
                            <LoadingIndicator />
                        ) : (
                            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        )}
                    </div>
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