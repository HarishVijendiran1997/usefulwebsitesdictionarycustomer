import React, { useState, Suspense } from 'react'

// Lazy load the CategoryList component
const CategoryList = React.lazy(() => import('./CategoryList'))

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

                {/* Lazy loading CategoryList component */}
                <Suspense fallback={<div className="text-center text-white">Loading Categories...</div>}>
                    <CategoryList 
                        selectedCategory={selectedCategory} 
                        handleCategory={handleCategory} 
                    />
                </Suspense>
            </ul>
        </div>
    )
}

export default SideBar
