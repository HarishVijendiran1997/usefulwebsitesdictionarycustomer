import { useEffect, useState, useCallback } from "react";
import Hero from "./components/Hero";
import NavBar from "./components/NavBar";

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setDebouncedQuery('');
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, 350);

    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-[100dvh] bg-black">
      <NavBar
        searchQuery={searchQuery}
        onSearchChange={handleSearch}  // Changed to handleSearch
        isSearching={isSearching}
      />

      <main className="flex-1 overflow-y-auto">
        <Hero 
          searchQuery={debouncedQuery} 
          isSearching={isSearching}
        />
      </main>
    </div>
  );
}

export default App;