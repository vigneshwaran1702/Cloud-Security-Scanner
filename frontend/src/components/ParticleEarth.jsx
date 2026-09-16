import { useEffect, useRef, useState } from 'react';

// Real Geographical Landmass Classifier
// Checks whether any (latitude, longitude) coordinate falls on Earth's continental landmasses
function isEarthLand(lat, lon) {
  // Normalize longitude to [-180, 180]
  while (lon > 180) lon -= 360;
  while (lon < -180) lon += 360;

  // Antarctica & Sub-Antarctic
  if (lat < -62) return true;

  // Greenland
  if (lat >= 60 && lat <= 83 && lon >= -73 && lon <= -12) return true;

  // North America
  // Canada & Alaska
  if (lat >= 54 && lat <= 72 && lon >= -168 && lon <= -55) return true;
  // Conterminous USA & Southern Canada
  if (lat >= 25 && lat <= 54 && lon >= -125 && lon <= -66) {
    // Exclude Gulf of Mexico
    if (lat < 30 && lon >= -97 && lon <= -82) return false;
    return true;
  }
  // Mexico
  if (lat >= 14 && lat <= 32 && lon >= -117 && lon <= -86) return true;
  // Central America
  if (lat >= 7 && lat <= 18 && lon >= -92 && lon <= -77) return true;
  // Caribbean Islands (Cuba, Hispaniola, Puerto Rico)
  if (lat >= 18 && lat <= 26 && lon >= -85 && lon <= -65) return true;

  // South America
  if (lat >= -56 && lat <= 12 && lon >= -81 && lon <= -34) {
    if (lat < -20) {
      // Southern tapering cone (Chile, Argentina)
      const left = -75 + (lat + 20) * 0.15;
      const right = -45 + (lat + 20) * 0.45;
      return lon >= left && lon <= right;
    }
    return true;
  }

  // Europe
  if (lat >= 36 && lat <= 71 && lon >= -10 && lon <= 45) {
    // Mediterranean Sea Exclusion (cut out water between Europe and Africa)
    if (lat >= 36 && lat <= 42 && lon >= -5 && lon <= 25) {
      // Iberian peninsula, Italy, Greece
      if ((lon >= -10 && lon <= 3) || (lon >= 8 && lon <= 18) || (lon >= 20 && lon <= 28)) {
        return true;
      }
      return false;
    }
    return true;
  }
  // British Isles
  if (lat >= 50 && lat <= 60 && lon >= -11 && lon <= 2) return true;
  // Scandinavia
  if (lat >= 55 && lat <= 71 && lon >= 5 && lon <= 32) return true;

  // Africa
  if (lat >= -35 && lat <= 37 && lon >= -18 && lon <= 52) {
    // Southern cone taper
    if (lat < 0) {
      const left = 10 + lat * 0.2;
      const right = 42 + lat * 0.4;
      return lon >= left && lon <= right;
    }
    // Red Sea cut
    if (lat >= 12 && lat <= 28 && lon >= 38 && lon <= 44) return false;
    return true;
  }
  // Madagascar
  if (lat >= -26 && lat <= -12 && lon >= 43 && lon <= 51) return true;

  // Asia
  // Russia / Siberia
  if (lat >= 50 && lat <= 75 && lon >= 45 && lon <= 180) return true;
  // Middle East & Arabia
  if (lat >= 12 && lat <= 35 && lon >= 35 && lon <= 62) {
    if (lat >= 12 && lat <= 27 && lon >= 38 && lon <= 43) return false; // Red Sea
    if (lat >= 24 && lat <= 30 && lon >= 48 && lon <= 56) return false; // Persian Gulf
    return true;
  }
  // Central Asia
  if (lat >= 35 && lat <= 55 && lon >= 45 && lon <= 90) {
    if (lat >= 37 && lat <= 47 && lon >= 47 && lon <= 54) return false; // Caspian Sea
    return true;
  }
  // Indian Subcontinent
  if (lat >= 8 && lat <= 35 && lon >= 68 && lon <= 90) {
    if (lat < 22) {
      // Tapering Indian peninsula
      const left = 68 + (22 - lat) * 0.7;
      const right = 89 - (22 - lat) * 0.6;
      return lon >= left && lon <= right;
    }
    return true;
  }
  // Sri Lanka
  if (lat >= 5 && lat <= 10 && lon >= 79 && lon <= 82) return true;
  // East Asia (China, Mongolia, Korea)
  if (lat >= 18 && lat <= 52 && lon >= 90 && lon <= 135) {
    if (lat >= 32 && lat <= 40 && lon >= 119 && lon <= 126) return false; // Yellow Sea
    return true;
  }
  // Japan
  if (lat >= 30 && lat <= 46 && lon >= 129 && lon <= 146) return true;
  // Southeast Asia
  if (lat >= 8 && lat <= 24 && lon >= 92 && lon <= 110) return true;
  // Indonesia, Malaysia, Philippines, Papua
  if (lat >= -11 && lat <= 7 && lon >= 95 && lon <= 142) return true;
  if (lat >= 5 && lat <= 20 && lon >= 117 && lon <= 127) return true;

  // Australia & Oceania
  if (lat >= -44 && lat <= -10 && lon >= 112 && lon <= 154) {
    if (lat < -38) return lat >= -44 && lat <= -40 && lon >= 144 && lon <= 149; // Tasmania
    return true;
  }
  // New Zealand
  if (lat >= -47 && lat <= -34 && lon >= 166 && lon <= 179) return true;

  return false;
}

// Major Cloud Hub Data Centers
const CLOUD_HUBS = [
  { name: 'AWS us-east-1', lat: 38.0, lon: -77.5, color: '#ffffff' },
  { name: 'AWS us-west-2', lat: 45.5, lon: -122.6, color: '#ffffff' },
  { name: 'Azure Frankfurt', lat: 50.1, lon: 8.6, color: '#ffffff' },
  { name: 'Azure Amsterdam', lat: 52.3, lon: 4.9, color: '#ffffff' },
  { name: 'GCP Tokyo', lat: 35.6, lon: 139.6, color: '#ffffff' },
  { name: 'GCP Singapore', lat: 1.3, lon: 103.8, color: '#ffffff' },
  { name: 'AWS Sydney', lat: -33.8, lon: 151.2, color: '#ffffff' },
  { name: 'Azure São Paulo', lat: -23.5, lon: -46.6, color: '#ffffff' },
  { name: 'GCP Mumbai', lat: 19.0, lon: 72.8, color: '#ffffff' },
  { name: 'Azure Dubai', lat: 25.2, lon: 55.2, color: '#ffffff' }
];

const ARCS = [
  { from: 0, to: 2 },
  { from: 2, to: 9 },
  { from: 9, to: 8 },
  { from: 8, to: 5 },
  { from: 5, to: 4 },
  { from: 4, to: 1 },
  { from: 1, to: 0 },
  { from: 0, to: 7 }
];

export default function ParticleEarth({
  stage = 'opening', // 'opening' | 'background'
  onEarthClick = null,
  isTransitioning = false,
  onAssembled = null
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameId = useRef(null);
  const gatherTimeRef = useRef(stage === 'opening' ? 0 : 5);
  const assembledRef = useRef(stage !== 'opening');

  const rotation = useRef({
    rotX: 0.22,
    rotY: 0.6,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    autoSpeed: stage === 'opening' ? 0.005 : 0.0025
  });

  const mousePos = useRef({ x: -9999, y: -9999, isHovering: false });
  const shockwave = useRef({ active: false, progress: 0 });

  useEffect(() => {
    if (isTransitioning) {
      shockwave.current = { active: true, progress: 0 };
    }
  }, [isTransitioning]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const getDims = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(320, rect.width || canvas.offsetWidth || 500) * dpr;
      const h = Math.max(320, rect.height || canvas.offsetHeight || 500) * dpr;
      return { w, h };
    };

    let { w: width, h: height } = getDims();
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      if (!canvas) return;
      const dims = getDims();
      width = canvas.width = dims.w;
      height = canvas.height = dims.h;
    };

    window.addEventListener('resize', handleResize);

    // ==========================================
    // Helper to generate scatter coordinates from normal surrounding screen
    // ==========================================
    const createScatterPoint = () => {
      const effBaseR = stage === 'opening'
        ? Math.min(width * 0.32, height * 0.30, 240 * dpr)
        : Math.min(width, height) * 0.44;
      const halfW = (width / 2) / Math.max(1, effBaseR);
      const halfH = (height / 2) / Math.max(1, effBaseR);
      const maxDim = Math.hypot(halfW, halfH);

      const mode = Math.random();
      let sx, sy, sz;

      if (mode < 0.48) {
        // 1. Spawning from outside the screen perimeter (left, right, top, bottom edges)
        const edge = Math.floor(Math.random() * 4);
        const margin = 0.2 + Math.random() * 1.0;
        if (edge === 0) {
          // Top edge
          sx = (Math.random() * 2 - 1) * (halfW + margin);
          sy = -(halfH + margin);
        } else if (edge === 1) {
          // Bottom edge
          sx = (Math.random() * 2 - 1) * (halfW + margin);
          sy = (halfH + margin);
        } else if (edge === 2) {
          // Left edge
          sx = -(halfW + margin);
          sy = (Math.random() * 2 - 1) * (halfH + margin);
        } else {
          // Right edge
          sx = (halfW + margin);
          sy = (Math.random() * 2 - 1) * (halfH + margin);
        }
        sz = (Math.random() - 0.5) * 4.2;
      } else if (mode < 0.84) {
        // 2. Wide ambient surrounding screen space (corners, quadrants, cosmic surrounding)
        const angle = Math.random() * Math.PI * 2;
        const rDist = 1.6 + Math.random() * (maxDim * 1.25);
        sx = Math.cos(angle) * rDist * (halfW / maxDim * 1.2 + 0.35);
        sy = Math.sin(angle) * rDist * (halfH / maxDim * 1.2 + 0.35);
        sz = (Math.random() - 0.5) * 4.8;
      } else {
        // 3. Deep space background & foreground streaming in
        const angle = Math.random() * Math.PI * 2;
        const rDist = 1.3 + Math.random() * 2.4;
        sx = Math.cos(angle) * rDist;
        sy = Math.sin(angle) * rDist;
        sz = (Math.random() > 0.5 ? 1 : -1) * (2.8 + Math.random() * 3.5);
      }

      // Staggered arrival delay (0.0 to 0.70 seconds)
      const delay = Math.random() * 0.7;
      return { sx, sy, sz, delay };
    };

    // Ambient stars in surrounding space
    const ambientStars = [];
    for (let i = 0; i < 110; i++) {
      ambientStars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.3 + 0.5,
        alpha: Math.random() * 0.6 + 0.25,
        twinkleSpeed: Math.random() * 1.5 + 0.8,
        offset: Math.random() * Math.PI * 2
      });
    }

    // ==========================================
    // Generate Realistic 3D Earth Particle System
    // ==========================================
    const particles = [];
    const totalSphereSamples = 2200;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < totalSphereSamples; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / totalSphereSamples);
      
      // Convert spherical angles to latitude and longitude
      const lat = 90 - (phi * 180) / Math.PI;
      let lon = ((theta * 180) / Math.PI) % 360;
      if (lon > 180) lon -= 360;

      // Classify whether this coordinate lies on Earth's continents
      const isLand = isEarthLand(lat, lon);

      // Unit sphere 3D Cartesian coordinates
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);

      const scatter = createScatterPoint(x, y, z);

      if (isLand) {
        // CONTINENT PARTICLES: Dense, bright, sharp white/silver landmasses
        particles.push({
          origX: x,
          origY: y,
          origZ: z,
          startX: scatter.sx,
          startY: scatter.sy,
          startZ: scatter.sz,
          delay: scatter.delay,
          isLand: true,
          baseSize: Math.random() * 1.6 + 1.4,
          twinkleOffset: Math.random() * Math.PI * 2
        });

        // Add additional sub-particles on continents to give solid land texture
        if (Math.random() > 0.45) {
          const jitterAngle = Math.random() * Math.PI * 2;
          const jitterDist = 0.012;
          const jx = x + Math.cos(jitterAngle) * jitterDist;
          const jy = y + Math.sin(jitterAngle) * jitterDist;
          const jz = z;
          const jLen = Math.sqrt(jx * jx + jy * jy + jz * jz) || 1;
          const nx = jx / jLen;
          const ny = jy / jLen;
          const nz = jz / jLen;
          const jScatter = createScatterPoint(nx, ny, nz);

          particles.push({
            origX: nx,
            origY: ny,
            origZ: nz,
            startX: jScatter.sx,
            startY: jScatter.sy,
            startZ: jScatter.sz,
            delay: jScatter.delay,
            isLand: true,
            baseSize: Math.random() * 1.3 + 1.0,
            twinkleOffset: Math.random() * Math.PI * 2
          });
        }
      } else {
        // OCEAN PARTICLES: Faint, sparse, dark cyber blue-grey dots showing water depth
        // Only keep a fraction of ocean points to give continents high contrast
        if (Math.random() > 0.52) {
          particles.push({
            origX: x,
            origY: y,
            origZ: z,
            startX: scatter.sx,
            startY: scatter.sy,
            startZ: scatter.sz,
            delay: scatter.delay,
            isLand: false,
            baseSize: Math.random() * 0.9 + 0.7,
            twinkleOffset: Math.random() * Math.PI * 2
          });
        }
      }
    }

    // Hub Nodes coordinates
    const hubPoints = CLOUD_HUBS.map((h) => {
      const latRad = (h.lat * Math.PI) / 180;
      const lonRad = (h.lon * Math.PI) / 180;
      return {
        x: Math.cos(latRad) * Math.sin(lonRad),
        y: -Math.sin(latRad),
        z: Math.cos(latRad) * Math.cos(lonRad),
        ...h
      };
    });

    let time = 0;

    // ==========================================
    // Render Loop
    // ==========================================
    const render = () => {
      time += 0.03;

      // Particle gathering progress
      if (stage === 'opening') {
        gatherTimeRef.current += 0.018;
        if (gatherTimeRef.current >= 1.8 && !assembledRef.current) {
          assembledRef.current = true;
          if (onAssembled) onAssembled();
        }
      } else {
        gatherTimeRef.current = 5;
      }
      const gTime = gatherTimeRef.current;

      const rot = rotation.current;

      if (!rot.isDragging) {
        rot.rotY += rot.autoSpeed;
      }

      // Shockwave update during transition
      if (shockwave.current.active) {
        shockwave.current.progress += 0.025;
        if (shockwave.current.progress > 1.2) {
          shockwave.current.active = false;
        }
      }

      ctx.clearRect(0, 0, width, height);

      const dpr = window.devicePixelRatio || 1;
      const cx = width / 2;
      const cy = height / 2;

      // Base globe radius depends on stage
      let baseRadius;
      if (stage === 'opening') {
        baseRadius = Math.min(width * 0.32, height * 0.30, 240 * dpr);
        if (baseRadius < 110 * dpr) {
          baseRadius = Math.min(width * 0.38, height * 0.34);
        }
      } else {
        baseRadius = Math.min(width, height) * 0.44;
      }

      // Subtle ambient stars twinkling in surrounding deep space
      if (stage === 'opening') {
        for (let i = 0; i < ambientStars.length; i++) {
          const star = ambientStars[i];
          const stAlpha = star.alpha * (0.65 + 0.35 * Math.sin(time * star.twinkleSpeed + star.offset));
          ctx.fillStyle = `rgba(255, 255, 255, ${stAlpha * 0.5})`;
          ctx.beginPath();
          ctx.arc(star.x * width, star.y * height, star.size * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Globe sphere disc and atmospheric glow fade in as particles converge
      const globeDiscAlpha = stage === 'opening'
        ? Math.min(1, Math.max(0, (gTime - 0.7) / 1.0))
        : 1;

      if (globeDiscAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = globeDiscAlpha;

        // 1. Dark Oceanic Globe Sphere Disc (Creates solid 3D Earth depth behind continents)
        const oceanGrad = ctx.createRadialGradient(
          cx - baseRadius * 0.3,
          cy - baseRadius * 0.3,
          baseRadius * 0.1,
          cx,
          cy,
          baseRadius
        );
        oceanGrad.addColorStop(0, 'rgba(18, 22, 34, 0.95)');
        oceanGrad.addColorStop(0.7, 'rgba(10, 12, 18, 0.95)');
        oceanGrad.addColorStop(1, 'rgba(4, 5, 8, 0.98)');
        
        ctx.fillStyle = oceanGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius, 0, Math.PI * 2);
        ctx.fill();

        // Atmospheric Rim Light Glow (Glowing White / Subtle Blue Rim)
        const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.85, cx, cy, baseRadius * 1.35);
        glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.14)');
        glowGrad.addColorStop(0.3, 'rgba(120, 160, 255, 0.09)');
        glowGrad.addColorStop(0.7, 'rgba(124, 91, 255, 0.04)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, baseRadius * 1.35, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Matrix rotation values
      const cosY = Math.cos(rot.rotY);
      const sinY = Math.sin(rot.rotY);
      const cosX = Math.cos(rot.rotX);
      const sinX = Math.sin(rot.rotX);

      const project = (px, py, pz, radiusMult = 1) => {
        // Rotate Y
        const x1 = px * cosY + pz * sinY;
        const y1 = py;
        const z1 = -px * sinY + pz * cosY;

        // Rotate X (Tilt)
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        const r = baseRadius * radiusMult;
        return {
          sx: cx + x2 * r,
          sy: cy + y2 * r,
          sz: z2,
          visible: z2 > -0.2
        };
      };

      // Rings and arcs visibility fades in as particles assemble
      const structureFade = Math.min(1, Math.max(0, (gTime - 1.2) / 0.6));

      // 2. Draw Subtle Equator & Latitude Guide Lines
      if (structureFade > 0.05) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.16 * structureFade})`;
        ctx.lineWidth = 1 * dpr;

        // Equator
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.1) {
          const proj = project(Math.cos(a), 0, Math.sin(a));
          if (a === 0) ctx.moveTo(proj.sx, proj.sy);
          else ctx.lineTo(proj.sx, proj.sy);
        }
        ctx.closePath();
        ctx.stroke();

        // Latitude 30deg N & S
        [-0.5, 0.5].forEach((latOffset) => {
          const ringRad = Math.sqrt(1 - latOffset * latOffset);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * structureFade})`;
          ctx.beginPath();
          for (let a = 0; a <= Math.PI * 2; a += 0.15) {
            const proj = project(Math.cos(a) * ringRad, latOffset, Math.sin(a) * ringRad);
            if (a === 0) ctx.moveTo(proj.sx, proj.sy);
            else ctx.lineTo(proj.sx, proj.sy);
          }
          ctx.closePath();
          ctx.stroke();
        });
      }

      // 3. Render Particles (Continents vs Oceans)
      const shockProgress = shockwave.current.progress;
      const isShock = shockwave.current.active;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Position interpolation: from outer space startX,Y,Z to globe origX,Y,Z
        let curX, curY, curZ;
        let pAlpha = 1;
        if (gTime >= 2.5) {
          curX = p.origX;
          curY = p.origY;
          curZ = p.origZ;
        } else {
          const localT = Math.max(0, Math.min(1, (gTime - p.delay) / 1.5));
          const ease = 1 - Math.pow(1 - localT, 3.2);
          curX = p.startX + (p.origX - p.startX) * ease;
          curY = p.startY + (p.origY - p.startY) * ease;
          curZ = p.startZ + (p.origZ - p.startZ) * ease;
          if (stage === 'opening') {
            pAlpha = Math.min(1, localT * 2.8);
          }
        }

        // Magnetic Hover deflection if cursor is close
        if (stage === 'opening' && mousePos.current.isHovering && gTime >= 1.6) {
          const dx = mousePos.current.x * dpr - cx;
          const dy = mousePos.current.y * dpr - cy;
          const mouseDist = Math.sqrt(dx * dx + dy * dy);
          if (mouseDist < baseRadius * 1.2) {
            curX += (Math.sin(time * 2 + i) * 0.008);
            curY += (Math.cos(time * 2 + i) * 0.008);
          }
        }

        let radiusMultiplier = 1;
        if (isShock) {
          radiusMultiplier = 1 + Math.sin(shockProgress * Math.PI) * 0.35;
        }

        const proj = project(curX, curY, curZ, radiusMultiplier);

        if (proj.visible) {
          const depthAlpha = Math.max(0.06, (proj.sz + 0.2) / 1.2);
          const twinkle = 0.85 + Math.sin(time * 2 + p.twinkleOffset) * 0.15;
          const dotSize = Math.max(0.8, p.baseSize * (1 + proj.sz * 0.45) * dpr);

          if (p.isLand) {
            // CONTINENTS: Crisp glowing white & bright silver
            const finalAlpha = Math.min(1, depthAlpha * twinkle * (stage === 'opening' ? 1.0 : 0.65) * pAlpha);
            ctx.fillStyle = proj.sz > 0.3
              ? `rgba(255, 255, 255, ${finalAlpha})`
              : `rgba(225, 230, 245, ${finalAlpha * 0.85})`;
          } else {
            // OCEANS: Faint subtle blue-grey matrix
            const finalAlpha = Math.min(0.35, depthAlpha * twinkle * 0.3 * pAlpha);
            ctx.fillStyle = `rgba(100, 140, 200, ${finalAlpha})`;
          }

          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Project and Draw Connecting Defense Arcs
      if (structureFade > 0.1) {
        const projectedHubs = hubPoints.map((h) => ({
          ...h,
          proj: project(h.x, h.y, h.z)
        }));

        ARCS.forEach((arc, arcIdx) => {
          const n1 = projectedHubs[arc.from];
          const n2 = projectedHubs[arc.to];

          if (n1.proj.visible || n2.proj.visible) {
            const midX = (n1.x + n2.x) * 0.5;
            const midY = (n1.y + n2.y) * 0.5;
            const midZ = (n1.z + n2.z) * 0.5;
            const midLen = Math.sqrt(midX * midX + midY * midY + midZ * midZ) || 1;
            const elevation = 1.34;
            const peak = {
              x: (midX / midLen) * elevation,
              y: (midY / midLen) * elevation,
              z: (midZ / midLen) * elevation
            };
            const peakProj = project(peak.x, peak.y, peak.z);

            // Arc line
            ctx.beginPath();
            ctx.moveTo(n1.proj.sx, n1.proj.sy);
            ctx.quadraticCurveTo(peakProj.sx, peakProj.sy, n2.proj.sx, n2.proj.sy);

            const arcAlpha = Math.max(0.08, (n1.proj.sz + n2.proj.sz + 1) * 0.22) * structureFade;
            ctx.strokeStyle = `rgba(255, 255, 255, ${arcAlpha * (stage === 'opening' ? 0.65 : 0.25)})`;
            ctx.lineWidth = 1.2 * dpr;
            ctx.stroke();

            // Traveling Pulse Beacon
            const t = (time * 0.5 + arcIdx * 0.25) % 1;
            const pulseX = (1 - t) * (1 - t) * n1.proj.sx + 2 * (1 - t) * t * peakProj.sx + t * t * n2.proj.sx;
            const pulseY = (1 - t) * (1 - t) * n1.proj.sy + 2 * (1 - t) * t * peakProj.sy + t * t * n2.proj.sy;

            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 8 * dpr;
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 2.2 * dpr, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });

        // 5. Draw Hub Nodes and Pulsing Telemetry Beacons
        projectedHubs.forEach((hub) => {
          if (hub.proj.visible && hub.proj.sz > -0.15) {
            const sz = (3.5 + hub.proj.sz * 2.5) * dpr;
            const pulseRad = sz + Math.sin(time * 3 + hub.lon) * 4.5 * dpr;

            // Pulse ring
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 * structureFade})`;
            ctx.lineWidth = 1 * dpr;
            ctx.beginPath();
            ctx.arc(hub.proj.sx, hub.proj.sy, Math.max(sz, pulseRad), 0, Math.PI * 2);
            ctx.stroke();

            // Core node
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10 * dpr;
            ctx.beginPath();
            ctx.arc(hub.proj.sx, hub.proj.sy, sz, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Inner white pinhead
            ctx.fillStyle = '#0c0c0c';
            ctx.beginPath();
            ctx.arc(hub.proj.sx, hub.proj.sy, sz * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    // Mouse & Touch Drag & Click Listeners
    let dragStartX = 0;
    let dragStartY = 0;
    let totalMoved = 0;

    const handleMouseDown = (e) => {
      rotation.current.isDragging = true;
      rotation.current.lastX = e.clientX;
      rotation.current.lastY = e.clientY;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      totalMoved = 0;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isHovering: true
      };

      if (!rotation.current.isDragging) return;
      const dx = e.clientX - rotation.current.lastX;
      const dy = e.clientY - rotation.current.lastY;
      totalMoved += Math.abs(dx) + Math.abs(dy);
      rotation.current.rotY += dx * 0.006;
      rotation.current.rotX = Math.max(-0.8, Math.min(0.8, rotation.current.rotX + dy * 0.006));
      rotation.current.lastX = e.clientX;
      rotation.current.lastY = e.clientY;
    };

    const handleMouseUp = () => {
      rotation.current.isDragging = false;
      if (totalMoved < 8 && stage === 'opening' && onEarthClick) {
        onEarthClick();
      }
    };

    const handleMouseLeave = () => {
      rotation.current.isDragging = false;
      mousePos.current.isHovering = false;
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        rotation.current.isDragging = true;
        rotation.current.lastX = e.touches[0].clientX;
        rotation.current.lastY = e.touches[0].clientY;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        totalMoved = 0;
      }
    };

    const handleTouchMove = (e) => {
      if (!rotation.current.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - rotation.current.lastX;
      const dy = e.touches[0].clientY - rotation.current.lastY;
      totalMoved += Math.abs(dx) + Math.abs(dy);
      rotation.current.rotY += dx * 0.007;
      rotation.current.rotX = Math.max(-0.8, Math.min(0.8, rotation.current.rotX + dy * 0.007));
      rotation.current.lastX = e.touches[0].clientX;
      rotation.current.lastY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      rotation.current.isDragging = false;
      if (totalMoved < 10 && stage === 'opening' && onEarthClick) {
        onEarthClick();
      }
    };

    const dom = canvas;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('mouseleave', handleMouseLeave);
    dom.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('mouseleave', handleMouseLeave);
      dom.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [stage, isTransitioning]);

  return (
    <div
      ref={containerRef}
      onClick={stage === 'opening' && onEarthClick ? onEarthClick : undefined}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: stage === 'opening' ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
    </div>
  );
}
