# Environmental Background Images Setup

## 🌿 Dashboard Environmental Cards Background System

Your dashboard now features **animated environmental background images** for the deforestation, mining, and forest fire cards!

### 🎨 Current Implementation

The system includes:
- **Deforestation Card**: Animated burning/smoke effects with earth tones
- **Mining Card**: Industrial drilling/dust effects with metallic grays
- **Forest Fire Card**: Flickering flames and sparks with fiery reds/oranges

### 📁 How to Add Your Custom Images/GIFs

1. **Navigate to the images folder:**
   ```
   frontend/public/images/
   ```

2. **Replace the placeholder files with your actual images/GIFs:**
   - `deforestation.gif` - Your deforestation image/GIF
   - `mining.gif` - Your mining image/GIF
   - `forest-fire.gif` - Your forest fire image/GIF

3. **File Requirements:**
   - **Format**: GIF, PNG, JPG, or WebP
   - **Size**: Recommended 800x600px or larger for best quality
   - **Optimization**: Keep file sizes under 2MB for performance

### 🔧 Technical Details

The system automatically:
- ✅ Loads your images when available
- ✅ Falls back to animated CSS backgrounds if images fail to load
- ✅ Maintains text readability with overlay effects
- ✅ Preserves all existing functionality
- ✅ Works across all themes

### 🎯 Features

- **Dynamic Loading**: Images load automatically when placed in the correct folder
- **Fallback System**: Beautiful animated backgrounds if images aren't available
- **Responsive Design**: Images scale properly on all screen sizes
- **Performance Optimized**: Lazy loading and caching support
- **Theme Compatible**: Works with all theme systems (Nature, Cyberpunk, Modern, Sunset)

### 🚀 Quick Setup

1. Place your images in `frontend/public/images/`
2. Name them exactly: `deforestation.gif`, `mining.gif`, `forest-fire.gif`
3. Refresh your browser - the new backgrounds will appear instantly!

### 📋 Image Suggestions

For best results, use:
- **Deforestation**: Images showing forest clearing, logging, or land degradation
- **Mining**: Images of quarries, mining equipment, or industrial sites
- **Forest Fire**: Images of wildfires, smoke, or fire damage

The system will automatically apply the appropriate overlay and styling to ensure text remains readable over your custom backgrounds!

🌍 **Your environmental dashboard is now ready with stunning custom backgrounds!**