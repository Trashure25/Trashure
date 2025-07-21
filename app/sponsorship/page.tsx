import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SponsorshipPage() {
  return (
    <div className="bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">Our Sponsor</h1>
          <p className="text-center text-gray-600 mb-12">
            We are proud to be partnered with brands that share our vision for a sustainable future in fashion.
          </p>

          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="bg-black p-8">
              <div className="flex justify-center">
                <Image
                  src="/sponsors/la-lune-reve.png"
                  alt="LA LUNE RÊVE Logo"
                  width={400}
                  height={100}
                  className="invert"
                />
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <CardTitle className="text-2xl mb-4">LA LUNE RÊVE</CardTitle>
              <p className="text-gray-700 leading-relaxed">
                LA LUNE RÊVE is a visionary fashion house that blends avant-garde design with sustainable practices.
                Their commitment to quality craftsmanship and ethical sourcing makes them a perfect partner for
                Trashure. Together, we are redefining the future of luxury and streetwear, proving that style and
                sustainability can coexist.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
