import React from 'react';
import { motion } from 'framer-motion';

const EnvironmentalCard = ({
  title,
  value,
  icon: Icon,
  backgroundImage,
  glowColor,
  children
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Determine background class based on title
  const getBackgroundClass = () => {
    if (title.includes('Deforestation')) return 'deforestation-bg';
    if (title.includes('Mining')) return 'mining-bg';
    if (title.includes('Forest Fire')) return 'forest-fire-bg';
    if (title.includes('Marine')) return 'marine-bg';
    return 'organic-card';
  };

  // Handle image loading
  React.useEffect(() => {
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
      img.src = backgroundImage;
    }
  }, [backgroundImage]);

  return (
    <motion.div
      className={`${getBackgroundClass()} p-6 relative overflow-hidden`}
      style={{
        backgroundImage: imageLoaded && !imageError ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      whileHover={{ scale: 1.03, y: -8 }}
      transition={{ type: "spring", stiffness: 250 }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-white/90">{title}</p>
            <motion.p
              className="text-3xl font-bold organic-text organic-counter"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {value}
            </motion.p>
          </div>
          <motion.div
            className="w-14 h-14 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center interactive-element backdrop-blur-sm"
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <Icon className="h-7 w-7 text-white" />
          </motion.div>
        </div>

        {children && (
          <div className="text-xs text-white/80">
            {children}
          </div>
        )}
      </div>

      {/* Animated border glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `inset 0 0 0 2px ${glowColor}, 0 0 20px ${glowColor}40`
        }}
      />
    </motion.div>
  );
};

export default EnvironmentalCard;