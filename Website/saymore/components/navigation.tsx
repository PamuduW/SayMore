import { Button } from "@/components/ui/button";

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="text-gray-700 hover:text-gray-900">
            SayMore
          </a>
          <div className="flex items-center">
            <span className="text-2xl font-bold">
              <span></span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-gray-700 hover:text-gray-900"
              onClick={e => {
                e.preventDefault();
                document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
              }}>
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Features
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Process
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Team
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              FAQ
            </a>
            <Button className="bg-orange-500 hover:bg-orange-600">Contact Us</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
