import Hero from "./components/Hero";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="w-full h-screen flex flex-col">
      {/* Reduced height for Navbar */}
      <NavBar className="h-2" /> 

      {/* Hero fills remaining height */}
      <div className="flex-grow">
        <Hero />
      </div>
    </div>
  );
}

export default App;
