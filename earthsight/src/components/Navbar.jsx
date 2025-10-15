import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import Button from "./Button";
import { Link, useNavigate } from 'react-router-dom';
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
    setShowLogoutModal(false);
    logout();
    showToast('👋 Logged out successfully!', 'success', 2500);
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
            <img src="/img/logo.png" alt="logo" className="w-10" />

            <Button
              id="product-button"
              title="Earth-Sight"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            />
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item, index) => {
                const protectedPages = ['Deforestation', 'Real Estate']
                const isProtected = protectedPages.includes(item)

                const handleClick = (e) => {
                  if (isProtected) {
                    const token = localStorage.getItem('token')
                    if (!token) {
                      e.preventDefault()
                      open('login')
                      return
                    }
                  }
                }

                if (item === 'Deforestation') {
                  return <Link key={index} to="/deforestation" onClick={handleClick} className="nav-hover-btn">{item}</Link>
                }

                if (item === 'Home') {
                  return <Link key={index} to="/" className="nav-hover-btn">{item}</Link>
                }

                if (item === 'Real Estate') {
                  return <Link key={index} to="/real-estate" onClick={handleClick} className="nav-hover-btn">{item}</Link>
                }

                return (
                  <a key={index} href={`#${item.toLowerCase()}`} className="nav-hover-btn">{item}</a>
                )
              })}
            </div>

            {/* User Info - Only show when authenticated */}
            {isAuthenticated && (
              <div className="ml-6 flex items-center gap-3">
                {/* User Name */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30">
                  <span className="text-xs text-indigo-400 font-medium">{user?.name || user?.email}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all text-xs text-red-400 font-medium"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Login Button - Show when NOT authenticated */}
            {!isAuthenticated && (
              <button
                onClick={() => open('login')}
                className="ml-6 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-all text-sm text-blue-400 font-medium"
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

      {/* Futuristic Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-violet-500/30 animate-scaleIn overflow-hidden">
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-600 opacity-50 blur-xl animate-pulse" />
            
            {/* Content */}
            <div className="relative p-8">
              {/* Icon with animation */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/50 animate-bounce">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  {/* Pulsing rings */}
                  <div className="absolute inset-0 rounded-full border-4 border-violet-500/30 animate-ping" />
                  <div className="absolute inset-0 rounded-full border-2 border-fuchsia-500/20 animate-pulse" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent animate-shimmer">
                Confirm Logout
              </h2>

              {/* Message */}
              <p className="text-slate-300 text-center mb-8 text-lg">
                Are you sure you want to logout?
              </p>

              {/* Buttons */}
              <div className="flex gap-4">
                {/* Cancel Button */}
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-6 py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-600/50 hover:border-slate-500 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-slate-500/30 active:scale-95"
                >
                  Cancel
                </button>

                {/* Confirm Button */}
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-500/50 hover:shadow-violet-500/70 transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
                >
                  <span className="relative z-10">OK</span>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </button>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-violet-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl" />
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;