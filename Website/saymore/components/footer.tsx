import { Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
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
              <li>Home</li>
              <li>Features</li>
              <li>Process</li>
              <li>Team</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Other</h4>
            <ul className="space-y-2">
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
              <li>Support</li>
              <li>FAQ</li>
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
