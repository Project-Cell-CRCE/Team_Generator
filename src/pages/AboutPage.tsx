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

        {/* Developed By Section */}
        <Card className="border-glow bg-gradient-to-br from-card/80 to-secondary/30 backdrop-blur-sm mb-16 overflow-hidden opacity-0 animate-slide-up" style={{ animationDelay: '0.85s', animationFillMode: 'both' }}>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-primary mb-8 text-center flex items-center justify-center gap-2">
              <Code className="w-6 h-6" />
              Developed By
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Developer Avatar */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-gaming p-1 group-hover:animate-spin-slow transition-all duration-500">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                    <span className="text-5xl">👨‍💻</span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center border-4 border-card">
                  <span className="text-xs">✓</span>
                </div>
              </div>
              
              {/* Developer Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-foreground mb-2">Leroy Daniel Edison</h3>
                <p className="text-primary font-medium mb-3">Full Stack Developer</p>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Passionate about creating beautiful, interactive web experiences. 
                  Specializing in React, TypeScript, and modern UI/UX design.
                </p>
                
                {/* Developer Skills Tags */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/30">React</span>
                  <span className="px-3 py-1 text-xs rounded-full bg-accent/20 text-accent border border-accent/30">TypeScript</span>
                  <span className="px-3 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">Node.js</span>
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Tailwind</span>
                </div>

                {/* Social Links */}
                <div className="flex gap-3 justify-center md:justify-start">
                  <Button onClick={() => window.open("https://github.com/LeroyEdi7", "_blank")} variant="outline" size="sm" className="hover-glow gap-2">
                    <Github className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => window.open("https://www.linkedin.com/in/leroy-edison-84303933b/", "_blank")} variant="outline" size="sm" className="hover-glow gap-2">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="hover-glow gap-2">
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="hover-glow gap-2">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="hover-glow gap-2">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <div className="text-center opacity-0 animate-fade-in" style={{ animationDelay: '0.9s', animationFillMode: 'both' }}>
          <h2 className="text-2xl font-bold text-foreground mb-6">Want to Connect?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Feel free to reach out for collaborations, questions, or just to say hi!
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="default" size="lg" className="gap-2 bg-gradient-gaming hover:opacity-90">
              <Mail className="w-5 h-5" />
              Get in Touch
            </Button>
            <Button variant="outline" size="lg" className="hover-glow gap-2">
              <Github className="w-5 h-5" />
              View Projects
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
