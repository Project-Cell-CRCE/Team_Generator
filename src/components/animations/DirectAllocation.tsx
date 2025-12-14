import React, { useState, useEffect } from 'react';
import { User, Users, Sparkles, ArrowRight } from 'lucide-react';

interface DirectAllocationProps {
  players: string[];
  numTeams: number;
  onAllocationComplete: (teams: string[][]) => void;
  isAllocating: boolean;
  setIsAllocating: (allocating: boolean) => void;
}

const DirectAllocation = ({ players, numTeams, onAllocationComplete, isAllocating, setIsAllocating }: DirectAllocationProps) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(-1);
  const [allocatedPlayers, setAllocatedPlayers] = useState<{ name: string; teamIndex: number; visible: boolean }[]>([]);
  const [teams, setTeams] = useState<string[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [targetTeam, setTargetTeam] = useState<number | null>(null);
  const [showArrow, setShowArrow] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const teamColors = [
    { bg: 'from-cyan-500 to-blue-600', border: 'border-cyan-400', glow: 'shadow-cyan-500/50' },
    { bg: 'from-purple-500 to-pink-600', border: 'border-purple-400', glow: 'shadow-purple-500/50' },
    { bg: 'from-green-500 to-emerald-600', border: 'border-green-400', glow: 'shadow-green-500/50' },
    { bg: 'from-orange-500 to-red-600', border: 'border-orange-400', glow: 'shadow-orange-500/50' },
    { bg: 'from-yellow-500 to-amber-600', border: 'border-yellow-400', glow: 'shadow-yellow-500/50' },
    { bg: 'from-indigo-500 to-violet-600', border: 'border-indigo-400', glow: 'shadow-indigo-500/50' },
  ];

  useEffect(() => {
    setTeams(Array.from({ length: numTeams }, () => []));
    setAllocatedPlayers([]);
    setCurrentPlayerIndex(-1);
    setCurrentPlayer(null);
    setTargetTeam(null);
  }, [players, numTeams]);

  const startAllocation = () => {
    if (isAllocating || players.length === 0) return;
    
    // Start countdown
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          beginAllocation();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 600);
  };

  const beginAllocation = () => {
    setIsAllocating(true);
    setAllocatedPlayers([]);
    
    const newTeams: string[][] = Array.from({ length: numTeams }, () => []);
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    
    let index = 0;
    
    const allocateNext = () => {
      if (index >= shuffledPlayers.length) {
        setCurrentPlayer(null);
        setTargetTeam(null);
        setShowArrow(false);
        setIsAllocating(false);
        setTimeout(() => onAllocationComplete(newTeams), 800);
        return;
      }
      
      const player = shuffledPlayers[index];
      const teamIndex = index % numTeams;
      
      // Phase 1: Show current player
      setCurrentPlayer(player);
      setTargetTeam(null);
      setShowArrow(false);
      
      setTimeout(() => {
        // Phase 2: Show arrow and target team
        setTargetTeam(teamIndex);
        setShowArrow(true);
        
        setTimeout(() => {
          // Phase 3: Allocate to team
          newTeams[teamIndex].push(player);
          setCurrentPlayerIndex(index);
          setAllocatedPlayers(prev => [...prev, { name: player, teamIndex, visible: true }]);
          setTeams([...newTeams]);
          setShowArrow(false);
          
          index++;
          setTimeout(allocateNext, 400);
        }, 600);
      }, 500);
    };
    
    allocateNext();
  };

  const getTeamPlayers = (teamIndex: number) => {
    return allocatedPlayers.filter(p => p.teamIndex === teamIndex);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Status Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">
          {countdown !== null && `Starting in ${countdown}...`}
          {countdown === null && !isAllocating && currentPlayerIndex === -1 && 'Ready to Allocate'}
          {countdown === null && isAllocating && '🎯 Allocating Players...'}
          {countdown === null && !isAllocating && currentPlayerIndex >= 0 && '✨ Allocation Complete!'}
        </h2>
        <p className="text-muted-foreground">
          {players.length} players → {numTeams} teams
        </p>
      </div>

      {/* Current Player Card */}
      <div className="h-32 flex items-center justify-center w-full">
        {currentPlayer && (
          <div className="flex items-center gap-4 animate-scale-in">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary flex items-center justify-center animate-pulse shadow-lg shadow-primary/30">
                <User className="w-10 h-10 text-primary" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
            </div>
            
            <div className="text-left">
              <p className="text-sm text-muted-foreground">Now assigning:</p>
              <p className="text-2xl font-bold text-foreground">{currentPlayer}</p>
            </div>

            {showArrow && targetTeam !== null && (
              <>
                <ArrowRight className="w-8 h-8 text-primary animate-pulse mx-2" />
                <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${teamColors[targetTeam % teamColors.length].bg} text-white font-bold shadow-lg ${teamColors[targetTeam % teamColors.length].glow} animate-scale-in`}>
                  Team {targetTeam + 1}
                </div>
              </>
            )}
          </div>
        )}
        
        {!currentPlayer && !isAllocating && currentPlayerIndex >= 0 && (
          <div className="flex items-center gap-3 text-green-400 animate-scale-in">
            <Sparkles className="w-8 h-8" />
            <span className="text-2xl font-bold">All players assigned!</span>
            <Sparkles className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Teams Grid */}
      <div 
        className="w-full grid gap-4" 
        style={{ gridTemplateColumns: `repeat(${Math.min(numTeams, 4)}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: numTeams }).map((_, teamIndex) => {
          const teamPlayers = getTeamPlayers(teamIndex);
          const isTarget = targetTeam === teamIndex && showArrow;
          const color = teamColors[teamIndex % teamColors.length];
          
          return (
            <div
              key={teamIndex}
              className={`relative rounded-2xl border-2 ${color.border} bg-card/60 backdrop-blur-sm p-4 min-h-[220px] transition-all duration-500 ${isTarget ? `scale-105 shadow-xl ${color.glow}` : ''}`}
            >
              {/* Team Header */}
              <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-gradient-to-r ${color.bg} text-white text-sm font-bold shadow-lg flex items-center gap-2`}>
                <Users className="w-4 h-4" />
                Team {teamIndex + 1}
              </div>

              {/* Team Members */}
              <div className="mt-6 space-y-2 min-h-[160px]">
                {teamPlayers.map((player, idx) => (
                  <div
                    key={`${player.name}-${idx}`}
                    className={`px-4 py-3 rounded-xl bg-gradient-to-r ${color.bg}/20 border ${color.border}/40 text-foreground font-medium flex items-center gap-2 animate-scale-in shadow-sm`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${color.bg} flex items-center justify-center text-white text-xs font-bold shadow`}>
                      {idx + 1}
                    </div>
                    <span className="truncate">{player.name}</span>
                  </div>
                ))}
                
                {/* Empty slots indicator */}
                {teamPlayers.length === 0 && !isAllocating && currentPlayerIndex === -1 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-muted-foreground/40 text-sm font-medium">Waiting for players...</span>
                  </div>
                )}
              </div>

              {/* Team count badge */}
              <div className={`absolute bottom-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r ${color.bg}/30 text-xs font-bold ${color.border}`}>
                {teamPlayers.length} player{teamPlayers.length !== 1 ? 's' : ''}
              </div>
            </div>
          );
        })}
      </div>

      {/* Start Button */}
      {!isAllocating && currentPlayerIndex === -1 && countdown === null && (
        <button
          onClick={startAllocation}
          className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient-x text-white font-bold text-xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-primary/50 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            Start Allocation
            <Sparkles className="w-6 h-6" />
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      )}

      {/* Progress Bar */}
      {(isAllocating || currentPlayerIndex >= 0) && (
        <div className="w-full max-w-lg">
          <div className="h-3 bg-muted/50 rounded-full overflow-hidden border border-primary/20">
            <div
              className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-gradient-x transition-all duration-500 ease-out rounded-full"
              style={{ width: `${((currentPlayerIndex + 1) / players.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Progress</span>
            <span className="font-mono font-bold text-primary">
              {Math.min(currentPlayerIndex + 1, players.length)} / {players.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectAllocation;
