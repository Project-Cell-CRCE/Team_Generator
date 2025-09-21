import React, { useState, useEffect } from 'react';
import LoadingPage from '@/components/LoadingPage';
import HomePage from '@/components/HomePage';
import TeamsPage from '@/components/TeamsPage';

interface PlayerData {
  numTeams: number;
  playersPerTeam: number;
  playerNames: string[];
}

const Index = () => {
  const [currentView, setCurrentView] = useState<'loading' | 'home' | 'teams'>('loading');
  const [generatedTeams, setGeneratedTeams] = useState<string[][]>([]);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);

  const handleLoadingComplete = () => {
    setCurrentView('home');
  };

  const handleGenerateTeams = (teams: string[][], data: PlayerData) => {
    setGeneratedTeams(teams);
    setPlayerData(data);
    setCurrentView('teams');
  };

  const handleRegenerate = () => {
    if (playerData) {
      // Regenerate teams with the same player data
      const validPlayers = playerData.playerNames.filter(name => name.trim() !== '');
      const shuffled = [...validPlayers].sort(() => Math.random() - 0.5);
      const teams: string[][] = Array.from({ length: playerData.numTeams }, () => []);
      
      shuffled.forEach((player, index) => {
        teams[index % playerData.numTeams].push(player);
      });
      
      setGeneratedTeams(teams);
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  if (currentView === 'loading') {
    return <LoadingPage onLoadingComplete={handleLoadingComplete} />;
  }

  if (currentView === 'teams') {
    return (
      <TeamsPage
        teams={generatedTeams}
        onRegenerate={handleRegenerate}
        onBackToHome={handleBackToHome}
      />
    );
  }

  return (
    <HomePage 
      onGenerateTeams={handleGenerateTeams} 
      previousData={playerData}
    />
  );
};

export default Index;
