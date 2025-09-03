'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [apiStatus, setApiStatus] = useState<'untested' | 'testing' | 'valid' | 'invalid'>('untested');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedApiKey = localStorage.getItem('ideogram-api-key');
      if (savedApiKey) {
        setApiKey(savedApiKey);
        setApiStatus('valid');
      }
      
      const savedTheme = localStorage.getItem('ai-graphics-theme') as 'light' | 'dark' | 'system';
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
  }, []);

  const saveApiKey = () => {
    if (typeof window !== 'undefined' && apiKey.trim()) {
      localStorage.setItem('ideogram-api-key', apiKey.trim());
      setApiStatus('valid');
      window.dispatchEvent(new Event('storage'));
    }
  };

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      alert('Please enter an API key first');
      return;
    }

    setApiStatus('testing');

    try {
      const response = await fetch('/api/ideogram/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.trim()
        },
        body: JSON.stringify({
          prompt: 'test connection',
          aspect_ratio: 'ASPECT_1_1'
        })
      });

      const result = await response.json();
      
      if (result.success || response.status !== 401) {
        setApiStatus('valid');
        saveApiKey();
      } else {
        setApiStatus('invalid');
      }
    } catch (error) {
      console.error('API test failed:', error);
      setApiStatus('invalid');
    }
  };

  const changeTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai-graphics-theme', newTheme);
      
      const root = document.documentElement;
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else if (newTheme === 'light') {
        root.classList.remove('dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-500/10 text-green-600 border-green-200 dark:border-green-800';
      case 'invalid': return 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-800';
      case 'testing': return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const settingsActions = (
    <div className="flex gap-3">
      <Button className="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
        <span>💾</span>
        <span>Save Settings</span>
      </Button>
    </div>
  );

  return (
    <AppLayout 
      title="Settings" 
      subtitle="Configure your AI graphics automation workspace"
      actions={settingsActions}
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* API Configuration */}
        <Card className="bg-card border-border shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl">
                🔑
              </div>
              <div>
                <h2 className="text-2xl font-bold">Ideogram API Configuration</h2>
                <p className="text-muted-foreground">Connect your Ideogram account for AI image generation</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div>
              <Label htmlFor="api-key" className="text-base font-semibold">API Key</Label>
              <div className="flex gap-3 mt-3">
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your Ideogram API key here..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 font-mono h-12 text-base"
                />
                <Button onClick={testApiKey} disabled={!apiKey.trim() || apiStatus === 'testing'} className="px-6">
                  {apiStatus === 'testing' ? 'Testing...' : 'Test'}
                </Button>
                <Button onClick={saveApiKey} disabled={!apiKey.trim()} variant="outline" className="px-6">
                  Save
                </Button>
              </div>
              <div className="flex items-center justify-between mt-4">
                <Badge className={getStatusColor(apiStatus) + ' text-sm px-3 py-1'}>
                  {apiStatus === 'valid' ? '✅ Connected' : 
                   apiStatus === 'invalid' ? '❌ Invalid Key' :
                   apiStatus === 'testing' ? '🔄 Testing...' : '⚪ Not Tested'}
                </Badge>
                <a 
                  href="https://developer.ideogram.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-base text-primary hover:text-primary/80 font-medium"
                >
                  Get API Key →
                </a>
              </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h4 className="font-bold text-lg mb-4 text-blue-700 dark:text-blue-300">🎨 Ideogram Capabilities:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-base text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Professional background generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Automatic multi-format creation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Intelligent background replacement</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-base text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>A/B testing variants</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>HD+ upscaling</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Advanced editing tools</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Configuration */}
        <Card className="bg-card border-border shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-2xl">
                🎨
              </div>
              <div>
                <h2 className="text-2xl font-bold">Appearance & Theme</h2>
                <p className="text-muted-foreground">Customize the interface appearance</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div>
              <Label className="text-base font-semibold mb-6 block">
                Choose Application Theme
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { 
                    value: 'light', 
                    name: 'Light Theme', 
                    icon: '☀️', 
                    desc: 'Classic bright interface'
                  },
                  { 
                    value: 'dark', 
                    name: 'Dark Theme', 
                    icon: '🌙', 
                    desc: 'Professional dark interface'
                  },
                  { 
                    value: 'system', 
                    name: 'Auto Theme', 
                    icon: '🖥️', 
                    desc: 'Follow system preference'
                  }
                ].map(themeOption => (
                  <div
                    key={themeOption.value}
                    className={`p-8 border-2 rounded-2xl cursor-pointer transition-all hover:scale-105 ${
                      theme === themeOption.value
                        ? 'border-primary bg-primary/5 shadow-lg'
                        : 'border-border hover:border-primary/50 bg-card'
                    }`}
                    onClick={() => changeTheme(themeOption.value as any)}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-4">{themeOption.icon}</div>
                      <div className="font-bold text-lg text-foreground mb-2">{themeOption.name}</div>
                      <div className="text-base text-muted-foreground">{themeOption.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Setup Guide */}
        <Card className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 border-violet-200 dark:border-violet-800 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-violet-700 dark:text-violet-300">
              🚀 Quick Setup Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">1</div>
                <h3 className="font-bold text-lg mb-3 text-foreground">🔑 Add API Key</h3>
                <p className="text-base text-muted-foreground mb-4">
                  Add your Ideogram API key to enable AI image generation
                </p>
                <Badge className={getStatusColor(apiStatus) + ' text-sm px-3 py-1'}>
                  {apiStatus === 'valid' ? '✅ Connected' : 'Not Connected'}
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">2</div>
                <h3 className="font-bold text-lg mb-3 text-foreground">🎨 Choose Theme</h3>
                <p className="text-base text-muted-foreground mb-4">
                  Customize the interface appearance
                </p>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {theme.charAt(0).toUpperCase() + theme.slice(1)} Mode
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">3</div>
                <h3 className="font-bold text-lg mb-3 text-foreground">🚀 Start Creating</h3>
                <p className="text-base text-muted-foreground mb-4">
                  Everything is ready for professional graphics automation
                </p>
                <Button size="lg" onClick={() => window.location.href = '/creator'} className="gap-2">
                  <span>✨</span>
                  <span>Create Project</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}