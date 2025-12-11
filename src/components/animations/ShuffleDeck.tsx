import React, { useState, useEffect } from 'react';

interface ShuffleDeckProps {
  cards: string[];
  numTeams: number;
  onShuffleComplete: (teams: string[][]) => void;
  isShuffling: boolean;
  setIsShuffling: (shuffling: boolean) => void;
}

const ShuffleDeck = ({ cards, numTeams, onShuffleComplete, isShuffling, setIsShuffling }: ShuffleDeckProps) => {
  const [displayCards, setDisplayCards] = useState<{ name: string; x: number; y: number; rotation: number; zIndex: number }[]>([]);
  const [phase, setPhase] = useState<'stack' | 'shuffle' | 'deal' | 'done'>('stack');
  const [dealtCards, setDealtCards] = useState<{ name: string; teamIndex: number }[]>([]);

  useEffect(() => {
    // Initialize cards in a stack
    const initialCards = cards.map((name, i) => ({
      name,
      x: 0,
      y: i * 2,
      rotation: 0,
      zIndex: i,
    }));
    setDisplayCards(initialCards);
  }, [cards]);

  const startShuffle = () => {
    if (isShuffling || cards.length === 0) return;
    
    setIsShuffling(true);
    setPhase('shuffle');
    setDealtCards([]);

    // Shuffle animation
    let shuffleCount = 0;
    const shuffleInterval = setInterval(() => {
      setDisplayCards(prev => 
        prev.map(card => ({
          ...card,
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: (Math.random() - 0.5) * 60,
        }))
      );
      shuffleCount++;
      
      if (shuffleCount >= 10) {
        clearInterval(shuffleInterval);
        
        // Stack them back
        setTimeout(() => {
          // Shuffle the order
          const shuffled = [...cards].sort(() => Math.random() - 0.5);
          setDisplayCards(shuffled.map((name, i) => ({
            name,
            x: 0,
            y: i * 2,
            rotation: 0,
            zIndex: i,
          })));
          
          // Start dealing
          setTimeout(() => {
            setPhase('deal');
            dealCards(shuffled);
          }, 500);
        }, 300);
      }
    }, 150);
  };

  const dealCards = (shuffledCards: string[]) => {
    const teams: string[][] = Array.from({ length: numTeams }, () => []);
    let cardIndex = 0;

    const dealInterval = setInterval(() => {
      if (cardIndex >= shuffledCards.length) {
        clearInterval(dealInterval);
        setPhase('done');
        setIsShuffling(false);
        onShuffleComplete(teams);
        return;
      }

      const teamIndex = cardIndex % numTeams;
      teams[teamIndex].push(shuffledCards[cardIndex]);
      
      setDealtCards(prev => [...prev, { name: shuffledCards[cardIndex], teamIndex }]);
      
      // Animate card flying to team pile
      setDisplayCards(prev => 
        prev.map((card, i) => 
          card.name === shuffledCards[cardIndex] 
            ? { 
                ...card, 
                x: (teamIndex - numTeams / 2) * 120, 
                y: 200 + (teams[teamIndex].length - 1) * 3,
                rotation: (Math.random() - 0.5) * 10,
              }
            : card
        )
      );
      
      cardIndex++;
    }, 200);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-xl font-bold text-primary mb-2">
          {phase === 'stack' && 'Ready to Shuffle'}
          {phase === 'shuffle' && 'Shuffling...'}
          {phase === 'deal' && 'Dealing Cards...'}
          {phase === 'done' && 'Cards Dealt!'}
        </p>
        <p className="text-muted-foreground text-sm">
          {cards.length} cards → {numTeams} teams
        </p>
      </div>

      {/* Card area */}
      <div 
        className="relative w-full h-[400px] cursor-pointer"
        onClick={startShuffle}
      >
        {/* Deck visualization */}
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2">
          {displayCards.map((card, index) => (
            <div
              key={`${card.name}-${index}`}
              className="absolute w-24 h-36 rounded-lg border-2 border-primary bg-card shadow-lg transition-all duration-300 flex items-center justify-center p-2"
              style={{
                transform: `translate(${card.x}px, ${card.y}px) rotate(${card.rotation}deg)`,
                zIndex: card.zIndex,
                boxShadow: phase === 'done' ? '0 0 15px hsl(180, 100%, 50%)' : '0 4px 6px rgba(0,0,0,0.3)',
              }}
            >
              <span className="text-xs font-medium text-center text-foreground leading-tight">
                {card.name.length > 12 ? card.name.substring(0, 10) + '...' : card.name}
              </span>
            </div>
          ))}
        </div>

        {/* Team piles visualization */}
        {phase === 'deal' || phase === 'done' ? (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-8">
            {Array.from({ length: numTeams }).map((_, teamIndex) => (
              <div key={teamIndex} className="text-center">
                <div className="w-24 h-36 rounded-lg border-2 border-dashed border-primary/50 bg-card/30 flex items-center justify-center">
                  <span className="text-primary font-bold">Team {teamIndex + 1}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {dealtCards.filter(c => c.teamIndex === teamIndex).length} cards
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <p className="text-muted-foreground text-sm">
        {phase === 'stack' ? 'Click to shuffle and deal!' : ''}
      </p>
    </div>
  );
};

export default ShuffleDeck;
