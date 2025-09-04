// Environmental background images configuration
export const environmentalBackgrounds = {
  deforestation: '/deforestion.gif',
  mining: '/mining.gif',
  forest_fire: '/forestfire.gif',
  marine: '/marine.gif'
};

// CSS Animation classes for fallback when images don't load
export const fallbackAnimations = {
  deforestation: 'deforestation-bg',
  mining: 'mining-bg',
  forest_fire: 'forest-fire-bg'
};

// Fallback solid colors if images don't load
export const fallbackColors = {
  deforestation: 'linear-gradient(135deg, #8B4513 0%, #654321 50%, #2F1B14 100%)',
  mining: 'linear-gradient(135deg, #696969 0%, #2F2F2F 50%, #000000 100%)',
  forest_fire: 'linear-gradient(135deg, #FF4500 0%, #FF6347 50%, #DC143C 100%)'
};

// Helper function to check if image exists
export const checkImageExists = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};