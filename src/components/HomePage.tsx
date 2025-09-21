import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, Users, Target, AlertCircle } from 'lucide-react';

interface PlayerData {
  numTeams: number;
  playersPerTeam: number;
  playerNames: string[];
}

interface HomePageProps {
  onGenerateTeams: (teams: string[][], data: PlayerData) => void;
  previousData?: PlayerData | null;
}

const HomePage = ({ onGenerateTeams, previousData }: HomePageProps) => {
  const [numTeams, setNumTeams] = useState(previousData?.numTeams || 2);
  const [playersPerTeam, setPlayersPerTeam] = useState(previousData?.playersPerTeam || 5);
  const [playerNames, setPlayerNames] = useState<string[]>(previousData?.playerNames || ['']);
  const [validationError, setValidationError] = useState('');

  const addPlayer = () => {
    setPlayerNames([...playerNames, '']);
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 1) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
      setValidationError('');
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
    setValidationError('');
  };

  const generateTeams = () => {
    // Validate that all player names are filled
    const emptyNames = playerNames.some((name, index) => name.trim() === '');
    
    if (emptyNames) {
      setValidationError('All player names must be filled in. Please complete all fields or remove empty ones.');
      return;
    }

    const validPlayers = playerNames.filter(name => name.trim() !== '');
    
    if (validPlayers.length === 0) {
      setValidationError('Please add at least one player!');
      return;
    }

    if (validPlayers.length < numTeams) {
      setValidationError(`You need at least ${numTeams} players to create ${numTeams} teams.`);
      return;
    }

    // Clear validation error
    setValidationError('');

    // Shuffle players
    const shuffled = [...validPlayers].sort(() => Math.random() - 0.5);
    
    // Create teams
    const teams: string[][] = Array.from({ length: numTeams }, () => []);
    
    shuffled.forEach((player, index) => {
      teams[index % numTeams].push(player);
    });

    onGenerateTeams(teams, {
      numTeams,
      playersPerTeam,
      playerNames: validPlayers
    });
  };

  // Create animated stars
  const createStars = () => {
    return Array.from({ length: 50 }).map((_, i) => (
      <div
        key={i}
        className="star"
        style={{
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${20 + Math.random() * 10}s`,
        }}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background p-6 relative overflow-hidden galaxy-bg">
      {/* Animated galaxy background with stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {createStars()}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-secondary/10 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold bg-gradient-gaming bg-clip-text text-transparent mb-4 animate-pulse-neon">
            TEAM GENERATOR
          </h1>
          <p className="text-xl text-muted-foreground">
            Create balanced teams for your gaming sessions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Team Configuration */}
          <Card className="border-glow bg-card/50 backdrop-blur-sm h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Target className="w-5 h-5" />
                Team Configuration
              </CardTitle>
              <CardDescription>
                Set up your team parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Number of Teams */}
              <div className="space-y-2">
                <Label htmlFor="numTeams" className="text-foreground">Number of Teams</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNumTeams(Math.max(2, numTeams - 1))}
                    className="hover-glow"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    id="numTeams"
                    type="number"
                    value={numTeams}
                    onChange={(e) => setNumTeams(Math.max(2, parseInt(e.target.value) || 2))}
                    className="text-center input-interactive bg-input/50 border-primary/30 focus:border-primary"
                    min="2"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNumTeams(numTeams + 1)}
                    className="hover-glow"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Players Per Team */}
              <div className="space-y-2">
                <Label htmlFor="playersPerTeam" className="text-foreground">Target Players Per Team</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPlayersPerTeam(Math.max(1, playersPerTeam - 1))}
                    className="hover-glow"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    id="playersPerTeam"
                    type="number"
                    value={playersPerTeam}
                    onChange={(e) => setPlayersPerTeam(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center input-interactive bg-input/50 border-primary/30 focus:border-primary"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPlayersPerTeam(playersPerTeam + 1)}
                    className="hover-glow"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Player Names */}
          <Card className="border-glow bg-card/50 backdrop-blur-sm h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Users className="w-5 h-5" />
                Player Names
              </CardTitle>
              <CardDescription>
                Add all the players who will be in teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {playerNames.map((name, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={name}
                      onChange={(e) => updatePlayerName(index, e.target.value)}
                      placeholder={`Player ${index + 1} *`}
                      className="input-interactive bg-input/50 border-primary/30 focus:border-primary"
                      required
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePlayer(index)}
                      disabled={playerNames.length === 1}
                      className="hover-glow"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button
                variant="outline"
                onClick={addPlayer}
                className="w-full mt-4 hover-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Player
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="max-w-4xl mx-auto mt-6">
            <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
              <AlertCircle className="w-5 h-5" />
              <span>{validationError}</span>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="text-center mt-8">
          <Button
            onClick={generateTeams}
            size="lg"
            className="bg-gradient-gaming hover:glow-primary text-primary-foreground px-12 py-6 text-xl font-bold rounded-xl transform hover:scale-105 transition-all duration-300"
          >
            GENERATE TEAMS
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;