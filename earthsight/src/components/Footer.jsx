import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaDiscord, FaTwitter, FaYoutube, FaFacebook } from "react-icons/fa";
import { FootLinks } from "../constants";
import { useAuth } from "../contexts/AuthContext";
import { useAuthModal } from "../contexts/AuthModalContext";

const socialLinks = [
  { href: "https://discord.com", icon: <FaDiscord /> },
  { href: "https://twitter.com", icon: <FaTwitter /> },
  { href: "https://youtube.com", icon: <FaYoutube /> },
  { href: "https://facebook.com", icon: <FaFacebook /> },
];

const Footer = () => {
  const [subscribeResult, setSubscribeResult] = useState("");
  const { user } = useAuth();
  const { open } = useAuthModal();
  const navigate = useNavigate();

  // Protected routes that require authentication
  const protectedRoutes = ['/deforestation', '/real-estate'];

  const handleNavigation = (e, link) => {
    // Check if the route is protected
    if (protectedRoutes.includes(link)) {
      // If user is not logged in, prevent navigation and show auth modal
      if (!user) {
        e.preventDefault();
        open(); // Open authentication modal
        return;
      }
    }
    // If not protected or user is logged in, allow normal navigation
  };

  const handleSubscribe = async (event) => {
    event.preventDefault();
    setSubscribeResult("Subscribing...");
    
    const formData = new FormData(event.target);
    formData.append("access_key", "03403155-f57b-4cc2-8f1e-f3e2dbcb4b0a");
    formData.append("subject", "New Newsletter Subscription");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setSubscribeResult("Subscribed! ✓");
      event.target.reset();
      setTimeout(() => setSubscribeResult(""), 3000);
    } else {
      setSubscribeResult("Error!");
      setTimeout(() => setSubscribeResult(""), 3000);
    }
  };

  return (
    <footer className="w-full text-black pt-10 pb-6">
      {/* Divider */}
      <div className="h-[1px] bg-slate-700 mb-8" />

      <div className="px-14 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-emerald-400">
            About Earth Sight
          </h3>
          <p className="text-sm leading-relaxed">
            We leverage satellite imagery and AI to monitor environmental
            changes, predict real estate trends, and support sustainable
            development across Nepal and beyond.
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:pl-10">
          <h3 className="text-lg font-semibold mb-3 text-emerald-400">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2 text-sm">
            {FootLinks.map((foot, idx) => (
              <li key={idx}>
                <Link
                  to={foot.link}
                  onClick={(e) => handleNavigation(e, foot.link)}
                  className="hover:text-emerald-400 transition-colors duration-300"
                >
                  {foot.name}
                  {protectedRoutes.includes(foot.link) && !user && (
                    <span className="ml-1 text-xs text-emerald-500">🔒</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-emerald-400">
            Contact
          </h3>
          <ul className="text-sm flex flex-col gap-2">
            <li>Email: support@earthsight.com</li>
            <li>Phone: +977-9800000000</li>
            <li>Address: Kathmandu, Nepal</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-emerald-400">
            Stay Updated
          </h3>
          <form onSubmit={handleSubscribe} className="flex">
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              className="px-3 py-2 text-sm rounded-l-md focus:outline-none w-full"
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-r-md transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
          {subscribeResult && (
            <p className={`text-sm mt-2 ${subscribeResult.includes('✓') ? 'text-emerald-400' : subscribeResult.includes('Error') ? 'text-red-400' : 'text-blue-400'}`}>
              {subscribeResult}
            </p>
          )}
          <p className="text-sm mt-3">
            Get our latest insights and updates delivered to your inbox.
          </p>
        </div>
      </div>

      {/* Social Icons */}
      <div className="mt-10 flex justify-center gap-6">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-400 hover:text-emerald-400 transition-colors duration-300"
          >
            {link.icon}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-500 text-sm mt-6 border-t border-slate-700 pt-4">
        © {new Date().getFullYear()} GEE. All rights reserved. | Built with ❤️
        by Team GEE
      </div>
    </footer>
  );
};

export default Footer;