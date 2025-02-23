import { Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer
        id ="footer"
        className="bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">SayMore</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/in/saymore-official-1b5b3b344/"
                target="_blank"
                rel="noopener noreferrer">
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/say.more_official/"
                target="_blank"
                rel="noopener noreferrer">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                {" "}
                <a
                  href="#home"
                  className="text-gray-700 hover:text-gray-900"
                  onClick={e => {
                    e.preventDefault();
                    document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
                  }}>
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-700 hover:text-gray-900"
                  onClick={e => {
                    e.preventDefault();
                    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
                  }}>
                  Features
                </a>
              </li>
              <li>
                {" "}
                <a
                  href="#process"
                  className="text-gray-700 hover:text-gray-900"
                  onClick={e => {
                    e.preventDefault();
                    document.getElementById("process")?.scrollIntoView({ behavior: "smooth" });
                  }}>
                  Process
                </a>
              </li>
              <li>
                {" "}
                <a
                  href="#team"
                  className="text-gray-700 hover:text-gray-900"
                  onClick={e => {
                    e.preventDefault();
                    document.getElementById("team")?.scrollIntoView({ behavior: "smooth" });
                  }}>
                  Team
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Other</h4>
            <ul className="space-y-2">
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Support</li>
              <li>
                {" "}
                <a
                  href="#faq"
                  className="text-gray-700 hover:text-gray-900"
                  onClick={e => {
                    e.preventDefault();
                    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
                  }}>
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p>925 Filbert Street</p>
            <p>Pennsylvania 18072</p>
            <p>+45 3411-4411</p>
            <p>info@saymore.com</p>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p>© 2024 SayMore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
