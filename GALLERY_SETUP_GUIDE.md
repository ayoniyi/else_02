# 3D Gallery Setup Guide

## Overview

Your Next.js portfolio now includes a stunning 3D gallery with:

- **Smooth scrolling** using Lenis
- **3D rendering** with Three.js
- **Cloth-like hover effects** with custom shaders
- **Horizontal gallery scroll** triggered by vertical scrolling
- **Black & white to color transition** on hover
- **Cylindrical wrapping** for 3D depth

## What Was Created

### 1. **GalleryCanvas Component** (`src/components/GalleryCanvas.tsx`)

A React component that encapsulates all the Three.js, GSAP, and Lenis logic. Features:

- Dynamic image loading with natural aspect ratios
- Custom vertex and fragment shaders for cloth effects
- Raycasting for hover detection
- Geometry bending for cylindrical wrapping
- Smooth hover transitions

### 2. **Updated Portfolio Page** (`src/pages/portfolio/index.tsx`)

Integrates the GalleryCanvas component with:

- Dynamic import (client-side only, no SSR)
- Title animation that scrolls with the gallery

### 3. **Updated Styles** (`src/pages/portfolio/Home.module.scss`)

Fixed positioning and layout:

- 600vh container for scroll space
- Fixed canvas wrapper
- Title with blend mode effects

### 4. **Assets Folder** (`public/assets/`)

Ready for your gallery images

## How to Use

### Step 1: Add Your Images

1. Place 12 images in the `public/assets/` folder
2. Name them: `img1.jpg`, `img2.jpg`, ... `img12.jpg`
3. Supported formats: JPG, PNG, WebP
4. Recommended size: 1200-2000px (width or height)
5. Any aspect ratio works (portrait or landscape)

**Image Layout:**

- **Top row**: img2, img3, img5, img7, img9, img11
- **Bottom row**: img1, img4, img6, img8, img10, img12

### Step 2: Run the Development Server

```bash
npm run dev
```

Navigate to: `http://localhost:3000/portfolio`

### Step 3: Test the Gallery

- **Scroll down** to see the gallery move horizontally
- **Hover over images** to see the cloth effect and color transition
- **Watch the title** animate across the screen

## Customization Options

### Change the Number of Images

Edit `src/components/GalleryCanvas.tsx`:

```typescript
const defaultImages: ImageData[] = [
  { src: "/assets/img1.jpg", yPos: -0.2, xOffset: 0, row: "bottom" },
  { src: "/assets/img2.jpg", yPos: 0.9, xOffset: 0.1, row: "top" },
  // Add or remove images here
];
```

**Parameters:**

- `src`: Path to the image
- `yPos`: Vertical position (-1 to 1, where 0 is center)
- `xOffset`: Horizontal offset for stagger effect
- `row`: "top" or "bottom" (for reference)

### Adjust Gallery Behavior

In `GalleryCanvas.tsx`, find the `galleryConfig` object:

```typescript
const galleryConfig = {
  scrollMultiplier: 20, // Total scroll distance
  cylinderRadius: 6, // Radius of the virtual cylinder
  centerOffset: 0, // Center position offset
  startOffset: 3, // Initial offset before first image
  bendStartX: 2, // When bending starts
  bendTransitionWidth: 2, // Bending transition smoothness
  bendCenterZone: 6, // Full bend area
  bendFadeZone: 4, // Bend fade-out area
  hoverZOffset: 0.64, // How much closer image comes on hover
  hoverTransitionSpeed: 0.075, // Hover transition speed
};
```

### Adjust Image Scale

Change the `baseScale` variable:

```typescript
const baseScale = 1.8; // Increase for larger images, decrease for smaller
```

### Modify Shader Effects

**Wave Intensity:**

```glsl
float waveStrength = uHover * 0.12; // Change 0.12 to adjust wave intensity
```

**Ripple Effect:**

```glsl
float ripple = sin(dist * 20.0 - uTime * 3.0) * exp(-dist * 3.0);
// Change 20.0 for ripple frequency
// Change 3.0 for ripple speed
```

### Change Scroll Behavior

Adjust Lenis settings:

```typescript
const lenis = new Lenis({
  duration: 1.2, // Smoothing duration (higher = slower/smoother)
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
```

### Adjust Title Animation

In `src/pages/portfolio/Home.module.scss`:

```scss
.title {
  font-size: 25vw; // Change title size
  left: 30vw; // Change starting position
  top: 20%; // Change vertical position
}
```

## Architecture

### Component Structure

```
portfolio/index.tsx
├── GalleryCanvas (client-side only)
│   ├── Lenis (smooth scrolling)
│   ├── GSAP + ScrollTrigger (scroll animations)
│   └── Three.js Scene
│       ├── Camera
│       ├── Renderer
│       ├── Raycaster (hover detection)
│       └── Image Meshes (with custom shaders)
└── Title (animated with GSAP)
```

### Key Features

1. **Client-Side Rendering**: Uses Next.js dynamic import to prevent SSR issues with Three.js
2. **Memory Management**: Proper cleanup in useEffect to prevent memory leaks
3. **Type Safety**: Full TypeScript support with proper type annotations
4. **Responsive**: Adapts to window resize
5. **Performance**: Efficient raycasting and shader updates

## Troubleshooting

### Images Not Loading

1. Check that images are in `public/assets/` folder
2. Verify image names match exactly (case-sensitive)
3. Check browser console for 404 errors

### Gallery Not Scrolling

1. Ensure you're scrolling vertically (the gallery moves horizontally)
2. Check that the container has `height: 600vh` in the styles
3. Verify ScrollTrigger is initializing (check console logs)

### Hover Effect Not Working

1. Check that images have loaded (console should show "Gallery loaded")
2. Verify raycasting is working (cursor should change to pointer)
3. Check that shader uniforms are updating

### Performance Issues

1. Reduce image file sizes
2. Decrease `baseScale` for smaller images
3. Lower `devicePixelRatio` in renderer setup:

```typescript
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
```

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile**: Works, but hover effects require touch

## Dependencies

Already installed:

- ✅ `three` - 3D rendering
- ✅ `gsap` - Animation and ScrollTrigger
- ✅ `@studio-freight/lenis` - Smooth scrolling
- ✅ `@types/three` - TypeScript definitions
- ✅ `sass` - SCSS styling

## Next Steps

1. **Add your images** to `public/assets/`
2. **Customize the layout** by adjusting `yPos` and `xOffset` values
3. **Fine-tune animations** by modifying `galleryConfig`
4. **Style the title** to match your brand
5. **Add more pages** to your portfolio

## Advanced Customization

### Add Click Handlers

Add to `GalleryCanvas.tsx`:

```typescript
function onCanvasClick(event: MouseEvent) {
  if (hoveredMesh) {
    const imageData = hoveredMesh.userData.imgData;
    console.log("Clicked image:", imageData.src);
    // Navigate to detail page, open lightbox, etc.
  }
}
renderer.domElement.addEventListener("click", onCanvasClick);
```

### Change Color Filter

Modify the fragment shader:

```glsl
// For sepia tone instead of grayscale:
vec3 sepia = vec3(
  dot(texColor.rgb, vec3(0.393, 0.769, 0.189)),
  dot(texColor.rgb, vec3(0.349, 0.686, 0.168)),
  dot(texColor.rgb, vec3(0.272, 0.534, 0.131))
);
texColor.rgb = mix(sepia, texColor.rgb, uHover);
```

### Add More Shader Effects

Examples:

- Chromatic aberration
- Vignette
- Glow/bloom
- Depth of field
- Pixelation

## Support

For issues or questions:

1. Check the browser console for errors
2. Review the troubleshooting section
3. Check Three.js documentation: https://threejs.org/docs/
4. Check GSAP documentation: https://greensock.com/docs/

---

**Happy coding!** 🎨✨
