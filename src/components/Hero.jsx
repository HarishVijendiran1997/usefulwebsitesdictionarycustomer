import React, { Suspense, useState, useEffect, useMemo, useRef, useCallback } from "react";
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
        loadingMore,
        noMoreData,
        loadMoreWebsites,
        updateVisitCount,
        favorites,
        toggleFavorite,
        trendingWebsites,
        trendingLoading,
        loadTrendingWebsites,
        latestWebsites,
        latestLoading,
        loadLatestWebsites,
        unloadTabData
    } = useWebsites();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [displayCount, setDisplayCount] = useState(15);
    const observer = useRef();
    const loadMoreRef = useRef();

    // Handle tab change
    const handleTabChange = useCallback((tab) => {
        // Unload data from previous tab if needed
        if (activeTab === "trending" || activeTab === "latest") {
            unloadTabData(activeTab);
        }
        
        setActiveTab(tab);
        
        // Load data for new tab if needed
        if (tab === "trending") {
            loadTrendingWebsites();
        } else if (tab === "latest") {
            loadLatestWebsites();
        }
    }, [activeTab, setActiveTab, loadTrendingWebsites, loadLatestWebsites, unloadTabData]);

    // Memoized filtered websites (for all and favorites tabs)
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
        }
        return filtered;
    }, [websites, selectedCategory, searchQuery, activeTab, favorites]);

    // Displayed websites
    const displayedWebsites = useMemo(() => {
        switch (activeTab) {
            case "trending":
                return trendingWebsites;
            case "latest":
                return latestWebsites;
            case "favorites":
                return filteredWebsites;
            default: // "all" tab
                return filteredWebsites.slice(0, displayCount);
        }
    }, [activeTab, trendingWebsites, latestWebsites, filteredWebsites, displayCount]);

    // Loading state
    const isLoading = useMemo(() => {
        switch (activeTab) {
            case "trending":
                return trendingLoading;
            case "latest":
                return latestLoading;
            case "favorites":
                return loading;
            default: // "all" tab
                return loading || loadingMore;
        }
    }, [activeTab, trendingLoading, latestLoading, loading, loadingMore]);

    // Infinite scroll observer callback
    const handleObserver = useCallback((entries) => {
        const [target] = entries;
        if (target.isIntersecting && !loadingMore && !noMoreData && activeTab === "all") {
            setDisplayCount(prev => prev + 15);
            if (displayCount >= filteredWebsites.length) {
                loadMoreWebsites();
            }
        }
    }, [loadingMore, noMoreData, activeTab, displayCount, filteredWebsites.length, loadMoreWebsites]);

    // Set up intersection observer
    useEffect(() => {
        if (activeTab !== "all") return;

        const option = {
            root: null,
            rootMargin: "20px",
            threshold: 0
        };

        observer.current = new IntersectionObserver(handleObserver, option);
        if (loadMoreRef.current) observer.current.observe(loadMoreRef.current);

        return () => {
            if (observer.current) observer.current.disconnect();
        };
    }, [handleObserver, activeTab, filteredWebsites]);

    // Reset display count when filters change
    useEffect(() => {
        if (activeTab === "all") {
            setDisplayCount(15);
        }
    }, [activeTab, selectedCategory, searchQuery]);

    const handleCategorySelection = (category) => {
        setSelectedCategory(category);
    };

    const handleWebsiteClick = async (site) => {
        try {
            window.open(site.url.startsWith("http") ? site.url : `https://${site.url}`, '_blank');
            await updateVisitCount(site.id);
        } catch (error) {
            console.error("Error handling website click:", error);
        }
    };

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
        <div className="bg-neutral-950 w-full sm:h-[calc(100vh-76px)] h-screen flex flex-col sm:flex-row overflow-hidden"
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
                <div className="sticky top-0 z-10 bg-black sm:pt-2">
                    <Suspense fallback={<div className="h-10 bg-neutral-800 animate-pulse"></div>}>
                        <TabNavigation activeTab={activeTab} setActiveTab={handleTabChange} />
                    </Suspense>
                </div>

                <div className="flex-1 overflow-y-auto xl:ml-4">
                    {isLoading && displayedWebsites.length === 0 ? (
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

                            {/* Infinite scroll trigger */}
                            {activeTab === "all" && !noMoreData && (
                                <div ref={loadMoreRef} className="h-10 mt-5 flex justify-center items-center">
                                    {loadingMore && (
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    )}
                                </div>
                            )}

                            {noMoreData && activeTab === "all" && (
                                <div className="text-center py-4 text-neutral-400">
                                    You've reached the end
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Hero;