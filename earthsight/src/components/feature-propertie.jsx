import { Building2, MapPin, Home } from "lucide-react"

const properties = [
  {
    title: "Luxury Villa in Kathmandu",
    price: "$2,650,000",
    location: "Kathmandu",
    beds: 5,
    baths: 4,
    area: "4500 sq ft",
    image: "/villa.jpg",
    tag: "Premium",
  },
  {
    title: "Modern Apartment",
    price: "$900,000",
    location: "Lalitpur",
    beds: 3,
    baths: 2,
    area: "1800 sq ft",
    image: "/modern.jpg",
    tag: "Hot Deal",
  },
  {
    title: "Lake View Property",
    price: "$2,100,000",
    location: "Pokhara",
    beds: 4,
    baths: 3,
    area: "3200 sq ft",
    image: "/pokhara.webp",
    tag: "Featured",
  },
  {
    title: "Heritage House",
    price: "$1,150,000",
    location: "Bhaktapur",
    beds: 4,
    baths: 3,
    area: "2800 sq ft",
    image: "/herutage.jpeg",
    tag: "Exclusive",
  },
  {
    title: "Penthouse Suite",
    price: "$3,200,000",
    location: "Kathmandu",
    beds: 4,
    baths: 4,
    area: "3800 sq ft",
    image: "/homesuit.webp",
    tag: "Premium",
  },
  {
    title: "Garden Villa",
    price: "$1,600,000",
    location: "Chitwan",
    beds: 3,
    baths: 3,
    area: "3000 sq ft",
    image: "/villa.jpg",
    tag: "New",
  },
  {
    title: "City Center Flat",
    price: "$725,000",
    location: "Biratnagar",
    beds: 2,
    baths: 2,
    area: "1200 sq ft",
    image: "/citycenter.jpeg",
    tag: "Hot Deal",
  },
  {
    title: "Hill Station Retreat",
    price: "$1,375,000",
    location: "Dharan",
    beds: 3,
    baths: 2,
    area: "2500 sq ft",
    image: "/hill.webp",
    tag: "Featured",
  },
]

export function FeaturedProperties() {
  return (
    <div className="relative group">
      <div className="absolute -inset-[1px] rounded-3xl animate-rgb-border opacity-75 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative backdrop-blur-2xl bg-slate-900/90 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-violet-500/20">
            <Building2 className="w-6 h-6 text-violet-400" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            Featured Properties
          </h3>
        </div>

        {/* Auto-scrolling gallery container */}
        <div className="relative h-[600px] overflow-hidden rounded-2xl bg-slate-800/30 border border-slate-700/30">
          {/* Gradient overlays for fade effect */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-900/90 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/90 to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling content */}
          <div className="animate-auto-scroll space-y-4 p-4">
            {[...properties, ...properties.slice(0, 4)].map((property, idx) => (
              <div
                key={idx}
                className="relative group/property backdrop-blur-xl bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/30 hover:border-violet-500/50 transition-all cursor-pointer hover:scale-[1.02] shadow-lg hover:shadow-violet-500/20"
              >
                <div className="flex gap-4 p-4">
                  {/* Property Image */}
                  <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover/property:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-xs font-bold shadow-lg">
                      {property.tag}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-white mb-1 truncate">{property.title}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-3 h-3 text-violet-400" />
                      <span className="text-xs text-slate-400">{property.location}</span>
                    </div>
                    <div className="text-lg font-bold text-violet-400 mb-2">{property.price}</div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Home className="w-3 h-3" />
                        <span>{property.beds} Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>•</span>
                        <span>{property.baths} Baths</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>•</span>
                        <span>{property.area}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 to-pink-500/0 group-hover/property:from-violet-500/10 group-hover/property:to-pink-500/10 transition-all pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center mt-4 font-medium">Hover to pause • Auto-scrolling gallery</p>
      </div>
    </div>
  )
}