import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CesiumMap from '../components/CesiumMap';
import { showToast } from '../components/FuturisticToast';

// Lucide Icons as SVG components
const Wallet = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
);

const TrendingUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const CreditCard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2"/>
    <line x1="2" x2="22" y1="10" y2="10"/>
  </svg>
);

const DollarSign = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" x2="12" y1="2" y2="22"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const Home = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ArrowLeftRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3 4 7l4 4"/>
    <path d="M4 7h16"/>
    <path d="m16 21 4-4-4-4"/>
    <path d="M20 17H4"/>
  </svg>
);

const BarChart3 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/>
    <path d="M18 17V9"/>
    <path d="M13 17V5"/>
    <path d="M8 17v-3"/>
  </svg>
);

const PiggyBank = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z"/>
    <path d="M2 9v1c0 1.1.9 2 2 2h1"/>
    <path d="M16 11h0"/>
  </svg>
);

const FileText = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" x2="8" y1="13" y2="13"/>
    <line x1="16" x2="8" y1="17" y2="17"/>
    <line x1="10" x2="8" y1="9" y2="9"/>
  </svg>
);

const Newspaper = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
    <path d="M18 14h-8"/>
    <path d="M15 18h-5"/>
    <path d="M10 6h8v4h-8V6Z"/>
  </svg>
);

const Search = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const Bell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);

const Briefcase = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const LogOut = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
);

const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
);

const Settings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const Trash = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
    <line x1="10" x2="10" y1="11" y2="17"/>
    <line x1="14" x2="14" y1="11" y2="17"/>
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <style>{`
        @keyframes orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }
        @keyframes orb-pulse {
          0%, 100% { opacity: 0.6; filter: blur(40px); }
          50% { opacity: 0.8; filter: blur(60px); }
        }
        .orb-1 {
          animation: orb-float 25s ease-in-out infinite, orb-pulse 8s ease-in-out infinite;
        }
        .orb-2 {
          animation: orb-float 30s ease-in-out infinite reverse, orb-pulse 10s ease-in-out infinite;
          animation-delay: 2s;
        }
        .orb-3 {
          animation: orb-float 20s ease-in-out infinite, orb-pulse 12s ease-in-out infinite;
          animation-delay: 4s;
        }
        .orb-4 {
          animation: orb-float 28s ease-in-out infinite reverse, orb-pulse 9s ease-in-out infinite;
          animation-delay: 1s;
        }
        .orb-5 {
          animation: orb-float 22s ease-in-out infinite, orb-pulse 11s ease-in-out infinite;
          animation-delay: 3s;
        }
      `}</style>
      
      <div 
        className="orb-1 absolute top-[10%] left-[15%] w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)'
        }}
      />
      <div 
        className="orb-2 absolute top-[60%] right-[10%] w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%)'
        }}
      />
      <div 
        className="orb-3 absolute bottom-[20%] left-[50%] w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)'
        }}
      />
      <div 
        className="orb-4 absolute top-[30%] right-[40%] w-72 h-72 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)'
        }}
      />
      <div 
        className="orb-5 absolute bottom-[40%] right-[30%] w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.3) 0%, transparent 70%)'
        }}
      />
    </div>
  );
}

// EnvironmentMap was moved to src/components/EnvironmentMap.jsx and is imported above

export default function Dashboard() {
  const { logout, user } = useAuth();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [newsCount, setNewsCount] = useState(4);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // Filter state: 'all', 'deforestation', 'marine', 'fire', 'mining'
  
  // Get user initials from user name
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    const names = user.name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  };
  
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

  // All environmental monitoring points
  const allEnvironmentalPoints = [
    { id: 1, lat: -3.4653, lng: -62.2159, title: 'Amazon Deforestation', description: 'Critical deforestation activity detected', color: '#ef4444', type: 'deforestation' },
    { id: 2, lat: 0.0, lng: -160.0, title: 'Pacific Marine Life', description: 'Marine ecosystem monitoring active', color: '#3b82f6', type: 'marine' },
    { id: 3, lat: 36.7783, lng: -119.4179, title: 'California Forest Fire', description: 'Active wildfire zone detected', color: '#f97316', type: 'fire' },
    { id: 4, lat: -0.2280, lng: 15.8277, title: 'Congo Mining', description: 'Mining operations ongoing', color: '#eab308', type: 'mining' },
    { id: 5, lat: -18.2871, lng: 147.6992, title: 'Great Barrier Reef', description: 'Coral reef restoration project', color: '#06b6d4', type: 'marine' },
    { id: 6, lat: 64.6863, lng: 97.7453, title: 'Siberian Wildfires', description: 'Forest fire monitoring active', color: '#dc2626', type: 'fire' },
    { id: 7, lat: -10.0, lng: -55.0, title: 'Brazilian Rainforest', description: 'Deforestation alert zone', color: '#ef4444', type: 'deforestation' },
    { id: 8, lat: 5.0, lng: 120.0, title: 'Borneo Mining Site', description: 'Large-scale mining detected', color: '#eab308', type: 'mining' },
  ];

  // Filter points based on active filter
  const filteredPoints = activeFilter === 'all' 
    ? allEnvironmentalPoints 
    : allEnvironmentalPoints.filter(point => point.type === activeFilter);
  
  const stats = [
    { id: "total", icon: Wallet, label: "Total Amount", value: "$187,001" },
    { id: "deposit", icon: TrendingUp, label: "Amount Deposit", value: "$21,345" },
    { id: "spent", icon: CreditCard, label: "Amount Spent", value: "$7,321" },
    { id: "expected", icon: DollarSign, label: "Expected Amount", value: "$81,987" }
  ];
  
  const allNews = [
    { id: 1, title: "Amazon Rainforest Deforestation Reaches Record Low", description: "New conservation efforts show promising results.", date: "2 hours ago", category: "Conservation", image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop" },
    { id: 2, title: "Ocean Cleanup Project Removes 100 Tons of Plastic", description: "Revolutionary technology clears Pacific Ocean.", date: "5 hours ago", category: "Marine", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop" },
    { id: 3, title: "Wildfire Prevention AI System Deployed", description: "AI-powered early warning system prevents fires.", date: "1 day ago", category: "Technology", image: "https://images.unsplash.com/photo-1592422746858-450d8e3c9e8e?w=400&h=300&fit=crop" },
    { id: 4, title: "Sustainable Mining Practices Adopted Globally", description: "Mining companies commit to zero-emission by 2030.", date: "1 day ago", category: "Industry", image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&h=300&fit=crop" },
    { id: 5, title: "Coral Reef Restoration Shows 80% Success Rate", description: "Breakthrough in coral regeneration techniques.", date: "2 days ago", category: "Marine", image: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400&h=300&fit=crop" },
    { id: 6, title: "Reforestation Initiative Plants 1 Million Trees", description: "Community project exceeds restoration goals.", date: "3 days ago", category: "Conservation", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop" },
    { id: 7, title: "Wildlife Population Increases in Protected Areas", description: "Endangered species numbers grow significantly.", date: "3 days ago", category: "Wildlife", image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop" },
    { id: 8, title: "Green Energy Powers Remote Mining Operations", description: "Solar and wind reduce carbon footprint.", date: "4 days ago", category: "Energy", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop" }
  ];
  
  const navItems = [
    { icon: Home, label: "Show All", filter: "all" },
    { icon: ArrowLeftRight, label: "Deforestation", filter: "deforestation" },
    { icon: BarChart3, label: "Marine Life", filter: "marine" },
    { icon: PiggyBank, label: "Forest Fire", filter: "fire" },
    { icon: FileText, label: "Mining", filter: "mining" },
  ];
  
  return (
    <>
      <style>{`
        @keyframes aurora {
          0%, 100% {
            background-position: 0% 50%;
            background-size: 200% 200%;
          }
          50% {
            background-position: 100% 50%;
            background-size: 250% 250%;
          }
        }
        @keyframes rgb-border {
          0% { border-color: rgb(59, 130, 246); }
          33% { border-color: rgb(139, 92, 246); }
          66% { border-color: rgb(236, 72, 153); }
          100% { border-color: rgb(59, 130, 246); }
        }
        @keyframes rgb-text {
          0% { color: rgb(59, 130, 246); }
          33% { color: rgb(139, 92, 246); }
          66% { color: rgb(236, 72, 153); }
          100% { color: rgb(59, 130, 246); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        body {
          background: #0a0a0f;
          position: relative;
          overflow-x: hidden;
        }
        
        body::before {
          content: '';
          position: fixed;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: 
            radial-gradient(ellipse at 20% 30%, rgba(59, 130, 246, 0.25) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.25) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 40%),
            radial-gradient(ellipse at 90% 70%, rgba(16, 185, 129, 0.2) 0%, transparent 40%),
            radial-gradient(ellipse at 10% 90%, rgba(251, 146, 60, 0.2) 0%, transparent 40%);
          animation: aurora 20s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }
        
        body::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            repeating-linear-gradient(0deg, rgba(59, 130, 246, 0.02) 0px, transparent 2px, transparent 4px, rgba(59, 130, 246, 0.02) 6px),
            repeating-linear-gradient(90deg, rgba(139, 92, 246, 0.02) 0px, transparent 2px, transparent 4px, rgba(139, 92, 246, 0.02) 6px);
          pointer-events: none;
          z-index: 0;
        }
        
        .rgb-border-animate { animation: rgb-border 3s linear infinite; }
        .rgb-text-animate { animation: rgb-text 3s linear infinite; }
        .float-animate { animation: float 3s ease-in-out infinite; }
        .shimmer-bg {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        .rgb-gradient-bg {
          background: linear-gradient(45deg, 
            rgba(59, 130, 246, 0.05) 0%, 
            rgba(139, 92, 246, 0.05) 33%, 
            rgba(236, 72, 153, 0.05) 66%, 
            rgba(59, 130, 246, 0.05) 100%);
          background-size: 300% 300%;
          animation: gradient-shift 5s ease infinite;
        }
        .icon-spin-hover:hover svg { animation: spin 1s linear infinite; }
        .card-click-effect:active {
          transform: scale(0.95) !important;
          transition: transform 0.1s ease;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
      
      <div className="flex min-h-screen text-white relative overflow-hidden">
        <FloatingOrbs />
        
        <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} border-r-2 rgb-border-animate bg-slate-900/30 backdrop-blur-xl p-6 flex flex-col transition-all duration-300 z-10 fixed left-0 top-0 h-screen`}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-8 z-20 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300"
          >
            {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
          
          <div className="mb-12">
            {/* //earthsigh */}
            {!sidebarCollapsed && (
              <h1 className="text-2xl font-bold rgb-text-animate"></h1>
            )}
            {sidebarCollapsed && (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">YL</span>
              </div>
            )}
          </div>
          
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveFilter(item.filter)}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl transition-all duration-300 group icon-spin-hover card-click-effect ${
                  activeFilter === item.filter
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-blue-500/10'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <item.icon />
                {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>
          
          <div className="pt-6 border-t border-slate-800/50">
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group card-click-effect`}
            >
              <LogOut />
              {!sidebarCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </aside>
        
        <main className={`flex-1 overflow-y-auto relative z-10 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
          <header className="sticky top-0 z-10 border-b-2 rgb-border-animate bg-slate-950/80 backdrop-blur-xl">
            <div className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-3xl font-bold text-white rgb-text-animate">Dashboard</h2>
                <p className="text-sm text-slate-400 mt-1">
                  {activeFilter === 'all' ? 'Showing all environmental data' : 
                   activeFilter === 'deforestation' ? 'Filtering: Deforestation zones' :
                   activeFilter === 'marine' ? 'Filtering: Marine ecosystems' :
                   activeFilter === 'fire' ? 'Filtering: Forest fires' :
                   activeFilter === 'mining' ? 'Filtering: Mining operations' : 'Your Personal Dashboard'}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* User Avatar with Dropdown */}
                <div className="relative">
                  <div 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-10 h-10 rounded-full border-2 rgb-border-animate hover:border-blue-500 transition-colors cursor-pointer overflow-hidden bg-blue-500/10 flex items-center justify-center card-click-effect"
                  >
                    <span className="text-sm font-semibold text-blue-500">{getUserInitials()}</span>
                  </div>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      {/* Backdrop to close menu */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      
                      {/* Menu */}
                      <div className="absolute right-0 mt-2 w-56 bg-slate-900 border-2 rgb-border-animate rounded-xl shadow-2xl shadow-blue-500/20 overflow-hidden z-50 animate-fadeIn">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-slate-800">
                          <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
                          <p className="text-xs text-slate-400 truncate">{user?.email || 'user@example.com'}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              showToast('⚙️ Settings coming soon!', 'info', 2000);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3"
                          >
                            <Settings />
                            <span>Settings</span>
                          </button>

                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              // Show confirmation for account deletion
                              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                showToast('🗑️ Account deletion feature coming soon!', 'warning', 3000);
                              }
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-3"
                          >
                            <Trash />
                            <span>Delete Account</span>
                          </button>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-slate-800 py-2">
                          <button
                            onClick={() => {
                              setShowUserMenu(false);
                              handleLogout();
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3"
                          >
                            <LogOut />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <div
                      key={stat.id}
                      className="relative overflow-hidden rounded-xl border-2 rgb-border-animate bg-slate-900/50 backdrop-blur-sm transition-all duration-500 cursor-pointer group hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1 card-click-effect float-animate rgb-gradient-bg"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onMouseEnter={() => setHoveredCard(stat.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="p-6 relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-blue-500/10 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                            <stat.icon />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-400">{stat.label}</p>
                          <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  ))}
                </div>
                
                <div className="rounded-xl border-2 rgb-border-animate bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-white rgb-text-animate">Environmental Monitoring</h3>
                        <p className="text-sm text-slate-400 mt-1">Real-time global tracking</p>
                      </div>
                    </div>
                    <CesiumMap
                      points={filteredPoints}
                    />
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="rounded-xl border-2 rgb-border-animate bg-slate-900/50 backdrop-blur-sm overflow-hidden sticky top-24">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white rgb-text-animate">Latest News</h3>
                        <p className="text-xs text-slate-400 mt-1">Environmental updates</p>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                      {allNews.slice(0, newsCount).map((news, index) => (
                        <div
                          key={news.id}
                          className="group relative overflow-hidden rounded-xl border-2 rgb-border-animate bg-slate-900 hover:bg-slate-800/80 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 card-click-effect"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={news.image || "/api/placeholder/400/300"}
                              alt={news.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                {news.category}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-white mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
                              {news.title}
                            </h4>
                            <p className="text-xs text-slate-400 line-clamp-2 mb-2">{news.description}</p>
                            <span className="text-xs text-slate-500">{news.date}</span>
                          </div>
                          <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      ))}
                    </div>
                    {newsCount < allNews.length && (
                      <div className="flex justify-center mt-4">
                        <button
                          onClick={() => setNewsCount(prev => Math.min(prev + 4, allNews.length))}
                          className="w-full px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 font-medium hover:scale-105 card-click-effect"
                        >
                          Load More
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="relative bg-slate-900 rounded-xl shadow-2xl max-w-md w-full border border-slate-700 overflow-hidden animate-scaleIn">
            {/* Content */}
            <div className="p-6">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-semibold text-center mb-2 text-white">
                Confirm Logout
              </h2>

              {/* Message */}
              <p className="text-slate-400 text-center mb-6 text-sm">
                Are you sure you want to logout?
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                {/* Cancel Button */}
                <button
                  onClick={cancelLogout}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  Cancel
                </button>

                {/* Confirm Button */}
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}