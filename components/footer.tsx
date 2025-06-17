import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <img src="/logo.svg" alt="Roadshow Spaces Logo" className="h-10 w-auto" />

            <div className="flex gap-4 mt-2">
              <a href="https://www.facebook.com/AsdorSingapore" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-400 transition-colors">
                <FaFacebookF size={22} />
              </a>
              <a href="https://www.facebook.com/AsdorSingapore" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-400 transition-colors">
                <FaInstagram size={22} />
              </a>
              <a href="https://www.facebook.com/AsdorSingapore" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-600 transition-colors">
                <FaLinkedinIn size={22} />
              </a>
            </div>
            <p className="text-gray-300">
              Premium touring venues for exceptional events. Making your roadshow unforgettable.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Head Office</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+65 6844 1110</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>sales@asdor.com.sg</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>03 Ang Mo Kio Street 62 #01-66 Link@AMK Singapore 569139</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2 text-gray-300">
              <div>
                <img src="/footer5.svg" alt="Roadshow Spaces Logo" className="h-15 w-auto" />
              </div>
              <div>
                <img src="/footer2.svg" alt="Roadshow Spaces Logo" className="h-15 w-auto" />

              </div>
              <div>
                <img src="/footer3.svg" alt="Roadshow Spaces Logo" className="h-15 w-auto" />

              </div>
              <div>
                <img src="/footer4.svg" alt="Roadshow Spaces Logo" className="h-15 w-auto" />

              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 Asdor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
