import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import PageLayout from '@/components/shared/PageLayout';
import { RotateCcw, Dices, Layers, Zap } from 'lucide-react';

const modeCards = [
  {
    id: 'spin-wheel',
    title: 'Spin Wheel',
    description: 'Watch the wheel spin and assign players based on where it lands. Physics-based rotation with weighted options.',
    icon: RotateCcw,
    gradient: 'from-cyan-500 via-blue-500 to-purple-500',
    path: '/mode/spin-wheel',
  },
  {
    id: 'dice-roll',
    title: 'Dice Roll',
    description: 'Roll the dice for each player! Re-roll if a team is full. See probability stats and rolling animations.',
    icon: Dices,
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    path: '/mode/dice-roll',
  },
  {
    id: 'shuffle-deck',
    title: 'Shuffle Deck',
    description: 'Each name becomes a card. Watch the deck shuffle and deal cards into teams with smooth animations.',
    icon: Layers,
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    path: '/mode/shuffle-deck',
  },
  {
    id: 'direct-allocation',
    title: 'Direct Allocation',
    description: 'Quick and efficient! Watch players get randomly assigned to teams one by one with smooth animations.',
    icon: Zap,
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    path: '/mode/direct-allocation',
  },
];

const ModeSelectorPage = () => {
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 opacity-0 animate-slide-down" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-gaming bg-clip-text text-transparent mb-4 animate-pulse-neon">
            TEAM GENERATOR
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your assignment style and create teams with stunning animations
          </p>
        </div>

        {/* Mode Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {modeCards.map((mode, index) => (
            <Link key={mode.id} to={mode.path}>
              <Card 
                className="group border-glow bg-card/50 backdrop-blur-sm hover:glow-primary transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer h-full opacity-0 animate-slide-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s`, animationFillMode: 'both' }}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center gap-6">
                    {/* Icon with gradient background */}
                    <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${mode.gradient} group-hover:scale-110 transition-transform duration-500`}>
                      <mode.icon className="w-16 h-16 text-white drop-shadow-lg" />
                      <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {mode.title}
                    </h2>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed">
                      {mode.description}
                    </p>

                    {/* Action hint */}
                    <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-medium">Click to start</span>
                      <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center opacity-0 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
          <Card className="inline-block border-glow bg-card/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-3">How it works</h3>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">1</span>
                  <span>Choose a mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">2</span>
                  <span>Configure teams & players</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">3</span>
                  <span>Watch the animation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">4</span>
                  <span>See your teams!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ModeSelectorPage;
