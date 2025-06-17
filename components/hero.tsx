"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export function Hero() {
  const scrollToSpaces = () => {
    document.getElementById("spaces")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      className="relative text-white min-h-screen flex items-center"
      style={{
        backgroundImage: "url('/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-3xl md:text-8xl font-bold mb-6 leading-none"
            style={{
              textShadow: "0 0 8px #00cfff88, 0 0 16px #00cfff55",
            }}
          >
            Premium <br /> Roadshows
          </p>
          <span className="text-xl md:text-6xl block text-white font-normal pb-2">
            Touring Spaces
          </span>
          <p className="text-xl md:text-2xl my-8 text-gray-300 max-w-2xl mx-auto">
            Discover exceptional venues for your next roadshow, conference, or touring event. Professional spaces
            designed to make your event unforgettable.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={scrollToSpaces}
              className="bg-[#005687] hover:bg-[#00405a] text-white px-8 py-3"
            >
              Browse Spaces
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3"
            >
              Learn More
            </Button>
          </div> */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={scrollToSpaces}
              className="bg-transparent border-none p-0 hover:opacity-80 transition"
              aria-label="Scroll Down"
              type="button"
            >
              <img
                src="/button.svg"
                alt="Scroll Down"
                className="h-15 w-15 animate-bounce"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
