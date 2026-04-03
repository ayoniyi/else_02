import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

import { layoutExamples } from "../utils/galleryLayoutGenerator";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ImageData {
  src: string;
  yPos: number;
  xOffset: number;
  row: string;
  scale?: number; // Uniform scale (affects both width and height equally)
  scaleX?: number; // Width scale multiplier (overrides scale for width)
  scaleY?: number; // Height scale multiplier (overrides scale for height)
  width?: number;
  height?: number;
}

interface GalleryCanvasProps {
  images?: ImageData[];
}

// Replace the defaultImages array with:
const defaultImages: ImageData[] = layoutExamples.masonryCustomCluster;
// Or: layoutExamples.grid2Rows
// Or: layoutExamples.zigzag
// Or: layoutExamples.waterfall
// Or: layoutExamples.wave

const GalleryCanvas: React.FC<GalleryCanvasProps> = ({
  images = defaultImages,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Sync Lenis with ScrollTrigger (single RAF to avoid double-driving Lenis)
    lenis.on("scroll", ScrollTrigger.update);

    // gsap.ticker.add((time) => {
    //   lenis.raf(time * 1000);
    // });
    // gsap.ticker.lagSmoothing(0);

    // ============================================
    // THREE.JS 3D GALLERY WITH CLOTH HOVER EFFECT
    // ============================================

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera setup - perspective for 3D depth
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 6;
    camera.position.y = -0.2;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Hide gallery initially, will fade in after delay
    // Ensure pointer-events are always active so hover detection works immediately
    if (canvasRef.current) {
      gsap.set(canvasRef.current, { opacity: 0, pointerEvents: "auto" });
      gsap.to(canvasRef.current, {
        opacity: 1,
        duration: 0.8,
        delay: 1.65, // 1.65 second delay before gallery appears
        ease: "power2.out",
      });
    }

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    raycaster.params.Line.threshold = 0.1;
    const mouse = new THREE.Vector2();
    const mouseScreen = new THREE.Vector2();
    let hoveredMesh: THREE.Mesh | null = null;
    const mouseUV = new THREE.Vector2(0.5, 0.5);
    let lastMouseMoveTime = performance.now();

    // Track mouse position
    function updateMousePosition(event: MouseEvent | PointerEvent) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseScreen.x = event.clientX;
      mouseScreen.y = event.clientY;
      lastMouseMoveTime = performance.now();
    }

    // Listen on both window and canvas to ensure we capture mouse position
    window.addEventListener("mousemove", updateMousePosition);

    // Capture mouse position when pointer enters canvas (fixes initial load issue)
    canvasRef.current.addEventListener("pointerenter", updateMousePosition);
    canvasRef.current.addEventListener("pointermove", updateMousePosition);

    // Cloth effect shader - vertex shader

    // Cloth effect shader - vertex shader
    const clothVertexShader = `
      uniform vec2 uMouse;
      uniform float uHover;
      uniform float uTime;
      uniform float uHoverZ;
      
      varying vec2 vUv;
      varying float vWave;
      
      void main() {
        vUv = uv;
        
        vec3 pos = position;
        
        // Calculate distance from mouse position (in UV space)
        float dist = distance(uv, uMouse);
        
        // Create wave effect that follows mouse
        float waveStrength = uHover * 0.12;
        float waveRadius = 0.4;
        
        // ============================================
        // RIPPLE EFFECT INTENSITY CONTROLS
        // ============================================
        // Ripple effect - multiple waves emanating from mouse
        // dist * 20.0 = ripple frequency (higher = more ripples)
        // uTime * 3.0 = ripple speed (higher = faster animation)
        // exp(-dist * 3.0) = ripple falloff (higher = faster fade)
        float ripple = sin(dist * 15.0 - uTime * 3.0) * exp(-dist * 3.0);
        
        // Cloth-like bulge that follows mouse
        float bulge = exp(-dist * dist * 8.0) * waveStrength;
        
        // Combine effects
        // ripple * 0.24 = RIPPLE INTENSITY MULTIPLIER (increase for stronger ripple)
        float wave = (ripple * 0.34 + bulge) * uHover;
        
        // Apply displacement on Z axis
        // wave * 0.4 = OVERALL WAVE INTENSITY (increase for more pronounced effect)
        pos.z += wave * 0.6;
        
        // Add subtle secondary waves for cloth feel
        pos.z += sin(uv.x * 10.0 + uTime * 2.0) * sin(uv.y * 10.0 + uTime * 1.5) * 0.016 * uHover;
        
        // Add hover Z offset to bring image closer
        pos.z += uHoverZ;
        
        vWave = wave;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    // Cloth effect shader - fragment shader
    const clothFragmentShader = `
      uniform sampler2D uTexture;
      uniform float uHover;
      uniform vec2 uMouse;
      uniform float uStartGrayscale; // 1.0 = start in grayscale, 0.0 = start in color
      
      varying vec2 vUv;
      varying float vWave;
      
      void main() {
        // Slight UV distortion based on wave for refraction-like effect
        vec2 distortedUV = vUv;
        distortedUV += vWave * 0.016 * uHover;
        
        vec4 texColor = texture2D(uTexture, distortedUV);
        
        // Black and white filter - toggles based on uStartGrayscale
        float grayscale = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
        vec3 bwColor = vec3(grayscale);
        
        // Interpolate between grayscale and color based on hover
        // If uStartGrayscale = 1.0: mix from grayscale to color (original behavior)
        // If uStartGrayscale = 0.0: always stay in color (never turn grayscale on hover)
        // Only apply grayscale transition when uStartGrayscale is enabled
        float grayscaleMix = uStartGrayscale * (1.0 - uHover);
        texColor.rgb = mix(texColor.rgb, bwColor, grayscaleMix);
        
        // Subtle highlight on the wave peaks
        float highlight = vWave * 0.24 * uHover;
        texColor.rgb += highlight;
        
        gl_FragColor = texColor;
      }
    `;

    // TextureLoader
    const textureLoader = new THREE.TextureLoader();

    // Store meshes for animation
    const meshes: Array<{ mesh: THREE.Mesh; index: number; img: ImageData }> =
      [];
    const gap = 0.0;
    let totalWidth = 0;
    let loadedCount = 0;
    const baseScale = 1.8;
    let shaderTime = 0;

    // Load all images and create meshes
    images.forEach((img, index) => {
      textureLoader.load(
        img.src,
        (texture: THREE.Texture) => {
          const image = texture.image as HTMLImageElement;
          const imageWidth = image.width;
          const imageHeight = image.height;
          const aspectRatio = imageWidth / imageHeight;

          // Support individual width/height scaling via scaleX/scaleY
          // If scaleX/scaleY not provided, falls back to uniform scale
          const uniformScale = img.scale ?? 1;
          const widthScale = img.scaleX ?? uniformScale;
          const heightScale = img.scaleY ?? uniformScale;

          let displayWidth, displayHeight;

          if (aspectRatio > 1) {
            displayWidth = baseScale * widthScale * aspectRatio * 0.7;
            displayHeight = baseScale * heightScale * 0.7;
          } else {
            displayWidth = baseScale * widthScale * 0.7;
            displayHeight = (baseScale * heightScale * 0.7) / aspectRatio;
          }

          img.width = displayWidth;
          img.height = displayHeight;

          const geometry = new THREE.PlaneGeometry(
            displayWidth,
            displayHeight,
            32,
            32
          );

          const positionAttribute = geometry.attributes.position;
          const originalPositions = new Float32Array(
            positionAttribute.array.length
          );
          originalPositions.set(positionAttribute.array);
          geometry.userData.originalPositions = originalPositions;

          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;

          const material = new THREE.ShaderMaterial({
            uniforms: {
              uTexture: { value: texture },
              uMouse: { value: new THREE.Vector2(0.5, 0.5) },
              uHover: { value: 0 },
              uTime: { value: 0 },
              uHoverZ: { value: 0 },
              uStartGrayscale: {
                value: galleryConfig.startInGrayscale ? 1.0 : 0.0,
              },
            },
            vertexShader: clothVertexShader,
            fragmentShader: clothFragmentShader,
            side: THREE.DoubleSide,
            transparent: true,
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.frustumCulled = false;
          mesh.userData.imgData = img;
          mesh.userData.index = index;
          mesh.userData.width = displayWidth;
          mesh.userData.height = displayHeight;
          mesh.userData.targetHover = 0;
          mesh.userData.currentHover = 0;
          mesh.userData.targetHoverZ = 0;
          mesh.userData.currentHoverZ = 0;

          meshes.push({ mesh, index, img });
          loadedCount++;

          if (loadedCount === images.length) {
            positionMeshes();
          }
        },
        undefined,
        (error: unknown) => {
          console.error(`Failed to load texture: ${img.src}`, error);
          loadedCount++;
          if (loadedCount === images.length) {
            positionMeshes();
          }
        }
      );
    });

    // Gallery configuration
    const galleryConfig = {
      scrollMultiplier: 20,
      //cylinderRadius: 6,
      cylinderRadius: 5.5,
      centerOffset: 0,
      startOffset: 3,
      bendStartX: 2,
      bendTransitionWidth: 2,
      bendCenterZone: 6,
      bendFadeZone: 4,
      // hoverZOffset: 0.64,
      hoverZOffset: 0.9,
      //hoverTransitionSpeed: 0.075,
      hoverTransitionSpeed: 0.15,
      // Color mode: true = start in grayscale (original), false = start in color
      startInGrayscale: true,
      //startInGrayscale: false,
      // Horizontal positioning: 0 = centered, negative = left, positive = right
      horizontalOffset: 0,
    };

    let scrollProgress = 0;
    let animationId: number;

    function positionMeshes() {
      meshes.sort(
        (
          a: { mesh: THREE.Mesh; index: number; img: ImageData },
          b: { mesh: THREE.Mesh; index: number; img: ImageData }
        ) => a.index - b.index
      );
      let currentX = 0;

      meshes.forEach(({ mesh, img }) => {
        const width = mesh.userData.width;
        const xPos = currentX + width / 2 + img.xOffset;
        currentX += width + gap;

        mesh.userData.initialX = xPos;
        mesh.userData.yPos = img.yPos;
        mesh.position.set(0, img.yPos, 0);
        scene.add(mesh);
      });

      totalWidth = currentX;
      galleryConfig.scrollMultiplier =
        totalWidth + galleryConfig.startOffset * 2;

      console.log(
        `Gallery loaded: ${meshes.length} images, totalWidth: ${totalWidth}, scrollMultiplier: ${galleryConfig.scrollMultiplier}`
      );

      createScrollTrigger();
      animate();
    }

    function createScrollTrigger() {
      const endSection = document.querySelector(
        ".horizontal-scroll-end"
      ) as HTMLElement | null;
      let endSectionVisible = false;

      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          scrollProgress = self.progress;
          if (endSection) {
            const shouldShow = scrollProgress > 0.97;
            if (shouldShow !== endSectionVisible) {
              endSectionVisible = shouldShow;
              endSection.style.pointerEvents = shouldShow ? "auto" : "none";
              gsap.to(endSection, {
                autoAlpha: shouldShow ? 1 : 0,
                duration: 0.6,
                overwrite: true,
                ease: "power2.out",
              });
            }
          }
        },
      });

      // Animate title horizontally with scroll
      const titleElement = document.querySelector(".gallery-title");
      if (titleElement) {
        gsap.fromTo(
          titleElement,
          { x: 0 },
          {
            x: () => {
              const viewportWidth = window.innerWidth;
              const titleWidth = (titleElement as HTMLElement).offsetWidth;
              return -(viewportWidth + titleWidth + totalWidth * 150);
            },
            ease: "none",
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
            },
          }
        );
      }

      // Animate all elements with horizontal-scroll-text class (navSection and textSection)
      const scrollTextElements = document.querySelectorAll(
        ".horizontal-scroll-text"
      );
      scrollTextElements.forEach((element) => {
        gsap.fromTo(
          element,
          { x: 0 },
          {
            x: () => {
              const viewportWidth = window.innerWidth;
              const elementWidth = (element as HTMLElement).offsetWidth;
              // Start appearing in the middle of the gallery (50% through)
              // Offset by half the gallery width so text appears mid-scroll
              const galleryMidpoint = totalWidth * 60; // match original layout pacing
              //increase the number to move the text further left
              return -(viewportWidth + elementWidth + galleryMidpoint);
            },
            ease: "none",
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
            },
          }
        );
      });
    }

    function smoothstep(edge0: number, edge1: number, x: number) {
      const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    }

    function animate() {
      animationId = requestAnimationFrame(animate);
      shaderTime += 0.016;

      const now = performance.now();
      const isMouseActive = now - lastMouseMoveTime < 2000; // keep hover alive longer

      let intersects: THREE.Intersection[] = [];
      if (isMouseActive) {
        raycaster.setFromCamera(mouse, camera);
        const allMeshes = meshes.map((m) => m.mesh);
        intersects = raycaster.intersectObjects(allMeshes);
      }

      let newHoveredMesh: THREE.Mesh | null = null;
      let intersectedUV: THREE.Vector2 | null = null;

      if (intersects.length > 0) {
        intersects.sort((a, b) => a.distance - b.distance);
        const intersected = intersects[0];
        newHoveredMesh = intersected.object as THREE.Mesh;

        if (intersected.uv) {
          intersectedUV = intersected.uv.clone();
        } else {
          const localPoint = newHoveredMesh.worldToLocal(
            intersected.point.clone()
          );
          const width = newHoveredMesh.userData.width;
          const height = newHoveredMesh.userData.height;
          intersectedUV = new THREE.Vector2(
            localPoint.x / width + 0.5,
            localPoint.y / height + 0.5
          );
        }
      }

      if (newHoveredMesh !== hoveredMesh) {
        if (hoveredMesh) {
          hoveredMesh.userData.targetHover = 0;
          hoveredMesh.userData.targetHoverZ = 0;
        }
        hoveredMesh = newHoveredMesh;
      }

      if (hoveredMesh) {
        hoveredMesh.userData.targetHover = 1;
        hoveredMesh.userData.targetHoverZ = galleryConfig.hoverZOffset;
        if (intersectedUV) {
          mouseUV.lerp(intersectedUV, 0.15);
        }
      }

      const scrollOffset =
        scrollProgress * galleryConfig.scrollMultiplier -
        galleryConfig.startOffset;

      meshes.forEach(({ mesh }) => {
        const hoverSpeed = galleryConfig.hoverTransitionSpeed;
        mesh.userData.currentHover +=
          (mesh.userData.targetHover - mesh.userData.currentHover) * hoverSpeed;
        mesh.userData.currentHoverZ +=
          (mesh.userData.targetHoverZ - mesh.userData.currentHoverZ) *
          hoverSpeed;

        const material = mesh.material as THREE.ShaderMaterial;
        if (material.uniforms) {
          material.uniforms.uTime.value = shaderTime;
          material.uniforms.uHover.value = mesh.userData.currentHover;
          material.uniforms.uHoverZ.value = mesh.userData.currentHoverZ;

          if (mesh === hoveredMesh) {
            material.uniforms.uMouse.value.lerp(mouseUV, 0.12);
          }
        }

        const baseWorldX = mesh.userData.initialX - scrollOffset;
        bendGeometryOnCylinder(mesh, baseWorldX, scrollOffset);
      });

      renderer.render(scene, camera);

      // Update cursor
      if (hoveredMesh) {
        renderer.domElement.style.cursor = "pointer";
      } else {
        renderer.domElement.style.cursor = "default";
      }
    }

    function bendGeometryOnCylinder(
      mesh: THREE.Mesh,
      baseWorldX: number,
      scrollOffset: number
    ) {
      const geometry = mesh.geometry;
      const positions = geometry.attributes.position;
      const originalPositions = geometry.userData.originalPositions;

      if (!originalPositions) return;

      const radius = galleryConfig.cylinderRadius;
      const width = mesh.userData.width;
      const { bendStartX, bendTransitionWidth, bendCenterZone, bendFadeZone } =
        galleryConfig;

      const scrollBendProgress = smoothstep(
        bendStartX,
        bendStartX + bendTransitionWidth,
        scrollOffset
      );

      for (let i = 0; i < positions.count; i++) {
        const localX = originalPositions[i * 3];
        const localY = originalPositions[i * 3 + 1];
        const localZ = originalPositions[i * 3 + 2];
        const worldX = baseWorldX + localX;
        const distanceFromCenter = Math.abs(worldX);

        let centerProximity;
        if (distanceFromCenter <= bendCenterZone) {
          centerProximity = 1;
        } else if (distanceFromCenter <= bendCenterZone + bendFadeZone) {
          centerProximity =
            1 -
            smoothstep(
              bendCenterZone,
              bendCenterZone + bendFadeZone,
              distanceFromCenter
            );
        } else {
          centerProximity = 0;
        }

        const bendProgress = scrollBendProgress * centerProximity;
        const angle = worldX / radius;
        const curvedX = radius * Math.sin(angle);
        const curvedZ = radius * Math.cos(angle) - radius;
        const flatX = worldX;
        const flatZ = 0;

        const newX = flatX + (curvedX - flatX) * bendProgress;
        const newZ = flatZ + (curvedZ - flatZ) * bendProgress;

        positions.setX(i, newX);
        positions.setY(i, localY);
        positions.setZ(i, newZ);
      }

      positions.needsUpdate = true;
      geometry.computeVertexNormals();
      mesh.position.set(0, mesh.userData.yPos, 0);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", onWindowResize);

    // Store canvas ref for cleanup
    const canvasElement = canvasRef.current;

    // Cleanup function
    cleanupRef.current = () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("resize", onWindowResize);
      if (canvasElement) {
        canvasElement.removeEventListener("pointerenter", updateMousePosition);
        canvasElement.removeEventListener("pointermove", updateMousePosition);
      }

      if (animationId) {
        cancelAnimationFrame(animationId);
      }

      lenis.destroy();

      meshes.forEach(({ mesh }) => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat: THREE.Material) => mat.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });

      renderer.dispose();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [images]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
};

export default GalleryCanvas;
