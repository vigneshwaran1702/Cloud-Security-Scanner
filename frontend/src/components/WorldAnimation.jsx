import { useEffect, useRef, useState } from 'react';
import { Shield, Sparkles, Activity, Globe, Lock, Zap } from 'lucide-react';

export default function WorldAnimation({ className = '', onRegionClick = null }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameId = useRef(null);

  // Interaction & Rotation State
  const rotationRef = useRef({ rotX: 0.28, rotY: 0.8, isDragging: false, lastX: 0, lastY: 0, autoRotateSpeed: 0.005 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [activeTelemetry, setActiveTelemetry] = useState({
    activePings: 42,
    threatsBlocked: 183,
    latencyMs: 16
  });

  // Global Multi-Cloud Regions (Lat, Lon in degrees)
  const cloudNodes = [
    { id: 'aws-us-east', name: 'AWS us-east-1 (N. Virginia)', lat: 38.0, lon: -77.5, provider: 'AWS', status: 'Optimal', pings: '4ms' },
    { id: 'aws-us-west', name: 'AWS us-west-2 (Oregon)', lat: 45.5, lon: -122.6, provider: 'AWS', status: 'Protected', pings: '12ms' },
    { id: 'azure-eu-west', name: 'Azure westeurope (Amsterdam)', lat: 52.3, lon: 4.9, provider: 'AZURE', status: 'Optimal', pings: '18ms' },
    { id: 'gcp-eu-central', name: 'GCP europe-west3 (Frankfurt)', lat: 50.1, lon: 8.6, provider: 'GCP', status: 'Protected', pings: '19ms' },
    { id: 'gcp-asia-se', name: 'GCP asia-southeast1 (Singapore)', lat: 1.3, lon: 103.8, provider: 'GCP', status: 'Optimal', pings: '32ms' },
    { id: 'aws-ap-east', name: 'AWS ap-northeast-1 (Tokyo)', lat: 35.6, lon: 139.6, provider: 'AWS', status: 'Protected', pings: '41ms' },
    { id: 'azure-latam', name: 'Azure brazilsouth (São Paulo)', lat: -23.5, lon: -46.6, provider: 'AZURE', status: 'Monitored', pings: '65ms' },
    { id: 'aws-aus', name: 'AWS ap-southeast-2 (Sydney)', lat: -33.8, lon: 151.2, provider: 'AWS', status: 'Optimal', pings: '82ms' },
    { id: 'gcp-india', name: 'GCP asia-south1 (Mumbai)', lat: 19.0, lon: 72.8, provider: 'GCP', status: 'Protected', pings: '28ms' },
    { id: 'azure-me', name: 'Azure uaenorth (Dubai)', lat: 25.2, lon: 55.2, provider: 'AZURE', status: 'Optimal', pings: '24ms' }
  ];

  // Intercept arcs between regions
  const arcConnections = [
    { from: 0, to: 2 }, // Virginia -> Amsterdam
    { from: 2, to: 9 }, // Amsterdam -> Dubai
    { from: 9, to: 8 }, // Dubai -> Mumbai
    { from: 8, to: 4 }, // Mumbai -> Singapore
    { from: 4, to: 5 }, // Singapore -> Tokyo
    { from: 5, to: 1 }, // Tokyo -> Oregon
    { from: 1, to: 0 }, // Oregon -> Virginia
    { from: 0, to: 6 }, // Virginia -> Brazil
    { from: 4, to: 7 }, // Singapore -> Sydney
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 540);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 540);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = (canvas.offsetWidth || 500) * (window.devicePixelRatio || 1);
      height = canvas.height = (canvas.offsetHeight || 500) * (window.devicePixelRatio || 1);
    };

    window.addEventListener('resize', handleResize);

    // Pre-calculate sphere dots (Fibonacci sphere algorithm)
    const totalPoints = 480;
    const spherePoints = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    for (let i = 0; i < totalPoints; i++) {
      const y = 1 - (i / (totalPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      spherePoints.push({ x, y, z });
    }

    // Convert lat/lon to 3D cartesian coordinates on unit sphere
    const nodeCoords = cloudNodes.map((n) => {
      const latRad = (n.lat * Math.PI) / 180;
      const lonRad = (n.lon * Math.PI) / 180;
      return {
        x: Math.cos(latRad) * Math.sin(lonRad),
        y: -Math.sin(latRad),
        z: Math.cos(latRad) * Math.cos(lonRad),
        ...n
      };
    });

    let pulseTime = 0;

    // Projection & Render Loop
    const render = () => {
      pulseTime += 0.035;
      const rot = rotationRef.current;
      if (!rot.isDragging) {
        rot.rotY += rot.autoRotateSpeed;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const globeRadius = Math.min(width, height) * 0.38;

      // Outer Atmospheric Glow
      const glowGrad = ctx.createRadialGradient(cx, cy, globeRadius * 0.7, cx, cy, globeRadius * 1.35);
      glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      glowGrad.addColorStop(0.5, 'rgba(124, 91, 255, 0.07)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Rotation matrix values
      const cosY = Math.cos(rot.rotY);
      const sinY = Math.sin(rot.rotY);
      const cosX = Math.cos(rot.rotX);
      const sinX = Math.sin(rot.rotX);

      // Function to rotate and project a 3D unit point
      const project = (p) => {
        // Rotate around Y
        const x1 = p.x * cosY + p.z * sinY;
        const y1 = p.y;
        const z1 = -p.x * sinY + p.z * cosY;

        // Rotate around X (tilt)
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        return {
          px: cx + x2 * globeRadius,
          py: cy + y2 * globeRadius,
          z: z2,
          visible: z2 > -0.2
        };
      };

      // 1. Draw Globe Sphere Outline / Latitude Wireframe
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.lineWidth = 1 * (window.devicePixelRatio || 1);
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Equator Ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2; a += 0.1) {
        const p = project({ x: Math.cos(a), y: 0, z: Math.sin(a) });
        if (a === 0) ctx.moveTo(p.px, p.py);
        else ctx.lineTo(p.px, p.py);
      }
      ctx.closePath();
      ctx.stroke();

      // 2. Draw Sphere Dots (Fibonacci Matrix)
      for (let i = 0; i < spherePoints.length; i++) {
        const pt = spherePoints[i];
        const proj = project(pt);

        if (proj.visible) {
          // Front hemisphere is bright, back is faint
          const depthAlpha = Math.max(0.08, (proj.z + 0.2) / 1.2);
          const dotSize = Math.max(1, (1.8 + proj.z * 1.2) * (window.devicePixelRatio || 1));

          ctx.fillStyle = proj.z > 0.4
            ? `rgba(240, 240, 248, ${depthAlpha * 0.85})`
            : `rgba(255, 255, 255, ${depthAlpha * 0.45})`;

          ctx.beginPath();
          ctx.arc(proj.px, proj.py, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Draw Connecting Telemetry Arcs
      const projectedNodes = nodeCoords.map((n) => ({
        ...n,
        proj: project(n)
      }));

      arcConnections.forEach((arc, arcIdx) => {
        const n1 = projectedNodes[arc.from];
        const n2 = projectedNodes[arc.to];

        if (n1.proj.visible || n2.proj.visible) {
          // Midpoint elevated off surface to form 3D arch
          const midX = (n1.x + n2.x) * 0.5;
          const midY = (n1.y + n2.y) * 0.5;
          const midZ = (n1.z + n2.z) * 0.5;
          const midLen = Math.sqrt(midX * midX + midY * midY + midZ * midZ) || 1;
          const elevation = 1.32; // Arch height multiplier
          const archPeak = {
            x: (midX / midLen) * elevation,
            y: (midY / midLen) * elevation,
            z: (midZ / midLen) * elevation
          };
          const peakProj = project(archPeak);

          // Arc path
          ctx.beginPath();
          ctx.moveTo(n1.proj.px, n1.proj.py);
          ctx.quadraticCurveTo(peakProj.px, peakProj.py, n2.proj.px, n2.proj.py);

          const arcAlpha = Math.max(0.12, (n1.proj.z + n2.proj.z + 1) * 0.25);
          ctx.strokeStyle = `rgba(255, 255, 255, ${arcAlpha * 0.35})`;
          ctx.lineWidth = 1.2 * (window.devicePixelRatio || 1);
          ctx.stroke();

          // Traveling Telemetry Pulse Dot
          const t = (pulseTime * 0.6 + arcIdx * 0.22) % 1;
          const pulseX = (1 - t) * (1 - t) * n1.proj.px + 2 * (1 - t) * t * peakProj.px + t * t * n2.proj.px;
          const pulseY = (1 - t) * (1 - t) * n1.proj.py + 2 * (1 - t) * t * peakProj.py + t * t * n2.proj.py;

          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2.5 * (window.devicePixelRatio || 1), 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // Reset
        }
      });

      // 4. Draw Active Cloud Nodes
      projectedNodes.forEach((node) => {
        if (node.proj.visible && node.proj.z > -0.1) {
          const size = (3.5 + node.proj.z * 2.5) * (window.devicePixelRatio || 1);
          const pulseRadius = size + Math.sin(pulseTime * 3 + node.lon) * 4 * (window.devicePixelRatio || 1);

          // Outer Pulse Ring
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1 * (window.devicePixelRatio || 1);
          ctx.beginPath();
          ctx.arc(node.proj.px, node.proj.py, Math.max(size, pulseRadius), 0, Math.PI * 2);
          ctx.stroke();

          // Solid Core Node
          ctx.fillStyle = node.provider === 'AWS' ? '#ffffff' : node.provider === 'AZURE' ? '#7c5bff' : '#06b6d4';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(node.proj.px, node.proj.py, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          // Inner white highlight
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(node.proj.px, node.proj.py, size * 0.45, 0, Math.PI * 2);
          ctx.fill();

          // Node Label for prominent front nodes
          if (node.proj.z > 0.4) {
            ctx.font = `${Math.round(9 * (window.devicePixelRatio || 1))}px JetBrains Mono, monospace`;
            ctx.fillStyle = 'rgba(240, 240, 248, 0.9)';
            ctx.fillText(node.provider, node.proj.px + size + 4, node.proj.py + 3);
          }
        }
      });

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    // Mouse & Touch Drag Listeners
    const handleMouseDown = (e) => {
      const rot = rotationRef.current;
      rot.isDragging = true;
      rot.lastX = e.clientX;
      rot.lastY = e.clientY;
    };

    const handleMouseMove = (e) => {
      const rot = rotationRef.current;
      if (!rot.isDragging) return;
      const dx = e.clientX - rot.lastX;
      const dy = e.clientY - rot.lastY;
      rot.rotY += dx * 0.006;
      rot.rotX = Math.max(-0.8, Math.min(0.8, rot.rotX + dy * 0.006));
      rot.lastX = e.clientX;
      rot.lastY = e.clientY;
    };

    const handleMouseUp = () => {
      rotationRef.current.isDragging = false;
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        const rot = rotationRef.current;
        rot.isDragging = true;
        rot.lastX = e.touches[0].clientX;
        rot.lastY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      const rot = rotationRef.current;
      if (!rot.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - rot.lastX;
      const dy = e.touches[0].clientY - rot.lastY;
      rot.rotY += dx * 0.008;
      rot.rotX = Math.max(-0.8, Math.min(0.8, rot.rotX + dy * 0.008));
      rot.lastX = e.touches[0].clientX;
      rot.lastY = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      rotationRef.current.isDragging = false;
    };

    const domCanvas = canvas;
    domCanvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domCanvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      domCanvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domCanvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`world-animation-wrapper ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        aspectRatio: '1 / 1',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          display: 'block'
        }}
      />

      {/* Floating Telemetry HUD Badges */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        background: 'rgba(23, 23, 23, 0.85)',
        border: '1px solid var(--border-color)',
        backdropFilter: 'blur(12px)',
        padding: '8px 14px',
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.74rem',
        fontFamily: 'JetBrains Mono, monospace',
        color: 'var(--text-main)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
        <span>10 REGIONS ACTIVE</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span style={{ color: 'var(--primary)' }}>{activeTelemetry.latencyMs}ms</span>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        background: 'rgba(23, 23, 23, 0.85)',
        border: '1px solid var(--border-color)',
        backdropFilter: 'blur(12px)',
        padding: '8px 14px',
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.74rem',
        fontFamily: 'JetBrains Mono, monospace',
        color: 'var(--text-main)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
      }}>
        <Shield size={13} color="var(--primary)" />
        <span>MULTI-CLOUD CSPM TELEMETRY</span>
      </div>

      {/* Subtle Drag Hint */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        fontSize: '0.68rem',
        fontFamily: 'JetBrains Mono, monospace',
        color: 'var(--text-muted)',
        pointerEvents: 'none',
        opacity: 0.6
      }}>
        drag to rotate ⤾
      </div>
    </div>
  );
}
