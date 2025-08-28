import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Map, 
  BarChart3, 
  User, 
  LogOut, 
  Menu, 
  X,
  Globe,
  Bell,
  Settings
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Map },
    { name: 'Prediction', path: '/prediction', icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-dark-900/80 backdrop-blur-md border-b border-neon-blue/20 fixed top-0 left-0 right-0 z-50 shadow-cyber">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center shadow-neon group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold gradient-text">EarthSlight</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-link px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/30 shadow-neon'
                      : 'text-gray-300 hover:text-neon-blue hover:bg-dark-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* User menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-300 hover:text-neon-blue transition-colors duration-300 group">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-red rounded-full animate-pulse"></div>
              <div className="absolute top-full right-0 mt-2 w-64 bg-dark-800 border border-neon-blue/30 rounded-lg shadow-cyber opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                <div className="p-3">
                  <p className="text-sm text-gray-300">No new notifications</p>
                </div>
              </div>
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-300 hover:text-neon-blue transition-colors duration-300">
              <Settings className="h-5 w-5" />
            </button>

            {/* User profile */}
            <div className="flex items-center space-x-3 p-2 bg-dark-800/50 rounded-lg border border-neon-blue/20">
              <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-gray-300 font-medium">{user?.name}</span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-300 hover:text-neon-red transition-colors duration-300 p-2 rounded-lg hover:bg-red-500/10"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-neon-blue transition-colors duration-300 p-2 rounded-lg hover:bg-dark-800/50"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-dark-800/95 backdrop-blur-md border-t border-neon-blue/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/30'
                      : 'text-gray-300 hover:text-neon-blue hover:bg-dark-700/50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            <div className="border-t border-neon-blue/20 pt-2 mt-2 space-y-1">
              {/* Notifications */}
              <button className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-neon-blue hover:bg-dark-700/50 rounded-lg transition-colors duration-300 w-full">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </button>
              
              {/* Settings */}
              <button className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-neon-blue hover:bg-dark-700/50 rounded-lg transition-colors duration-300 w-full">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              
              {/* User profile */}
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-300">
                <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">{user?.name}</span>
              </div>
              
              {/* Logout */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-neon-red hover:bg-red-500/10 rounded-lg transition-colors duration-300 w-full"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 