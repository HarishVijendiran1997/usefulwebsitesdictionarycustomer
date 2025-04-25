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
        unloadTabData,
        resetScrollStates,
        searchAllWebsites
    } = useWebsites();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [displayCount, setDisplayCount] = useState(15);
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const observer = useRef();

    // Cleanup observer on unmount
    useEffect(() => {
        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, []);

    // Reset scroll states when category or tab changes
    useEffect(() => {
        const resetScroll = () => {
            if (observer.current) {
                observer.current.disconnect();
            }
            resetScrollStates();
            setDisplayCount(15);
        };

        // Reset when category changes (for 'all' tab)
        if (activeTab === 'all') {
            resetScroll();
        }

        // Reset when tab changes (unless we're coming from search)
        if (searchResults === null) {
            resetScroll();
        }
    }, [selectedCategory, activeTab, searchResults, resetScrollStates]);

    // Handle search
    useEffect(() => {
        if (!searchQuery || searchQuery.trim().length < 2) {
            setSearchResults(null);
            return;
        }

        const performSearch = async () => {
            setIsSearching(true);
            try {
                const results = await searchAllWebsites(searchQuery);
                setSearchResults(results);
            } catch (error) {
                console.error("Search error:", error);
                setSearchResults([]);
            }
            setIsSearching(false);
            resetScroll();
        };

        const timer = setTimeout(performSearch, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, searchAllWebsites]);


    // Handle tab change
    const handleTabChange = useCallback((tab) => {

        if (activeTab === tab) return;

        setSearchResults(null);
        setSelectedCategory('All');  // Reset category
        if (activeTab === "trending" || activeTab === "latest") {
            unloadTabData(activeTab);
        }

        setActiveTab(tab);

        if (tab === "trending") {
            loadTrendingWebsites();
        } else if (tab === "latest") {
            loadLatestWebsites();
        }
    }, [activeTab, setActiveTab, loadTrendingWebsites, loadLatestWebsites, unloadTabData]);


    // Reset states when category changes
    useEffect(() => {
        if (activeTab === "all" && searchResults === null) {
            resetScrollStates();
            setDisplayCount(15);
        }

    }, [selectedCategory, activeTab, searchResults, resetScrollStates]);

    useEffect(() => {
        if (activeTab === "latest" && !latestWebsites.length && !latestLoading) {
            loadLatestWebsites();
        }
    }, [activeTab, latestWebsites.length, latestLoading, loadLatestWebsites]);


    // Filtered websites
    const filteredWebsites = useMemo(() => {
        if (searchResults !== null) return [];

        let filtered = selectedCategory === "All"
            ? websites
            : websites.filter(website =>
                website.category.toLowerCase() === selectedCategory.toLowerCase()
            );

        if (activeTab === "favorites") {
            filtered = filtered.filter(website => favorites.includes(website.id));  // Filter based on favorites
        }

        return filtered;
    }, [websites, selectedCategory, activeTab, favorites, searchResults]);


    // Displayed websites
    const displayedWebsites = useMemo(() => {
        if (searchResults !== null) return searchResults;

        switch (activeTab) {
            case "trending": return trendingWebsites;
            case "latest": return latestWebsites;
            case "favorites": return filteredWebsites;
            default: return filteredWebsites.slice(0, displayCount);
        }
    }, [activeTab, trendingWebsites, latestWebsites, filteredWebsites, displayCount, searchResults]);


    // Loading state
    const isLoading = useMemo(() => {
        if (isSearching) return true;
        switch (activeTab) {
            case "trending": return trendingLoading;
            case "latest": return latestLoading;
            case "favorites": return loading;
            default: return loading || loadingMore;
        }
    }, [activeTab, trendingLoading, latestLoading, loading, loadingMore, isSearching]);

    // Infinite scroll observer
    useEffect(() => {
        // Ensure observer is active only for the "all" tab
        if (activeTab !== "all" || searchResults !== null) return;

        const handleObserver = (entries) => {
            const [target] = entries;
            if (target.isIntersecting && !loadingMore && !noMoreData) {
                if (displayCount < filteredWebsites.length) {
                    setDisplayCount(prev => prev + 15);
                } else {
                    loadMoreWebsites();
                }
            }
        };

        observer.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: "20px",
            threshold: 0
        });

        const loadMoreElement = document.querySelector('#load-more-trigger');
        if (loadMoreElement) {
            observer.current.observe(loadMoreElement);
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [activeTab, searchResults, loadingMore, noMoreData, displayCount, filteredWebsites.length, loadMoreWebsites, selectedCategory, favorites, toggleFavorite, unloadTabData]);


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
        if (searchResults !== null) {
            return `Search Results${searchQuery ? ` for "${searchQuery}"` : ''}`;
        }

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
    // const SearchDebugger = ({ searchQuery }) => {
    //     const { searchAllWebsites } = useWebsites();
    //     const [results, setResults] = useState([]);

    //     useEffect(() => {
    //         if (searchQuery && searchQuery.trim().length >= 2) {
    //             searchAllWebsites(searchQuery).then(setResults);
    //         } else {
    //             setResults([]);
    //         }
    //     }, [searchQuery, searchAllWebsites]);

    //     if (!searchQuery || searchQuery.trim().length < 2) return null;

    //     return (
    //         <div className="bg-red-900 bg-opacity-10 p-4 mb-4">
    //             <h3 className="font-bold text-white">Search Debug</h3>
    //             <p className="text-white">Query: "{searchQuery}"</p>
    //             <p className="text-white">Found: {results.length} results</p>
    //             <div className="mt-2">
    //                 {results.map(website => (
    //                     <div key={website.id} className="text-sm text-white">
    //                         {website.title} - 
    //                         Tags: {website.tags.join(', ')}
    //                     </div>
    //                 ))}
    //             </div>
    //         </div>
    //     );
    // };
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

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="sticky top-0 z-10 bg-black sm:pt-2 shrink-0">
                    <Suspense fallback={<div className="h-10 bg-neutral-800 animate-pulse"></div>}>
                        <TabNavigation activeTab={activeTab} setActiveTab={handleTabChange} />
                    </Suspense>
                </div>

                <div className="flex-1 overflow-y-auto px-4 xl:ml-4">
                    {isLoading && displayedWebsites.length === 0 ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        </div>
                    ) : (
                        <div className="w-full max-w-screen mx-auto bg-neutral-950 py-4 px-2 rounded-lg">
                            <h2 className="text-2xl font-bold text-white capitalize">
                                {getSectionTitle()}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-5 mt-4">
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
                                        <EmptyState
                                            activeTab={activeTab}
                                            selectedCategory={selectedCategory}
                                            isSearch={searchResults !== null}
                                            searchQuery={searchQuery}
                                        />
                                    )}
                                </Suspense>
                            </div>

                            {activeTab === "all" && !noMoreData && searchResults === null && (
                                <div id="load-more-trigger" className="h-10 mt-5 flex justify-center items-center">
                                    {loadingMore && (
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    )}
                                </div>
                            )}

                            {noMoreData && activeTab === "all" && searchResults === null && filteredWebsites.length > 0 && (
                                <div className="text-center py-4 text-neutral-400">
                                    You've reached the end
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hero;
