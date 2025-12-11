import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Info, Target, Dices, RotateCcw, Layers } from 'lucide-react';

const NavigationBar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-gaming bg-clip-text text-transparent">
          <Target className="w-6 h-6 text-primary" />
          Team Generator
        </Link>
        
        <div className="flex items-center gap-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant={location.pathname === path ? 'default' : 'ghost'}
                size="sm"
                className={location.pathname === path ? 'bg-gradient-gaming' : 'hover-glow'}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
