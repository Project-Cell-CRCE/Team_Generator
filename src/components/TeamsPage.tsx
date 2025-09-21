import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, Trophy, Users } from 'lucide-react';

interface TeamsPageProps {
  teams: string[][];
  onRegenerate: () => void;
  onBackToHome: () => void;
}

const TeamsPage = ({ teams, onRegenerate, onBackToHome }: TeamsPageProps) => {
  const teamColors = [
    'from-cyan-500 to-blue-600',
    'from-purple-500 to-pink-600',
    'from-green-500 to-emerald-600',
    'from-yellow-500 to-orange-600',
    'from-red-500 to-rose-600',
    'from-indigo-500 to-purple-600',
    'from-teal-500 to-cyan-600',
    'from-orange-500 to-red-600',
  ];

  return (
    <div className="min-h-screen bg-background p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-gaming bg-clip-text text-transparent mb-4 animate-pulse-neon">
            TEAMS GENERATED
          </h1>
          <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
            <Trophy className="w-5 h-5 text-primary" />
            {teams.length} Teams Created
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="flex items-center gap-2 hover-glow"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <Button
            onClick={onRegenerate}
            className="flex items-center gap-2 bg-gradient-gaming hover:glow-primary"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate Teams
          </Button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teams.map((team, index) => (
            <Card
              key={index}
              className="border-glow bg-card/50 backdrop-blur-sm hover:glow-primary transition-all duration-300 transform hover:scale-105"
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-primary">Team {index + 1}</span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {team.length}
                  </div>
                </CardTitle>
                <div 
                  className={`h-1 rounded-full bg-gradient-to-r ${teamColors[index % teamColors.length]} opacity-60`}
                />
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {team.map((player, playerIndex) => (
                    <li
                      key={playerIndex}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-primary/20"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-foreground font-medium">{player}</span>
                    </li>
                  ))}
                  {team.length === 0 && (
                    <li className="text-muted-foreground italic text-center py-4">
                      No players assigned
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-12 text-center">
          <Card className="inline-block border-glow bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {teams.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Teams</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {teams.reduce((acc, team) => acc + team.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Players</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {teams.length > 0 ? Math.round(teams.reduce((acc, team) => acc + team.length, 0) / teams.length * 10) / 10 : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Team Size</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gaming elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;