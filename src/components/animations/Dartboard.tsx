import React, { useState, useRef } from 'react';

interface DartboardProps {
  numTeams: number;
  onThrowComplete: (teamIndex: number) => void;
  isThrowing: boolean;
  setIsThrowing: (throwing: boolean) => void;
  currentPlayer?: string;
}

const Dartboard = ({ numTeams, onThrowComplete, isThrowing, setIsThrowing, currentPlayer }: DartboardProps) => {
  const [dartPosition, setDartPosition] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
  const [lastHit, setLastHit] = useState<number | null>(null);
  const boardRef = useRef<SVGSVGElement>(null);
  
  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 20;

  const teamColors = [
    'hsl(180, 100%, 45%)',
    'hsl(280, 100%, 55%)',
    'hsl(120, 100%, 40%)',
    'hsl(40, 100%, 50%)',
    'hsl(0, 100%, 55%)',
    'hsl(200, 100%, 50%)',
    'hsl(320, 100%, 55%)',
    'hsl(60, 100%, 45%)',
  ];

  const throwDart = () => {
    if (isThrowing) return;
    
    setIsThrowing(true);
    setDartPosition({ x: 0, y: 0, visible: false });
    setLastHit(null);

    // Simulate dart throw animation
    setTimeout(() => {
      // Random landing position
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radius * 0.9;
      const x = center + distance * Math.cos(angle);
      const y = center + distance * Math.sin(angle);
      
      setDartPosition({ x, y, visible: true });
      
      // Calculate which team wedge the dart landed in
      const normalizedAngle = (Math.atan2(y - center, x - center) + Math.PI * 2) % (Math.PI * 2);
      const segmentAngle = (Math.PI * 2) / numTeams;
      const teamIndex = Math.floor((normalizedAngle + segmentAngle / 2) % (Math.PI * 2) / segmentAngle);
      
      setLastHit(teamIndex);
      
      setTimeout(() => {
        setIsThrowing(false);
        onThrowComplete(teamIndex);
      }, 800);
    }, 500);
  };

  const renderWedges = () => {
    const segmentAngle = 360 / numTeams;
    
    return Array.from({ length: numTeams }).map((_, index) => {
      const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
      const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
      
      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);
      
      const largeArc = segmentAngle > 180 ? 1 : 0;
      const pathD = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      
      // Calculate label position
      const midAngle = (startAngle + endAngle) / 2;
      const labelRadius = radius * 0.7;
      const labelX = center + labelRadius * Math.cos(midAngle);
      const labelY = center + labelRadius * Math.sin(midAngle);

      return (
        <g key={index}>
          <path
            d={pathD}
            fill={teamColors[index % teamColors.length]}
            stroke="hsl(220, 30%, 10%)"
            strokeWidth="2"
            className={`transition-all duration-300 ${lastHit === index ? 'brightness-150' : ''}`}
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {index + 1}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {currentPlayer && (
        <div className="text-center opacity-0 animate-fade-in" style={{ animationFillMode: 'both' }}>
          <p className="text-muted-foreground">Throwing for:</p>
          <p className="text-2xl font-bold text-primary">{currentPlayer}</p>
        </div>
      )}

      <div className="relative cursor-pointer" onClick={throwDart}>
        <svg
          ref={boardRef}
          width={size}
          height={size}
          className="drop-shadow-2xl"
        >
          {/* Dartboard rings */}
          <circle
            cx={center}
            cy={center}
            r={radius + 10}
            fill="hsl(220, 30%, 8%)"
            stroke="hsl(180, 100%, 50%)"
            strokeWidth="4"
            style={{ filter: 'drop-shadow(0 0 15px hsl(180, 100%, 50%))' }}
          />
          
          {/* Team wedges */}
          {renderWedges()}
          
          {/* Center rings */}
          <circle cx={center} cy={center} r={20} fill="hsl(0, 100%, 50%)" stroke="hsl(220, 30%, 10%)" strokeWidth="2" />
          <circle cx={center} cy={center} r={8} fill="hsl(0, 100%, 30%)" stroke="hsl(220, 30%, 10%)" strokeWidth="1" />

          {/* Dart */}
          {dartPosition.visible && (
            <g className="animate-scale-in" style={{ transformOrigin: `${dartPosition.x}px ${dartPosition.y}px` }}>
              {/* Dart shadow */}
              <ellipse
                cx={dartPosition.x + 5}
                cy={dartPosition.y + 5}
                rx={8}
                ry={4}
                fill="rgba(0,0,0,0.3)"
              />
              {/* Dart body */}
              <circle
                cx={dartPosition.x}
                cy={dartPosition.y}
                r={6}
                fill="hsl(40, 100%, 50%)"
                stroke="hsl(20, 100%, 40%)"
                strokeWidth="2"
              />
              {/* Dart tip */}
              <circle
                cx={dartPosition.x}
                cy={dartPosition.y}
                r={3}
                fill="hsl(0, 0%, 90%)"
              />
            </g>
          )}
        </svg>

        {/* Throw animation effect */}
        {isThrowing && !dartPosition.visible && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
          </div>
        )}
      </div>

      <div className="text-center">
        {lastHit !== null ? (
          <p className="text-xl font-bold animate-fade-in" style={{ color: teamColors[lastHit % teamColors.length] }}>
            Team {lastHit + 1}!
          </p>
        ) : (
          <p className="text-muted-foreground">
            {isThrowing ? 'Throwing...' : 'Click to throw dart!'}
          </p>
        )}
      </div>

      {/* Team legend */}
      <div className="flex flex-wrap justify-center gap-3 max-w-sm">
        {Array.from({ length: numTeams }).map((_, i) => (
          <div 
            key={i} 
            className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${lastHit === i ? 'border-primary glow-primary' : 'border-border'}`}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: teamColors[i % teamColors.length] }}
            />
            <span className="text-sm text-foreground">Team {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dartboard;
