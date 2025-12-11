import React, { useState, useEffect } from 'react';
import { Dices } from 'lucide-react';

interface DiceRollProps {
  numTeams: number;
  onRollComplete: (result: number) => void;
  isRolling: boolean;
  setIsRolling: (rolling: boolean) => void;
  currentPlayer?: string;
}

const DiceRoll = ({ numTeams, onRollComplete, isRolling, setIsRolling, currentPlayer }: DiceRollProps) => {
  const [displayValue, setDisplayValue] = useState(1);
  const [finalValue, setFinalValue] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRolling) {
      setFinalValue(null);
      interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * numTeams) + 1);
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        const result = Math.floor(Math.random() * numTeams) + 1;
        setDisplayValue(result);
        setFinalValue(result);
        setIsRolling(false);
        onRollComplete(result - 1); // Convert to 0-indexed team
      }, 1500);
    }

    return () => clearInterval(interval);
  }, [isRolling, numTeams, onRollComplete, setIsRolling]);

  const roll = () => {
    if (!isRolling) {
      setIsRolling(true);
    }
  };

  // Get dice dots pattern based on value
  const getDicePattern = (value: number) => {
    const patterns: Record<number, { cx: number; cy: number }[]> = {
      1: [{ cx: 50, cy: 50 }],
      2: [{ cx: 25, cy: 25 }, { cx: 75, cy: 75 }],
      3: [{ cx: 25, cy: 25 }, { cx: 50, cy: 50 }, { cx: 75, cy: 75 }],
      4: [{ cx: 25, cy: 25 }, { cx: 75, cy: 25 }, { cx: 25, cy: 75 }, { cx: 75, cy: 75 }],
      5: [{ cx: 25, cy: 25 }, { cx: 75, cy: 25 }, { cx: 50, cy: 50 }, { cx: 25, cy: 75 }, { cx: 75, cy: 75 }],
      6: [{ cx: 25, cy: 25 }, { cx: 75, cy: 25 }, { cx: 25, cy: 50 }, { cx: 75, cy: 50 }, { cx: 25, cy: 75 }, { cx: 75, cy: 75 }],
    };
    return patterns[Math.min(value, 6)] || patterns[6];
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {currentPlayer && (
        <div className="text-center opacity-0 animate-fade-in" style={{ animationFillMode: 'both' }}>
          <p className="text-muted-foreground">Rolling for:</p>
          <p className="text-2xl font-bold text-primary">{currentPlayer}</p>
        </div>
      )}

      <div
        className={`relative cursor-pointer transition-all duration-300 ${isRolling ? 'animate-bounce' : 'hover:scale-110'}`}
        onClick={roll}
      >
        {/* 3D Dice */}
        <div
          className={`w-32 h-32 relative ${isRolling ? 'animate-spin' : ''}`}
          style={{
            perspective: '500px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Dice face */}
          <svg
            width="128"
            height="128"
            viewBox="0 0 100 100"
            className="drop-shadow-2xl"
            style={{
              filter: finalValue !== null 
                ? 'drop-shadow(0 0 20px hsl(180, 100%, 50%))' 
                : 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
            }}
          >
            {/* Dice background */}
            <rect
              x="5"
              y="5"
              width="90"
              height="90"
              rx="15"
              fill={finalValue !== null ? 'hsl(280, 100%, 60%)' : 'hsl(220, 30%, 15%)'}
              stroke="hsl(180, 100%, 50%)"
              strokeWidth="3"
              className="transition-colors duration-300"
            />
            
            {/* Dice dots or number */}
            {displayValue <= 6 ? (
              getDicePattern(displayValue).map((dot, i) => (
                <circle
                  key={i}
                  cx={dot.cx}
                  cy={dot.cy}
                  r="10"
                  fill="white"
                  className={isRolling ? 'animate-pulse' : ''}
                />
              ))
            ) : (
              <text
                x="50"
                y="55"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="40"
                fontWeight="bold"
              >
                {displayValue}
              </text>
            )}
          </svg>
        </div>

        {/* Glow effect */}
        {finalValue !== null && (
          <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl -z-10 animate-pulse" />
        )}
      </div>

      <div className="text-center">
        {finalValue !== null ? (
          <p className="text-xl font-bold text-primary animate-fade-in">
            Team {finalValue}!
          </p>
        ) : (
          <p className="text-muted-foreground">
            {isRolling ? 'Rolling...' : 'Click to roll!'}
          </p>
        )}
      </div>

      {/* Stats display */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Dices className="w-4 h-4 text-primary" />
          <span>{numTeams}-sided dice</span>
        </div>
        <div>
          <span>Probability: {(100 / numTeams).toFixed(1)}% each</span>
        </div>
      </div>
    </div>
  );
};

export default DiceRoll;
