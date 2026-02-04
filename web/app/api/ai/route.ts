import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getToken } from '@/lib/auth';

// AI Service Integration
export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'optimize_resume':
        return await optimizeResume(data, token.userId);
      
      case 'analyze_job':
        return await analyzeJob(data, token.userId);
      
      case 'generate_cover_letter':
        return await generateCoverLetter(data, token.userId);
      
      case 'generate_interview_questions':
        return await generateInterviewQuestions(data, token.userId);
      
      case 'optimize_profile':
        return await optimizeProfile(data, token.userId);
      
      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('AI Service error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function optimizeResume(data: any, userId: string) {
  // Integration with OpenAI/Anthropic
  const prompt = `Optimize this resume for the job description:
  
  Job: ${data.jobTitle} at ${data.company}
  Description: ${data.jobDescription}
  Requirements: ${data.requirements?.join(', ')}
  
  Current Resume:
  ${data.resumeContent}
  
  Provide optimization suggestions and improved content.`;

  const aiResponse = await callAI(prompt);
  
  // Track usage
  await trackAnalytics('ai_resume_optimization', {
    jobTitle: data.jobTitle,
    company: data.company,
  }, userId);

  return NextResponse.json({ 
    success: true, 
    optimizedResume: aiResponse.content,
    suggestions: aiResponse.suggestions || []
  });
}

async function analyzeJob(data: any, userId: string) {
  const prompt = `Analyze this job description and provide:
  1. Match score (0-100) for a typical software developer
  2. Key requirements breakdown
  3. Recommended skills to highlight
  4. Potential red flags
  
  Job: ${data.title} at ${data.company}
  Description: ${data.description}`;

  const aiResponse = await callAI(prompt);
  
  await trackAnalytics('ai_job_analysis', {
    jobTitle: data.title,
    company: data.company,
  }, userId);

  return NextResponse.json({
    success: true,
    analysis: aiResponse
  });
}

async function generateCoverLetter(data: any, userId: string) {
  const prompt = `Generate a professional cover letter for:
  
  Job: ${data.jobTitle} at ${data.company}
  Description: ${data.jobDescription}
  Candidate Profile: ${data.profileSummary}
  
  Create a compelling, personalized cover letter.`;

  const aiResponse = await callAI(prompt);
  
  await trackAnalytics('ai_cover_letter_generated', {
    jobTitle: data.jobTitle,
    company: data.company,
  }, userId);

  return NextResponse.json({
    success: true,
    coverLetter: aiResponse.content
  });
}

async function generateInterviewQuestions(data: any, userId: string) {
  const prompt = `Generate likely interview questions for:
  
  Job: ${data.jobTitle} at ${data.company}
  Requirements: ${data.requirements?.join(', ')}
  Candidate Skills: ${data.candidateSkills?.join(', ')}
  
  Provide 10-15 questions with tips for answering each.`;

  const aiResponse = await callAI(prompt);
  
  await trackAnalytics('ai_interview_questions', {
    jobTitle: data.jobTitle,
    company: data.company,
  }, userId);

  return NextResponse.json({
    success: true,
    questions: aiResponse.questions || []
  });
}

async function optimizeProfile(data: any, userId: string) {
  const prompt = `Optimize this professional profile for better job matching:
  
  Current Profile:
  Summary: ${data.summary}
  Skills: ${data.skills?.join(', ')}
  Experience: ${data.experiences?.map((exp: any) => `${exp.title} at ${exp.company}`).join(', ')}
  
  Provide suggestions for improvement.`;

  const aiResponse = await callAI(prompt);
  
  await trackAnalytics('ai_profile_optimization', {}, userId);

  return NextResponse.json({
    success: true,
    suggestions: aiResponse.suggestions || []
  });
}

async function callAI(prompt: string) {
  // Get user's AI settings
  const settings = await getUserSettings(userId);
  
  if (settings.aiProvider === 'openai' && settings.apiKey) {
    return await callOpenAI(prompt, settings.apiKey);
  } else if (settings.aiProvider === 'anthropic' && settings.apiKey) {
    return await callAnthropic(prompt, settings.apiKey);
  } else {
    throw new Error('AI provider not configured');
  }
}

async function callOpenAI(prompt: string, apiKey: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API error');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropic(prompt: string, apiKey: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-opus-20240229',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error('Anthropic API error');
  }

  const data = await response.json();
  return data.content[0].text;
}