import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    setTeams(Array.from({ length: numTeams }, () => []));
    setAllocatedPlayers([]);
    setCurrentPlayerIndex(-1);
  }, [players, numTeams]);

  const startAllocation = () => {
    if (isAllocating || players.length === 0) return;
    
    setIsAllocating(true);
    setAllocatedPlayers([]);
    
    const newTeams: string[][] = Array.from({ length: numTeams }, () => []);
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    
    let index = 0;
    
    const allocateNext = () => {
      if (index >= shuffledPlayers.length) {
        setIsAllocating(false);
        setTimeout(() => onAllocationComplete(newTeams), 300);
        return;
      }
      
      const player = shuffledPlayers[index];
      const teamIndex = index % numTeams;
      newTeams[teamIndex].push(player);
      
      setCurrentPlayerIndex(index);
      setAllocatedPlayers(prev => [...prev, { name: player, teamIndex, visible: true }]);
      setTeams([...newTeams]);
      
      index++;
      setTimeout(allocateNext, 400);
    };
    
    allocateNext();
  };

  const teamColors = [
    'from-cyan-500 to-blue-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-yellow-500 to-amber-500',
    'from-indigo-500 to-violet-500',
  ];

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Status */}
      <div className="text-center">
        <p className="text-2xl font-bold text-primary mb-2">
          {!isAllocating && currentPlayerIndex === -1 && 'Ready to Allocate'}
          {isAllocating && 'Allocating Players...'}
          {!isAllocating && currentPlayerIndex >= 0 && 'Allocation Complete!'}
        </p>
        <p className="text-muted-foreground">
          {players.length} players → {numTeams} teams
        </p>
      </div>

      {/* Current player being allocated */}
      {isAllocating && currentPlayerIndex >= 0 && currentPlayerIndex < players.length && (
        <div className="text-center animate-pulse">
          <div className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/50">
            <span className="text-lg font-semibold text-primary">
              Assigning: {allocatedPlayers[allocatedPlayers.length - 1]?.name}
            </span>
          </div>
        </div>
      )}

      {/* Teams Grid */}
      <div className="w-full grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(numTeams, 3)}, minmax(0, 1fr))` }}>
        {Array.from({ length: numTeams }).map((_, teamIndex) => (
          <div
            key={teamIndex}
            className="relative rounded-xl border-2 border-primary/30 bg-card/50 backdrop-blur-sm p-4 min-h-[200px] transition-all duration-300"
            style={{
              boxShadow: teams[teamIndex]?.length > 0 ? `0 0 20px hsl(var(--primary) / 0.3)` : 'none',
            }}
          >
            {/* Team Header */}
            <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r ${teamColors[teamIndex % teamColors.length]} text-white text-sm font-bold shadow-lg`}>
              Team {teamIndex + 1}
            </div>

            {/* Team Members */}
            <div className="mt-4 space-y-2">
              {allocatedPlayers
                .filter(p => p.teamIndex === teamIndex)
                .map((player, idx) => (
                  <div
                    key={`${player.name}-${idx}`}
                    className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-foreground text-sm font-medium animate-scale-in transition-all duration-300"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    {player.name}
                  </div>
                ))}
            </div>

            {/* Empty state */}
            {!allocatedPlayers.filter(p => p.teamIndex === teamIndex).length && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-muted-foreground/50 text-sm">Waiting...</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Start Button */}
      {!isAllocating && currentPlayerIndex === -1 && (
        <button
          onClick={startAllocation}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-primary/50"
        >
          Start Allocation
        </button>
      )}

      {/* Progress */}
      {isAllocating && (
        <div className="w-full max-w-md">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${((currentPlayerIndex + 1) / players.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {currentPlayerIndex + 1} / {players.length} players allocated
          </p>
        </div>
      )}
    </div>
  );
};

export default DirectAllocation;
