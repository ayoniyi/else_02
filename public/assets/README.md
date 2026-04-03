# Gallery Assets

This folder contains images for the 3D gallery.

## Required Images

Place 12 images in this folder with the following names:

- `img1.jpg` through `img12.jpg`

## Image Specifications

- **Format**: JPG, PNG, or WebP
- **Recommended Size**: 1200px - 2000px (width or height)
- **Aspect Ratio**: Any (the gallery automatically adjusts to each image's aspect ratio)
- **Orientation**: Both portrait and landscape work well

## Image Layout

The gallery arranges images in a staggered two-row layout:

- **Top row**: img2, img3, img5, img7, img9, img11
- **Bottom row**: img1, img4, img6, img8, img10, img12

## Adding Your Own Images

1. Add your images to this folder
2. Name them `img1.jpg` through `img12.jpg` (or .png, .webp)
3. Update the image paths in `GalleryCanvas.tsx` if using different names or formats

## Effects

- Images start in **black & white**
- On hover, they transition to **full color** with a **cloth-like wave effect**
- The gallery scrolls horizontally as you scroll vertically
- Images wrap around a virtual cylinder for a 3D effect
