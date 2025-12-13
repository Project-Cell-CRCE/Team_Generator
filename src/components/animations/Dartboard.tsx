import React, { useState, useRef, useEffect } from 'react';
import { Target, Flame, Trophy } from 'lucide-react';

interface DartboardProps {
  numTeams: number;
  onThrowComplete: (teamIndex: number) => void;
  isThrowing: boolean;
  setIsThrowing: (throwing: boolean) => void;
  currentPlayer?: string;
}

const Dartboard = ({ numTeams, onThrowComplete, isThrowing, setIsThrowing, currentPlayer }: DartboardProps) => {
  const [dartPosition, setDartPosition] = useState<{ x: number; y: number; visible: boolean; trail: { x: number; y: number }[] }>({ x: 0, y: 0, visible: false, trail: [] });
  const [lastHit, setLastHit] = useState<number | null>(null);
  const [throwCount, setThrowCount] = useState(0);
  const [bullseyeCount, setBullseyeCount] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showImpact, setShowImpact] = useState(false);
  const boardRef = useRef<SVGSVGElement>(null);
  
  const size = 320;
  const center = size / 2;
  const radius = size / 2 - 25;

  const teamColors = [
    { main: 'hsl(180, 100%, 45%)', glow: 'hsl(180, 100%, 60%)' },
    { main: 'hsl(280, 100%, 55%)', glow: 'hsl(280, 100%, 70%)' },
    { main: 'hsl(120, 100%, 40%)', glow: 'hsl(120, 100%, 55%)' },
    { main: 'hsl(40, 100%, 50%)', glow: 'hsl(40, 100%, 65%)' },
    { main: 'hsl(0, 100%, 55%)', glow: 'hsl(0, 100%, 70%)' },
    { main: 'hsl(200, 100%, 50%)', glow: 'hsl(200, 100%, 65%)' },
    { main: 'hsl(320, 100%, 55%)', glow: 'hsl(320, 100%, 70%)' },
    { main: 'hsl(60, 100%, 45%)', glow: 'hsl(60, 100%, 60%)' },
  ];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!boardRef.current || isThrowing) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
  };

  const throwDart = () => {
    if (isThrowing) return;
    
    setIsThrowing(true);
    setDartPosition({ x: 0, y: 0, visible: false, trail: [] });
    setLastHit(null);
    setShowImpact(false);
    setThrowCount(prev => prev + 1);

    // Create dart trail animation
    const startX = cursorPos.x || center;
    const startY = size + 50;
    
    // Random landing position with slight influence from cursor position
    const targetAngle = Math.random() * 2 * Math.PI;
    const targetDistance = Math.random() * radius * 0.85;
    const finalX = center + targetDistance * Math.cos(targetAngle);
    const finalY = center + targetDistance * Math.sin(targetAngle);

    // Animate dart flying
    const frames = 20;
    let frame = 0;
    const trail: { x: number; y: number }[] = [];

    const animateDart = () => {
      frame++;
      const progress = frame / frames;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
      const currentX = startX + (finalX - startX) * easeProgress;
      const currentY = startY + (finalY - startY) * easeProgress;
      
      // Add to trail
      if (frame % 2 === 0) {
        trail.push({ x: currentX, y: currentY });
        if (trail.length > 5) trail.shift();
      }

      setDartPosition({ 
        x: currentX, 
        y: currentY, 
        visible: true,
        trail: [...trail]
      });

      if (frame < frames) {
        requestAnimationFrame(animateDart);
      } else {
        // Dart has landed
        setShowImpact(true);
        
        // Check for bullseye
        const distFromCenter = Math.sqrt(Math.pow(finalX - center, 2) + Math.pow(finalY - center, 2));
        if (distFromCenter < 25) {
          setBullseyeCount(prev => prev + 1);
        }
        
        // Calculate which team wedge the dart landed in
        const normalizedAngle = (Math.atan2(finalY - center, finalX - center) + Math.PI * 2) % (Math.PI * 2);
        const segmentAngle = (Math.PI * 2) / numTeams;
        const teamIndex = Math.floor((normalizedAngle + segmentAngle / 2) % (Math.PI * 2) / segmentAngle);
        
        setLastHit(teamIndex);
        
        setTimeout(() => {
          setIsThrowing(false);
          onThrowComplete(teamIndex);
        }, 1000);
      }
    };

    requestAnimationFrame(animateDart);
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
      const labelRadius = radius * 0.65;
      const labelX = center + labelRadius * Math.cos(midAngle);
      const labelY = center + labelRadius * Math.sin(midAngle);

      const isHit = lastHit === index;
      const colors = teamColors[index % teamColors.length];

      return (
        <g key={index}>
          {/* Glow effect for hit wedge */}
          {isHit && (
            <path
              d={pathD}
              fill="none"
              stroke={colors.glow}
              strokeWidth="8"
              className="animate-pulse"
              style={{ filter: `drop-shadow(0 0 20px ${colors.glow})` }}
            />
          )}
          <path
            d={pathD}
            fill={colors.main}
            stroke="hsl(220, 30%, 15%)"
            strokeWidth="2"
            className={`transition-all duration-300 ${isHit ? 'brightness-150' : 'hover:brightness-125'}`}
            style={isHit ? { filter: `drop-shadow(0 0 15px ${colors.glow})` } : {}}
          />
          {/* Score rings */}
          <path
            d={`M ${center + radius * 0.9 * Math.cos(startAngle)} ${center + radius * 0.9 * Math.sin(startAngle)} 
                A ${radius * 0.9} ${radius * 0.9} 0 ${largeArc} 1 
                ${center + radius * 0.9 * Math.cos(endAngle)} ${center + radius * 0.9 * Math.sin(endAngle)}`}
            fill="none"
            stroke="hsl(220, 30%, 20%)"
            strokeWidth="1"
            opacity="0.5"
          />
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="16"
            fontWeight="bold"
            className={isHit ? 'animate-pulse' : ''}
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
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
          <p className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <Target className="w-5 h-5" />
            {currentPlayer}
          </p>
        </div>
      )}

      {/* Stats Bar */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Throws:</span>
          <span className="font-bold text-primary">{throwCount}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-muted-foreground">Bullseyes:</span>
          <span className="font-bold text-yellow-400">{bullseyeCount}</span>
        </div>
      </div>

      <div 
        className="relative cursor-crosshair" 
        onClick={throwDart}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <svg
          ref={boardRef}
          width={size}
          height={size}
          className="drop-shadow-2xl transition-transform duration-300"
          style={{ transform: isHovering && !isThrowing ? 'scale(1.02)' : 'scale(1)' }}
          onMouseMove={handleMouseMove}
        >
          {/* Outer decorative ring */}
          <circle
            cx={center}
            cy={center}
            r={radius + 18}
            fill="none"
            stroke="hsl(220, 30%, 15%)"
            strokeWidth="12"
          />
          
          {/* Dartboard main ring */}
          <circle
            cx={center}
            cy={center}
            r={radius + 8}
            fill="hsl(220, 30%, 8%)"
            stroke="hsl(180, 100%, 50%)"
            strokeWidth="4"
            style={{ filter: 'drop-shadow(0 0 20px hsl(180, 100%, 50%))' }}
          />
          
          {/* Team wedges */}
          {renderWedges()}
          
          {/* Triple ring */}
          <circle 
            cx={center} 
            cy={center} 
            r={radius * 0.6} 
            fill="none" 
            stroke="hsl(220, 30%, 20%)" 
            strokeWidth="3" 
            strokeDasharray="8 4"
            opacity="0.6"
          />
          
          {/* Double ring */}
          <circle 
            cx={center} 
            cy={center} 
            r={radius * 0.35} 
            fill="none" 
            stroke="hsl(220, 30%, 25%)" 
            strokeWidth="2"
            opacity="0.5"
          />
          
          {/* Outer bullseye */}
          <circle 
            cx={center} 
            cy={center} 
            r={25} 
            fill="hsl(120, 100%, 35%)" 
            stroke="hsl(220, 30%, 10%)" 
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 10px hsl(120, 100%, 40%))' }}
          />
          
          {/* Inner bullseye */}
          <circle 
            cx={center} 
            cy={center} 
            r={10} 
            fill="hsl(0, 100%, 50%)" 
            stroke="hsl(220, 30%, 10%)" 
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 8px hsl(0, 100%, 60%))' }}
          />

          {/* Crosshair when hovering */}
          {isHovering && !isThrowing && (
            <g opacity="0.6">
              <line x1={cursorPos.x - 15} y1={cursorPos.y} x2={cursorPos.x + 15} y2={cursorPos.y} stroke="hsl(180, 100%, 50%)" strokeWidth="2" />
              <line x1={cursorPos.x} y1={cursorPos.y - 15} x2={cursorPos.x} y2={cursorPos.y + 15} stroke="hsl(180, 100%, 50%)" strokeWidth="2" />
              <circle cx={cursorPos.x} cy={cursorPos.y} r={8} fill="none" stroke="hsl(180, 100%, 50%)" strokeWidth="1" />
            </g>
          )}

          {/* Dart trail */}
          {dartPosition.trail.map((pos, i) => (
            <circle
              key={i}
              cx={pos.x}
              cy={pos.y}
              r={3 - i * 0.4}
              fill={`hsl(40, 100%, ${70 - i * 10}%)`}
              opacity={1 - i * 0.15}
            />
          ))}

          {/* Dart */}
          {dartPosition.visible && (
            <g style={{ transformOrigin: `${dartPosition.x}px ${dartPosition.y}px` }}>
              {/* Impact effect */}
              {showImpact && (
                <>
                  <circle
                    cx={dartPosition.x}
                    cy={dartPosition.y}
                    r={20}
                    fill="none"
                    stroke="hsl(40, 100%, 60%)"
                    strokeWidth="3"
                    className="animate-ping"
                    opacity="0.6"
                  />
                  <circle
                    cx={dartPosition.x}
                    cy={dartPosition.y}
                    r={12}
                    fill="none"
                    stroke="hsl(0, 100%, 60%)"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                </>
              )}
              
              {/* Dart shadow */}
              <ellipse
                cx={dartPosition.x + 4}
                cy={dartPosition.y + 4}
                rx={10}
                ry={5}
                fill="rgba(0,0,0,0.4)"
              />
              
              {/* Dart body */}
              <circle
                cx={dartPosition.x}
                cy={dartPosition.y}
                r={8}
                fill="url(#dartGradient)"
                stroke="hsl(20, 100%, 30%)"
                strokeWidth="2"
              />
              
              {/* Dart tip highlight */}
              <circle
                cx={dartPosition.x}
                cy={dartPosition.y}
                r={4}
                fill="hsl(0, 0%, 95%)"
              />
              
              {/* Dart shine */}
              <circle
                cx={dartPosition.x - 2}
                cy={dartPosition.y - 2}
                r={2}
                fill="white"
                opacity="0.8"
              />
            </g>
          )}

          {/* Gradient definitions */}
          <defs>
            <radialGradient id="dartGradient" cx="30%" cy="30%">
              <stop offset="0%" stopColor="hsl(45, 100%, 70%)" />
              <stop offset="100%" stopColor="hsl(35, 100%, 45%)" />
            </radialGradient>
          </defs>
        </svg>

        {/* Throw animation indicator */}
        {isThrowing && !dartPosition.visible && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-6 h-6 bg-yellow-400 rounded-full animate-ping" />
              <Flame className="absolute inset-0 w-6 h-6 text-orange-500 animate-pulse" />
            </div>
          </div>
        )}

        {/* Hit glow effect */}
        {lastHit !== null && showImpact && (
          <div 
            className="absolute inset-0 pointer-events-none rounded-full animate-pulse"
            style={{ 
              background: `radial-gradient(circle at ${dartPosition.x}px ${dartPosition.y}px, ${teamColors[lastHit % teamColors.length].glow}40 0%, transparent 50%)` 
            }}
          />
        )}
      </div>

      <div className="text-center">
        {lastHit !== null ? (
          <div className="animate-fade-in">
            <p className="text-2xl font-bold flex items-center justify-center gap-2" style={{ color: teamColors[lastHit % teamColors.length].main }}>
              <Trophy className="w-6 h-6" />
              Team {lastHit + 1}!
            </p>
            <p className="text-sm text-muted-foreground mt-1">Great throw!</p>
          </div>
        ) : (
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Target className="w-4 h-4" />
            {isThrowing ? 'Dart in flight...' : 'Click the board to throw!'}
          </p>
        )}
      </div>

      {/* Team legend */}
      <div className="flex flex-wrap justify-center gap-3 max-w-md">
        {Array.from({ length: numTeams }).map((_, i) => {
          const colors = teamColors[i % teamColors.length];
          return (
            <div 
              key={i} 
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 ${
                lastHit === i 
                  ? 'scale-110 border-primary' 
                  : 'border-border hover:border-primary/50'
              }`}
              style={lastHit === i ? { 
                boxShadow: `0 0 15px ${colors.glow}`,
                borderColor: colors.main
              } : {}}
            >
              <div 
                className="w-4 h-4 rounded-full transition-transform duration-300"
                style={{ 
                  backgroundColor: colors.main,
                  boxShadow: lastHit === i ? `0 0 10px ${colors.glow}` : 'none',
                  transform: lastHit === i ? 'scale(1.2)' : 'scale(1)'
                }}
              />
              <span className={`text-sm font-medium ${lastHit === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                Team {i + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dartboard;
