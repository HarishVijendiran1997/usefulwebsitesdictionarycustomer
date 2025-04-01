import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import NavBar from "./components/NavBar";

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);



  return (
    <div className="flex bg-black flex-col min-h-screen">
      <NavBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex-1 overflow-y-auto">
        <Hero searchQuery={debouncedQuery} />
      </div>
    </div>
  );
}

export default App;