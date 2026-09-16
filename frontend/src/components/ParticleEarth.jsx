import { useEffect, useRef, useState } from 'react';

// Continent approximate centroid anchors to form recognizable landmass particle clusters
const CONTINENT_ANCHORS = [
  // North America
  { lat: 40, lon: -100, spread: 28, count: 50 },
  { lat: 55, lon: -115, spread: 24, count: 35 },
  { lat: 28, lon: -82, spread: 18, count: 30 },
  // South America
  { lat: -15, lon: -55, spread: 22, count: 45 },
  { lat: -32, lon: -65, spread: 16, count: 25 },
  // Europe
  { lat: 50, lon: 15, spread: 20, count: 55 },
  { lat: 60, lon: 25, spread: 18, count: 30 },
  // Africa
  { lat: 5, lon: 20, spread: 26, count: 55 },
  { lat: -25, lon: 25, spread: 18, count: 30 },
  // Asia
  { lat: 35, lon: 85, spread: 32, count: 70 },
  { lat: 55, lon: 75, spread: 28, count: 50 },
  { lat: 22, lon: 110, spread: 24, count: 45 },
  { lat: 15, lon: 100, spread: 18, count: 35 },
  // Australia & Oceania
  { lat: -25, lon: 135, spread: 20, count: 40 },
  { lat: -40, lon: 175, spread: 12, count: 20 }
];

// Major Cloud Hub Data Centers
const CLOUD_HUBS = [
  { name: 'AWS us-east-1', lat: 38.0, lon: -77.5, color: '#e4007c' },
  { name: 'AWS us-west-2', lat: 45.5, lon: -122.6, color: '#e4007c' },
  { name: 'Azure Frankfurt', lat: 50.1, lon: 8.6, color: '#7c5bff' },
  { name: 'Azure Amsterdam', lat: 52.3, lon: 4.9, color: '#7c5bff' },
  { name: 'GCP Tokyo', lat: 35.6, lon: 139.6, color: '#06b6d4' },
  { name: 'GCP Singapore', lat: 1.3, lon: 103.8, color: '#06b6d4' },
  { name: 'AWS Sydney', lat: -33.8, lon: 151.2, color: '#e4007c' },
  { name: 'Azure São Paulo', lat: -23.5, lon: -46.6, color: '#7c5bff' },
  { name: 'GCP Mumbai', lat: 19.0, lon: 72.8, color: '#06b6d4' },
  { name: 'Azure Dubai', lat: 25.2, lon: 55.2, color: '#7c5bff' }
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
  isTransitioning = false
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  const rotation = useRef({
    rotX: 0.24,
    rotY: 0.5,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    autoSpeed: stage === 'opening' ? 0.007 : 0.003
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
    // Generate 3D Earth Particle System
    // ==========================================
    const particles = [];

    // 1. Fibonacci Sphere Surface Grid (~700 points)
    const totalGrid = 720;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < totalGrid; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / totalGrid);
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);

      particles.push({
        origX: x,
        origY: y,
        origZ: z,
        x, y, z,
        vx: 0, vy: 0, vz: 0,
        baseSize: Math.random() * 1.5 + 1.2,
        type: 'grid',
        colorType: Math.random() > 0.35 ? 'magenta' : 'ice',
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }

    // 2. Continent Landmass Dense Clusters (~500 points)
    CONTINENT_ANCHORS.forEach((c) => {
      for (let i = 0; i < c.count; i++) {
        // Gaussian spread around anchor lat/lon
        const latOffset = (Math.random() - 0.5) * c.spread;
        const lonOffset = (Math.random() - 0.5) * c.spread;
        const latRad = ((c.lat + latOffset) * Math.PI) / 180;
        const lonRad = ((c.lon + lonOffset) * Math.PI) / 180;

        const x = Math.cos(latRad) * Math.sin(lonRad);
        const y = -Math.sin(latRad);
        const z = Math.cos(latRad) * Math.cos(lonRad);

        particles.push({
          origX: x,
          origY: y,
          origZ: z,
          x, y, z,
          vx: 0, vy: 0, vz: 0,
          baseSize: Math.random() * 1.8 + 1.5,
          type: 'continent',
          colorType: Math.random() > 0.3 ? 'magenta' : 'violet',
          twinkleOffset: Math.random() * Math.PI * 2
        });
      }
    });

    // 3. Outer Atmospheric Halo Cloud (~200 points)
    for (let i = 0; i < 180; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.08 + Math.random() * 0.15; // slightly above surface
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      particles.push({
        origX: x,
        origY: y,
        origZ: z,
        x, y, z,
        vx: 0, vy: 0, vz: 0,
        baseSize: Math.random() * 1.2 + 0.8,
        type: 'halo',
        colorType: 'violet',
        twinkleOffset: Math.random() * Math.PI * 2
      });
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
        baseRadius = Math.min(width, height) * 0.36;
      } else {
        // In background mode, large atmospheric ambient scale
        baseRadius = Math.min(width, height) * 0.44;
      }

      // Atmospheric Backlight Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.6, cx, cy, baseRadius * 1.38);
      if (stage === 'opening') {
        glowGrad.addColorStop(0, 'rgba(228, 0, 124, 0.22)');
        glowGrad.addColorStop(0.4, 'rgba(124, 91, 255, 0.12)');
        glowGrad.addColorStop(0.85, 'rgba(6, 182, 212, 0.04)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        glowGrad.addColorStop(0, 'rgba(228, 0, 124, 0.12)');
        glowGrad.addColorStop(0.5, 'rgba(124, 91, 255, 0.06)');
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 1.38, 0, Math.PI * 2);
      ctx.fill();

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
          visible: z2 > -0.3
        };
      };

      // 1. Draw Equator & Latitude Rings in subtle neon lines
      ctx.strokeStyle = stage === 'opening' ? 'rgba(228, 0, 124, 0.25)' : 'rgba(228, 0, 124, 0.12)';
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
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.15) {
          const proj = project(Math.cos(a) * ringRad, latOffset, Math.sin(a) * ringRad);
          if (a === 0) ctx.moveTo(proj.sx, proj.sy);
          else ctx.lineTo(proj.sx, proj.sy);
        }
        ctx.closePath();
        ctx.stroke();
      });

      // 2. Render All Particles
      const shockProgress = shockwave.current.progress;
      const isShock = shockwave.current.active;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Magnetic Hover deflection if cursor is close (opening stage only)
        if (stage === 'opening' && mousePos.current.isHovering) {
          const dx = mousePos.current.x * dpr - cx;
          const dy = mousePos.current.y * dpr - cy;
          const mouseDist = Math.sqrt(dx * dx + dy * dy);
          if (mouseDist < baseRadius * 1.2) {
            p.x += (Math.sin(time * 2 + i) * 0.008);
            p.y += (Math.cos(time * 2 + i) * 0.008);
          }
        }

        // Shockwave expansion calculation
        let radiusMultiplier = 1;
        if (isShock) {
          radiusMultiplier = 1 + Math.sin(shockProgress * Math.PI) * 0.35;
        }

        const proj = project(p.origX, p.origY, p.origZ, radiusMultiplier);

        if (proj.visible) {
          const depthAlpha = Math.max(0.06, (proj.sz + 0.3) / 1.3);
          const twinkle = 0.8 + Math.sin(time * 2 + p.twinkleOffset) * 0.2;
          const finalAlpha = Math.min(1, depthAlpha * twinkle * (stage === 'opening' ? 1.0 : 0.45));

          const dotSize = Math.max(0.8, p.baseSize * (1 + proj.sz * 0.5) * dpr);

          if (p.colorType === 'magenta') {
            ctx.fillStyle = `rgba(228, 0, 124, ${finalAlpha})`;
          } else if (p.colorType === 'violet') {
            ctx.fillStyle = `rgba(124, 91, 255, ${finalAlpha})`;
          } else {
            ctx.fillStyle = `rgba(240, 240, 248, ${finalAlpha * 0.9})`;
          }

          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Project and Draw Connecting Defense Arcs
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
          const elevation = 1.36;
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

          const arcAlpha = Math.max(0.08, (n1.proj.sz + n2.proj.sz + 1) * 0.22);
          ctx.strokeStyle = `rgba(228, 0, 124, ${arcAlpha * (stage === 'opening' ? 0.6 : 0.25)})`;
          ctx.lineWidth = 1.2 * dpr;
          ctx.stroke();

          // Traveling Pulse Beacon
          const t = (time * 0.5 + arcIdx * 0.25) % 1;
          const pulseX = (1 - t) * (1 - t) * n1.proj.sx + 2 * (1 - t) * t * peakProj.sx + t * t * n2.proj.sx;
          const pulseY = (1 - t) * (1 - t) * n1.proj.sy + 2 * (1 - t) * t * peakProj.sy + t * t * n2.proj.sy;

          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#e4007c';
          ctx.shadowBlur = 8 * dpr;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2.2 * dpr, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 4. Draw Hub Nodes and Pulsing Telemetry Beacons
      projectedHubs.forEach((hub) => {
        if (hub.proj.visible && hub.proj.sz > -0.15) {
          const sz = (3.5 + hub.proj.sz * 2.5) * dpr;
          const pulseRad = sz + Math.sin(time * 3 + hub.lon) * 4.5 * dpr;

          // Pulse ring
          ctx.strokeStyle = 'rgba(228, 0, 124, 0.7)';
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.arc(hub.proj.sx, hub.proj.sy, Math.max(sz, pulseRad), 0, Math.PI * 2);
          ctx.stroke();

          // Core node
          ctx.fillStyle = hub.color;
          ctx.shadowColor = hub.color;
          ctx.shadowBlur = 10 * dpr;
          ctx.beginPath();
          ctx.arc(hub.proj.sx, hub.proj.sy, sz, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Inner white pinhead
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(hub.proj.sx, hub.proj.sy, sz * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
      });

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
      // If user clicked rather than dragged, trigger onEarthClick
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
