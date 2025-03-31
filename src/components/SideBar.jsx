import React, { useState } from 'react'
import { categories } from '../utils/Categories'

const SideBar = () => {
    const [selectedCategory, setSelectedCategory] = useState('')

    const handleCategory = (e) => {
        setSelectedCategory(e.target.innerText)
    }

    return (
        <div 
            className="text-white sm:w-64 w-full bg-black sm:max-h-auto max-h-auto cursor-auto overflow-x-hidden" 
            style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}
        >
            <ul className="flex sm:flex-col sm:justify-center sm:items-start p-2 font-semibold">
                <h1 className="mb-4 sm:block hidden">Categories</h1>

                <ul className="flex sm:flex-col space-x-4 sm:space-x-0 sm:space-y-2 overflow-x-auto whitespace-nowrap w-full">
                    {categories.map((category, index) => (
                        <li
                            key={index}
                            onClick={handleCategory}
                            className={`hover:bg-neutral-800 active:bg-neutral-900 p-2 rounded-sm font-extralight cursor-pointer
                                        ${selectedCategory === category ? 'bg-neutral-700' : ''}`}
                        >
                            {category}
                        </li>
                    ))}
                </ul>
            </ul>
        </div>
    )
}

export default SideBar
