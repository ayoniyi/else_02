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
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  width?: number;
  height?: number;
}

interface GalleryCanvasProps {
  images?: ImageData[];
  handleNavigate?: (route: string) => void;
  triggerScaleDown?: () => void;
}

const defaultImages: ImageData[] = layoutExamples.masonryCustomCluster;

const GalleryCanvas: React.FC<GalleryCanvasProps> = ({
  images = defaultImages,
  handleNavigate,
  triggerScaleDown,
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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
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

    // Fade in gallery
    if (canvasRef.current) {
      gsap.set(canvasRef.current, { opacity: 0 });
      gsap.to(canvasRef.current, {
        opacity: 1,
        duration: 0.8,
        delay: 0.1,
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

    // Enlargement state
    let isEnlarging = false;
    let isTransitioning = false;
    let enlargingMesh: THREE.Mesh | null = null;
    let enlargeStartTime = 0;
    const enlargeConfig = {
      centerTransitionDuration: 0.6, // New: duration for moving to center
      rippleDuration: 1.2, // Increased to allow ripple to be visible longer
      scaleDuration: 1.3,
      delay: 0.1,
      finalScale: 1.4,
      rippleIntensity: 3.5,
    };

    // Track mouse position
    function onMouseMove(event: MouseEvent) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseScreen.x = event.clientX;
      mouseScreen.y = event.clientY;
    }
    window.addEventListener("mousemove", onMouseMove);

    // Click handler for image enlargement and navigation
    function onCanvasClick(event: MouseEvent) {
      if (isEnlarging || isTransitioning) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const allMeshes = meshes.map((m) => m.mesh);
      const intersects = raycaster.intersectObjects(allMeshes);

      if (intersects.length > 0) {
        // Trigger the page scale down immediately
        if (triggerScaleDown) {
          triggerScaleDown();
        }

        isTransitioning = true; // Lock interactions during scale down

        const clickedMesh = intersects[0].object as THREE.Mesh;
        const clickedUV = intersects[0].uv || new THREE.Vector2(0.5, 0.5);
        const imageIndex = clickedMesh.userData.index;

        // Wait for scale down animation to complete (0.8s) before starting image enlargement
        setTimeout(() => {
          isTransitioning = false;
          isEnlarging = true;
          enlargingMesh = clickedMesh;
          enlargeStartTime = performance.now();

          // Store original bend state for smooth transition
          const clickedGeometry = clickedMesh.geometry as THREE.BufferGeometry;
          const posAttr = clickedGeometry.attributes
            .position as THREE.BufferAttribute;
          const currentBentPositions = new Float32Array(posAttr.array.length);
          currentBentPositions.set(posAttr.array as Float32Array);
          clickedMesh.userData.bentPositions = currentBentPositions;

          // Render above other meshes
          clickedMesh.renderOrder = 999;
          const clickedMaterial = clickedMesh.material as THREE.ShaderMaterial;
          clickedMaterial.depthTest = false;
          clickedMaterial.depthWrite = false;
          clickedMaterial.transparent = true;
          clickedMaterial.opacity = 1;

          // Calculate target scale to fit screen width
          const meshWidth = clickedMesh.userData.width;
          const vFOV = (camera.fov * Math.PI) / 180;
          const distance = camera.position.z;
          const visibleHeight = 2 * Math.tan(vFOV / 2) * distance;
          const visibleWidth = visibleHeight * camera.aspect;
          // Multiply by 1.05 to slightly overfill and avoid edges
          const targetScaleForWidth = (visibleWidth / meshWidth) * 1.0;

          // Store values for animation
          clickedMesh.userData.originalScale = {
            x: clickedMesh.scale.x,
            y: clickedMesh.scale.y,
            z: clickedMesh.scale.z,
          };
          clickedMesh.userData.originalPosition = {
            x: clickedMesh.position.x,
            y: clickedMesh.position.y,
            z: clickedMesh.position.z,
          };
          clickedMesh.userData.clickUV = clickedUV.clone();
          clickedMesh.userData.targetScale = targetScaleForWidth;

          // Trigger ripple effect
          const material = clickedMesh.material as THREE.ShaderMaterial;
          if (material.uniforms) {
            material.uniforms.uMouse.value.copy(clickedUV);
          }

          console.log(
            "Image clicked - starting enlargement animation",
            imageIndex,
          );

          // Navigate after animation completes
          const totalAnimationTime =
            (enlargeConfig.centerTransitionDuration +
              enlargeConfig.delay +
              enlargeConfig.scaleDuration) *
            1000;

          setTimeout(() => {
            if (handleNavigate) {
              handleNavigate(`/projects`);
            }
          }, totalAnimationTime);
        }, 800);
      }
    }

    if (canvasRef.current) {
      canvasRef.current.addEventListener("click", onCanvasClick);
    }

    // Cloth effect shaders
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
        
        float dist = distance(uv, uMouse);
        float waveStrength = uHover * 0.12;
        float ripple = sin(dist * 15.0 - uTime * 3.0) * exp(-dist * 3.0);
        float bulge = exp(-dist * dist * 8.0) * waveStrength;
        float wave = (ripple * 0.34 + bulge) * uHover;
        
        pos.z += wave * 0.6;
        pos.z += sin(uv.x * 10.0 + uTime * 2.0) * sin(uv.y * 10.0 + uTime * 1.5) * 0.016 * uHover;
        pos.z += uHoverZ;
        
        vWave = wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const clothFragmentShader = `
      uniform sampler2D uTexture;
      uniform float uHover;
      uniform vec2 uMouse;
      uniform float uStartGrayscale;
      uniform float uForceColor; // New: force color during enlargement
      
      varying vec2 vUv;
      varying float vWave;
      
      void main() {
        vec2 distortedUV = vUv;
        distortedUV += vWave * 0.016 * uHover;
        
        vec4 texColor = texture2D(uTexture, distortedUV);
        
        float grayscale = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
        vec3 bwColor = vec3(grayscale);
        
        // Mix between grayscale and color, respecting uForceColor
        float grayscaleMix = uStartGrayscale * (1.0 - uHover) * (1.0 - uForceColor);
        texColor.rgb = mix(texColor.rgb, bwColor, grayscaleMix);
        
        float highlight = vWave * 0.24 * uHover;
        texColor.rgb += highlight;
        
        gl_FragColor = texColor;
      }
    `;

    const textureLoader = new THREE.TextureLoader();
    const meshes: Array<{ mesh: THREE.Mesh; index: number; img: ImageData }> =
      [];
    const gap = 0.0;
    let totalWidth = 0;
    let loadedCount = 0;
    const baseScale = 1.8;
    let shaderTime = 0;

    // Load images and create meshes
    images.forEach((img, index) => {
      textureLoader.load(
        img.src,
        (texture: THREE.Texture) => {
          const image = texture.image as HTMLImageElement;
          const aspectRatio = image.width / image.height;
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
            32,
          );
          const positionAttribute = geometry.attributes.position;
          const originalPositions = new Float32Array(
            positionAttribute.array.length,
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
              uForceColor: { value: 0.0 }, // New uniform
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
        },
      );
    });

    // Gallery configuration
    const galleryConfig = {
      scrollMultiplier: 20,
      cylinderRadius: 5.5,
      centerOffset: 0,
      startOffset: 3,
      bendStartX: 2,
      bendTransitionWidth: 2,
      bendCenterZone: 6,
      bendFadeZone: 4,
      hoverZOffset: 0.9,
      hoverTransitionSpeed: 0.15,
      startInGrayscale: true,
      horizontalOffset: 0,
    };

    let scrollProgress = 0;
    let animationId: number;

    function positionMeshes() {
      meshes.sort((a, b) => a.index - b.index);
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
        `Gallery loaded: ${meshes.length} images, totalWidth: ${totalWidth}`,
      );

      createScrollTrigger();
      animate();
    }

    function createScrollTrigger() {
      const endSection = document.querySelector(".horizontal-scroll-end");

      // Update scroll progress for the 3D gallery
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.8,
        onUpdate: (self) => {
          scrollProgress = self.progress;

          // Manual update for end section to ensure strict synchronization
          if (endSection) {
            const startP = 0.85;
            if (scrollProgress > startP) {
              const p = (scrollProgress - startP) / (1 - startP);
              gsap.set(endSection, { x: -window.innerWidth * p });
            } else {
              gsap.set(endSection, { x: 0 });
            }
          }
        },
      });

      // Animate title
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
          },
        );
      }

      // Animate scroll text elements
      const scrollTextElements = document.querySelectorAll(
        ".horizontal-scroll-text",
      );
      scrollTextElements.forEach((element) => {
        gsap.fromTo(
          element,
          { x: 0 },
          {
            x: () => {
              const viewportWidth = window.innerWidth;
              const elementWidth = (element as HTMLElement).offsetWidth;
              const galleryMidpoint = totalWidth * 60;
              return -(viewportWidth + elementWidth + galleryMidpoint);
            },
            ease: "none",
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
            },
          },
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

      meshes.forEach(({ mesh }) => {
        mesh.geometry.computeBoundingSphere();
        mesh.geometry.computeBoundingBox();
      });

      raycaster.setFromCamera(mouse, camera);
      const allMeshes = meshes.map((m) => m.mesh);
      const intersects = raycaster.intersectObjects(allMeshes);

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
            intersected.point.clone(),
          );
          const width = newHoveredMesh.userData.width;
          const height = newHoveredMesh.userData.height;
          intersectedUV = new THREE.Vector2(
            localPoint.x / width + 0.5,
            localPoint.y / height + 0.5,
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

      if (hoveredMesh && !isEnlarging) {
        hoveredMesh.userData.targetHover = 1;
        hoveredMesh.userData.targetHoverZ = galleryConfig.hoverZOffset;
        if (intersectedUV) {
          mouseUV.lerp(intersectedUV, 0.15);
        }
      }

      // Enlargement animation
      if (isEnlarging && enlargingMesh) {
        const elapsedTime = (performance.now() - enlargeStartTime) / 1000;

        // Phase 1: Center transition (0 to centerTransitionDuration)
        const centerProgress = Math.min(
          1,
          elapsedTime / enlargeConfig.centerTransitionDuration,
        );
        const easedCenterProgress = 1 - Math.pow(1 - centerProgress, 3); // easeOutCubic

        // Phase 2: Ripple effect (starts immediately, extends throughout)
        const rippleProgress = Math.min(
          1,
          elapsedTime / enlargeConfig.rippleDuration,
        );

        // Phase 3: Scale animation (starts after delay + center transition)
        const scaleStartTime =
          enlargeConfig.delay + enlargeConfig.centerTransitionDuration;
        const delayedTime = Math.max(0, elapsedTime - scaleStartTime);
        const scaleProgress = Math.min(
          1,
          delayedTime / enlargeConfig.scaleDuration,
        );
        const easedScaleProgress = 1 - Math.pow(1 - scaleProgress, 3); // easeOutCubic

        const material = enlargingMesh.material as THREE.ShaderMaterial;
        const geometry = enlargingMesh.geometry as THREE.BufferGeometry;
        const posAttr = geometry.attributes.position as THREE.BufferAttribute;

        if (material.uniforms) {
          // Keep ripple effect visible throughout the animation
          const rippleIntensity =
            enlargeConfig.rippleIntensity * Math.max(0.3, 1 - rippleProgress);
          material.uniforms.uHover.value = rippleIntensity;
          material.uniforms.uTime.value = shaderTime * 2;

          // Force color mode during enlargement
          material.uniforms.uForceColor.value = centerProgress;

          if (enlargingMesh.userData.clickUV) {
            material.uniforms.uMouse.value.copy(enlargingMesh.userData.clickUV);
          }
        }

        // Smoothly transition geometry from bent to flat during center transition
        const originalPositions = geometry.userData
          .originalPositions as Float32Array;
        const bentPositions = enlargingMesh.userData
          .bentPositions as Float32Array;

        if (originalPositions && bentPositions) {
          for (let i = 0; i < posAttr.count; i++) {
            const bentX = bentPositions[i * 3];
            const bentY = bentPositions[i * 3 + 1];
            const bentZ = bentPositions[i * 3 + 2];

            const flatX = originalPositions[i * 3];
            const flatY = originalPositions[i * 3 + 1];
            const flatZ = originalPositions[i * 3 + 2];

            posAttr.setX(i, bentX + (flatX - bentX) * easedCenterProgress);
            posAttr.setY(i, bentY + (flatY - bentY) * easedCenterProgress);
            posAttr.setZ(i, bentZ + (flatZ - bentZ) * easedCenterProgress);
          }
          posAttr.needsUpdate = true;
          geometry.computeVertexNormals();
        }

        const targetScale = enlargingMesh.userData.targetScale;
        const originalScale = enlargingMesh.userData.originalScale;
        const originalPosition = enlargingMesh.userData.originalPosition;

        // Move to center smoothly during phase 1
        enlargingMesh.position.x =
          originalPosition.x + (0 - originalPosition.x) * easedCenterProgress;
        enlargingMesh.position.y =
          originalPosition.y +
          (-0.2 - originalPosition.y) * easedCenterProgress;
        enlargingMesh.position.z = originalPosition.z;

        // Scale during phase 3
        if (delayedTime > 0) {
          enlargingMesh.scale.x =
            originalScale.x +
            (targetScale - originalScale.x) * easedScaleProgress;
          enlargingMesh.scale.y =
            originalScale.y +
            (targetScale - originalScale.y) * easedScaleProgress;
          enlargingMesh.scale.z =
            originalScale.z +
            (targetScale - originalScale.z) * easedScaleProgress;

          // Fade out other images
          meshes.forEach(({ mesh }) => {
            if (mesh !== enlargingMesh) {
              const meshMaterial = mesh.material as THREE.ShaderMaterial;
              if (meshMaterial.uniforms) {
                meshMaterial.opacity = 1 - easedScaleProgress * 0.8;
                meshMaterial.transparent = true;
              }
            }
          });
        }
      }

      const scrollOffset =
        scrollProgress * galleryConfig.scrollMultiplier -
        galleryConfig.startOffset;

      meshes.forEach(({ mesh }) => {
        if (isEnlarging && mesh === enlargingMesh) {
          return;
        }

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

      renderer.domElement.style.cursor = hoveredMesh ? "pointer" : "default";
    }

    function bendGeometryOnCylinder(
      mesh: THREE.Mesh,
      baseWorldX: number,
      scrollOffset: number,
    ) {
      const geometry = mesh.geometry;
      const positions = geometry.attributes.position;
      const originalPositions = geometry.userData.originalPositions;

      if (!originalPositions) return;

      const radius = galleryConfig.cylinderRadius;
      const { bendStartX, bendTransitionWidth, bendCenterZone, bendFadeZone } =
        galleryConfig;

      const scrollBendProgress = smoothstep(
        bendStartX,
        bendStartX + bendTransitionWidth,
        scrollOffset,
      );

      for (let i = 0; i < positions.count; i++) {
        const localX = originalPositions[i * 3];
        const localY = originalPositions[i * 3 + 1];
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
              distanceFromCenter,
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

    // Cleanup
    cleanupRef.current = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onWindowResize);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("click", onCanvasClick);
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
    };

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [images, handleNavigate]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
};

export default GalleryCanvas;
