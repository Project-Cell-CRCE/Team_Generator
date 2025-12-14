import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/shared/PageLayout';
import TeamConfigForm from '@/components/shared/TeamConfigForm';
import TeamResults from '@/components/shared/TeamResults';
import DirectAllocation from '@/components/animations/DirectAllocation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap } from 'lucide-react';
import { PlayerData } from '@/types/team';
import { useTeamGenerator } from '@/hooks/useTeamGenerator';

const DirectAllocationPage = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'config' | 'allocating' | 'results'>('config');
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [isAllocating, setIsAllocating] = useState(false);
  const { teams, setTeamsWithHistory, undo, canUndo } = useTeamGenerator();

  const handleConfigSubmit = (data: PlayerData) => {
    setPlayerData(data);
    setStage('allocating');
  };

  const handleAllocationComplete = (newTeams: string[][]) => {
    setTeamsWithHistory(newTeams);
    setTimeout(() => setStage('results'), 500);
  };

  const handleRegenerate = () => {
    if (playerData) {
      setStage('allocating');
    }
  };

  const validPlayers = playerData?.playerNames.filter(n => n.trim() !== '') || [];

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 opacity-0 animate-slide-down" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-gaming bg-clip-text text-transparent">
              Direct Allocation Mode
            </h1>
          </div>
          <p className="text-muted-foreground">
            Watch players get allocated to teams in real-time!
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
            submitLabel="Start Allocation!"
          />
        )}

        {/* Allocating Stage */}
        {stage === 'allocating' && playerData && (
          <div className="flex flex-col items-center gap-8">
            <div className="w-full max-w-4xl opacity-0 animate-scale-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <DirectAllocation
                players={validPlayers}
                numTeams={playerData.numTeams}
                onAllocationComplete={handleAllocationComplete}
                isAllocating={isAllocating}
                setIsAllocating={setIsAllocating}
              />
            </div>

            {/* Back button during allocation */}
            {!isAllocating && (
              <Button
                variant="ghost"
                onClick={() => setStage('config')}
                className="hover-glow"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Config
              </Button>
            )}
          </div>
        )}

        {/* Results Stage */}
        {stage === 'results' && (
          <TeamResults
            teams={teams}
            onRegenerate={handleRegenerate}
            onUndo={undo}
            canUndo={canUndo}
            modeName="Direct Allocation"
          />
        )}
      </div>
    </PageLayout>
  );
};

export default DirectAllocationPage;
