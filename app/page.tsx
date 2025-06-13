import { Hero } from "@/components/hero"
import { SpacesList } from "@/components/spaces-list"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="min-h-screen">
      <Hero />
      <SpacesList />
      <Footer />
    </div>
  )
}
