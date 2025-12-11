import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/shared/PageLayout';
import TeamConfigForm from '@/components/shared/TeamConfigForm';
import TeamResults from '@/components/shared/TeamResults';
import SpinWheel from '@/components/animations/SpinWheel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Play, SkipForward } from 'lucide-react';
import { PlayerData } from '@/types/team';
import { useTeamGenerator } from '@/hooks/useTeamGenerator';

const SpinWheelPage = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'config' | 'spinning' | 'results'>('config');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [remainingPlayers, setRemainingPlayers] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const { teams, setTeamsWithHistory, undo, canUndo } = useTeamGenerator();

  const handleConfigSubmit = (data: PlayerData) => {
    setPlayerData(data);
    const validPlayers = data.playerNames.filter(n => n.trim() !== '');
    setRemainingPlayers(validPlayers);
    setCurrentPlayer(validPlayers[0] || null);
    
    // Initialize empty teams
    const emptyTeams = Array.from({ length: data.numTeams }, () => [] as string[]);
    setTeamsWithHistory(emptyTeams);
    
    setStage('spinning');
  };

  const handleSpinComplete = (teamName: string, teamIndex: number) => {
    if (!currentPlayer || !playerData) return;

    // Add player to team
    const newTeams = teams.map((team, i) => 
      i === teamIndex ? [...team, currentPlayer] : team
    );
    setTeamsWithHistory(newTeams);

    // Move to next player
    const newRemaining = remainingPlayers.slice(1);
    setRemainingPlayers(newRemaining);

    if (newRemaining.length === 0) {
      setTimeout(() => setStage('results'), 1000);
    } else {
      setCurrentPlayer(newRemaining[0]);
    }
  };

  const handleRegenerate = () => {
    if (playerData) {
      handleConfigSubmit(playerData);
    }
  };

  const skipAnimation = () => {
    if (!playerData) return;
    
    const validPlayers = playerData.playerNames.filter(n => n.trim() !== '');
    const shuffled = [...validPlayers].sort(() => Math.random() - 0.5);
    const finalTeams: string[][] = Array.from({ length: playerData.numTeams }, () => []);
    
    shuffled.forEach((player, index) => {
      finalTeams[index % playerData.numTeams].push(player);
    });
    
    setTeamsWithHistory(finalTeams);
    setRemainingPlayers([]);
    setStage('results');
  };

  // Team names for the wheel
  const teamNames = playerData ? Array.from({ length: playerData.numTeams }, (_, i) => `Team ${i + 1}`) : [];

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 opacity-0 animate-slide-down" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <RotateCcw className="w-10 h-10 text-primary animate-spin-slow" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-gaming bg-clip-text text-transparent">
              Spin Wheel Mode
            </h1>
          </div>
          <p className="text-muted-foreground">
            Spin the wheel to assign each player to a team!
          </p>
        </div>

        {/* Back button */}
        {stage === 'config' && (
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 hover-glow opacity-0 animate-fade-in"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Modes
          </Button>
        )}

        {/* Config Stage */}
        {stage === 'config' && (
          <TeamConfigForm
            onSubmit={handleConfigSubmit}
            previousData={playerData}
            submitLabel="Start Spinning!"
          />
        )}

        {/* Spinning Stage */}
        {stage === 'spinning' && playerData && (
          <div className="flex flex-col items-center gap-8">
            {/* Progress */}
            <Card className="border-glow bg-card/50 backdrop-blur-sm w-full max-w-md opacity-0 animate-slide-down" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Progress:</span>
                  <span className="text-primary font-bold">
                    {playerData.playerNames.filter(n => n.trim()).length - remainingPlayers.length} / {playerData.playerNames.filter(n => n.trim()).length}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-gaming h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${((playerData.playerNames.filter(n => n.trim()).length - remainingPlayers.length) / playerData.playerNames.filter(n => n.trim()).length) * 100}%` 
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Current Player */}
            {currentPlayer && (
              <div className="text-center opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                <p className="text-muted-foreground mb-2">Spinning for:</p>
                <p className="text-3xl font-bold text-primary">{currentPlayer}</p>
              </div>
            )}

            {/* Spin Wheel */}
            <div className="opacity-0 animate-scale-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <SpinWheel
                items={teamNames}
                onSpinComplete={handleSpinComplete}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
                size={320}
                type="team"
              />
            </div>

            {/* Skip button */}
            <Button
              variant="outline"
              onClick={skipAnimation}
              className="hover-glow opacity-0 animate-fade-in"
              style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip to Results
            </Button>

            {/* Current Teams Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl opacity-0 animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
              {teams.map((team, index) => (
                <Card key={index} className="border-glow bg-card/30 backdrop-blur-sm">
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm text-primary">Team {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-xs text-muted-foreground">
                      {team.length} players
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Results Stage */}
        {stage === 'results' && (
          <TeamResults
            teams={teams}
            onRegenerate={handleRegenerate}
            onUndo={undo}
            canUndo={canUndo}
            modeName="Spin Wheel"
          />
        )}
      </div>
    </PageLayout>
  );
};

export default SpinWheelPage;
