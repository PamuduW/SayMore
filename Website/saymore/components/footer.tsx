import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

export default function Footer() {
  return (
    <footer id="footer" className="bg-blue-50 pt-12 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-left items-center pt-5">
            <Image src={"/saymore_logo.png"} alt={"Logo"} width={1563} height={484} className="w-40 h-14 -ml-7"/>
            <h3 className="text-gray-700">Your one stop shop for all <br/> your communication needs !</h3>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                {" "}
                <a
                  href="#home"
                  className="text-gray-700 hover:text-blue-500"
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
                  className="text-gray-700 hover:text-blue-500"
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
                  className="text-gray-700 hover:text-blue-500"
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
                  className="text-gray-700 hover:text-blue-500"
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
                  className="text-gray-700 hover:text-blue-500"
                  onClick={e => {
                    e.preventDefault();
                    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
                  }}>
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <p className="pb-2">+45 3411-4411</p>
            <a href="mailto:info@saymore.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-500">
              info@saymore.com
            </a>
            <div className="flex space-x-4 pt-2">
              <a
                href="https://www.linkedin.com/in/saymore-official-1b5b3b344/"
                target="_blank"
                rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedinIn} className="w-8 h-8 hover:text-blue-500" />
              </a>
              <a
                href="https://www.instagram.com/say.more_official/"
                target="_blank"
                rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} className="w-8 h-8 hover:text-blue-500" />
              </a>
              <a href="https://github.com/SayMore-Global/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} className="w-8 h-8 hover:text-blue-500" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-6 pt-6 text-center">
          <p>© 2024 SayMore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
