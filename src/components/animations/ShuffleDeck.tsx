import React, { useState, useEffect, useCallback } from 'react';

interface ShuffleDeckProps {
  cards: string[];
  numTeams: number;
  onShuffleComplete: (teams: string[][]) => void;
  isShuffling: boolean;
  setIsShuffling: (shuffling: boolean) => void;
}

interface CardState {
  name: string;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  scale: number;
  opacity: number;
  dealt: boolean;
  teamIndex?: number;
}

const ShuffleDeck = ({ cards, numTeams, onShuffleComplete, isShuffling, setIsShuffling }: ShuffleDeckProps) => {
  const [displayCards, setDisplayCards] = useState<CardState[]>([]);
  const [phase, setPhase] = useState<'ready' | 'shuffle' | 'deal' | 'done'>('ready');
  const [currentDealIndex, setCurrentDealIndex] = useState(-1);

  const cardColors = [
    'from-red-500 to-red-600',
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
  ];

  // Initialize cards
  useEffect(() => {
    const initialCards: CardState[] = cards.map((name, i) => ({
      name,
      x: 0,
      y: -i * 3,
      rotation: (Math.random() - 0.5) * 4,
      zIndex: cards.length - i,
      scale: 1,
      opacity: 1,
      dealt: false,
    }));
    setDisplayCards(initialCards);
    setPhase('ready');
    setCurrentDealIndex(-1);
  }, [cards]);

  const startShuffle = useCallback(() => {
    if (isShuffling || cards.length === 0) return;
    
    setIsShuffling(true);
    setPhase('shuffle');

    // Shuffle animation - cards fly around
    let shuffleStep = 0;
    const maxShuffleSteps = 15;
    
    const shuffleInterval = setInterval(() => {
      setDisplayCards(prev => 
        prev.map((card, i) => ({
          ...card,
          x: (Math.random() - 0.5) * 200,
          y: (Math.random() - 0.5) * 150,
          rotation: (Math.random() - 0.5) * 45,
          scale: 0.9 + Math.random() * 0.2,
          zIndex: Math.floor(Math.random() * prev.length),
        }))
      );
      
      shuffleStep++;
      
      if (shuffleStep >= maxShuffleSteps) {
        clearInterval(shuffleInterval);
        
        // Restack cards with new random order
        const shuffledOrder = [...cards].sort(() => Math.random() - 0.5);
        
        setTimeout(() => {
          setDisplayCards(shuffledOrder.map((name, i) => ({
            name,
            x: 0,
            y: -i * 3,
            rotation: (Math.random() - 0.5) * 4,
            zIndex: shuffledOrder.length - i,
            scale: 1,
            opacity: 1,
            dealt: false,
          })));
          
          setTimeout(() => {
            setPhase('deal');
            dealCards(shuffledOrder);
          }, 600);
        }, 400);
      }
    }, 100);
  }, [isShuffling, cards]);

  const dealCards = (shuffledCards: string[]) => {
    const teams: string[][] = Array.from({ length: numTeams }, () => []);
    const teamCounts: number[] = Array(numTeams).fill(0);
    let cardIndex = 0;

    const dealInterval = setInterval(() => {
      if (cardIndex >= shuffledCards.length) {
        clearInterval(dealInterval);
        setPhase('done');
        setIsShuffling(false);
        setTimeout(() => onShuffleComplete(teams), 500);
        return;
      }

      const teamIndex = cardIndex % numTeams;
      teams[teamIndex].push(shuffledCards[cardIndex]);
      teamCounts[teamIndex]++;
      
      const currentCard = shuffledCards[cardIndex];
      const cardIdx = cardIndex;
      const teamIdx = teamIndex;
      const stackPosition = teamCounts[teamIndex] - 1;
      
      setCurrentDealIndex(cardIndex);
      
      // Calculate target position for the card
      const teamSpacing = Math.min(140, 600 / numTeams);
      const startX = -((numTeams - 1) * teamSpacing) / 2;
      const targetX = startX + teamIdx * teamSpacing;
      const targetY = 180 + stackPosition * 4;
      
      setDisplayCards(prev => 
        prev.map(card => 
          card.name === currentCard && !card.dealt
            ? { 
                ...card, 
                x: targetX,
                y: targetY,
                rotation: (Math.random() - 0.5) * 8,
                zIndex: 100 + cardIdx,
                scale: 0.85,
                dealt: true,
                teamIndex: teamIdx,
              }
            : card
        )
      );
      
      cardIndex++;
    }, 300);
  };

  const getTeamPileCards = (teamIndex: number) => {
    return displayCards.filter(c => c.dealt && c.teamIndex === teamIndex);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Status */}
      <div className="text-center">
        <p className="text-2xl font-bold text-primary mb-2">
          {phase === 'ready' && 'Ready to Shuffle'}
          {phase === 'shuffle' && '🔀 Shuffling...'}
          {phase === 'deal' && '🃏 Dealing Cards...'}
          {phase === 'done' && '✨ Cards Dealt!'}
        </p>
        <p className="text-muted-foreground">
          {cards.length} cards → {numTeams} teams
        </p>
      </div>

      {/* Main Card Area */}
      <div className="relative w-full h-[450px] overflow-hidden rounded-xl bg-gradient-to-b from-card/50 to-card/20 border border-primary/20">
        
        {/* Deck Position (top center) */}
        <div className="absolute left-1/2 top-8 -translate-x-1/2">
          {displayCards.filter(c => !c.dealt).map((card, index) => (
            <div
              key={`${card.name}-${index}`}
              className="absolute w-20 h-28 md:w-24 md:h-32 rounded-xl border-2 border-primary/50 bg-gradient-to-br from-card to-card/80 shadow-xl flex items-center justify-center p-2 cursor-pointer transition-all duration-300 ease-out"
              style={{
                transform: `translate(calc(-50% + ${card.x}px), ${card.y}px) rotate(${card.rotation}deg) scale(${card.scale})`,
                zIndex: card.zIndex,
                opacity: card.opacity,
              }}
              onClick={phase === 'ready' ? startShuffle : undefined}
            >
              <div className={`absolute inset-1 rounded-lg bg-gradient-to-br ${cardColors[index % cardColors.length]} opacity-20`} />
              <span className="text-xs md:text-sm font-semibold text-center text-foreground leading-tight z-10 drop-shadow">
                {card.name.length > 10 ? card.name.substring(0, 8) + '...' : card.name}
              </span>
            </div>
          ))}
        </div>

        {/* Dealt Cards (flying to team positions) */}
        <div className="absolute left-1/2 top-8 -translate-x-1/2">
          {displayCards.filter(c => c.dealt).map((card, index) => (
            <div
              key={`dealt-${card.name}-${index}`}
              className="absolute w-20 h-28 md:w-24 md:h-32 rounded-xl border-2 border-primary bg-gradient-to-br from-card to-card/90 shadow-2xl flex items-center justify-center p-2 transition-all duration-500 ease-out"
              style={{
                transform: `translate(calc(-50% + ${card.x}px), ${card.y}px) rotate(${card.rotation}deg) scale(${card.scale})`,
                zIndex: card.zIndex,
                boxShadow: '0 10px 30px rgba(0,0,0,0.4), 0 0 20px hsl(var(--primary) / 0.3)',
              }}
            >
              <div className={`absolute inset-1 rounded-lg bg-gradient-to-br ${cardColors[card.teamIndex! % cardColors.length]} opacity-30`} />
              <span className="text-xs md:text-sm font-semibold text-center text-foreground leading-tight z-10 drop-shadow">
                {card.name.length > 10 ? card.name.substring(0, 8) + '...' : card.name}
              </span>
            </div>
          ))}
        </div>

        {/* Team Labels at Bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 md:gap-6">
          {Array.from({ length: numTeams }).map((_, teamIndex) => {
            const teamSpacing = Math.min(140, 600 / numTeams);
            const cardCount = getTeamPileCards(teamIndex).length;
            
            return (
              <div 
                key={teamIndex} 
                className="flex flex-col items-center"
                style={{ width: `${Math.min(100, teamSpacing - 10)}px` }}
              >
                <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${cardColors[teamIndex % cardColors.length]} text-white text-xs md:text-sm font-bold shadow-lg`}>
                  Team {teamIndex + 1}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {cardCount} {cardCount === 1 ? 'card' : 'cards'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      {phase === 'ready' && (
        <button
          onClick={startShuffle}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-primary/50 animate-pulse"
        >
          🎴 Shuffle & Deal
        </button>
      )}

      {/* Progress */}
      {phase === 'deal' && (
        <div className="w-full max-w-md">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${((currentDealIndex + 1) / cards.length) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {currentDealIndex + 1} / {cards.length} cards dealt
          </p>
        </div>
      )}
    </div>
  );
};

export default ShuffleDeck;
