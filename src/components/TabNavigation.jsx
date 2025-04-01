import React from "react";

const TabNavigation = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: "all", label: "All Websites" },
        { id: "favorites", label: "Favorites" },
        { id: "trending", label: "Trending" },
        { id: "latest", label: "Latest" }
    ];

    return (
        <div className="flex flex-wrap gap-3 px-5">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`px-3 md:text-xs text-xs py-2 rounded-full font-semibold transition ${activeTab === tab.id
                            ? "bg-neutral-800 border-2 border-b-0 border-t-0 text-white"
                            : "bg-white border border-b-0 border-t-0 text-black"
                        }`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default TabNavigation;