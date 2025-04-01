import React from "react";

const EmptyState = ({ activeTab, selectedCategory }) => {
    const getMessage = () => {
        switch (activeTab) {
            case "favorites":
                return "No favorite websites yet. Add some to see them here!";
            case "trending":
                return "No trending websites yet. Start browsing to see popular sites!";
            case "latest":
                return "No websites added today. Check back later!";
            default:
                return selectedCategory === "All"
                    ? "No websites found"
                    : `No websites found in ${selectedCategory} category`;
        }
    };

    return (
        <div className="col-span-3 text-center py-10">
            <p className="text-white text-lg">{getMessage()}</p>
        </div>
    );
};

export default EmptyState;