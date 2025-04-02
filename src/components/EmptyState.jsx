import React from "react";

const EmptyState = ({ activeTab, selectedCategory, isSearch, searchQuery }) => {
    const getMessage = () => {
        if (isSearch) return `No results found for "${searchQuery}"`;
        
        switch (activeTab) {
            case "favorites":
                return "No favorite websites yet";
            case "trending":
                return "No trending websites yet";
            case "latest":
                return "No latest websites yet";
            default:
                return selectedCategory === "All"
                    ? "No websites available"
                    : `No websites in ${selectedCategory} category`;
        }
    };

    return (
        <div className="col-span-3 text-center py-10">
            <p className="text-white text-lg">{getMessage()}</p>
        </div>
    );
};

export default EmptyState;