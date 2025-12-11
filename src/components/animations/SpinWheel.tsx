import React, { useState, useRef, useEffect } from 'react';

interface SpinWheelProps {
  items: string[];
  onSpinComplete: (winner: string, index: number) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  size?: number;
  type?: 'name' | 'team';
}

const SpinWheel = ({ items, onSpinComplete, isSpinning, setIsSpinning, size = 300, type = 'name' }: SpinWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<SVGSVGElement>(null);

  const colors = type === 'team' 
    ? ['hsl(180, 100%, 50%)', 'hsl(200, 100%, 60%)', 'hsl(280, 100%, 60%)', 'hsl(300, 100%, 70%)', 'hsl(160, 100%, 45%)', 'hsl(220, 100%, 55%)', 'hsl(340, 100%, 60%)', 'hsl(40, 100%, 55%)']
    : ['hsl(180, 100%, 40%)', 'hsl(200, 100%, 50%)', 'hsl(280, 100%, 50%)', 'hsl(300, 100%, 60%)', 'hsl(160, 100%, 35%)', 'hsl(220, 100%, 45%)', 'hsl(340, 100%, 50%)', 'hsl(40, 100%, 45%)'];

  const spin = () => {
    if (isSpinning || items.length === 0) return;
    
    setIsSpinning(true);
    
    // Random number of full rotations (3-6) plus random final position
    const fullRotations = 3 + Math.floor(Math.random() * 4);
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + (fullRotations * 360) + randomAngle;
    
    setRotation(totalRotation);

    // Calculate winner after spin completes
    setTimeout(() => {
      const normalizedAngle = (360 - (totalRotation % 360) + 90) % 360;
      const segmentAngle = 360 / items.length;
      const winnerIndex = Math.floor(normalizedAngle / segmentAngle) % items.length;
      
      setIsSpinning(false);
      onSpinComplete(items[winnerIndex], winnerIndex);
    }, 4000);
  };

  const renderSegments = () => {
    if (items.length === 0) return null;
    
    const segmentAngle = 360 / items.length;
    const radius = size / 2 - 10;
    const center = size / 2;

    return items.map((item, index) => {
      const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
      const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
      
      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);
      
      const largeArc = segmentAngle > 180 ? 1 : 0;
      
      const pathD = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      
      // Calculate text position
      const midAngle = (startAngle + endAngle) / 2;
      const textRadius = radius * 0.65;
      const textX = center + textRadius * Math.cos(midAngle);
      const textY = center + textRadius * Math.sin(midAngle);
      const textRotation = (midAngle * 180 / Math.PI) + 90;

      return (
        <g key={index}>
          <path
            d={pathD}
            fill={colors[index % colors.length]}
            stroke="hsl(220, 30%, 10%)"
            strokeWidth="2"
            className="transition-all duration-300"
          />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={Math.max(8, Math.min(14, 120 / items.length))}
            fontWeight="bold"
            transform={`rotate(${textRotation}, ${textX}, ${textY})`}
            className="pointer-events-none"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {item.length > 10 ? item.substring(0, 8) + '...' : item}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="relative flex flex-col items-center gap-4">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
        <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
      </div>
      
      {/* Wheel */}
      <svg
        ref={wheelRef}
        width={size}
        height={size}
        className="cursor-pointer drop-shadow-2xl"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
        }}
        onClick={spin}
      >
        {/* Outer ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 5}
          fill="none"
          stroke="hsl(180, 100%, 50%)"
          strokeWidth="6"
          className="drop-shadow-lg"
          style={{ filter: 'drop-shadow(0 0 10px hsl(180, 100%, 50%))' }}
        />
        
        {renderSegments()}
        
        {/* Center button */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={30}
          fill="hsl(220, 30%, 10%)"
          stroke="hsl(180, 100%, 50%)"
          strokeWidth="3"
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="hsl(180, 100%, 50%)"
          fontSize="12"
          fontWeight="bold"
        >
          {isSpinning ? '...' : 'SPIN'}
        </text>
      </svg>
      
      <p className="text-muted-foreground text-sm">
        {isSpinning ? 'Spinning...' : 'Click the wheel to spin!'}
      </p>
    </div>
  );
};

export default SpinWheel;
