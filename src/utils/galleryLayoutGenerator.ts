// Gallery Layout Generator Helper
// Use this to quickly create different layout patterns

interface ImageData {
  src: string;
  yPos: number;
  xOffset: number;
  row: string;
  scale?: number; // Uniform scale (affects both width and height equally)
  scaleX?: number; // Width scale multiplier (overrides scale for width)
  scaleY?: number; // Height scale multiplier (overrides scale for height)
}

export class GalleryLayoutGenerator {
  /**
   * Creates a perfect grid layout
   * @param imageCount - Total number of images
   * @param rows - Number of rows (2 or 3 recommended)
   */
  static grid(imageCount: number, rows: number = 2): ImageData[] {
    const images: ImageData[] = [];
    const yPositions = this.calculateRowPositions(rows);

    for (let i = 0; i < imageCount; i++) {
      const rowIndex = i % rows;
      images.push({
        src: `/assets/img${i + 1}.jpg`,
        yPos: yPositions[rowIndex],
        xOffset: 0,
        row: `row${rowIndex}`,
      });
    }

    return images;
  }

  /**
   * Creates a zigzag pattern
   * @param imageCount - Total number of images
   */
  static zigzag(imageCount: number): ImageData[] {
    const images: ImageData[] = [];
    const topY = 0.8;
    const bottomY = -0.8;

    for (let i = 0; i < imageCount; i++) {
      images.push({
        src: `/assets/img${i + 1}.jpg`,
        yPos: i % 2 === 0 ? topY : bottomY,
        xOffset: 0,
        row: i % 2 === 0 ? "top" : "bottom",
      });
    }

    return images;
  }

  /**
   * Creates a staggered layout with varying heights
   * @param imageCount - Total number of images
   */
  static staggered(imageCount: number): ImageData[] {
    const images: ImageData[] = [];
    const patterns = [
      { yPos: -0.2, xOffset: 0, row: "bottom" },
      { yPos: 0.9, xOffset: 0.1, row: "top" },
      { yPos: 0.7, xOffset: 0, row: "top" },
      { yPos: -0.6, xOffset: 0.05, row: "bottom" },
    ];

    for (let i = 0; i < imageCount; i++) {
      const pattern = patterns[i % patterns.length];
      images.push({
        src: `/assets/img${i + 1}.jpg`,
        ...pattern,
      });
    }

    return images;
  }

  /**
   * Creates a waterfall layout with gradual descent
   * @param imageCount - Total number of images
   */
  static waterfall(imageCount: number): ImageData[] {
    const images: ImageData[] = [];
    const startY = 1.0;
    const endY = -1.0;
    const yStep = (startY - endY) / (imageCount - 1);

    for (let i = 0; i < imageCount; i++) {
      images.push({
        src: `/assets/img${i + 1}.jpg`,
        yPos: startY - i * yStep,
        xOffset: (i % 3) * 0.1, // Slight horizontal variation
        row: `image${i}`,
      });
    }

    return images;
  }

  /**
   * Creates a random organic layout
   * @param imageCount - Total number of images
   * @param seed - Random seed for reproducibility
   */
  static random(imageCount: number, seed: number = 42): ImageData[] {
    const images: ImageData[] = [];
    const random = this.seededRandom(seed);

    for (let i = 0; i < imageCount; i++) {
      images.push({
        src: `/assets/img${i + 1}.jpg`,
        yPos: random() * 1.6 - 0.8, // Range: -0.8 to 0.8
        xOffset: random() * 0.3, // Range: 0 to 0.3
        row: `random${i}`,
      });
    }

    return images;
  }

  /**
   * Creates a wave pattern
   * @param imageCount - Total number of images
   * @param amplitude - Height of the wave
   * @param frequency - How many complete waves
   */
  static wave(
    imageCount: number,
    amplitude: number = 0.6,
    frequency: number = 2
  ): ImageData[] {
    const images: ImageData[] = [];

    for (let i = 0; i < imageCount; i++) {
      const angle = (i / imageCount) * Math.PI * 2 * frequency;
      images.push({
        src: `/assets/img${i + 1}.jpg`,
        yPos: Math.sin(angle) * amplitude,
        xOffset: 0,
        row: `wave${i}`,
      });
    }

    return images;
  }

  /**
   * Creates a mirrored layout (symmetrical top and bottom)
   * @param imageCount - Total number of images (should be even)
   */
  static mirrored(imageCount: number): ImageData[] {
    const images: ImageData[] = [];
    const halfCount = Math.floor(imageCount / 2);

    for (let i = 0; i < imageCount; i++) {
      const isTop = i < halfCount;
      const positionIndex = isTop ? i : i - halfCount;
      const yVariation = (positionIndex % 3) * 0.2;

      images.push({
        src: `/assets/img${i + 1}.jpg`,
        yPos: isTop ? 0.6 + yVariation : -0.6 - yVariation,
        xOffset: (positionIndex % 2) * 0.1,
        row: isTop ? "top" : "bottom",
      });
    }

    return images;
  }

  /**
   * Bento grid layout - clusters images with varied scales
   * @param imageCount total number of images
   */
  static bentoGrid(imageCount: number = 12): ImageData[] {
    const images: ImageData[] = [];
    const template: ImageData[] = [
      { src: "", yPos: 0.82, xOffset: -0.35, row: "bento-top", scale: 1.1 },
      { src: "", yPos: 0.78, xOffset: -0.25, row: "bento-top", scale: 0.65 },
      { src: "", yPos: 0.35, xOffset: -0.28, row: "bento-mid", scale: 0.85 },
      { src: "", yPos: -0.05, xOffset: -0.32, row: "bento-mid", scale: 0.7 },
      { src: "", yPos: -0.55, xOffset: -0.3, row: "bento-bottom", scale: 0.9 },
      { src: "", yPos: 0.6, xOffset: -0.12, row: "bento-top", scale: 0.55 },
      { src: "", yPos: 0.1, xOffset: -0.15, row: "bento-mid", scale: 0.65 },
      { src: "", yPos: -0.35, xOffset: -0.18, row: "bento-bottom", scale: 0.5 },
      { src: "", yPos: 0.75, xOffset: 0.05, row: "bento-top", scale: 0.6 },
      { src: "", yPos: 0.25, xOffset: 0, row: "bento-mid", scale: 1.15 },
      { src: "", yPos: -0.25, xOffset: 0.02, row: "bento-mid", scale: 0.55 },
      { src: "", yPos: -0.7, xOffset: 0, row: "bento-bottom", scale: 0.8 },
    ];

    for (let i = 0; i < imageCount; i++) {
      const pattern = template[i % template.length];
      const columnShift = Math.floor(i / template.length) * 0.4;
      images.push({
        src: `/assets/img${i + 1}.jpg`,
        yPos: pattern.yPos,
        xOffset: pattern.xOffset + columnShift,
        row: `${pattern.row}-${i}`,
        scale: pattern.scale,
      });
    }

    return images;
  }

  /**
   * Masonry cluster layout - matches the reference image exactly
   * Structure: [Large + 2 small stacked] [GAP] [Large + 1 small] [GAP] [3 top + 2 bottom]
   * Total: 10 images
   */
  static masonryCluster(_imageCount: number = 10): ImageData[] {
    // Fixed 10 images to match reference layout exactly
    // Using explicit positions for each image to prevent overlaps
    return [
      // ═══════════════════════════════════════════════════════════
      // GROUP 1: Large tall image + 2 small square images stacked
      // ═══════════════════════════════════════════════════════════
      // Image 1: Large tall image (left side of cluster 1)
      {
        src: "/assets/img1.jpg",
        yPos: 0,
        xOffset: 0,
        row: "g1-main",
        scale: 1.4,
      },
      // Image 2: Small square (top-right of large image)
      {
        src: "/assets/img2.jpg",
        yPos: 0.32,
        xOffset: -0.85,
        row: "g1-top",
        scale: 0.52,
      },
      // Image 3: Small square (bottom-right of large image)
      {
        src: "/assets/img3.jpg",
        yPos: -0.32,
        xOffset: -0.85,
        row: "g1-bottom",
        scale: 0.52,
      },

      // ═══════════════════════════════════════════════════════════
      // GROUP 2: Large wide image + 1 small below (with clear gap)
      // ═══════════════════════════════════════════════════════════
      // Image 4: Large wide image
      {
        src: "/assets/img4.jpg",
        yPos: 0.18,
        xOffset: 0.6,
        row: "g2-main",
        scale: 1.15,
      },
      // Image 5: Small image below large
      {
        src: "/assets/img5.jpg",
        yPos: -0.38,
        xOffset: -0.35,
        row: "g2-bottom",
        scale: 0.58,
      },

      // ═══════════════════════════════════════════════════════════
      // GROUP 3: 3 small images top row + 2 small images bottom row
      // ═══════════════════════════════════════════════════════════
      // Image 6: Top-left of group 3
      {
        src: "/assets/img6.jpg",
        yPos: 0.32,
        xOffset: 0.8,
        row: "g3-top1",
        scale: 0.52,
      },
      // Image 7: Top-middle of group 3
      {
        src: "/assets/img7.jpg",
        yPos: 0.32,
        xOffset: -0.45,
        row: "g3-top2",
        scale: 0.52,
      },
      // Image 8: Top-right of group 3
      {
        src: "/assets/img8.jpg",
        yPos: 0.32,
        xOffset: -0.45,
        row: "g3-top3",
        scale: 0.52,
      },
      // Image 9: Bottom-left of group 3
      {
        src: "/assets/img9.jpg",
        yPos: -0.32,
        xOffset: -1.35,
        row: "g3-bot1",
        scale: 0.58,
      },
      // Image 10: Bottom-right of group 3
      {
        src: "/assets/img10.jpg",
        yPos: -0.32,
        xOffset: -0.5,
        row: "g3-bot2",
        scale: 0.58,
      },
    ];
  }

  /**
   * Masonry cluster layout - matches the reference image exactly
   * Structure: [Large + 2 small stacked] [GAP] [Large + 1 small] [GAP] [3 top + 2 bottom]
   * Total: 10 images
   */
  static masonryCustomCluster(_imageCount: number = 10): ImageData[] {
    // Using explicit positions for each image to prevent overlaps
    return [
      // ═══════════════════════════════════════════════════════════
      // GROUP 1: Large tall image + 2 small square images stacked
      // ═══════════════════════════════════════════════════════════
      // Image 1: Large tall image (left side of cluster 1)
      {
        src: "/assets/img1.jpg",
        yPos: 0,
        xOffset: 0,
        row: "g1-main",
        scale: 1.4,
      },
      // Image 2: Small square (top-right of large image)
      {
        src: "/assets/img2.jpg",
        yPos: 0.55,
        xOffset: 0.09,
        row: "g1-top",
        scale: 0.52,
      },
      // Image 3: Small square (bottom-right of large image)
      {
        src: "/assets/img3.jpg",
        yPos: 0.55,
        xOffset: 0.2,
        row: "g1-top2",
        //scale: 0.52,
        scaleX: 0.52,
        scaleY: 0.52,
      },
      {
        src: "/assets/img4.jpg",
        yPos: -0.35,
        xOffset: -2.24,
        row: "g1-below-tops",
        //scale: 0.8,
        scaleX: 1.1,
        scaleY: 0.83,
      },

      // ═══════════════════════════════════════════════════════════
      // GROUP 2: Large wide image + 1 small below (with clear gap)
      // ═══════════════════════════════════════════════════════════
      // Image 4: Large wide image
      {
        src: "/assets/img4.jpg",
        yPos: 0,
        xOffset: -1.6,
        row: "g2-main",
        //scale: 1.15,
        scaleX: 0.4,
        scaleY: 1.4,
      },
      // // Image 5: Small image below large
      {
        src: "/assets/img5.jpg",
        yPos: 0.52,
        xOffset: -1.5,
        row: "g2-bottom",
        scaleX: 0.58,
        scaleY: 0.58,
      },
      {
        src: "/assets/img6.jpg",
        yPos: -0.38,
        xOffset: -2.8,
        row: "g3-top1",
        scaleX: 1,
        scaleY: 0.8,
      },

      // ═══════════════════════════════════════════════════════════
      // GROUP 3: 3 small images top row + 2 small images bottom row
      // ═══════════════════════════════════════════════════════════

      {
        src: "/assets/img7.jpg",
        yPos: 0.54,
        xOffset: -2.1,
        row: "g3-top1",
        scale: 0.48,
      },
      {
        src: "/assets/img8.jpg",
        yPos: 0.54,
        xOffset: -2,
        row: "g3-top2",
        scale: 0.48,
      },
      {
        src: "/assets/img9.jpg",
        yPos: -0.035,
        xOffset: -1.9,
        row: "g3-top3",
        scaleX: 0.48,
        scaleY: 1.4,
      },
      // // Image 9: Bottom-left of group 3
      {
        src: "/assets/img9.jpg",
        yPos: -0.38,
        xOffset: -5.32,
        row: "g3-bot1",
        scaleX: 1.01,
        scaleY: 0.85,
      },
      // // Image 10: Bottom-right of group 3
      // {
      //   src: "/assets/img10.jpg",
      //   yPos: -0.32,
      //   xOffset: -0.5,
      //   row: "g3-bot2",
      //   scale: 0.58,
      // },
    ];
  }

  /**
   * Helper: Calculate evenly spaced row positions
   */
  private static calculateRowPositions(rows: number): number[] {
    const positions: number[] = [];
    const spacing = 1.6 / (rows - 1); // Space between -0.8 and 0.8

    for (let i = 0; i < rows; i++) {
      positions.push(0.8 - i * spacing);
    }

    return positions;
  }

  /**
   * Helper: Seeded random number generator
   */
  private static seededRandom(seed: number) {
    let current = seed;
    return () => {
      current = (current * 9301 + 49297) % 233280;
      return current / 233280;
    };
  }

  /**
   * Custom layout from pattern string
   * Example: "T T B B T T" where T=top, B=bottom
   */
  static fromPattern(
    pattern: string,
    topY: number = 0.7,
    bottomY: number = -0.7
  ): ImageData[] {
    const images: ImageData[] = [];
    const positions = pattern.trim().split(/\s+/);

    positions.forEach((pos, i) => {
      images.push({
        src: `/assets/img${i + 1}.jpg`,
        yPos: pos.toUpperCase() === "T" ? topY : bottomY,
        xOffset: 0,
        row: pos.toUpperCase() === "T" ? "top" : "bottom",
      });
    });

    return images;
  }
}

// Usage examples:
export const layoutExamples = {
  // Perfect 2-row grid
  grid2Rows: GalleryLayoutGenerator.grid(12, 2),

  // Perfect 3-row grid
  grid3Rows: GalleryLayoutGenerator.grid(12, 3),

  // Zigzag pattern
  zigzag: GalleryLayoutGenerator.zigzag(12),

  // Original staggered look
  staggered: GalleryLayoutGenerator.staggered(12),

  // Waterfall descent
  waterfall: GalleryLayoutGenerator.waterfall(12),

  // Random organic
  randomLayout: GalleryLayoutGenerator.random(12),

  // Wave pattern
  wave: GalleryLayoutGenerator.wave(12, 0.6, 2),

  // Mirrored symmetry
  mirrored: GalleryLayoutGenerator.mirrored(12),

  // Bento grid
  bentoGrid: GalleryLayoutGenerator.bentoGrid(12),

  // Masonry cluster layout (matches reference image - fixed 10 images)
  masonryCluster: GalleryLayoutGenerator.masonryCluster(10),

  // Masonry cluster layout (matches reference image - fixed 10 images)
  masonryCustomCluster: GalleryLayoutGenerator.masonryCustomCluster(10),

  // Custom pattern
  customPattern: GalleryLayoutGenerator.fromPattern("T T B B T T B B T T B B"),
};

// Export for direct use
export default GalleryLayoutGenerator;
