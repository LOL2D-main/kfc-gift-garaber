import { useEffect, useState } from "react";

const Confetti = () => {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    const colors = [
      "hsl(0, 85%, 45%)",    // KFC Red
      "hsl(45, 100%, 50%)",  // Gold
      "hsl(0, 0%, 100%)",    // White
      "hsl(0, 85%, 35%)",    // Dark Red
    ];

    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-sm animate-confetti"
          style={{
            left: `${particle.left}%`,
            bottom: "0",
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
