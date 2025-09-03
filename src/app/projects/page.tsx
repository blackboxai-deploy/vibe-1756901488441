'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AppLayout } from '@/components/layout/AppLayout';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'draft';
  progress: number;
  formats: number;
  languages: number;
  aiMasks: number;
  createdAt: string;
  updatedAt: string;
  totalImages: number;
  gradient: string;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Premium Fitness Supplements Campaign',
    status: 'completed',
    progress: 100,
    formats: 12,
    languages: 5,
    aiMasks: 8,
    createdAt: '2024-01-15',
    updatedAt: '2 hours ago',
    totalImages: 60,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: '2',
    name: 'Probiotics Health Series',
    status: 'in-progress',
    progress: 75,
    formats: 8,
    languages: 3,
    aiMasks: 5,
    createdAt: '2024-01-14',
    updatedAt: '5 hours ago',
    totalImages: 24,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: '3',
    name: 'Natural Skincare Collection',
    status: 'in-progress',
    progress: 45,
    formats: 12,
    languages: 4,
    aiMasks: 12,
    createdAt: '2024-01-13',
    updatedAt: '1 day ago',
    totalImages: 48,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: '4',
    name: 'Energy Drinks Marketing',
    status: 'draft',
    progress: 0,
    formats: 6,
    languages: 2,
    aiMasks: 0,
    createdAt: '2024-01-12',
    updatedAt: '2 days ago',
    totalImages: 0,
    gradient: 'from-orange-500 to-red-500'
  }
];

export default function ProjectsPage() {
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'draft'>('all');

  const filteredProjects = projects.filter(project => 
    filter === 'all' || project.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'draft': return 'Draft';
      default: return status;
    }
  };

  const projectsActions = (
    <Link href="/creator">
      <Button className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg">
        <span>✨</span>
        <span>New Project</span>
      </Button>
    </Link>
  );

  return (
    <AppLayout 
      title="Projects" 
      subtitle="Manage your graphics automation campaigns"
      actions={projectsActions}
    >
      {/* Filter Tabs */}
      <div className="flex gap-3 mb-8">
        {[
          { key: 'all', label: 'All Projects', count: projects.length },
          { key: 'completed', label: 'Completed', count: projects.filter(p => p.status === 'completed').length },
          { key: 'in-progress', label: 'In Progress', count: projects.filter(p => p.status === 'in-progress').length },
          { key: 'draft', label: 'Drafts', count: projects.filter(p => p.status === 'draft').length }
        ].map(tab => (
          <Button
            key={tab.key}
            variant={filter === tab.key ? "default" : "outline"}
            onClick={() => setFilter(tab.key as any)}
            className="gap-2 px-6"
          >
            <span>{tab.label}</span>
            <Badge variant="secondary" className="text-xs font-semibold">
              {tab.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <Card key={project.id} className="bg-card border-border hover:shadow-xl transition-all group rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              {/* Project Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${project.gradient} flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {project.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-lg leading-tight">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(project.status) + ' font-semibold'}>
                      {getStatusText(project.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-muted/20 rounded-xl">
                  <div className="text-2xl font-bold text-foreground">{project.totalImages}</div>
                  <div className="text-sm text-muted-foreground">Images</div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-xl">
                  <div className="text-2xl font-bold text-foreground">{project.aiMasks}</div>
                  <div className="text-sm text-muted-foreground">AI Masks</div>
                </div>
              </div>

              {/* Progress */}
              {project.status !== 'draft' && (
                <div className="mb-6">
                  <div className="flex justify-between text-base mb-3">
                    <span className="text-muted-foreground font-medium">Progress</span>
                    <span className="text-foreground font-bold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                </div>
              )}

              {/* Details */}
              <div className="text-sm text-muted-foreground space-y-2 mb-6 bg-muted/10 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <span>📐 Formats:</span>
                  <span className="font-semibold">{project.formats}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>🌍 Languages:</span>
                  <span className="font-semibold">{project.languages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>📅 Created:</span>
                  <span className="font-semibold">{project.createdAt}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>⏰ Updated:</span>
                  <span className="font-semibold">{project.updatedAt}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 gap-1 h-10">
                  <span>👁️</span>
                  <span>View</span>
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1 h-10">
                  <span>✏️</span>
                  <span>Edit</span>
                </Button>
                {project.status === 'completed' && (
                  <Button size="sm" className="flex-1 gap-1 h-10">
                    <span>📤</span>
                    <span>Export</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create New Project Card */}
        <Link href="/creator">
          <Card className="bg-gradient-to-br from-violet-500/5 to-purple-500/5 border-dashed border-2 border-violet-300 dark:border-violet-700 hover:border-violet-500 hover:shadow-2xl transition-all group rounded-2xl">
            <CardContent className="p-8 text-center h-full flex flex-col justify-center">
              <div className="w-24 h-24 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl">
                <span className="text-4xl text-white">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Create New Project</h3>
              <p className="text-base text-muted-foreground mb-6">
                Start a new graphics automation campaign with AI
              </p>
              <Button className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg">
                <span>🚀</span>
                <span>Get Started</span>
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && filter !== 'all' && (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">📂</div>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            No {filter} projects found
          </h3>
          <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto">
            {filter === 'completed' && 'No completed projects yet. Create your first project to get started.'}
            {filter === 'in-progress' && 'No projects currently in progress.'}
            {filter === 'draft' && 'No draft projects. All your projects are either completed or in progress.'}
          </p>
          <Button onClick={() => setFilter('all')} variant="outline" className="gap-2">
            <span>🔄</span>
            <span>Show All Projects</span>
          </Button>
        </div>
      )}
    </AppLayout>
  );
}