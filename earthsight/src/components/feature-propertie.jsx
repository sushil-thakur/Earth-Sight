import { Building2, MapPin, Home } from "lucide-react"

const properties = [
  {
    title: "Luxury Villa in Kathmandu",
    price: "$2,650,000",
    location: "Kathmandu",
    beds: 5,
    baths: 4,
    area: "4500 sq ft",
    image: "/img/villa.jpg",
    tag: "Premium",
  },
  {
    title: "Modern Apartment",
    price: "$900,000",
    location: "Lalitpur",
    beds: 3,
    baths: 2,
    area: "1800 sq ft",
    image: "/img/modern.jpg",
    tag: "Hot Deal",
  },
  {
    title: "Lake View Property",
    price: "$2,100,000",
    location: "Pokhara",
    beds: 4,
    baths: 3,
    area: "3200 sq ft",
    image: "/img/pokhara.webp",
    tag: "Featured",
  },
  {
    title: "Heritage House",
    price: "$1,150,000",
    location: "Bhaktapur",
    beds: 4,
    baths: 3,
    area: "2800 sq ft",
    image: "/img/herutage.jpeg",
    tag: "Exclusive",
  },
  {
    title: "Penthouse Suite",
    price: "$3,200,000",
    location: "Kathmandu",
    beds: 4,
    baths: 4,
    area: "3800 sq ft",
    image: "/img/homesuit.webp",
    tag: "Premium",
  },
  {
    title: "Garden Villa",
    price: "$1,600,000",
    location: "Chitwan",
    beds: 3,
    baths: 3,
    area: "3000 sq ft",
    image: "/img/chitwan.jpg",
    tag: "New",
  },
  {
    title: "City Center Flat",
    price: "$725,000",
    location: "Biratnagar",
    beds: 2,
    baths: 2,
    area: "1200 sq ft",
    image: "/img/citycenter.jpeg",
    tag: "Hot Deal",
  },
  {
    title: "Hill Station Retreat",
    price: "$1,375,000",
    location: "Dharan",
    beds: 3,
    baths: 2,
    area: "2500 sq ft",
    image: "/img/hill.webp",
    tag: "Featured",
  },
]

export function FeaturedProperties() {
  return (
    <div className="relative group">
      <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative backdrop-blur-xl bg-white/95 rounded-3xl p-8 shadow-xl border border-emerald-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Featured Properties
          </h3>
        </div>

        {/* Auto-scrolling gallery container */}
        <div className="relative h-[650px] overflow-hidden rounded-2xl bg-emerald-50/30 border border-emerald-200">
          {/* Gradient overlays for fade effect */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling content */}
          <div className="animate-auto-scroll space-y-4 p-4">
            {[...properties, ...properties.slice(0, 4)].map((property, idx) => (
              <div
                key={idx}
                className="relative group/property bg-white rounded-2xl overflow-hidden border border-emerald-200 hover:border-emerald-400 transition-all cursor-pointer hover:scale-[1.02] shadow-lg hover:shadow-emerald-500/20"
              >
                <div className="flex gap-4 p-4 min-h-[180px]">
                  {/* Property Image */}
                  <div className="relative w-36 h-36 flex-shrink-0 rounded-xl overflow-hidden">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover/property:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg">
                      {property.tag}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    <h4 className="text-base font-bold text-slate-900 mb-1 truncate">{property.title}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span className="text-xs text-slate-600 truncate">{property.location}</span>
                    </div>
                    <div className="text-xl font-bold text-emerald-600 mb-3">{property.price}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 mt-auto">
                      <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-emerald-50">
                        <Home className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold">{property.beds}</span>
                        <span className="text-[10px]">Beds</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-emerald-50">
                        <Building2 className="w-4 h-4 text-teal-600" />
                        <span className="font-semibold">{property.baths}</span>
                        <span className="text-[10px]">Baths</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-emerald-50">
                        <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
                          <path d="M3 9h18M9 21V9" strokeWidth="2"/>
                        </svg>
                        <span className="font-semibold">{property.area.replace(' sq ft', '')}</span>
                        <span className="text-[10px]">sq ft</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover/property:from-emerald-500/5 group-hover/property:to-teal-500/5 transition-all pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center mt-4 font-medium">Hover to pause • Auto-scrolling gallery</p>
      </div>
    </div>
  )
}