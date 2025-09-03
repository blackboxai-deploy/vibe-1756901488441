'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AppLayout } from '@/components/layout/AppLayout';
import { useRouter } from 'next/navigation';

interface ProjectData {
  name: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  backgroundStyle: string;
}

export default function CreatorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    productName: '',
    productDescription: '',
    targetAudience: '',
    backgroundStyle: 'modern_minimalist'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'missing' | 'valid'>('checking');

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkApiKey = () => {
        const apiKey = localStorage.getItem('ideogram-api-key');
        setApiKeyStatus(apiKey ? 'valid' : 'missing');
      };
      
      checkApiKey();
      const handleStorageChange = () => checkApiKey();
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const updateProjectData = (field: keyof ProjectData, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const generateProject = async () => {
    if (!projectData.name || !projectData.productName) {
      alert('Please fill in project name and product name');
      return;
    }

    if (apiKeyStatus !== 'valid') {
      alert('Please add your Ideogram API key in Settings first');
      router.push('/settings');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    
    const steps = [
      'Preparing project data...',
      'Generating AI background with Ideogram...',
      'Processing formats and variants...',
      'Finalizing project...'
    ];
    
    try {
      for (let i = 0; i < steps.length; i++) {
        setGenerationStatus(steps[i]);
        
        if (i === 1) {
          const prompt = `${projectData.backgroundStyle} professional background for ${projectData.productName} advertisement, ${projectData.productDescription}, targeting ${projectData.targetAudience}`;
          
          const apiKey = typeof window !== 'undefined' ? localStorage.getItem('ideogram-api-key') : null;
          const response = await fetch('/api/ideogram/generate', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-api-key': apiKey || ''
            },
            body: JSON.stringify({
              prompt: prompt,
              aspect_ratio: 'ASPECT_1_1',
              style_type: 'DESIGN',
              magic_prompt_option: 'ON'
            })
          });
          
          const result = await response.json();
          console.log('Ideogram generation result:', result);
          
          if (!result.success) {
            throw new Error(result.error || 'Failed to generate background');
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        setGenerationProgress(((i + 1) / steps.length) * 100);
      }
      
      setGenerationStatus('Project created successfully!');
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/projects');
      
    } catch (error) {
      console.error('Generation failed:', error);
      setGenerationStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
        setGenerationStatus('');
      }, 5000);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1: return projectData.name && projectData.productName;
      case 2: return projectData.productDescription;
      case 3: return true;
      default: return false;
    }
  };

  if (isGenerating) {
    return (
      <AppLayout>
        <div className="h-full flex items-center justify-center">
          <Card className="w-full max-w-lg bg-card border-border shadow-2xl rounded-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full animate-pulse opacity-20"></div>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-3">🚀 Creating Project</h3>
              <p className="text-muted-foreground mb-8 text-lg">{generationStatus}</p>
              <Progress value={generationProgress} className="h-4 mb-6" />
              <p className="text-sm text-muted-foreground">{Math.round(generationProgress)}% complete</p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const creatorActions = (
    <div className="flex gap-3">
      {apiKeyStatus === 'missing' && (
        <Button variant="outline" onClick={() => router.push('/settings')} className="gap-2">
          <span>🔑</span>
          <span>Add API Key</span>
        </Button>
      )}
      <Button 
        onClick={generateProject}
        disabled={!isStepValid(currentStep) || apiKeyStatus !== 'valid'}
        className="gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
      >
        <span>🚀</span>
        <span>Generate Project</span>
      </Button>
    </div>
  );

  return (
    <AppLayout 
      title="Project Creator" 
      subtitle="Create professional graphics campaigns with AI automation"
      actions={creatorActions}
    >
      {/* API Key Warning */}
      {apiKeyStatus === 'missing' && (
        <div className="mb-6 p-4 bg-amber-500/10 border border-amber-200 dark:border-amber-800 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-amber-600">⚠️</span>
            <span className="text-sm text-amber-800 dark:text-amber-200">
              Ideogram API key is required to generate images. Please add your API key in Settings.
            </span>
            <Button size="sm" variant="outline" onClick={() => router.push('/settings')}>
              Add API Key
            </Button>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <Card className="mb-8 bg-card border-border shadow-lg rounded-2xl">
        <CardContent className="p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-bold text-foreground">Step {currentStep} of {totalSteps}</span>
            <Badge variant="outline" className="font-mono text-base px-3 py-1">
              {Math.round(progress)}%
            </Badge>
          </div>
          <Progress value={progress} className="h-4 mb-8" />
          <div className="grid grid-cols-3 gap-6">
            {[
              { step: 1, label: 'Project Info', icon: '📋' },
              { step: 2, label: 'Product Details', icon: '🎨' },
              { step: 3, label: 'Generate', icon: '🚀' }
            ].map(item => (
              <div key={item.step} className={`text-center p-6 rounded-xl transition-all ${
                currentStep >= item.step 
                  ? 'bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-2 border-violet-300 dark:border-violet-700' 
                  : 'bg-muted/30 border-2 border-transparent'
              }`}>
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="font-bold text-lg">{item.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        {currentStep === 1 && (
          <Card className="bg-card border-border shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl">📋</div>
                <span className="text-2xl">Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label htmlFor="project-name" className="text-base font-semibold">Project Name *</Label>
                  <Input
                    id="project-name"
                    placeholder="e.g., Fitness Supplements 2024"
                    value={projectData.name}
                    onChange={(e) => updateProjectData('name', e.target.value)}
                    className="mt-3 h-12 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="product-name" className="text-base font-semibold">Product Name *</Label>
                  <Input
                    id="product-name"
                    placeholder="e.g., VitaMax Pro Whey Protein"
                    value={projectData.productName}
                    onChange={(e) => updateProjectData('productName', e.target.value)}
                    className="mt-3 h-12 text-base"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="target-audience" className="text-base font-semibold">Target Audience</Label>
                <Input
                  id="target-audience"
                  placeholder="e.g., Men 25-40, fitness enthusiasts, health-conscious individuals"
                  value={projectData.targetAudience}
                  onChange={(e) => updateProjectData('targetAudience', e.target.value)}
                  className="mt-3 h-12 text-base"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="bg-card border-border shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl">🎨</div>
                <span className="text-2xl">Product Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div>
                <Label htmlFor="product-description" className="text-base font-semibold">Product Description</Label>
                <Textarea
                  id="product-description"
                  placeholder="Detailed description of your product, its benefits, features, and unique selling points..."
                  value={projectData.productDescription}
                  onChange={(e) => updateProjectData('productDescription', e.target.value)}
                  className="mt-3 min-h-32 text-base"
                  rows={6}
                />
              </div>
              
              <div>
                <Label htmlFor="background-style" className="text-base font-semibold">Background Style</Label>
                <select
                  id="background-style"
                  value={projectData.backgroundStyle}
                  onChange={(e) => updateProjectData('backgroundStyle', e.target.value)}
                  className="mt-3 w-full p-4 border border-input rounded-xl bg-background text-base"
                >
                  <option value="modern_minimalist">🏢 Modern Minimalist</option>
                  <option value="dynamic_energetic">⚡ Dynamic Energetic</option>
                  <option value="premium_elegant">💎 Premium Elegant</option>
                  <option value="natural_organic">🌿 Natural Organic</option>
                  <option value="tech_futuristic">🚀 Tech Futuristic</option>
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="bg-card border-border shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl">🚀</div>
                <span className="text-2xl">Ready to Generate</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="bg-muted/30 rounded-2xl p-8">
                <h4 className="font-bold text-foreground mb-6 text-xl">Project Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="text-base"><strong>Project:</strong> {projectData.name}</div>
                    <div className="text-base"><strong>Product:</strong> {projectData.productName}</div>
                    <div className="text-base"><strong>Target:</strong> {projectData.targetAudience || 'Not specified'}</div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-base"><strong>Style:</strong> {projectData.backgroundStyle}</div>
                    <div className="text-base"><strong>AI Ready:</strong> {apiKeyStatus === 'valid' ? '✅ Yes' : '❌ API Key needed'}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl p-8 border border-violet-200 dark:border-violet-800">
                <h4 className="font-bold text-foreground mb-6 text-xl text-center">🎯 What Will Be Generated</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold text-primary">12</div>
                    <div className="text-base text-muted-foreground">Formats</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-purple-600">5</div>
                    <div className="text-base text-muted-foreground">Languages</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-green-600">HD+</div>
                    <div className="text-base text-muted-foreground">Quality</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-orange-600">~3min</div>
                    <div className="text-base text-muted-foreground">Time</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            size="lg"
            className="gap-2 px-8"
          >
            <span>←</span>
            <span>Previous</span>
          </Button>
          
          {currentStep < totalSteps ? (
            <Button 
              onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
              disabled={!isStepValid(currentStep)}
              size="lg"
              className="gap-2 px-8"
            >
              <span>Next</span>
              <span>→</span>
            </Button>
          ) : (
            <Button 
              onClick={generateProject}
              disabled={!isStepValid(currentStep) || apiKeyStatus !== 'valid'}
              size="lg"
              className="gap-3 px-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            >
              <span>🚀</span>
              <span>Generate Project</span>
            </Button>
          )}
        </div>
        
        {/* Validation Messages */}
        {!isStepValid(currentStep) && (
          <div className="mt-8 p-6 bg-amber-500/10 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-amber-600 text-xl">⚠️</span>
              <span className="text-base text-amber-800 dark:text-amber-200 font-medium">
                {currentStep === 1 && 'Please fill in project name and product name to continue'}
                {currentStep === 2 && 'Please add a detailed product description'}
              </span>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}