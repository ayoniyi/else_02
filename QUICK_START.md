# 🚀 Quick Start - 3D Gallery

## ✅ What's Ready

Everything is set up and ready to use! Here's what was created:

1. **`GalleryCanvas` Component** - Full 3D gallery with cloth hover effects
2. **Portfolio Page Integration** - Gallery added to `/portfolio` route
3. **12 Images Detected** - Your images in `public/assets/` are ready to display
4. **All Dependencies Installed** - Lenis, GSAP, Three.js, and TypeScript types

## 🎯 Start the Gallery Now

```bash
npm run dev
```

Then visit: **http://localhost:3000/portfolio**

## 🎮 How to Use the Gallery

1. **Scroll down** → Gallery moves horizontally
2. **Hover over images** → Watch the cloth effect and color transition
3. **See the title** → "V.O" animates across the screen

## 🎨 Features

✨ **Smooth Scrolling** - Lenis provides buttery smooth scrolling  
🌊 **Cloth Effect** - Custom shaders create realistic cloth-like waves  
🎨 **Color Transition** - Images go from black & white to full color on hover  
🔄 **3D Wrapping** - Images wrap around a virtual cylinder  
📱 **Responsive** - Adapts to any screen size  
⚡ **Optimized** - Efficient rendering and memory management

## 📁 File Structure

```
src/
├── components/
│   └── GalleryCanvas.tsx        ← 3D Gallery component
└── pages/
    └── portfolio/
        ├── index.tsx             ← Portfolio page (updated)
        └── Home.module.scss      ← Styles (updated)

public/
└── assets/
    ├── img1.jpg - img12.jpg     ← Your gallery images ✅
    └── README.md                ← Image placement guide
```

## 🔧 Quick Customizations

### Change Image Scale

Open `src/components/GalleryCanvas.tsx` and find:

```typescript
const baseScale = 1.8; // Change to 2.5 for larger, 1.2 for smaller
```

### Adjust Scroll Speed

In the same file, modify `galleryConfig`:

```typescript
const galleryConfig = {
  scrollMultiplier: 20, // Lower = faster scroll, Higher = slower
  // ... other settings
};
```

### Change Title

Edit `src/pages/portfolio/index.tsx`:

```tsx
<h1 className={`${style.title} gallery-title`}>V.O</h1>
```

### Replace Images

Just replace the files in `public/assets/` (keep the same names: img1.jpg - img12.jpg)

## 📖 Full Documentation

For detailed customization options, see **`GALLERY_SETUP_GUIDE.md`**

## 🎯 What's Next?

1. **Test the gallery** - Make sure everything works as expected
2. **Customize the images** - Replace with your portfolio pieces
3. **Adjust the layout** - Modify `yPos` and `xOffset` in `GalleryCanvas.tsx`
4. **Style the title** - Update typography and effects
5. **Add interactions** - Implement click handlers for image details

## 🐛 Troubleshooting

**Gallery not showing?**

- Check console for errors
- Verify you're on `/portfolio` route
- Ensure dev server is running

**Images not loading?**

- Check file names match exactly
- Verify images are in `public/assets/`
- Check browser network tab for 404s

**Performance issues?**

- Reduce image file sizes
- Lower `baseScale` value
- Check browser hardware acceleration

## 💡 Tips

- **Scroll slowly** to appreciate the smooth transitions
- **Hover near edges** to see the full cloth effect
- **Use high-quality images** (1200-2000px recommended)
- **Mix portrait and landscape** for visual interest

---

**Enjoy your stunning 3D gallery!** 🎨✨

For detailed customization, see `GALLERY_SETUP_GUIDE.md`
