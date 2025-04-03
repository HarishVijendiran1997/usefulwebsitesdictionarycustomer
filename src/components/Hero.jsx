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
        searchAllWebsites // Add this to your WebsitesContext
    } = useWebsites();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [displayCount, setDisplayCount] = useState(15);
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const observer = useRef();
    const loadMoreRef = useRef();

    // Handle search when searchQuery changes
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
        };

        const timer = setTimeout(performSearch, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, searchAllWebsites]);

    // Handle tab change
    const handleTabChange = useCallback((tab) => {
        if (activeTab === tab) return;
        
        // Clear search results when changing tabs
        setSearchResults(null);
        
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
        if (searchResults !== null) return []; // Skip when showing search results
        
        let filtered = selectedCategory === "All"
            ? websites
            : websites.filter(website => website.category.toLowerCase() === selectedCategory.toLowerCase());

        if (activeTab === "favorites") {
            filtered = filtered.filter(website => favorites.includes(website.id));
        }
        
        return filtered;
    }, [websites, selectedCategory, activeTab, favorites, searchResults]);

    // Displayed websites
    const displayedWebsites = useMemo(() => {
        if (searchResults !== null) return searchResults;
        
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
    }, [activeTab, trendingWebsites, latestWebsites, filteredWebsites, displayCount, searchResults]);

    // Loading state
    const isLoading = useMemo(() => {
        if (isSearching) return true;
        
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
    }, [activeTab, trendingLoading, latestLoading, loading, loadingMore, isSearching]);

    // Infinite scroll observer callback
    const handleObserver = useCallback((entries) => {
        const [target] = entries;
        if (target.isIntersecting && !loadingMore && !noMoreData && activeTab === "all" && searchResults === null) {
            setDisplayCount(prev => prev + 15);
            if (displayCount >= filteredWebsites.length) {
                loadMoreWebsites();
            }
        }
    }, [loadingMore, noMoreData, activeTab, displayCount, filteredWebsites.length, loadMoreWebsites, searchResults]);

    // Set up intersection observer
    useEffect(() => {
        if (activeTab !== "all" || searchResults !== null) return;

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
    }, [handleObserver, activeTab, filteredWebsites, searchResults]);

    // Reset display count when filters change
    useEffect(() => {
        if (activeTab === "all" && searchResults === null) {
            setDisplayCount(15);
        }
    }, [activeTab, selectedCategory, searchResults]);

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

    {/* Sidebar - fixed height */}
    <Suspense fallback={<div className="flex justify-center items-center h-64 p-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>}>
      <SideBar
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelection}
        setSelectedCategory={setSelectedCategory}
      />
    </Suspense>

    {/* Main content area - matches sidebar height */}
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Sticky header - fixed height */}
      <div className="sticky top-0 z-10 bg-black sm:pt-2 shrink-0">
        <Suspense fallback={<div className="h-10 bg-neutral-800 animate-pulse"></div>}>
          <TabNavigation activeTab={activeTab} setActiveTab={handleTabChange} />
        </Suspense>
      </div>

      {/* Scrollable websites container */}
      <div className="flex-1 overflow-y-auto px-4 xl:ml-4">
        {isLoading && displayedWebsites.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="w-full max-w-screen-xl mx-auto bg-neutral-950 py-4 px-2 rounded-lg">
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
                  <EmptyState 
                    activeTab={activeTab} 
                    selectedCategory={selectedCategory}
                    isSearch={searchResults !== null}
                    searchQuery={searchQuery}
                  />
                )}
              </Suspense>
            </div>

            {/* Infinite scroll trigger */}
            {activeTab === "all" && !noMoreData && searchResults === null && (
              <div ref={loadMoreRef} className="h-10 mt-5 flex justify-center items-center">
                {loadingMore && (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                )}
              </div>
            )}

            {noMoreData && activeTab === "all" && searchResults === null && (
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
    