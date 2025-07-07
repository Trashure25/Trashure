import React from "react"
import { FaInstagram, FaFacebook, FaYoutube, FaLinkedin } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-8 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <nav className="flex flex-wrap gap-x-8 gap-y-2 justify-center md:justify-start w-full md:w-auto mb-4 md:mb-0">
          <a href="#" className="font-bold text-black text-sm">ABOUT</a>
          <a href="#" className="font-bold text-black text-sm">YOUR PRIVACY CHOICES</a>
          <a href="#" className="font-bold text-black text-sm">HELP & FAQ</a>
          <a href="#" className="font-bold text-black text-sm">TERMS</a>
          <a href="#" className="font-bold text-black text-sm">PRIVACY</a>
          <a href="#" className="font-bold text-black text-sm">CONTACT</a>
          <a href="#" className="font-bold text-black text-sm">IOS APP</a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="#" aria-label="Instagram"><FaInstagram className="w-5 h-5 text-black" /></a>
          <a href="#" aria-label="Facebook"><FaFacebook className="w-5 h-5 text-black" /></a>
          <a href="#" aria-label="YouTube"><FaYoutube className="w-5 h-5 text-black" /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedin className="w-5 h-5 text-black" /></a>
          <span className="ml-4 text-black text-sm font-semibold">Trashure © 2025</span>
        </div>
      </div>
    </footer>
  )
}
