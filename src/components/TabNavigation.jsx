import React from "react";

const TabNavigation = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: "all", label: "All Websites" },
        { id: "favorites", label: "Favorites" },
        { id: "trending", label: "Trending" },
        { id: "latest", label: "Latest" }
    ];

    return (
        <div className="flex flex-wrap gap-3 md:gap-0 px-5">
            {tabs.map((tab) => (
                <button
                key={tab.id}
                className={`
                  px-3 py-2 text-xs font-semibold
                  transition-all duration-300
                  ${activeTab === tab.id
                    ? "bg-neutral-950 text-white border-2 border-b-0 border-neutral-950 rounded-t-lg"
                    : "bg-white text-black border border-b-0 border-neutral-300 rounded-t-lg hover:bg-neutral-100"
                  }
                `}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
        </div>
    );
};

export default TabNavigation;