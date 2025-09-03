'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  href: string;
  label: string;
  icon: string;
  shortcut: string;
  badge?: string;
  highlight?: boolean;
}

const NAVIGATION_ITEMS: Array<{
  section: string;
  items: NavigationItem[];
}> = [
  {
    section: 'Main',
    items: [
      { href: '/', label: 'Dashboard', icon: '🏠', shortcut: 'Ctrl+1' },
      { href: '/projects', label: 'Projects', icon: '🎨', shortcut: 'Ctrl+2', badge: '24' },
      { href: '/library', label: 'Library', icon: '📁', shortcut: 'Ctrl+3', badge: '1.2k' },
    ]
  },
  {
    section: 'Tools',
    items: [
      { href: '/editor-advanced', label: 'Advanced Editor', icon: '🎭', shortcut: 'Ctrl+E', highlight: true },
      { href: '/creator', label: 'Project Creator', icon: '✨', shortcut: 'Ctrl+N' },
      { href: '/batch', label: 'Batch Processor', icon: '⚡', shortcut: 'Ctrl+B' },
    ]
  },
  {
    section: 'System',
    items: [
      { href: '/analytics', label: 'Analytics', icon: '📊', shortcut: 'Ctrl+A' },
      { href: '/settings', label: 'Settings', icon: '⚙️', shortcut: 'Ctrl+,' },
    ]
  }
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className={`bg-card/98 backdrop-blur-md border-r border-border/50 h-screen flex flex-col transition-all duration-300 shadow-xl ${
      isCollapsed ? 'w-16' : 'w-72'
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-gradient-to-r from-violet-500/5 to-blue-500/5">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                  Graphics Studio Pro
                </h1>
                <p className="text-sm text-muted-foreground">
                  Advanced AI Platform
                </p>
              </div>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2 hover:bg-accent/50 rounded-xl transition-all hover:scale-110"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="text-lg">{isCollapsed ? '▶️' : '◀️'}</span>
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        {NAVIGATION_ITEMS.map((section, sectionIndex) => (
          <div key={section.section} className="mb-8">
            {!isCollapsed && (
              <div className="px-6 mb-4">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {section.section}
                </h3>
              </div>
            )}
            
            <div className="space-y-2 px-4">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const isHovered = hoveredItem === item.href;
                
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`relative flex items-center rounded-xl transition-all duration-200 group ${
                        isActive
                          ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      } ${
                        item.highlight && !isActive
                          ? 'bg-gradient-to-r from-purple-500/15 to-blue-500/15 border border-purple-300 dark:border-purple-700'
                          : ''
                      }`}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="flex items-center gap-4 w-full p-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-muted/50 text-muted-foreground group-hover:text-foreground group-hover:bg-muted'
                        }`}>
                          {item.icon}
                        </div>
                        {!isCollapsed && (
                          <>
                            <span className="font-semibold flex-1 text-left">{item.label}</span>
                            <div className="flex items-center gap-2">
                              {item.badge && (
                                <Badge
                                  variant={isActive ? "secondary" : "outline"}
                                  className="text-xs h-6 px-2 font-semibold bg-background/20"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      
                      {/* Enhanced tooltip for collapsed state */}
                      {isCollapsed && isHovered && (
                        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-popover border border-border rounded-xl px-4 py-3 shadow-2xl z-50 min-w-48">
                          <div className="font-bold text-foreground">{item.label}</div>
                          <div className="text-sm text-muted-foreground mt-1">{item.shortcut}</div>
                          {item.badge && (
                            <Badge variant="outline" className="text-xs mt-2">
                              {item.badge} items
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {/* Enhanced active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full shadow-lg"></div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {sectionIndex < NAVIGATION_ITEMS.length - 1 && !isCollapsed && (
              <Separator className="mx-6 mt-6 bg-border/30" />
            )}
          </div>
        ))}
      </div>

      {/* Enhanced Bottom Section */}
      <div className="border-t border-border/50 p-4 bg-gradient-to-r from-muted/20 to-muted/10">
        {/* Enhanced Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const root = document.documentElement;
            const isDark = root.classList.contains('dark');
            if (isDark) {
              root.classList.remove('dark');
              if (typeof window !== 'undefined') {
                localStorage.setItem('ai-graphics-theme', 'light');
              }
            } else {
              root.classList.add('dark');
              if (typeof window !== 'undefined') {
                localStorage.setItem('ai-graphics-theme', 'dark');
              }
            }
          }}
          className={`w-full justify-start gap-3 h-12 px-3 mb-3 hover:bg-accent/50 rounded-xl transition-all hover:scale-[1.02]`}
          title="Toggle between light and dark theme"
        >
          <div className="w-9 h-9 bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-600 dark:to-purple-600 rounded-lg flex items-center justify-center transition-all">
            <span className="text-lg">🌙</span>
          </div>
          {!isCollapsed && (
            <span className="font-semibold">Theme Toggle</span>
          )}
        </Button>

        {/* Enhanced User Profile */}
        {!isCollapsed && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-200 dark:border-green-800 hover:shadow-lg transition-all group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
              U
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">User</div>
              <div className="text-xs text-muted-foreground">Pro Plan • AI Ready</div>
            </div>
            <Button variant="ghost" size="sm" className="p-2 hover:bg-accent/50 rounded-lg">
              <span className="text-lg">⚙️</span>
            </Button>
          </div>
        )}
        
        {/* Collapsed user avatar */}
        {isCollapsed && (
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md hover:scale-110 transition-transform cursor-pointer" title="User Profile">
              U
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;