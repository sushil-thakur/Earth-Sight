import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Shield, 
  TrendingUp, 
  Eye, 
  Cpu,
  ArrowRight,
  Play,
  Star,
  Users,
  BarChart3,
  MapPin,
  Bell
} from 'lucide-react';

const Home = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Environmental Monitoring",
      description: "Real-time tracking of deforestation, mining activities, and forest fires across the globe",
      color: "from-neon-green to-emerald-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "AI-Powered Predictions",
      description: "Advanced machine learning models predict real estate values with unprecedented accuracy",
      color: "from-neon-blue to-cyan-500"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Smart Alerts",
      description: "Instant email notifications for environmental risks and market opportunities",
      color: "from-neon-purple to-violet-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytics Dashboard",
      description: "Comprehensive insights and visualizations for informed decision-making",
      color: "from-neon-pink to-rose-500"
    }
  ];

  const stats = [
    { number: "99.8%", label: "Prediction Accuracy", icon: <TrendingUp className="w-6 h-6" /> },
    { number: "24/7", label: "Real-time Monitoring", icon: <Eye className="w-6 h-6" /> },
    { number: "50+", label: "Countries Covered", icon: <MapPin className="w-6 h-6" /> },
    { number: "10K+", label: "Active Users", icon: <Users className="w-6 h-6" /> }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
        <div className="absolute inset-0 bg-cyber-grid opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-radial from-neon-blue/10 via-transparent to-transparent"></div>
      </div>

      {/* Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold gradient-text">EarthSlight</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="btn-secondary">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-6">
              <span className="gradient-text">Future</span>
              <br />
              <span className="text-white">of Environmental</span>
              <br />
              <span className="gradient-text">Intelligence</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Harness the power of AI to monitor environmental risks and predict real estate values with unprecedented accuracy. 
              Join the revolution in environmental intelligence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 group">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn-cyber text-lg px-8 py-4 group">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Feature Showcase */}
          <div className="mt-20">
            <div className="card-cyber max-w-4xl mx-auto p-8">
              <div className="flex items-center justify-center mb-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                      index === currentFeature 
                        ? `bg-gradient-to-r ${feature.color} text-white shadow-neon scale-110` 
                        : 'bg-dark-800 text-gray-400'
                    }`}
                  >
                    {feature.icon}
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {features[currentFeature].title}
                </h3>
                <p className="text-gray-300 text-lg">
                  {features[currentFeature].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-card hover:transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                    {stat.icon}
                  </div>
                </div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-6">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the next generation of environmental monitoring and real estate prediction
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Predictions */}
            <div className="card-cyber group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-cyan-500 rounded-lg flex items-center justify-center mb-6 group-hover:shadow-neon transition-all duration-300">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI-Powered Predictions</h3>
              <p className="text-gray-300 mb-4">
                Advanced machine learning algorithms analyze environmental data to predict real estate values with 99.8% accuracy.
              </p>
              <div className="flex items-center text-neon-blue group-hover:text-white transition-colors duration-300">
                <span className="text-sm font-semibold">Learn More</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Real-time Monitoring */}
            <div className="card-cyber group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-green to-emerald-500 rounded-lg flex items-center justify-center mb-6 group-hover:shadow-neon transition-all duration-300">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Real-time Monitoring</h3>
              <p className="text-gray-300 mb-4">
                24/7 satellite monitoring of deforestation, mining activities, and forest fires across the globe.
              </p>
              <div className="flex items-center text-neon-blue group-hover:text-white transition-colors duration-300">
                <span className="text-sm font-semibold">Learn More</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Smart Alerts */}
            <div className="card-cyber group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-purple to-violet-500 rounded-lg flex items-center justify-center mb-6 group-hover:shadow-neon transition-all duration-300">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Smart Alerts</h3>
              <p className="text-gray-300 mb-4">
                Instant email notifications for environmental risks and market opportunities, keeping you ahead of the curve.
              </p>
              <div className="flex items-center text-neon-blue group-hover:text-white transition-colors duration-300">
                <span className="text-sm font-semibold">Learn More</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="card-cyber group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-pink to-rose-500 rounded-lg flex items-center justify-center mb-6 group-hover:shadow-neon transition-all duration-300">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Analytics Dashboard</h3>
              <p className="text-gray-300 mb-4">
                Comprehensive insights and visualizations for informed decision-making and strategic planning.
              </p>
              <div className="flex items-center text-neon-blue group-hover:text-white transition-colors duration-300">
                <span className="text-sm font-semibold">Learn More</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Data Security */}
            <div className="card-cyber group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-yellow to-amber-500 rounded-lg flex items-center justify-center mb-6 group-hover:shadow-neon transition-all duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Enterprise Security</h3>
              <p className="text-gray-300 mb-4">
                Military-grade encryption and security protocols ensure your data is always protected and confidential.
              </p>
              <div className="flex items-center text-neon-blue group-hover:text-white transition-colors duration-300">
                <span className="text-sm font-semibold">Learn More</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Global Coverage */}
            <div className="card-cyber group hover:transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-red to-red-500 rounded-lg flex items-center justify-center mb-6 group-hover:shadow-neon transition-all duration-300">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Global Coverage</h3>
              <p className="text-gray-300 mb-4">
                Monitor environmental risks and predict real estate values across 50+ countries worldwide.
              </p>
              <div className="flex items-center text-neon-blue group-hover:text-white transition-colors duration-300">
                <span className="text-sm font-semibold">Learn More</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-cyber p-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-6">
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already leveraging the power of AI to make smarter environmental and real estate decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                Sign In
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-neon-blue" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-neon-blue/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold gradient-text">EarthSlight</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>© 2024 EarthSlight. All rights reserved.</span>
              <Link to="/login" className="hover:text-neon-blue transition-colors">Privacy Policy</Link>
              <Link to="/login" className="hover:text-neon-blue transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 