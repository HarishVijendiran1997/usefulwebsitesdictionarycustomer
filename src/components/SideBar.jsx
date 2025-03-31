import React, { useEffect } from 'react';
import { useWebsites } from '../contexts/WebsitesContext';
import {
    FaRobot,          // AI & Robots
    FaBriefcase,      // Business
    FaMotorcycle,     // Cars & Bikes
    FaTshirt,         // Clothes & Fashion
    FaCode,           // Coding
    FaBitcoin,        // Crypto & Investing
    FaPalette,        // Design & Art
    FaGraduationCap,  // Education
    FaFilm,           // Entertainment
    FaDumbbell,       // Exercise & Fitness
    FaUtensils,       // Food & Cooking
    FaHeartbeat,      // Health
    FaHome,           // Houses & Property
    FaShieldAlt,      // Internet Safety
    FaSmile,          // Lifestyle
    FaBullhorn,       // Marketing
    FaMoneyBillWave,  // Money
    FaBrain,          // Motivation & Mindset
    FaTv,             // Movies & TV Shows
    FaMusic,          // Music
    FaNewspaper,      // News
    FaShoppingBag,    // Online Shopping
    FaCamera,         // Photography
    FaFlask,          // Science
    FaUserAstronaut,  // Self-Improvement
    FaHashtag,        // Social Media
    FaFootballBall,   // Sports
    FaMicrochip,      // Technology
    FaPlane,          // Travel
    FaGamepad,        // Video Games
    FaTasks           // Work & Productivity
} from 'react-icons/fa';
import { FaQuestionCircle } from 'react-icons/fa';
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
    const categories = ['All', ...new Set(websites.map(website => website.category))]; // Add "All" to the categories

    const handleCategory = (e) => {
        const category = e.target.innerText;
        setSelectedCategory(category);
        onCategorySelect(category);
    };

    // useEffect to log the selectedCategory after it has been updated
    useEffect(() => {
    }, [selectedCategory]);

    return (
        <div
            className="text-white sm:w-64 w-full bg-black sm:max-h-auto max-h-auto cursor-auto 
  overflow-x-auto sm:overflow-x-hidden relative shadow-xl shadow-black"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}
        >
            <ul className="flex sm:flex-col sm:justify-center sm:items-start p-1 md:p-2 font-semibold">
                <h1 className="mb-4 sm:block hidden">Categories</h1>
                <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black opacity-90 sm:hidden"></div>
                <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-black opacity-90 sm:hidden"></div>
                {/* Directly inserting CategoryList code here */}
                <ul className="flex sm:flex-col space-x-4 sm:space-x-0 sm:space-y-2 overflow-x-auto whitespace-nowrap w-full">
                    {categories.map((category, index) => (
                        <li
                            key={index}
                            onClick={handleCategory}
                            className={`hover:bg-neutral-800 active:bg-neutral-900 transition-transform hover:scale-105 mx-2 flex items-center p-2 rounded-sm font-extralight cursor-pointer
                                ${selectedCategory === category ? 'bg-neutral-700' : ''}`}
                        >
                            {categoryIcons[category] || <FaQuestionCircle className="mr-2" />}
                            <span>{category}</span>
                        </li>
                    ))}
                </ul>
            </ul>
        </div>
    );
};

export default SideBar;
