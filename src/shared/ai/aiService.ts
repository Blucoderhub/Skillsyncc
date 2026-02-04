// AI service for resume optimization, job analysis, and content generation

import type {
  ProfessionalProfile,
  JobDescription,
  JobMatchAnalysis,
  ResumeVersion,
  ExtensionSettings
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
  private static anthropicModel: string = 'claude-3-5-sonnet-20241022';
  private static defaultSettings: ExtensionSettings = {
    autoActivate: true,
    showMatchScore: true,
    requireApproval: true,
    premium: false,
    aiProvider: 'openai',
    anthropicModel: 'claude-3-5-sonnet-20241022',
    openaiModel: 'gpt-4',
  };

  // Model selection strategy based on task complexity
  private static getModelForTask(taskType: 'quick' | 'balanced' | 'complex'): string {
    if (this.provider !== 'anthropic') {
      return this.anthropicModel; // Use current model for non-Anthropic providers
    }

    switch (taskType) {
      case 'quick':
        return 'claude-3-haiku-20240307'; // Fastest for simple tasks
      case 'balanced':
        return 'claude-3-5-sonnet-20241022'; // Best value
      case 'complex':
        return 'claude-3-opus-20240229'; // Most capable
      default:
        return this.anthropicModel;
    }
  }

  static async initialize(): Promise<void> {
    const settings = await StorageManager.getSettings();
    this.provider = settings.aiProvider;
    this.apiKey = settings.apiKey || null;

    // Set Claude-specific model if using Anthropic
    if (this.provider === 'anthropic' && settings.anthropicModel) {
      this.anthropicModel = settings.anthropicModel;
    }
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
      const analysis = await this.callAI(prompt, 'complex'); // Use Opus for complex optimization
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
      const analysis = await this.callAI(prompt, 'complex'); // Use Opus for complex job analysis

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
      const answer = await this.callAI(prompt, 'balanced'); // Use Sonnet for balanced response

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
      const data = await this.callAI(prompt, 'complex'); // Use Opus for detailed interview prep
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
      const data = await this.callAI(prompt, 'complex'); // Use Opus for detailed STAR mapping
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
      const message = await this.callAI(prompt, 'balanced'); // Use Sonnet for outreach

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
      const data = await this.callAI(prompt, 'balanced'); // Use Sonnet for balanced outreach
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
      const data = await this.callAI(prompt, 'balanced'); // Use Sonnet for balanced bullet generation
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
      const data = await this.callAI(prompt, 'quick'); // Use Haiku for quick autofill
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
      const data = await this.callAI(prompt, 'balanced'); // Use Sonnet for balanced analysis
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to identify targets' };
    }
  }

  // Technical Synergy: Deep Logical Alignment (Founders Edition)
  static async analyzeTechnicalSynergy(
    jobDescription: JobDescription,
    profile: ProfessionalProfile
  ): Promise<AIResponse> {
    try {
      await this.initialize();
      const prompt = `You are an elite Technical Architect. Analyze the "Technical Synergy" between this candidate and the job.
      Beyond keywords, find deep logical overlaps in:
      1. Architectural Patterns (e.g., Microservices, Event-driven)
      2. Problem-Solving Parallels
      3. Technology Evolution (e.g., candidate transitioned from Java to Go, job requires high-perf systems)
      
      Job: ${jobDescription.title} at ${jobDescription.company}
      Candidate Background: ${profile.personalInfo.summary}
      Experience: ${JSON.stringify(profile.experiences.slice(0, 3))}
      
      Return JSON:
      {
        "synergyScore": 0-100,
        "logicalOverlaps": ["overlap 1", "overlap 2"],
        "pitchAngle": "The unique angle the candidate should take when reaching out",
        "redFlags": ["Potential technical friction points"]
      }`;
      const data = await this.callAI(prompt, 'complex');
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Synergy analysis failed' };
    }
  }

  // Peer-Grade Endorsement: Senior Engineer Level Referral (Founders Edition)
  static async generatePeerGradeEndorsement(
    jobDescription: JobDescription,
    profile: ProfessionalProfile
  ): Promise<AIResponse> {
    try {
      await this.initialize();
      const prompt = `You are a Senior Staff Engineer at a top-tier tech firm. Write a "Peer Endorsement" for this candidate for the ${jobDescription.title} role at ${jobDescription.company}.
      
      The tone should be:
      - Highly technical and specific.
      - Collaborative (like a peer recommending a peer).
      - Focused on high-impact outcomes and "how" they solve problems.
      
      Candidate Info: ${profile.personalInfo.summary}
      Core STAR Stories: ${JSON.stringify(profile.starStories.slice(0, 2))}
      
      Return JSON:
      {
        "endorsementText": "A 2-paragraph highly technical recommendation",
        "peerSignals": ["Specific technical signals this candidate sends to other engineers"]
      }`;
      const data = await this.callAI(prompt, 'complex');
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Peer endorsement generation failed' };
    }
  }

  // ATS Guard: Shadow-Ban Protection (Founders Edition)
  static async checkATSCompatibility(
    resume: ResumeVersion,
    jobDescription: JobDescription
  ): Promise<AIResponse> {
    try {
      await this.initialize();
      const prompt = `You are an ATS (Applicant Tracking System) Expert. Audit this resume for potential "Shadow-Ban" triggers in systems like Workday, Greenhouse, or Lever.
      
      Resume: ${resume.content}
      Job context: ${jobDescription.title} at ${jobDescription.company}
      
      Check for:
      1. Parsing Errors (Complex layouts, tables, headers)
      2. Keyword "Stuffing" vs. Lack of context
      3. Missing Standard Sections
      4. Hard-Rejection triggers (e.g., specific missing certifications required)
      
      Return JSON:
      {
        "parsingRisk": "Low|Medium|High",
        "rejectionTriggers": ["trigger 1", "trigger 2"],
        "remediationSteps": ["step 1", "step 2"]
      }`;
      const data = await this.callAI(prompt, 'balanced');
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'ATS audit failed' };
    }
  }

  // Private helper methods
  private static async callAI(prompt: string, taskType: 'quick' | 'balanced' | 'complex' = 'balanced'): Promise<any> {
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
      return this.callAnthropic(prompt, taskType);
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

  private static async callAnthropic(prompt: string, taskType: 'quick' | 'balanced' | 'complex' = 'balanced'): Promise<any> {
    try {
      const model = this.getModelForTask(taskType);

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey!,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'messages-2023-12-15', // For better JSON handling
        },
        body: JSON.stringify({
          model: model,
          max_tokens: 4096,
          temperature: 0.7,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'text',
                text: `${prompt}\n\nPlease respond with valid JSON only. Do not include any markdown formatting, code blocks, or additional text. Return ONLY the JSON object as requested.`
              }
            ]
          }
          ],
          system: 'You are a precise JSON generator. Always respond with valid JSON objects. Never include markdown formatting or additional text.'
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Anthropic API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      // Claude returns content as an array of content blocks
      if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
        throw new Error('Invalid response format from Claude API');
      }

      const contentText = data.content[0].text;
      return this.parseJSONResponse(contentText);
    } catch (error) {
      console.error('Claude API call failed:', error);
      throw error;
    }
  }

  private static parseJSONResponse(text: string): any {
    // Validate input length to prevent memory issues
    if (text.length > 100000) {
      throw new Error('AI response too long to parse safely');
    }

    // Deep sanitize to remove any potential XSS threats
    let sanitized = text.replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["\'][^"\']*["\']/gi, '')
      .replace(/javascript:/gi, '')
      .trim();

    try {
      // First, try direct parsing for performance
      if (this.isJSONStructure(sanitized)) {
        const parsed = JSON.parse(sanitized);
        // Validate it's safe structure
        if (this.validateAIParsedJSON(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      // Try other strategies

      // Try to find JSON within markdown code blocks
      const codeBlockMatch = sanitized.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (codeBlockMatch?.[1] && codeBlockMatch[1].length <= 10000) {
        try {
          const extractedJson = codeBlockMatch[1].trim();
          if (this.isJSONStructure(extractedJson)) {
            const parsed = JSON.parse(extractedJson);
            if (this.validateAIParsedJSON(parsed)) {
              return parsed;
            }
          }
        } catch (innerE) {
          // Continue to next strategy
        }
      }

      // Try to extract JSON object from text
      const objectMatch = sanitized.match(/\{[\s\S]*\}/);
      if (objectMatch?.[0] && objectMatch[0].length <= 10000) {
        try {
          const extractedObject = objectMatch[0].trim();
          if (this.isJSONStructure(extractedObject)) {
            const parsed = JSON.parse(extractedObject);
            if (this.validateAIParsedJSON(parsed)) {
              return parsed;
            }
          }
        } catch (innerE) {
          // Continue to next strategy
        }
      }

      // Try to extract JSON array from text
      const arrayMatch = sanitized.match(/\[[\s\S]*\]/);
      if (arrayMatch?.[0] && arrayMatch[0].length <= 10000) {
        try {
          const extractedArray = arrayMatch[0].trim();
          if (this.isJSONStructure(extractedArray)) {
            const parsed = JSON.parse(extractedArray);
            if (this.validateAIParsedJSON(parsed)) {
              return parsed;
            }
          }
        } catch (innerE) {
          // All strategies failed
        }
      }

      throw new Error('Failed to parse AI response as valid JSON');
    }
  }

  // Helper method to validate JSON structure
  private static isJSONStructure(str: string): boolean {
    const trimmed = str.trim();
    return (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'));
  }

  // Validate that parsed JSON is safe and has expected structure
  private static validateAIParsedJSON(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    // Check for dangerous properties
    const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
    for (const key of dangerousKeys) {
      if (key in obj) {
        return false;
      }
    }

    // Check for function values
    for (const value of Object.values(obj)) {
      if (typeof value === 'function') {
        return false;
      }
    }

    return true;
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

Return ONLY a JSON object with this exact structure:
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

Return ONLY JSON with this exact structure:
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
