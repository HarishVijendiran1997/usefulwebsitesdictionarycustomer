import React, { Suspense, useState, useEffect } from "react";
import { useWebsites } from "../contexts/WebsitesContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const SideBar = React.lazy(() => import("./SideBar"));
const ExpandableText = React.lazy(() => import("./ExpandableText"));

const Hero = ({ searchQuery }) => {
    const {
        activeTab,
        setActiveTab,
        websites,
        loading,
        noMoreData,
        loadMoreWebsites,
        updateVisitCount,
        favorites,
        toggleFavorite,
        getTodaysWebsites
    } = useWebsites();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const PAGE_LIMIT = 12
    const [displayCount, setDisplayCount] = useState(PAGE_LIMIT);

    // Filter websites based on active tab and category
    const filteredWebsites = () => {
        let filtered = selectedCategory === "All"
            ? websites
            : websites.filter(website => website.category.toLowerCase() === selectedCategory.toLowerCase());

        if (searchQuery.trim() && activeTab !== "trending" && activeTab !== "latest") {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(website =>
                website.title.toLowerCase().includes(query) ||
                website.category.toLowerCase().includes(query) ||
                (website.tags && website.tags.some(tag => tag.toLowerCase().includes(query)))
            );
        }

        if (activeTab === "favorites") {
            return filtered.filter(website => favorites.includes(website.id));
        } else if (activeTab === "trending") {
            // Return top 10 most visited websites
            return [...websites]
                .sort((a, b) => (b.visitedCount || 0) - (a.visitedCount || 0))
                .slice(0, 10);
        } else if (activeTab === "latest") {
            // Return 10 most recently added websites (you'll implement this later)
            const todaysWebsites = getTodaysWebsites(filtered);
            return todaysWebsites.sort((a, b) => b.createdAt - a.createdAt);
        }
        return filtered;
    };


    const displayedWebsites = (activeTab === "trending" || activeTab === "latest")
        ? filteredWebsites()
        : filteredWebsites().slice(0, displayCount);

    const handleCategorySelection = (category) => {
        setSelectedCategory(category);
        setDisplayCount(10);
    };

    const handleLoadMore = () => {
        if (displayCount >= filteredWebsites().length && !noMoreData) {
            loadMoreWebsites();
        }
        setDisplayCount(prev => prev + PAGE_LIMIT);
    };

    const handleWebsiteClick = async (site) => {
        try {
            // Open in new tab immediately
            window.open(site.url.startsWith("http") ? site.url : `https://${site.url}`, '_blank');

            // Update visit count
            await updateVisitCount(site.id);
        } catch (error) {
            console.error("Error handling website click:", error);
        }
    };

    useEffect(() => {
        setDisplayCount(PAGE_LIMIT);
    }, [activeTab, selectedCategory]);

    const showLoadMore = activeTab === "all" &&
        (filteredWebsites().length > displayCount ||
            (!noMoreData && selectedCategory === "All" && !searchQuery.trim()));

    const renderWebsiteCard = (site) => (
        <div key={site.id} className="bg-neutral-950 border border-neutral-900 rounded-lg drop-shadow-lg flex flex-col hover:scale-105 transition-all duration-300">
            {/* Favorite toggle button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(site.id);
                }}
                className="absolute top-2 right-2 z-10 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
                aria-label={favorites.includes(site.id) ? "Remove from favorites" : "Add to favorites"}
            >
                {favorites.includes(site.id) ? (
                    <FaHeart className="text-red-500 text-xl" />
                ) : (
                    <FaRegHeart className="text-white text-xl hover:text-red-500" />
                )}
            </button>
            <img src={site.imageUrl} alt={site.title} className="w-full h-50 object-cover rounded-t-lg" />
            <div className="px-2">
                <div className="flex justify-between items-center mt-2 py-2">
                    <a href={site.url.startsWith("http") ? site.url : `https://${site.url}`} onClick={(e) => {
                        e.preventDefault();
                        handleWebsiteClick(site);
                    }} target="_blank" rel="noopener noreferrer">
                        <h3 className="text-lg font-semibold text-white">{site.title}</h3>
                    </a>
                    <a
                        href={site.url.startsWith("http") ? site.url : `https://${site.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                            e.preventDefault();
                            handleWebsiteClick(site);
                        }}
                        className="px-3 py-1 border border-neutral-600 text-white hover:text-black rounded-lg text-sm font-medium w-fit hover:bg-neutral-300 transition"
                    >
                        Visit
                    </a>
                </div>
                <Suspense fallback={<div className="text-white">Loading description...</div>}>
                    <p className="text-gray-300 text-sm w-65">
                        <ExpandableText text={site.description} limit={100} />
                    </p>
                </Suspense>
                <div className="flex justify-between py-2 pr-2">
                    <p className="text-gray-400 text-sm">Category: {site.category}</p>
                    <p className="text-gray-400 text-sm">
                        Visited: {site.visitedCount < 1 ? site.visitedCount : `${site.visitedCount} times`}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-neutral-950 w-full sm:h-[calc(100vh-64px)] h-screen flex flex-col sm:flex-row overflow-hidden" style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}>
            <Suspense fallback={<div className="flex justify-center items-center h-64 p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>}>
                <SideBar
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelection}
                    setSelectedCategory={setSelectedCategory}
                />
            </Suspense>


            <main className="flex-1 px-4 md:px-0 overflow-auto">
                <div className="sticky top-0 z-10 bg-black pb-2 sm:pt-2">
                    <div className="flex flex-wrap gap-2 px-4">
                        {["all", "favorites", "trending", "latest"].map((tab) => (
                            <button
                                key={tab}

                                className={`px-3 md:text-xs text-xs py-2 rounded-full font-semibold transition ${activeTab === tab ? "bg-black border border-b-0 border-t-0 text-white" : "bg-white border border-b-0 border-t-0 text-black"}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === "all" ? "All Websites" :
                                    tab === "favorites" ? "Favorites" :
                                        tab === "trending" ? "Trending" : "Latest"}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto xl:ml-4">

                    {loading && websites.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        </div>
                    ) : (
                        <section className="w-full max-w-screen-xl mx-auto bg-neutral-950 py-4  px-2 rounded-lg">
                            <h2 className="text-2xl font-bold text-white capitalize">
                                {activeTab === "all"
                                    ? selectedCategory
                                    : activeTab === "trending"
                                        ? "Top 10 Trending Websites"
                                        : activeTab === "latest"
                                            ? "Latest Websites"
                                            : "Your Favorites"}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
                                {displayedWebsites.length > 0 ? (
                                    displayedWebsites.map(renderWebsiteCard)
                                ) : (
                                    <div className="col-span-3 text-center py-10">
                                        <p className="text-white text-lg">
                                            {activeTab === "favorites"
                                                ? "No favorite websites yet. Add some to see them here!"
                                                : activeTab === "trending"
                                                    ? "No trending websites yet. Start browsing to see popular sites!"
                                                    : activeTab === "latest"
                                                        ? "No websites added today. Check back later!"
                                                        : "No websites found in this category."}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {showLoadMore && filteredWebsites().length >= PAGE_LIMIT && (
                                <button
                                    onClick={handleLoadMore}
                                    className="mt-4 mb-10 px-4 py-2 bg-neutral-700 text-white rounded-lg block mx-auto hover:bg-neutral-600 transition duration-200"
                                    disabled={loading}
                                >
                                    {loading ? "Loading..." : "Load More"}
                                </button>
                            )}
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Hero;