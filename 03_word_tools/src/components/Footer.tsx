import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-300 p-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
        <p className="text-sm md:text-base">
          © {new Date().getFullYear()} Developed by{" "}
          <span className="font-semibold text-white">Umair</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
