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

interface AdaptiveParticleBackgroundProps {
  color?: 'blue' | 'white';
  className?: string;
}

export function AdaptiveParticleBackground({ color = 'blue', className = '' }: AdaptiveParticleBackgroundProps) {
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
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const createParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.3,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawParticles = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const connectionDistance = 120;
      const mouseInfluenceRadius = 150;

      // Determine particle color based on background
      const particleColor = color === 'blue' 
        ? 'rgba(255, 255, 255, ' // White particles on blue background
        : 'rgba(59, 130, 246, '; // Blue particles on white background

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        // Mouse influence
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseInfluenceRadius && distance > 0) {
          const force = (mouseInfluenceRadius - distance) / mouseInfluenceRadius;
          particle.vx -= (dx / distance) * force * 0.015;
          particle.vy -= (dy / distance) * force * 0.015;
        }

        // Gentle random movement
        particle.vx += (Math.random() - 0.5) * 0.008;
        particle.vy += (Math.random() - 0.5) * 0.008;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -0.6;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -0.6;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Maintain minimal velocity
        if (Math.abs(particle.vx) < 0.1) particle.vx += (Math.random() - 0.5) * 0.15;
        if (Math.abs(particle.vy) < 0.1) particle.vy += (Math.random() - 0.5) * 0.15;

        // Pulsing effect
        const pulseOpacity = particle.opacity + Math.sin(timeRef.current * particle.pulseSpeed + particle.pulsePhase) * 0.12;
        const pulseRadius = particle.radius + Math.sin(timeRef.current * particle.pulseSpeed * 2 + particle.pulsePhase) * 0.25;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, Math.max(0.8, pulseRadius), 0, Math.PI * 2);
        ctx.fillStyle = particleColor + Math.max(0.2, Math.min(0.7, pulseOpacity)) + ')';
        ctx.fill();

        // Glow effect
        if (particle.radius > 1.5) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, pulseRadius * 2, 0, Math.PI * 2);
          ctx.fillStyle = particleColor + Math.max(0.1, pulseOpacity * 0.25) + ')';
          ctx.fill();
        }

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const connDx = particle.x - other.x;
          const connDy = particle.y - other.y;
          const connDistance = Math.sqrt(connDx * connDx + connDy * connDy);

          if (connDistance < connectionDistance) {
            const opacity = (1 - connDistance / connectionDistance) * 0.35;
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = particleColor + opacity + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(drawParticles);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      };
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
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ 
        width: '100%', 
        height: '100%',
        zIndex: 1
      }}
    />
  );
}
