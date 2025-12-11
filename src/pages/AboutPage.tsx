import React from 'react';
import PageLayout from '@/components/shared/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Linkedin, Twitter, Mail, Code, Sparkles, Zap, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutPage = () => {
  const skills = [
    { name: 'React', color: 'from-cyan-400 to-blue-500' },
    { name: 'TypeScript', color: 'from-blue-400 to-indigo-500' },
    { name: 'Tailwind CSS', color: 'from-teal-400 to-cyan-500' },
    { name: 'Node.js', color: 'from-green-400 to-emerald-500' },
    { name: 'Animation', color: 'from-purple-400 to-pink-500' },
    { name: 'UI/UX', color: 'from-pink-400 to-rose-500' },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Beautiful Animations',
      description: 'Smooth, physics-based animations that make team generation fun and engaging.',
    },
    {
      icon: Zap,
      title: 'Fast & Responsive',
      description: 'Optimized performance across all devices with a mobile-first approach.',
    },
    {
      icon: Code,
      title: 'Clean Code',
      description: 'Built with modern React patterns, TypeScript, and best practices.',
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every detail crafted with care to provide the best user experience.',
    },
  ];

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 opacity-0 animate-slide-down" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          {/* Avatar */}
          <div className="relative inline-block mb-8">
            <div className="w-40 h-40 rounded-full bg-gradient-gaming p-1 animate-spin-slow" style={{ animationDuration: '8s' }}>
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                <span className="text-6xl">🚀</span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-gradient-gaming flex items-center justify-center animate-bounce">
              <Code className="w-6 h-6 text-background" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-gaming bg-clip-text text-transparent mb-4">
            About This Project
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A stunning team generator application built with modern web technologies, 
            featuring multiple animated assignment modes and a beautiful gaming-inspired design.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="border-glow bg-card/50 backdrop-blur-sm hover:glow-primary transition-all duration-300 transform hover:scale-105 opacity-0 animate-slide-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s`, animationFillMode: 'both' }}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-gaming">
                    <feature.icon className="w-6 h-6 text-background" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skills Section */}
        <div className="mb-16 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Built With</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className={`px-6 py-3 rounded-full bg-gradient-to-r ${skill.color} text-white font-semibold shadow-lg transform hover:scale-110 transition-transform duration-300`}
                style={{ 
                  animationDelay: `${0.7 + index * 0.1}s`,
                }}
              >
                {skill.name}
              </div>
            ))}
          </div>
        </div>

        {/* Project Info */}
        <Card className="border-glow bg-card/50 backdrop-blur-sm mb-16 opacity-0 animate-slide-up" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-primary mb-6 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-gaming flex items-center justify-center text-xl font-bold text-background">
                  1
                </div>
                <h3 className="font-semibold text-foreground">Choose Mode</h3>
                <p className="text-sm text-muted-foreground">Select from 4 unique assignment animations</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-gaming flex items-center justify-center text-xl font-bold text-background">
                  2
                </div>
                <h3 className="font-semibold text-foreground">Configure</h3>
                <p className="text-sm text-muted-foreground">Set teams, players, and add names</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-gaming flex items-center justify-center text-xl font-bold text-background">
                  3
                </div>
                <h3 className="font-semibold text-foreground">Animate</h3>
                <p className="text-sm text-muted-foreground">Watch the exciting assignment animation</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-gaming flex items-center justify-center text-xl font-bold text-background">
                  4
                </div>
                <h3 className="font-semibold text-foreground">Results</h3>
                <p className="text-sm text-muted-foreground">View your balanced teams!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <div className="text-center opacity-0 animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
          <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" className="hover-glow gap-2">
              <Github className="w-5 h-5" />
              GitHub
            </Button>
            <Button variant="outline" size="lg" className="hover-glow gap-2">
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </Button>
            <Button variant="outline" size="lg" className="hover-glow gap-2">
              <Twitter className="w-5 h-5" />
              Twitter
            </Button>
            <Button variant="outline" size="lg" className="hover-glow gap-2">
              <Mail className="w-5 h-5" />
              Email
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-muted-foreground opacity-0 animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 animate-pulse" /> using React & Tailwind CSS
          </p>
          <p className="mt-2 text-sm">© 2024 Team Generator. All rights reserved.</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default AboutPage;
