"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export function Hero() {
  const scrollToSpaces = () => {
    document.getElementById("spaces")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Premium Roadshow
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Touring Spaces
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Discover exceptional venues for your next roadshow, conference, or touring event. Professional spaces
            designed to make your event unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={scrollToSpaces}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
            >
              Browse Spaces
            </Button>
            {/* <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3"
            >
              Learn More
            </Button> */}
          </div>
          <div className="mt-12">
            <Button variant="ghost" size="sm" onClick={scrollToSpaces} className="text-gray-300 hover:text-white">
              <ArrowDown className="h-5 w-5 animate-bounce" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
