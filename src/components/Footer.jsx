import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white shadow px-6 py-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-gray-700">
        
        <p className="text-sm text-center md:text-left mb-2 md:mb-0">
          © 2025 <span className="font-semibold text-indigo-700">GradProjects</span>. All rights reserved.
        </p>

        <div className="flex flex-col items-center justify-center md:items-end">
          <span className="text-sm text-gray-500 mb-1">Follow us on social media</span>
          <div className="flex space-x-4 text-indigo-700">
            <FaFacebookF className="w-5 h-5 hover:text-indigo-900 cursor-pointer transition duration-200" />
            <FaTwitter className="w-5 h-5 hover:text-indigo-900 cursor-pointer transition duration-200" />
            <FaInstagram className="w-5 h-5 hover:text-indigo-900 cursor-pointer transition duration-200" />
            <FaLinkedinIn className="w-5 h-5 hover:text-indigo-900 cursor-pointer transition duration-200" />
          </div>
        </div>
      </div>
    </footer>
  );
}
