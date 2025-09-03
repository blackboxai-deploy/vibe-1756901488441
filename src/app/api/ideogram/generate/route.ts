import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'API key required. Please add your Ideogram API key in Settings.',
        code: 'MISSING_API_KEY'
      }, { status: 401 });
    }
    
    if (!body.prompt) {
      return NextResponse.json({
        success: false,
        error: 'Prompt is required'
      }, { status: 400 });
    }
    
    const ideogramRequest = {
      image_request: {
        model: body.model || 'V_2',
        prompt: body.prompt,
        aspect_ratio: body.aspect_ratio || 'ASPECT_1_1',
        magic_prompt_option: body.magic_prompt_option || 'AUTO',
        style_type: body.style_type || 'AUTO',
        num_images: body.num_images || 1,
        negative_prompt: body.negative_prompt
      }
    };
    
    console.log('Sending request to Ideogram:', ideogramRequest);
    
    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ideogramRequest),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ideogram API Error:', response.status, errorText);
      
      return NextResponse.json({
        success: false,
        error: `Ideogram API Error: ${response.status}`,
        details: errorText,
        code: response.status === 401 ? 'INVALID_API_KEY' : 'API_ERROR'
      }, { status: response.status });
    }
    
    const result = await response.json();
    console.log('Ideogram API Success:', result);
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Image generated successfully'
    });
    
  } catch (error) {
    console.error('Generate endpoint error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Ideogram Generate API v3',
    method: 'POST',
    description: 'Generate images using Ideogram AI',
    required_headers: ['x-api-key'],
    required_fields: ['prompt'],
    models: ['V_2', 'V_2_TURBO'],
    aspect_ratios: ['ASPECT_1_1', 'ASPECT_16_9', 'ASPECT_9_16'],
    style_types: ['AUTO', 'DESIGN', 'PHOTO', 'RENDER'],
    status: 'Ready for professional graphics automation'
  });
}