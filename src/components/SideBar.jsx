import React from 'react';
import { useWebsites } from '../contexts/WebsitesContext';
import {
    FaRobot, FaBriefcase, FaMotorcycle, FaTshirt, FaCode,
    FaBitcoin, FaPalette, FaGraduationCap, FaFilm, FaDumbbell,
    FaUtensils, FaHeartbeat, FaHome, FaShieldAlt, FaSmile,
    FaBullhorn, FaMoneyBillWave, FaBrain, FaTv, FaMusic,
    FaNewspaper, FaShoppingBag, FaCamera, FaFlask, FaUserAstronaut,
    FaHashtag, FaFootballBall, FaMicrochip, FaPlane, FaGamepad,
    FaTasks, FaQuestionCircle
} from 'react-icons/fa';

const SideBar = ({ selectedCategory, onCategorySelect, setSelectedCategory }) => {
    const categoryIcons = {
        "AI & Robots": <FaRobot className="mr-2" />,
        "Business": <FaBriefcase className="mr-2" />,
        "Cars & Bikes": <FaMotorcycle className="mr-2" />,
        "Clothes & Fashion": <FaTshirt className="mr-2" />,
        "Coding": <FaCode className="mr-2" />,
        "Crypto & Investing": <FaBitcoin className="mr-2" />,
        "Design & Art": <FaPalette className="mr-2" />,
        "Education": <FaGraduationCap className="mr-2" />,
        "Entertainment": <FaFilm className="mr-2" />,
        "Exercise & Fitness": <FaDumbbell className="mr-2" />,
        "Food & Cooking": <FaUtensils className="mr-2" />,
        "Health": <FaHeartbeat className="mr-2" />,
        "Houses & Property": <FaHome className="mr-2" />,
        "Internet Safety": <FaShieldAlt className="mr-2" />,
        "Lifestyle": <FaSmile className="mr-2" />,
        "Marketing": <FaBullhorn className="mr-2" />,
        "Money": <FaMoneyBillWave className="mr-2" />,
        "Motivation & Mindset": <FaBrain className="mr-2" />,
        "Movies & TV Shows": <FaTv className="mr-2" />,
        "Music": <FaMusic className="mr-2" />,
        "News": <FaNewspaper className="mr-2" />,
        "Online Shopping": <FaShoppingBag className="mr-2" />,
        "Photography": <FaCamera className="mr-2" />,
        "Science": <FaFlask className="mr-2" />,
        "Self-Improvement": <FaUserAstronaut className="mr-2" />,
        "Social Media": <FaHashtag className="mr-2" />,
        "Sports": <FaFootballBall className="mr-2" />,
        "Technology": <FaMicrochip className="mr-2" />,
        "Travel": <FaPlane className="mr-2" />,
        "Video Games": <FaGamepad className="mr-2" />,
        "Work & Productivity": <FaTasks className="mr-2" />,
    };

    const { websites } = useWebsites();

    // Get unique categories and sort them in ascending order
    const categories = ['All', ...new Set(websites.map(website => website.category))]
        .sort((a, b) => {
            if (a === 'All') return -1; // Keep 'All' at the top
            if (b === 'All') return 1;
            return a.localeCompare(b); // Sort other categories alphabetically
        });

    const handleCategory = (e) => {
        const category = e.currentTarget.textContent.trim();
        setSelectedCategory(category);
        onCategorySelect(category);
    };

    return (
        <div
            className="text-white sm:w-64 w-full bg-black sm:max-h-auto max-h-auto cursor-auto 
            overflow-x-auto sm:overflow-x-hidden relative shadow-xl shadow-black"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}
        >
            <h1 className="hidden sm:block text-xl font-bold p-4 pb-2">Categories</h1>

            <div className="flex-1 overflow-y-auto">
                <ul className="flex sm:flex-col flex-row sm:space-y-2 space-x-2 sm:space-x-0 px-2 sm:px-4 py-2">
                    {categories.map((category, index) => (
                        <li
                            key={index}
                            onClick={handleCategory}
                            className={`
                                flex items-center p-2 rounded-lg  cursor-pointer 
                                hover:bg-neutral-800 active:bg-neutral-700 transition-colors
                                ${selectedCategory === category ? 'bg-gray-700 md:bg-neutral-700 font-semibold' : 'font-semibold'}
                                whitespace-nowrap
                            `}
                        >
                            {categoryIcons[category] || <FaQuestionCircle className="mr-2" />}
                            <span>{category}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SideBar;