import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import Button from "./Button";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthModal } from '../contexts/AuthModalContext';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from './FuturisticToast';

const navItems = ["Home", "Deforestation", "Real Estate", "About", "Contact"];

const NavBar = () => {
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  // Refs for audio and navigation container
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);
  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  // modal control for login/register
  const { open } = useAuthModal()
  const { user, logout, isAuthenticated } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation(); // Get current route
  const navigate = useNavigate(); // Add navigation hook

  // Debug logging for auth state
  useEffect(() => {
    console.log('🔍 Navbar Auth State:', { 
      isAuthenticated, 
      user: user ? { name: user.name, email: user.email } : null 
    })
  }, [isAuthenticated, user])

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Manage audio playback
  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    console.log('🔓 Logout confirmed in Navbar');
    setShowLogoutModal(false);
    showToast('👋 Logged out successfully!', 'success', 2500);
    logout(); // AuthContext handles navigation
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
    showToast('❌ Logout cancelled', 'info', 2000);
  };

  useEffect(() => {
    if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo and Product button */}
          <div className="flex items-center gap-7">
            <img 
              src="/img/logo.png" 
              alt="logo" 
              className="w-10 cursor-pointer hover:scale-110 transition-transform" 
              onClick={() => navigate('/')}
            />

            <Button
              id="product-button"
              title="Earth-Sight"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
              onClick={() => navigate('/')}
            />
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item, index) => {
                const protectedPages = ['Deforestation', 'Real Estate']
                const isProtected = protectedPages.includes(item)

                // Determine the route path for each item
                let itemPath = '/';
                if (item === 'Deforestation') itemPath = '/deforestation';
                if (item === 'Real Estate') itemPath = '/real-estate';
                if (item === 'About') itemPath = '/about';
                if (item === 'Contact') itemPath = '/contact';

                // Check if current route matches this nav item
                const isActive = location.pathname === itemPath;
                
                // Debug log
                if (isActive) {
                  console.log(`Active page: ${item}, pathname: ${location.pathname}`);
                }

                const handleClick = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // Check if protected and user is not authenticated
                  if (isProtected) {
                    const token = localStorage.getItem('token')
                    if (!token) {
                      console.log(`🔒 Protected page ${item} - redirecting to login`);
                      open('login')
                      return
                    }
                  }
                  
                  // Navigate based on item
                  console.log(`🧭 Navigating to: ${item}`);
                  if (item === 'Home') {
                    navigate('/');
                  } else if (item === 'Deforestation') {
                    navigate('/deforestation');
                  } else if (item === 'Real Estate') {
                    navigate('/real-estate');
                  } else if (item === 'About') {
                    navigate('/about');
                  } else if (item === 'Contact') {
                    navigate('/contact');
                  }
                }

                // Active link class - bright green text for active page
                const activeStyle = isActive ? { color: '#4ade80', fontWeight: 'bold' } : {};
                const linkClass = "nav-hover-btn";

                // Return unified anchor tag with onClick handler
                return (
                  <a 
                    key={index} 
                    onClick={handleClick} 
                    className={linkClass} 
                    style={{...activeStyle, cursor: 'pointer'}}
                    role="button"
                    tabIndex={0}
                  >
                    {item}
                  </a>
                )
              })}
            </div>

            {/* User Info - Only show when authenticated */}
            {isAuthenticated && (
              <div className="ml-6 flex items-center gap-3">
                {/* User Name */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 nav-user-info">
                  <span className="text-xs font-medium nav-user-text">{user?.name || user?.email}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all text-xs font-medium nav-logout-btn"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Login Button - Show when NOT authenticated */}
            {!isAuthenticated && (
              <button
                onClick={() => open('login')}
                className="ml-6 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-all text-sm font-medium nav-login-btn"
              >
                Login
              </button>
            )}

            <button
              onClick={toggleAudioIndicator}
              className="ml-6 flex items-center space-x-0.5"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-fadeIn" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 border-emerald-300 animate-scaleIn" style={{ overflow: 'visible' }}>
            {/* Close Button */}
            <button
              onClick={cancelLogout}
              className="absolute -top-4 -right-4 z-[10000] w-12 h-12 bg-white hover:bg-red-50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl border-3 border-emerald-400 hover:border-red-500"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
            >
              <svg className="w-6 h-6 text-slate-800 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header Section with Gradient Background */}
            <div className="relative h-32 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center rounded-t-2xl">
              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" 
                     style={{
                       backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
                       backgroundSize: '30px 30px'
                     }}>
                </div>
              </div>
              
              {/* Logo */}
              <div className="relative z-10 flex flex-col items-center">
                <img 
                  src="/img/logo.png" 
                  alt="Earth Sight Logo" 
                  className="h-16 w-16 object-contain drop-shadow-lg"
                />
                <h1 className="text-white font-bold text-xl mt-2 drop-shadow-md">
                  Earth Sight
                </h1>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Title */}
              <h2 className="text-2xl font-bold text-center mb-2 text-slate-800 mt-4">
                Confirm Logout
              </h2>

              {/* Message */}
              <p className="text-slate-600 text-center mb-6">
                Are you sure you want to logout from your account?
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                {/* Cancel Button */}
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border-2 border-slate-300 hover:border-slate-400 transition-all shadow-md"
                >
                  Cancel
                </button>

                {/* Confirm Button */}
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold transition-all shadow-lg hover:shadow-xl"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;