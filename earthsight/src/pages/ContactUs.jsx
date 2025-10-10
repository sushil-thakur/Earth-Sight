import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  return (
    <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-16 px-6 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-800">
            Contact Us
          </h2>
          <p className="text-gray-700 mt-3 max-w-2xl mx-auto">
            Have questions about our satellite imagery analysis or want to
            collaborate? Reach out — we’d love to hear from you.
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <FaMapMarkerAlt className="text-emerald-600 text-2xl" />
              <div>
                <h4 className="font-semibold text-emerald-800">Our Office</h4>
                <p className="text-gray-700">
                  Kathmandu, Nepal
                  <br />
                  Earth Observation & Environmental Lab
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaPhoneAlt className="text-emerald-600 text-2xl" />
              <div>
                <h4 className="font-semibold text-emerald-800">Phone</h4>
                <p className="text-gray-700">+977-9812345678</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaEnvelope className="text-emerald-600 text-2xl" />
              <div>
                <h4 className="font-semibold text-emerald-800">Email</h4>
                <p className="text-gray-700">contact@envsatellite.com</p>
              </div>
            </div>

            <p className="text-gray-600 mt-8">
              Our mission is to empower decision-makers with satellite data for
              sustainable development, land-use planning, and environmental
              conservation.
            </p>
          </div>

          {/* Contact Form */}
          <form className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold">Name</label>
              <input
                type="text"
                placeholder="Your full name"
                className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">
                Message
              </label>
              <textarea
                rows="5"
                placeholder="Tell us how we can help..."
                className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
