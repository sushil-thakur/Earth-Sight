import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import Button from "./Button";
import { Link } from "react-router-dom";
import { useAuthModal } from "../contexts/AuthModalContext";
import { NavData } from "../constants";
import { IoClose, IoMenu } from "react-icons/io5";

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
  const [isOpen, setIsOpen] = useState(false);
  // modal control for login/register
  const { open } = useAuthModal();

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
      className="fixed inset-x-0 top-0 z-20 h-16 border-none transition-all duration-700 bg-black/50"
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
              {NavData.map(({ name, link, protected: isProtected }, index) => (
                <Link
                  key={index}
                  to={link}
                  onClick={(e) => {
                    if (isProtected) {
                      const token = localStorage.getItem("token");
                      if (!token) {
                        e.preventDefault();
                        open("login");
                      }
                    }
                  }}
                  className="nav-hover-btn"
                >
                  {name}
                </Link>
              ))}
            </div>
            <div className="md:hidden block">
              <IoMenu
                size={20}
                className="text-white"
                onClick={() => setIsOpen(true)}
              />
            </div>

            <button
              onClick={toggleAudioIndicator}
              className="pl-6 flex items-center space-x-0.5"
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
        {isOpen && (
          <div className="bg-white/80 absolute top-16 w-full p-4">
            <IoClose
              size={20}
              className="text-black absolute top-2 right-4"
              onClick={() => {
                setIsOpen(false);
              }}
            />
            <div className="flex flex-col py-4 items-center space-y-3">
              {NavData.map(({ name, link, protected: isProtected }, index) => (
                <Link
                  key={index}
                  to={link}
                  onClick={(e) => {
                    if (isProtected) {
                      const token = localStorage.getItem("token");
                      if (!token) {
                        e.preventDefault();
                        open("login");
                      }
                    }
                  }}
                  className="text-base"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default NavBar;
