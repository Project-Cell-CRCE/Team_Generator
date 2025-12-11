import { useState, useCallback } from 'react';
import { PlayerData, TeamAssignment } from '@/types/team';

// Seeded random number generator for deterministic results
function createSeededRandom(seed: number) {
  return function() {
    seed = Math.sin(seed) * 10000;
    return seed - Math.floor(seed);
  };
}

export function useTeamGenerator(seed?: number) {
  const [teams, setTeams] = useState<string[][]>([]);
  const [assignments, setAssignments] = useState<TeamAssignment[]>([]);
  const [history, setHistory] = useState<string[][][]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const random = seed !== undefined ? createSeededRandom(seed) : Math.random;

  const generateTeams = useCallback((playerData: PlayerData): string[][] => {
    const validPlayers = playerData.playerNames.filter(name => name.trim() !== '');
    const shuffled = [...validPlayers].sort(() => random() - 0.5);
    const newTeams: string[][] = Array.from({ length: playerData.numTeams }, () => []);
    
    shuffled.forEach((player, index) => {
      newTeams[index % playerData.numTeams].push(player);
    });
    
    return newTeams;
  }, [random]);

  const setTeamsWithHistory = useCallback((newTeams: string[][]) => {
    setTeams(newTeams);
    const newHistory = [...history.slice(0, currentHistoryIndex + 1), newTeams];
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  }, [history, currentHistoryIndex]);

  const undo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(prev => prev - 1);
      setTeams(history[currentHistoryIndex - 1]);
    }
  }, [currentHistoryIndex, history]);

  const canUndo = currentHistoryIndex > 0;

  const addAssignment = useCallback((assignment: TeamAssignment) => {
    setAssignments(prev => [...prev, assignment]);
  }, []);

  const resetAssignments = useCallback(() => {
    setAssignments([]);
  }, []);

  return {
    teams,
    setTeams,
    setTeamsWithHistory,
    assignments,
    addAssignment,
    resetAssignments,
    generateTeams,
    undo,
    canUndo,
    history,
  };
}
