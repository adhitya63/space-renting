import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <img src="/logo.svg" alt="Roadshow Spaces Logo" className="h-10 w-auto" />
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
            <h4 className="font-semibold">Quick Links</h4>
            <div className="space-y-2 text-gray-300">
              <div>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-white transition-colors">
                  Our Spaces
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-white transition-colors">
                  Services
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
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
