import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import NavBar from "./components/NavBar";
function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Reduced height for Navbar */}
      <NavBar searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} />

      {/* Hero fills remaining height */}
      <Hero searchQuery={searchQuery} />
    </div>
  );
}

export default App;
