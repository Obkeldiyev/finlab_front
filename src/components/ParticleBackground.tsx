import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      // More particles for better visibility
      const particleCount = Math.floor((canvas.width * canvas.height) / 8000); // Increased density
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.2, // Faster movement
          vy: (Math.random() - 0.5) * 1.2, // Faster movement
          radius: Math.random() * 2.5 + 1, // Larger particles
          opacity: Math.random() * 0.6 + 0.3, // Higher opacity for visibility
          pulseSpeed: Math.random() * 0.03 + 0.015, // Faster pulsing
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawParticles = () => {
      timeRef.current += 0.016; // ~60fps
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const connectionDistance = 140; // Increased connection distance
      const mouseInfluenceRadius = 180; // Increased mouse influence

      // Draw connections and particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        // Mouse influence - more responsive
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInfluenceRadius && distance > 0) {
          const force = (mouseInfluenceRadius - distance) / mouseInfluenceRadius;
          particle.vx -= (dx / distance) * force * 0.02; // Stronger force
          particle.vy -= (dy / distance) * force * 0.02;
        }

        // Gentle random movement
        particle.vx += (Math.random() - 0.5) * 0.01;
        particle.vy += (Math.random() - 0.5) * 0.01;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary check with gentle bounce
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.6;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.6;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Friction for controlled movement
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Maintain minimal velocity
        if (Math.abs(particle.vx) < 0.1) particle.vx += (Math.random() - 0.5) * 0.2;
        if (Math.abs(particle.vy) < 0.1) particle.vy += (Math.random() - 0.5) * 0.2;

        // Maximum velocity limit
        const maxVel = 1.2;
        if (Math.abs(particle.vx) > maxVel) particle.vx = Math.sign(particle.vx) * maxVel;
        if (Math.abs(particle.vy) > maxVel) particle.vy = Math.sign(particle.vy) * maxVel;

        // Enhanced pulsing effect
        const pulseOpacity = particle.opacity + Math.sin(timeRef.current * particle.pulseSpeed + particle.pulsePhase) * 0.15;
        const pulseRadius = particle.radius + Math.sin(timeRef.current * particle.pulseSpeed * 2 + particle.pulsePhase) * 0.3;

        // Draw particle with medium-dark blue color
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, Math.max(0.8, pulseRadius), 0, Math.PI * 2);
        // Medium-dark blue: rgb(59, 130, 246) - darker than light blue
        ctx.fillStyle = `rgba(59, 130, 246, ${Math.max(0.2, Math.min(0.8, pulseOpacity))})`;
        ctx.fill();

        // Enhanced glow effect
        if (particle.radius > 1.5) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, pulseRadius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${Math.max(0.1, pulseOpacity * 0.3)})`;
          ctx.fill();
        }

        // Draw enhanced connections
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const connDx = particle.x - other.x;
          const connDy = particle.y - other.y;
          const connDistance = Math.sqrt(connDx * connDx + connDy * connDy);

          if (connDistance < connectionDistance) {
            const opacity = (1 - connDistance / connectionDistance) * 0.4; // Higher opacity
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            // Medium-dark blue connections: rgb(59, 130, 246)
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 1.2; // Thicker lines
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(drawParticles);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      resizeCanvas();
      createParticles();
    };

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
}

