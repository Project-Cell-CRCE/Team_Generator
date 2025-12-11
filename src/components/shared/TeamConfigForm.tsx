import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Minus, Upload, HelpCircle, Users, Hash } from 'lucide-react';
import { PlayerData } from '@/types/team';

interface TeamConfigFormProps {
  onSubmit: (data: PlayerData) => void;
  previousData?: PlayerData | null;
  submitLabel?: string;
  isLoading?: boolean;
}

const TeamConfigForm = ({ onSubmit, previousData, submitLabel = 'Start Assignment', isLoading = false }: TeamConfigFormProps) => {
  const [numTeams, setNumTeams] = useState(previousData?.numTeams || 2);
  const [playersPerTeam, setPlayersPerTeam] = useState(previousData?.playersPerTeam || 5);
  const [playerNames, setPlayerNames] = useState<string[]>(
    previousData?.playerNames || Array(10).fill('')
  );

  useEffect(() => {
    if (previousData) {
      setNumTeams(previousData.numTeams);
      setPlayersPerTeam(previousData.playersPerTeam);
      setPlayerNames(previousData.playerNames);
    }
  }, [previousData]);

  const totalPlayers = numTeams * playersPerTeam;

  useEffect(() => {
    if (playerNames.length < totalPlayers) {
      setPlayerNames([...playerNames, ...Array(totalPlayers - playerNames.length).fill('')]);
    } else if (playerNames.length > totalPlayers) {
      setPlayerNames(playerNames.slice(0, totalPlayers));
    }
  }, [totalPlayers]);

  const handlePlayerNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const names = text.split(/[,\n]/).map(name => name.trim()).filter(name => name);
        const newNames = [...names, ...Array(Math.max(0, totalPlayers - names.length)).fill('')].slice(0, totalPlayers);
        setPlayerNames(newNames);
      };
      reader.readAsText(file);
    }
  };

  const handleBulkInput = (text: string) => {
    const names = text.split(/[,\n]/).map(name => name.trim()).filter(name => name);
    const newNames = [...names, ...Array(Math.max(0, totalPlayers - names.length)).fill('')].slice(0, totalPlayers);
    setPlayerNames(newNames);
  };

  const filledPlayers = playerNames.filter(name => name.trim() !== '').length;

  const handleSubmit = () => {
    onSubmit({
      numTeams,
      playersPerTeam,
      playerNames: playerNames.filter(name => name.trim() !== '')
    });
  };

  return (
    <TooltipProvider>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Team Configuration */}
        <Card className="border-glow bg-card/50 backdrop-blur-sm h-fit opacity-0 animate-slide-right" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Hash className="w-5 h-5" />
              Team Configuration
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Set the number of teams and players per team</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Number of Teams */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Number of Teams</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNumTeams(Math.max(2, numTeams - 1))}
                  className="hover-glow"
                  disabled={numTeams <= 2}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={numTeams}
                  onChange={(e) => setNumTeams(Math.max(2, parseInt(e.target.value) || 2))}
                  className="w-20 text-center input-interactive"
                  min={2}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNumTeams(numTeams + 1)}
                  className="hover-glow"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Players per Team */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Players per Team</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPlayersPerTeam(Math.max(1, playersPerTeam - 1))}
                  className="hover-glow"
                  disabled={playersPerTeam <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={playersPerTeam}
                  onChange={(e) => setPlayersPerTeam(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center input-interactive"
                  min={1}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPlayersPerTeam(playersPerTeam + 1)}
                  className="hover-glow"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-lg bg-muted/30 border border-primary/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Players Needed:</span>
                <span className="text-primary font-bold text-lg">{totalPlayers}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Players Entered:</span>
                <span className={`font-bold text-lg ${filledPlayers >= totalPlayers ? 'text-green-400' : 'text-yellow-400'}`}>
                  {filledPlayers}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Player Names */}
        <Card className="border-glow bg-card/50 backdrop-blur-sm h-fit opacity-0 animate-slide-left" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Users className="w-5 h-5" />
                Player Names
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
                <Button variant="outline" size="sm" className="hover-glow" asChild>
                  <span className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Import CSV
                  </span>
                </Button>
              </label>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bulk Input */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Paste names (comma or newline separated)</Label>
              <Textarea
                placeholder="Player 1, Player 2, Player 3..."
                className="input-interactive min-h-[80px]"
                onChange={(e) => handleBulkInput(e.target.value)}
              />
            </div>

            <div className="h-px bg-border" />

            {/* Individual Inputs */}
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
              {playerNames.map((name, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm w-8">{index + 1}.</span>
                  <Input
                    value={name}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    placeholder={`Player ${index + 1}`}
                    className="input-interactive"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="text-center mt-8 opacity-0 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
        <Button
          onClick={handleSubmit}
          disabled={filledPlayers < 2 || isLoading}
          size="lg"
          className="bg-gradient-gaming hover:glow-primary text-lg px-8 py-6 font-bold disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : submitLabel}
        </Button>
        {filledPlayers < 2 && (
          <p className="text-destructive text-sm mt-2">Enter at least 2 player names</p>
        )}
      </div>
    </TooltipProvider>
  );
};

export default TeamConfigForm;
