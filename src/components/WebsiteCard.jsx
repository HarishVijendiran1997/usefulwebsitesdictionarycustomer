import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ExpandableText from "./ExpandableText";

const WebsiteCard = ({
    site,
    isFavorite,
    onToggleFavorite,
    onWebsiteClick
}) => {
    return (
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg drop-shadow-lg flex flex-col hover:scale-105 transition-all duration-300">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleFavorite(site.id);
                }}
                className="absolute top-2 right-2 z-10 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
                {isFavorite ? (
                    <FaHeart className="text-red-500 text-xl" />
                ) : (
                    <FaRegHeart className="text-white text-xl hover:text-red-500" />
                )}
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    onWebsiteClick(site);
                }}
                className="text-lg font-semibold text-white hover:underline text-left"
            >
                <img src={site.imageUrl} alt={site.title} className="w-full h-50 object-cover rounded-t-lg" />
            </button>
            <div className="px-2">
                <div className="flex justify-between items-center mt-2 py-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onWebsiteClick(site);
                        }}
                        className="text-lg font-semibold text-white hover:underline text-left"
                    >
                        {site.title}
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onWebsiteClick(site);
                        }}
                        className="px-3 py-1 border border-neutral-600 text-white hover:text-black rounded-lg text-sm font-medium w-fit hover:bg-neutral-300 transition"
                    >
                        Visit
                    </button>
                </div>
                <p className="text-gray-300 text-sm w-65">
                    <ExpandableText text={site.description} limit={100} />
                </p>
                <div className="flex justify-between py-2 pr-2">
                    <p className="text-gray-400 text-sm">Category: {site.category}</p>
                    <p className="text-gray-400 text-sm">
                        Visited: {site.visitedCount < 1 ? site.visitedCount : `${site.visitedCount} times`}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WebsiteCard;