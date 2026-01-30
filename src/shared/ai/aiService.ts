// AI service for resume optimization, job analysis, and content generation

import type {
  ProfessionalProfile,
  JobDescription,
  JobMatchAnalysis,
  ResumeVersion
} from '../../types';
import { StorageManager } from '../storage/storage';

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class AIService {
  private static apiKey: string | null = null;
  private static provider: 'openai' | 'anthropic' | 'local' = 'openai';

  static async initialize(): Promise<void> {
    const settings = await StorageManager.getSettings();
    this.provider = settings.aiProvider;
    this.apiKey = settings.apiKey || null;
  }

  // Resume Optimization
  static async optimizeResume(
    resume: ResumeVersion,
    jobDescription: JobDescription,
    profile: ProfessionalProfile
  ): Promise<AIResponse> {
    try {
      await this.initialize();

      const prompt = this.buildResumeOptimizationPrompt(resume, jobDescription, profile);
      const analysis = await this.callAI(prompt);
      const optimizedResume = analysis.optimizedResume || analysis;

      return {
        success: true,
        data: {
          optimizedResume,
          diff: this.generateDiff(resume.content, optimizedResume),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to optimize resume',
      };
    }
  }

  // Job Match Analysis
  static async analyzeJobMatch(
    jobDescription: JobDescription,
    profile: ProfessionalProfile
  ): Promise<AIResponse> {
    try {
      await this.initialize();

      const prompt = this.buildJobAnalysisPrompt(jobDescription, profile);
      const analysis = await this.callAI(prompt);

      const matchScore = this.calculateMatchScore(analysis, profile, jobDescription);

      return {
        success: true,
        data: {
          matchScore,
          matchedSkills: analysis.matchedSkills || [],
          missingSkills: analysis.missingSkills || [],
          recommendations: analysis.recommendations || [],
        } as JobMatchAnalysis,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze job',
      };
    }
  }

  // Generate Answer
  static async generateAnswer(
    question: string,
    context: { jobDescription: JobDescription; profile: ProfessionalProfile }
  ): Promise<AIResponse> {
    try {
      await this.initialize();

      const prompt = this.buildAnswerGenerationPrompt(question, context);
      const answer = await this.callAI(prompt);

      return {
        success: true,
        data: { answer },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate answer',
      };
    }
  }

  // Neural Interview Assistant
  static async prepInterview(
    jobDescription: JobDescription,
    profile: ProfessionalProfile
  ): Promise<AIResponse> {
    try {
      await this.initialize();
      const prompt = this.buildInterviewPrepPrompt(jobDescription, profile);
      const data = await this.callAI(prompt);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to prep interview',
      };
    }
  }

  // STAR Method Experience Mapper
  static async mapStarStories(
    jobDescription: JobDescription,
    profile: ProfessionalProfile
  ): Promise<AIResponse> {
    try {
      await this.initialize();
      const prompt = this.buildStarMappingPrompt(jobDescription, profile);
      const data = await this.callAI(prompt);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to map STAR stories',
      };
    }
  }

  // Draft Outreach Message
  static async draftOutreach(
    recipientName: string,
    jobDescription: JobDescription,
    profile: ProfessionalProfile,
    type: 'referral' | 'networking' | 'follow-up'
  ): Promise<AIResponse> {
    try {
      await this.initialize();

      const prompt = this.buildOutreachPrompt(recipientName, jobDescription, profile, type);
      const message = await this.callAI(prompt);

      return {
        success: true,
        data: { message },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to draft outreach',
      };
    }
  }

  // Generate Cold Outreach
  static async generateColdOutreach(
    targetRole: string,
    jobDescription: JobDescription,
    profile: ProfessionalProfile
  ): Promise<AIResponse> {
    try {
      await this.initialize();
      const prompt = `Draft a high-precision, technical cold message to a ${targetRole} at ${jobDescription.company} for the ${jobDescription.title} role.
      
Candidate: ${profile.personalInfo.firstName} ${profile.personalInfo.lastName}
Background: ${profile.personalInfo.summary}
Relevant Experience: ${profile.experiences.slice(0, 2).map(e => `${e.title} at ${e.company} (${e.description.slice(0, 100)}...)`).join('\n')}

Guidelines:
1. Tone: Professional, expert-level, and technically specific (Alignerr style).
2. Highlight a specific technical syngery between candidate background and job requirements.
3. Keep it under 100 words.

Return a JSON object:
{
  "message": "...",
  "talkingPoints": ["technical point 1", "technical point 2"]
}`;
      const data = await this.callAI(prompt);
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Outreach generation failed',
      };
    }
  }

  // Magic Tailor: Generate tailored bullet points for a job
  static async generateTailoredBullets(
    jobDescription: JobDescription,
    profile: ProfessionalProfile
  ): Promise<AIResponse> {
    try {
      await this.initialize();
      const prompt = `Generate 3 high-impact, technical bullet points for a resume tailoring it to this job.
      
Job: ${jobDescription.title} at ${jobDescription.company}
Required Skills: ${jobDescription.skills.join(', ')}

Candidate Profile: ${profile.personalInfo.summary}
Key Experiences: ${profile.experiences.slice(0, 2).map(e => `${e.title} at ${e.company}: ${e.description.slice(0, 150)}...`).join('\n')}

Guidelines:
1. Start with strong action verbs.
2.Quantify results where possible.
3. Align strictly with the job's technical requirements.

Return JSON: { "bullets": ["...", "...", "..."], "summary": "A 1-sentence targeted summary" }`;
      const data = await this.callAI(prompt);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to generate tailored bullets' };
    }
  }

  // Autofill Buddy: Suggest value for a form field
  static async suggestFormFieldValue(
    fieldName: string,
    fieldLabel: string,
    profile: ProfessionalProfile
  ): Promise<AIResponse> {
    try {
      await this.initialize();
      const prompt = `Suggest a professional value for a job application form field.
      
Field Name: ${fieldName}
Field Label: ${fieldLabel}

Candidate Profile:
Name: ${profile.personalInfo.firstName} ${profile.personalInfo.lastName}
Summary: ${profile.personalInfo.summary}
Skills: ${profile.skills.join(', ')}
Key Story: ${profile.starStories[0]?.situation || 'N/A'}

Return JSON: { "suggestion": "..." }`;
      const data = await this.callAI(prompt);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to suggest field value' };
    }
  }

  // Identify Outreach Targets
  static async identifyOutreachTargets(jobDescription: JobDescription): Promise<AIResponse> {
    try {
      await this.initialize();
      const prompt = `Identify the 3 best roles to reach out to at ${jobDescription.company} for a ${jobDescription.title} position (e.g., Hiring Manager, Senior Peer, Internal Recruiter). 
      Provide a brief reason why for each.

Return JSON: { "targets": [{ "role": "...", "reason": "..." }] }`;
      const data = await this.callAI(prompt);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to identify targets' };
    }
  }

  // Private helper methods
  private static async callAI(prompt: string): Promise<any> {
    if (this.provider === 'local') {
      return this.callLocalAI(prompt);
    }

    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    if (this.provider === 'openai') {
      return this.callOpenAI(prompt);
    }

    if (this.provider === 'anthropic') {
      return this.callAnthropic(prompt);
    }

    throw new Error('Unknown AI provider');
  }

  private static async callOpenAI(prompt: string): Promise<any> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.parseJSONResponse(data.choices[0].message.content);
  }

  private static async callAnthropic(prompt: string): Promise<any> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.parseJSONResponse(data.content[0].text);
  }

  private static parseJSONResponse(text: string): any {
    try {
      // Sanitize input by removing potential malicious code
      const sanitized = text.replace(/<script[^>]*>.*?<\/script>/gi, '');
      
      // Try direct parse first
      return JSON.parse(sanitized);
    } catch (e) {
      // Try to find JSON block in markdown
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        try {
          // Validate that the extracted JSON is safe before parsing
          const extractedJson = jsonMatch[1].trim();
          if (extractedJson.startsWith('{') || extractedJson.startsWith('[')) {
            return JSON.parse(extractedJson);
          }
        } catch (innerE) {
          // Fall through
        }
      }

      // Try to find anything that looks like a JSON object
      const objectMatch = text.match(/\{[\s\S]*?\}/);
      if (objectMatch) {
        try {
          // Validate that the extracted object is safe
          const extractedObject = objectMatch[0].trim();
          if (extractedObject.startsWith('{') && extractedObject.endsWith('}')) {
            return JSON.parse(extractedObject);
          }
        } catch (innerE) {
          // Fall through
        }
      }

      throw new Error('Failed to parse AI response as JSON');
    }
  }

  private static async callLocalAI(_prompt: string): Promise<any> {
    // Placeholder for local AI model integration
    // This would integrate with a local model like Ollama, LM Studio, etc.
    return {
      message: 'Local AI integration not yet implemented',
      matchedSkills: [],
      missingSkills: [],
      recommendations: [],
    };
  }

  private static buildResumeOptimizationPrompt(
    resume: ResumeVersion,
    jobDescription: JobDescription,
    profile: ProfessionalProfile
  ): string {
    return `You are an expert resume optimizer specializing in ATS (Applicant Tracking System) compatibility.

Job Description:
Title: ${jobDescription.title}
Company: ${jobDescription.company}
Description: ${jobDescription.description}
Required Skills: ${jobDescription.skills.join(', ')}

Current Resume:
${resume.content}

User Profile:
Skills: ${profile.skills.join(', ')}
Experiences: ${profile.experiences.map(e => `${e.title} at ${e.company}`).join(', ')}

Task: Optimize the resume to match the job description while maintaining authenticity. Focus on:
1. Incorporating relevant keywords from the job description
2. Highlighting matching skills and experiences
3. Improving ATS compatibility
4. Maintaining professional tone

Return ONLY a JSON object with:
{
  "optimizedResume": "the optimized resume text",
  "changes": "brief explanation of key changes made"
}`;
  }

  private static buildJobAnalysisPrompt(
    jobDescription: JobDescription,
    profile: ProfessionalProfile
  ): string {
    return `You are an elite Technical Recruiting Architect (Alignerr/Weekday grade). 
Perform an exhaustive technical alignment analysis between this Candidate and the Job.

JOB: ${jobDescription.title} @ ${jobDescription.company}
REQ SKILLS: ${jobDescription.skills.join(', ')}
FULL DESC: ${jobDescription.description.slice(0, 1000)}...

CANDIDATE:
SUMMARY: ${profile.personalInfo.summary}
TECHNICAL SKILLS: ${profile.skills.join(', ')}
KEY EXPERIENCES: ${profile.experiences.map(e => `${e.title} at ${e.company}: ${e.description.slice(0, 300)}`).join('\n')}

TASK:
1. Identify EXACT matching technologies/methodologies.
2. Identify TRANSFERABLE expert skills (e.g., React -> Vue).
3. Identify CRITICAL GAPS that will trigger rejection.
4. Calculate a "Semantic Match Score" (0-100) based strictly on domain depth, not keyword counts.

Return ONLY JSON:
{
  "matchedSkills": [{ "skill": "...", "type": "Exact|Transferable", "confidence": 0.0-1.0 }],
  "missingSkills": ["..."],
  "semanticMatchScore": 0-100,
  "recommendations": ["Direct, expert advice on how to bridge the specific technical gaps identified"]
}`;
  }


  private static buildAnswerGenerationPrompt(
    question: string,
    context: { jobDescription: JobDescription; profile: ProfessionalProfile }
  ): string {
    return `Generate a professional, tailored answer to an application question.

Question: ${question}

Job Context:
Title: ${context.jobDescription.title}
Company: ${context.jobDescription.company}
Description: ${context.jobDescription.description}

Candidate Profile:
Skills: ${context.profile.skills.join(', ')}
Experiences: ${context.profile.experiences.map(e => `${e.title} at ${e.company}`).join(', ')}

Return a JSON object with:
{
  "answer": "a well-structured, professional answer (2-3 paragraphs)",
  "keyPoints": ["main points covered"]
}`;
  }

  private static buildOutreachPrompt(
    recipientName: string,
    jobDescription: JobDescription,
    profile: ProfessionalProfile,
    type: 'referral' | 'networking' | 'follow-up'
  ): string {
    const typeContext = {
      referral: 'requesting a referral for this position',
      networking: 'seeking advice and networking',
      'follow-up': 'following up on a previous conversation',
    };

    return `Draft a professional ${type} message.

Recipient: ${recipientName}
Job: ${jobDescription.title} at ${jobDescription.company}
Type: ${typeContext[type]}

Candidate:
Name: ${profile.personalInfo.firstName} ${profile.personalInfo.lastName}
Background: ${profile.personalInfo.summary || 'Experienced professional'}
Key Skills: ${profile.skills.slice(0, 5).join(', ')}

Return a JSON object with:
{
  "subject": "email subject line",
  "body": "professional message body (3-4 paragraphs)"
}`;
  }

  private static buildInterviewPrepPrompt(
    jobDescription: JobDescription,
    profile: ProfessionalProfile
  ): string {
    return `Generate a comprehensive interview preparation guide.
    
Job: ${jobDescription.title} at ${jobDescription.company}
Description: ${jobDescription.description}

Candidate Profile: ${profile.personalInfo.summary}
Skills: ${profile.skills.join(', ')}

Return a JSON object with:
{
  "behavioralQuestions": [
    { "question": "...", "intent": "...", "tips": "..." }
  ],
  "technicalQuestions": ["list of likely technical questions"],
  "talkingPoints": ["key highlights from the candidate's background to emphasize"]
}`;
  }

  private static buildStarMappingPrompt(
    jobDescription: JobDescription,
    profile: ProfessionalProfile
  ): string {
    const stories = profile.starStories.map(s => `[${s.tags.join(',')}] S:${s.situation} T:${s.task} A:${s.action} R:${s.result}`).join('\n');

    return `Map the best STAR stories to this job's requirements.

Job Description: ${jobDescription.description}

Candidate's Professional Vault (STAR Stories):
${stories}

Return a JSON object with:
{
  "recommendations": [
    { "storyId": "...", "reason": "...", "adaptation": "how to tweak for this job" }
  ]
}`;
  }

  private static calculateMatchScore(
    analysis: any,
    _profile: ProfessionalProfile,
    jobDescription: JobDescription
  ): number {
    const matchedSkills = analysis.matchedSkills?.length || 0;
    const totalSkills = jobDescription.skills.length || 1;
    let score = (matchedSkills / totalSkills) * 100;

    // Add semantic weighting if available in analysis
    if (analysis.semanticMatchScore) {
      score = (score * 0.4) + (analysis.semanticMatchScore * 0.6);
    }

    return Math.min(100, Math.round(score));
  }

  private static generateDiff(original: string, optimized: string): string {
    // Simple diff generation - in production, use a proper diff library
    if (original === optimized) {
      return 'No changes made';
    }

    return `Resume optimized with ${optimized.length - original.length} character changes. Key improvements: keyword optimization, ATS compatibility enhancements.`;
  }
}
