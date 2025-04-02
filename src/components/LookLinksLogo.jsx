import { useState, useEffect } from "react";

export default function LookLinksLogo() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsOpen((prev) => !prev);
    }, 10000); // Toggle every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-4xl font-bold flex items-center space-x-2">
      <span>L</span>
      <img
        src={isOpen ? "/open-eye.png" : "/closed-eye.png"}
        alt="eye"
        className="w-8 transition-all duration-500"
      />
      <img
        src={isOpen ? "/open-eye.png" : "/closed-eye.png"}
        alt="eye"
        className="w-8 transition-all duration-500"
      />
      <span>k Links</span>
    </div>
  );
}
