'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <header className="bg-card/98 backdrop-blur-md border-b border-border/50 px-6 py-5 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          {title && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-foreground mb-1">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground font-medium">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Center Section - Enhanced Search */}
        <div className="hidden md:flex items-center max-w-lg flex-1 mx-8">
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <span className="text-lg">🔍</span>
            </div>
            <Input
              placeholder="Search projects, files, tools, or commands..."
              className="w-full pl-12 pr-16 h-11 bg-muted/30 border-muted-foreground/20 rounded-xl focus:bg-background focus:border-primary/50 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Badge variant="outline" className="text-xs font-semibold bg-background">
                ⌘K
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Enhanced AI Status */}
          <div className="hidden lg:flex items-center gap-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-4 py-2 rounded-xl border border-green-200 dark:border-green-800">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">AI Systems Online</span>
          </div>

          {/* Enhanced Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative p-3 hover:bg-accent/50 rounded-xl transition-all hover:scale-110"
            title="Notifications"
          >
            <span className="text-xl">🔔</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xs text-white font-bold">3</span>
            </div>
          </Button>

          {/* Custom Actions */}
          <div className="animate-fade-in">
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;