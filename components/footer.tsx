import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="col-span-2 lg:col-span-2">
            <Image src="/trashure-icon.jpeg" alt="Trashure icon" width={24} height={24} className="inline-block align-middle mr-2" />
            <Image src="/trashure-wordmark.png" alt="Trashure logo" width={80} height={20} className="inline-block align-middle" />
            <p className="text-sm max-w-xs">
              The leading global platform for peer-to-peer luxury, streetwear, and vintage fashion and goods.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/menswear" className="hover:text-primary">
                  Menswear
                </Link>
              </li>
              <li>
                <Link href="/womenswear" className="hover:text-primary">
                  Womenswear
                </Link>
              </li>
              <li>
                <Link href="/household" className="hover:text-primary">
                  Households & Dorms
                </Link>
              </li>
              <li>
                <Link href="/designers" className="hover:text-primary">
                  Designers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Press
                </Link>
              </li>
              <li>
                <Link href="/sponsorship" className="hover:text-primary">
                  Sponsorship
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://instagram.com/trashure" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  Instagram
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Trashure. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-primary">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
