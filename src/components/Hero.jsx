import React, { Suspense } from "react";
import { useWebsites } from "../contexts/WebsitesContext"; // Import the custom hook

// Lazily load the components
const SideBar = React.lazy(() => import("./SideBar"));
const ExpandableText = React.lazy(() => import("./ExpandableText"));

const Hero = () => {
    const {
        activeTab,
        setActiveTab,
        websites,
        loading,
        noMoreData,
        loadMoreWebsites,
    } = useWebsites(); // Use the context

    return (
        <div className="bg-neutral-950 w-full h-[calc(100vh-74px)] flex flex-col sm:flex-row overflow-hidden">
            {/* Suspense to handle lazy loading */}
            <Suspense fallback={<div className="flex justify-center items-center h-64 p-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>}>
                <SideBar />
            </Suspense>

            <main className="flex-1 p-4 xl:ml-4 overflow-auto">
                {/* Tabs Navigation */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {["all", "favorites", "mostVisited"].map((tab) => (
                        <button
                            key={tab}
                            className={`px-4 py-2 rounded-lg transition ${activeTab === tab ? "bg-black text-white" : "bg-white text-black"}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "all" ? "All Websites" : tab === "favorites" ? "Favorites" : "Most Visited"}
                        </button>
                    ))}
                </div>

                {/* Loading Spinner */}
                {loading && websites.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <section className="w-full max-w-screen-xl mx-auto bg-neutral-950 p-5 rounded-lg">
                        <h2 className="text-2xl font-bold text-white capitalize">{activeTab} Websites</h2>

                        {/* Conditional Section Rendering */}
                        {activeTab === "all" && (
                            <div>
                                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                                    {websites.map((site) => (
                                        <div key={site.id} className="bg-neutral-950 border border-neutral-900 rounded-lg drop-shadow-lg flex flex-col hover:scale-105 transition-all duration-300">
                                            <img src={site.imageUrl} alt={site.title} className="w-full h-50 object-cover rounded-t-lg" />
                                            <div className="px-2">
                                                <div className="flex justify-between items-center mt-2 py-2">
                                                    <a href={site.url.startsWith("http") ? site.url : `https://${site.url}`} target="_blank" rel="noopener noreferrer">
                                                        <h3 className="text-lg font-semibold text-white">{site.title}</h3>
                                                    </a>
                                                    <a
                                                        href={site.url.startsWith("http") ? site.url : `https://${site.url}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1 border border-neutral-600 text-white hover:text-black rounded-lg text-sm font-medium w-fit hover:bg-neutral-300 transition"
                                                    >
                                                        Visit
                                                    </a>
                                                </div>
                                                {/* Suspense to handle lazy loading of ExpandableText */}
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
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Other tabs */}
                        {activeTab === "favorites" && (
                            <div>
                                <p className="text-white mb-4">Here your favorite websites will be shown.</p>
                                {/* Add your logic for favorite websites here */}
                            </div>
                        )}

                        {activeTab === "mostVisited" && (
                            <div>
                                <p className="text-white mb-4">Here your most visited websites will be shown.</p>
                                {/* Add your logic for most visited websites here */}
                            </div>
                        )}

                        {!noMoreData && activeTab === "all" && (
                            <button
                                onClick={loadMoreWebsites}
                                className="mt-4 mb-4 px-4 py-2 bg-neutral-700 text-white rounded-lg block mx-auto hover:bg-neutral-600 transition duration-200"
                            >
                                {loading ? "Loading..." : "Load More"}
                            </button>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
};

export default Hero;
