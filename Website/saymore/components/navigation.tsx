import { useState, useEffect } from "react";

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "features", "process", "team", "faq", "footer"];
      const scrollPosition = window.scrollY;

      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop - 100 && scrollPosition < offsetTop + offsetHeight - 100) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(sectionId);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="text-gray-700 hover:text-gray-900">
            SayMore
          </a>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className={`hover:text-gray-900 ${
                activeSection === "home" ? "text-blue-600 font-bold" : "text-gray-700"
              }`}
              onClick={e => {
                e.preventDefault();
                handleClick("home");
              }}>
              Home
            </a>
            <a
              href="#features"
              className={`hover:text-gray-900 ${
                activeSection === "features" ? "text-blue-600 font-bold" : "text-gray-700"
              }`}
              onClick={e => {
                e.preventDefault();
                handleClick("features");
              }}>
              Features
            </a>
            <a
              href="#process"
              className={`hover:text-gray-900 ${
                activeSection === "process" ? "text-blue-600 font-bold" : "text-gray-700"
              }`}
              onClick={e => {
                e.preventDefault();
                handleClick("process");
              }}>
              Process
            </a>
            <a
              href="#team"
              className={`hover:text-gray-900 ${
                activeSection === "team" ? "text-blue-600 font-bold" : "text-gray-700"
              }`}
              onClick={e => {
                e.preventDefault();
                handleClick("team");
              }}>
              Team
            </a>
            <a
              href="#faq"
              className={`hover:text-gray-900 ${
                activeSection === "faq" ? "text-blue-600 font-bold" : "text-gray-700"
              }`}
              onClick={e => {
                e.preventDefault();
                handleClick("faq");
              }}>
              FAQ
            </a>
            <a
              href="#footer"
              className={`hover:text-gray-900 ${
                activeSection === "footer" ? "text-blue-600 font-bold" : "text-gray-700"
              }`}
              onClick={e => {
                e.preventDefault();
                handleClick("footer");
              }}>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
