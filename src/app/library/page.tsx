'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';
import Link from 'next/link';

interface LibraryFile {
  id: string;
  filename: string;
  person: string;
  product: string;
  dimensions: string;
  language: string;
  version: number;
  tags: string[];
  filesize: string;
  createdAt: string;
  status: 'completed' | 'generating' | 'error';
  gradient: string;
}

const MOCK_FILES: LibraryFile[] = [
  {
    id: '1',
    filename: 'Anna_Probiotyki_1080x1080_PL_v1.png',
    person: 'Anna',
    product: 'Probiotyki Premium',
    dimensions: '1080×1080',
    language: 'PL',
    version: 1,
    tags: ['zdrowie', 'kobiety', 'premium'],
    filesize: '2.4 MB',
    createdAt: '2024-01-15',
    status: 'completed',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: '2',
    filename: 'Marek_Whey_Protein_1920x1080_EN_v2.png',
    person: 'Marek',
    product: 'Whey Protein Max',
    dimensions: '1920×1080',
    language: 'EN',
    version: 2,
    tags: ['fitness', 'męzczyzni', 'sport'],
    filesize: '3.1 MB',
    createdAt: '2024-01-14',
    status: 'completed',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: '3',
    filename: 'Kasia_Kolagen_1080x1920_DE_v1.png',
    person: 'Kasia',
    product: 'Kolagen Beauty',
    dimensions: '1080×1920',
    language: 'DE',
    version: 1,
    tags: ['uroda', 'kolagen', 'kobiety'],
    filesize: '2.8 MB',
    createdAt: '2024-01-13',
    status: 'generating',
    gradient: 'from-purple-500 to-pink-500'
  }
];

export default function LibraryPage() {
  const [files] = useState<LibraryFile[]>(MOCK_FILES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const filteredFiles = files.filter(file => 
    file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'generating': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'error': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const libraryActions = (
    <div className="flex gap-3">
      <Button 
        variant="outline"
        disabled={selectedFiles.length === 0}
        className="gap-2"
      >
        <span>📤</span>
        <span>Export ({selectedFiles.length})</span>
      </Button>
      <Link href="/creator">
        <Button className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
          <span>✨</span>
          <span>New Project</span>
        </Button>
      </Link>
    </div>
  );

  return (
    <AppLayout 
      title="File Library" 
      subtitle="Manage your generated graphics and assets"
      actions={libraryActions}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Files', value: files.length, icon: '📁', color: 'from-blue-500 to-blue-600' },
          { label: 'Completed', value: files.filter(f => f.status === 'completed').length, icon: '✅', color: 'from-green-500 to-green-600' },
          { label: 'Processing', value: files.filter(f => f.status === 'generating').length, icon: '⏳', color: 'from-orange-500 to-orange-600' },
          { label: 'Total Size', value: '24.3 MB', icon: '💾', color: 'from-purple-500 to-purple-600' }
        ].map((stat, index) => (
          <Card key={index} className="bg-card border-border hover:shadow-lg transition-all rounded-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-xl">{stat.icon}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card className="bg-card border-border mb-8 rounded-2xl">
        <CardContent className="p-6">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <span className="text-lg">🔍</span>
            </div>
            <Input
              placeholder="Search files by name, person, product, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Showing <strong className="text-foreground">{filteredFiles.length}</strong> of {files.length} files
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">🔳 Grid</Button>
              <Button variant="ghost" size="sm">📋 List</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFiles.map(file => (
          <Card 
            key={file.id}
            className={`bg-card border-border cursor-pointer transition-all hover:shadow-xl hover:scale-105 group rounded-2xl ${
              selectedFiles.includes(file.id) ? 'ring-2 ring-primary shadow-lg' : ''
            }`}
            onClick={() => handleFileSelect(file.id)}
          >
            <CardContent className="p-6">
              <div className="relative mb-6">
                <div className={`w-full h-32 rounded-xl bg-gradient-to-r ${file.gradient} flex items-center justify-center text-white font-bold text-4xl shadow-lg`}>
                  {file.person.charAt(0)}
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className={getStatusColor(file.status) + ' font-semibold'}>
                    {file.status === 'completed' ? 'Done' : file.status === 'generating' ? 'Processing...' : 'Error'}
                  </Badge>
                </div>
                {selectedFiles.includes(file.id) && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                    <span className="text-lg">✓</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-lg">
                    {file.person} - {file.product}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                    <span className="font-mono">{file.dimensions}</span>
                    <span className="font-bold">{file.language}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {file.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{file.filesize}</span>
                  <Badge variant="outline" className="text-xs">
                    v{file.version}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <Card className="bg-card border-border rounded-2xl">
          <CardContent className="p-16 text-center">
            <div className="text-8xl mb-6">📁</div>
            <h3 className="text-2xl font-bold text-foreground mb-4">No files found</h3>
            <p className="text-base text-muted-foreground mb-8">
              {searchTerm 
                ? 'No files match your search criteria. Try different keywords.'
                : 'No graphics files yet. Create your first project to generate files.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/creator">
                <Button className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
                  <span>✨</span>
                  <span>Create Project</span>
                </Button>
              </Link>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')} className="gap-2">
                  <span>🔄</span>
                  <span>Clear Search</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
}