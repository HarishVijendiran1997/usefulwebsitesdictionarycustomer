import React, { Suspense, useState, useEffect, useMemo } from "react";
import { useWebsites } from "../contexts/WebsitesContext";
const SideBar = React.lazy(() => import("./SideBar"));
const WebsiteCard = React.lazy(() => import("./WebsiteCard"));
const EmptyState = React.lazy(() => import("./EmptyState"));
const TabNavigation = React.lazy(() => import("./TabNavigation"));

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
    const PAGE_LIMIT = 12;
    const [displayCount, setDisplayCount] = useState(PAGE_LIMIT);

    // Memoized filtered websites
    const filteredWebsites = useMemo(() => {
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
            return [...websites]
                .sort((a, b) => (b.visitedCount || 0) - (a.visitedCount || 0))
                .slice(0, 10);
        } else if (activeTab === "latest") {
            const todaysWebsites = getTodaysWebsites(filtered);
            return todaysWebsites.sort((a, b) => b.createdAt - a.createdAt);
        }
        return filtered;
    }, [websites, selectedCategory, searchQuery, activeTab, favorites, getTodaysWebsites]);

    const displayedWebsites = useMemo(() => {
        return (activeTab === "trending" || activeTab === "latest")
            ? filteredWebsites
            : filteredWebsites.slice(0, displayCount);
    }, [filteredWebsites, activeTab, displayCount]);

    const handleCategorySelection = (category) => {
        setSelectedCategory(category);
        setDisplayCount(10);
    };

    const handleLoadMore = () => {
        if (displayCount >= filteredWebsites.length && !noMoreData) {
            loadMoreWebsites();
        }
        setDisplayCount(prev => prev + PAGE_LIMIT);
    };

    const handleWebsiteClick = async (site) => {
        try {
            window.open(site.url.startsWith("http") ? site.url : `https://${site.url}`, '_blank');
            await updateVisitCount(site.id);
        } catch (error) {
            console.error("Error handling website click:", error);
        }
    };

    useEffect(() => {
        setDisplayCount(PAGE_LIMIT);
    }, [activeTab, selectedCategory]);

    const showLoadMore = activeTab === "all" &&
        (filteredWebsites.length > displayCount ||
            (!noMoreData && selectedCategory === "All" && !searchQuery.trim()));

    const getSectionTitle = () => {
        switch (activeTab) {
            case "all":
                return selectedCategory;
            case "trending":
                return "Top 10 Trending Websites";
            case "latest":
                return "Latest Websites";
            case "favorites":
                return "Your Favorites";
            default:
                return "";
        }
    };

    return (
        <div className="bg-neutral-950 w-full sm:h-[calc(100vh-64px)] h-screen flex flex-col sm:flex-row overflow-hidden"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}>

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
                    <Suspense fallback={<div className="h-10 bg-neutral-800 animate-pulse"></div>}>
                        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
                    </Suspense>
                </div>

                <div className="flex-1 overflow-y-auto xl:ml-4">
                    {loading && websites.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        </div>
                    ) : (
                        <section className="w-full max-w-screen-xl mx-auto bg-neutral-950 py-4 px-2 rounded-lg">
                            <h2 className="text-2xl font-bold text-white capitalize">
                                {getSectionTitle()}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
                                <Suspense fallback={<div className="col-span-3 text-center py-10">Loading websites...</div>}>
                                    {displayedWebsites.length > 0 ? (
                                        displayedWebsites.map(site => (
                                            <WebsiteCard
                                                key={site.id}
                                                site={site}
                                                isFavorite={favorites.includes(site.id)}
                                                onToggleFavorite={toggleFavorite}
                                                onWebsiteClick={handleWebsiteClick}
                                            />
                                        ))
                                    ) : (
                                        <EmptyState activeTab={activeTab} selectedCategory={selectedCategory} />
                                    )}
                                </Suspense>
                            </div>

                            {showLoadMore && filteredWebsites.length >= PAGE_LIMIT && (
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