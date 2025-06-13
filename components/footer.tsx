import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Roadshow Spaces</h3>
            <p className="text-gray-300">
              Premium touring venues for exceptional events. Making your roadshow unforgettable.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@roadshowspaces.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>123 Business Ave, City</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Business Hours</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <div>
                  <div>Mon - Fri: 9AM - 6PM</div>
                  <div>Sat: 10AM - 4PM</div>
                  <div>Sun: Closed</div>
                </div>
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
          <p>&copy; 2024 Roadshow Spaces. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
