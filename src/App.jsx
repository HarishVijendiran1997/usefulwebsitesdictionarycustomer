import Hero from "./components/Hero";
import NavBar from "./components/NavBar";

function App() {
  return (
    <>
      {/* Reduced height for Navbar */}
      <NavBar />

      {/* Hero fills remaining height */}
      <Hero />
    </>
  );
}

export default App;
