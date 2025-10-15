import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <section className="py-4 px-6 lg:px-20 text-emerald-400">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Get in Touch with Us
          </h2>
          <p className="text-white mt-3 max-w-3xl mx-auto leading-relaxed">
            We're passionate about leveraging satellite imagery and geospatial
            analytics to support environmental sustainability. Whether you're a
            researcher, organization, or policymaker — let’s collaborate to make
            data-driven impact on our planet.
          </p>
        </div>

        {/* Grid Content */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Items */}
            <div className="flex items-start space-x-4">
              <FaMapMarkerAlt className="text-emerald-600 text-2xl" />
              <div>
                <h4 className="font-semibold">Our Office</h4>
                <p className="text-white">
                  Kathmandu, Nepal
                  <br />
                  Earth Observation & Environmental Lab
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaPhoneAlt className="text-emerald-600 text-2xl" />
              <div>
                <h4 className="font-semibold">Phone</h4>
                <p className="text-white">+977-9812345678</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <FaEnvelope className="text-emerald-600 text-2xl" />
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-white">contact@envsatellite.com</p>
              </div>
            </div>

            {/* Office Hours */}
            <div>
              <h4 className="font-semibold">Office Hours</h4>
              <p className="text-white">
                Sunday – Friday: 9:00 AM – 6:00 PM <br />
                Saturday: Closed
              </p>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex space-x-5 text-2xl">
                <a href="#" className="hover:text-emerald-800">
                  <FaFacebook />
                </a>
                <a href="#" className="hover:text-emerald-800">
                  <FaTwitter />
                </a>
                <a href="#" className="hover:text-emerald-800">
                  <FaLinkedin />
                </a>
              </div>
            </div>

            {/* Mission */}
            <p className="text-white text-sm mt-6 leading-relaxed">
              🌱 Our mission is to provide accessible, reliable environmental
              insights through satellite data, empowering governments, NGOs, and
              communities to protect ecosystems and plan sustainable futures.
            </p>
          </div>

          {/* Contact Form */}
          <form className="bg-white border border-green-100 shadow-md rounded-2xl p-8 space-y-6">
            <h3 className="text-2xl font-semibold text-emerald-700 mb-4">
              Send Us a Message
            </h3>
            <div>
              <label className="block text-gray-700 font-medium">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Subject</label>
              <input
                type="text"
                placeholder="Subject of your message"
                className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-300 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Message</label>
              <textarea
                rows="5"
                placeholder="Write your message here..."
                className="w-full mt-2 border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-300 outline-none"
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

        {/* Map Embed Placeholder */}
        <div className="mt-16">
          <iframe
            title="Our Office Location"
            className="w-full h-80 rounded-2xl border border-green-100"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.1031034185273!2d85.3240!3d27.7076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb191bce1b4c3f%3A0xaedba3b7864148c9!2sKathmandu%2C%20Nepal!5e0!3m2!1sen!2snp!4v1681136600000!5m2!1sen!2snp"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <Footer />
    </section>
  );
}
