import React, { useState } from "react";

const ExpandableText = ({ text, limit = 5 }) => {
    const [expanded, setExpanded] = useState(false);

    if (!text) return <span className="text-gray-500 italic">No description</span>;

    const isLong = text.length > limit;
    const displayText = expanded || !isLong ? text : `${text.slice(0, limit)}...`;

    return (
        <span className="relative">
            {displayText}
            {isLong && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-neutral-600 hover:underline text-xs ml-1"
                    aria-label={expanded ? "See less" : "See more"}
                >
                    {expanded ? "See less" : "See more"}
                </button>
            )}
        </span>
    );
};

export default ExpandableText;
