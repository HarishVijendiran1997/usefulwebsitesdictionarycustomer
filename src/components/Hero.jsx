import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore"; // Import Firebase
import SideBar from "./SideBar";
import ExpandableText from "./ExpandableText";

const Hero = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [websites, setWebsites] = useState([]); // Store fetched data
    const [visibleCount, setVisibleCount] = useState(21); // Number of visible items

    // Fetch Firestore Data
    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "websites"));
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setWebsites(data); // Store in state
            } catch (error) {
                console.error("Error fetching websites:", error);
            }
        };
        fetchWebsites();
    }, []);

    // Filter Websites Based on Tab
    const filteredWebsites = websites.filter((site) => {
        switch (activeTab) {
            case "favorites":
                return site["Visited Count"] > 3;
            case "mostVisited":
                return site["Visited Count"] > 0;
            default:
                return true;
        }
    });

    // Show only visibleCount items
    const displayedWebsites = filteredWebsites.slice(0, visibleCount);

    return (
        <div className="bg-neutral-950 w-full h-[calc(100vh-74px)] flex flex-col sm:flex-row overflow-hidden" style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}>
            {/* Sidebar */}
            <SideBar />

            {/* Main Content */}
            <main className="flex-1 p-4 xl:ml-4 overflow-auto">
                {/* Tabs Navigation */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {["all", "favorites", "mostVisited"].map((tab) => (
                        <button
                            key={tab}
                            className={`px-4 py-2 rounded-lg transition ${activeTab === tab ? "bg-black text-white" : "bg-white text-black"
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === "all" ? "All Websites" : tab === "favorites" ? "Favorites" : "Most Visited"}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <section className="w-full max-w-screen-xl mx-auto bg-neutral-900 p-5 rounded-lg">

                    <h2 className="text-2xl font-bold text-white capitalize">{activeTab}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                        {displayedWebsites.map((site) => (

                            <div key={site.id} className="bg-neutral-950 rounded-lg drop-shadow-lg flex flex-col hover:scale-105 transition-all duration-300">
                                <img src={site.imageUrl} alt={site.title} className="w-full h-50 object-cover rounded-t-lg" />
                                <div className="px-2">
                                    <div className="flex justify-between items-center mt-2">
                                        {/* Title on the Left */}
                                        <h3 className="text-lg font-semibold text-white">{site.title}</h3>

                                        {/* Visit Button on the Right */}
                                        <a
                                            href={site.url.startsWith("http") ? site.url : `https://${site.url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1 border border-neutral-600 text-white hover:text-black rounded-lg text-sm font-medium w-fit hover:bg-neutral-300 transition"
                                        >
                                            Visit
                                        </a>
                                    </div>

                                    <p className="text-gray-300 text-sm">
                                        <ExpandableText text={site.description} limit={100} />
                                    </p>

                                    <div className="flex justify-between py-2">
                                        <p className="text-gray-400 text-sm">Category: {site.category}</p>
                                        <p className="text-gray-400 text-sm">
                                            Visited: {site.visitedCount < 1 ? site.visitedCount : `${site.visitedCount} times`}
                                        </p>
                                    </div>
                                </div>

                                {/* 
                                <a
                                    href={site.url.startsWith("http") ? site.url : `https://${site.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto mb-2 px-3 py-1 mx-2 bg-neutral-200 text-black rounded-lg text-center text-sm font-medium w-fit self-end hover:bg-neutral-300 transition"
                                >
                                    Visit
                                </a> */}
                            </div>

                        ))}
                    </div>

                    {visibleCount < filteredWebsites.length && (
                        <button
                            onClick={() => setVisibleCount(prev => prev + 20)}
                            className="mt-4 mb-4 px-4 py-2 bg-neutral-700 text-white rounded-lg block mx-auto hover:bg-neutral-600 transition duration-200"
                        >
                            Load More
                        </button>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Hero;
