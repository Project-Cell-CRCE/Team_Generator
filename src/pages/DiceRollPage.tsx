import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/shared/PageLayout';
import TeamConfigForm from '@/components/shared/TeamConfigForm';
import TeamResults from '@/components/shared/TeamResults';
import DiceRoll from '@/components/animations/DiceRoll';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dices, SkipForward } from 'lucide-react';
import { PlayerData } from '@/types/team';
import { useTeamGenerator } from '@/hooks/useTeamGenerator';

const DiceRollPage = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'config' | 'rolling' | 'results'>('config');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [remainingPlayers, setRemainingPlayers] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollCount, setRollCount] = useState(0);
  const [rerollCount, setRerollCount] = useState(0);
  const { teams, setTeamsWithHistory, undo, canUndo } = useTeamGenerator();

  const handleConfigSubmit = (data: PlayerData) => {
    setPlayerData(data);
    const validPlayers = data.playerNames.filter(n => n.trim() !== '');
    setRemainingPlayers(validPlayers);
    setCurrentPlayer(validPlayers[0] || null);
    setRollCount(0);
    setRerollCount(0);
    
    // Initialize empty teams
    const emptyTeams = Array.from({ length: data.numTeams }, () => [] as string[]);
    setTeamsWithHistory(emptyTeams);
    
    setStage('rolling');
  };

  const handleRollComplete = (teamIndex: number) => {
    if (!currentPlayer || !playerData) return;

    setRollCount(prev => prev + 1);

    // Check if team is full
    const maxPerTeam = Math.ceil(playerData.playerNames.filter(n => n.trim()).length / playerData.numTeams);
    if (teams[teamIndex].length >= maxPerTeam) {
      // Re-roll needed
      setRerollCount(prev => prev + 1);
      setTimeout(() => setIsRolling(true), 500);
      return;
    }

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

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 opacity-0 animate-slide-down" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dices className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-gaming bg-clip-text text-transparent">
              Dice Roll Mode
            </h1>
          </div>
          <p className="text-muted-foreground">
            Roll the dice to determine each player's team assignment!
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
            submitLabel="Start Rolling!"
          />
        )}

        {/* Rolling Stage */}
        {stage === 'rolling' && playerData && (
          <div className="flex flex-col items-center gap-8">
            {/* Progress & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
              <Card className="border-glow bg-card/50 backdrop-blur-sm opacity-0 animate-slide-down" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground text-sm">Progress</p>
                  <p className="text-2xl font-bold text-primary">
                    {playerData.playerNames.filter(n => n.trim()).length - remainingPlayers.length} / {playerData.playerNames.filter(n => n.trim()).length}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-glow bg-card/50 backdrop-blur-sm opacity-0 animate-slide-down" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground text-sm">Total Rolls</p>
                  <p className="text-2xl font-bold text-primary">{rollCount}</p>
                </CardContent>
              </Card>
              <Card className="border-glow bg-card/50 backdrop-blur-sm opacity-0 animate-slide-down" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                <CardContent className="p-4 text-center">
                  <p className="text-muted-foreground text-sm">Re-rolls</p>
                  <p className="text-2xl font-bold text-accent">{rerollCount}</p>
                </CardContent>
              </Card>
            </div>

            {/* Dice Roll */}
            <div className="opacity-0 animate-scale-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <DiceRoll
                numTeams={playerData.numTeams}
                onRollComplete={handleRollComplete}
                isRolling={isRolling}
                setIsRolling={setIsRolling}
                currentPlayer={currentPlayer || undefined}
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
          <div>
            {/* Final Stats */}
            <div className="mb-8 text-center opacity-0 animate-fade-in" style={{ animationFillMode: 'both' }}>
              <Card className="inline-block border-glow bg-card/30 backdrop-blur-sm">
                <CardContent className="p-4 flex gap-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Rolls</p>
                    <p className="text-xl font-bold text-primary">{rollCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Re-rolls Needed</p>
                    <p className="text-xl font-bold text-accent">{rerollCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                    <p className="text-xl font-bold text-green-400">
                      {rollCount > 0 ? Math.round(((rollCount - rerollCount) / rollCount) * 100) : 100}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <TeamResults
              teams={teams}
              onRegenerate={handleRegenerate}
              onUndo={undo}
              canUndo={canUndo}
              modeName="Dice Roll"
            />
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DiceRollPage;
