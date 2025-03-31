import React from 'react'
import { categories } from '../utils/Categories'

const CategoryList = ({ selectedCategory, handleCategory }) => {
    return (
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
    )
}

export default CategoryList
