// Core types for the Job Application Copilot

export interface ProfessionalProfile {
  id: string;
  personalInfo: PersonalInfo;
  skills: string[];
  experiences: Experience[];
  achievements: Achievement[];
  education: Education[];
  resumeVersions: ResumeVersion[];
  starStories: STARStory[];
  outreachTemplates: OutreachTemplate[];
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  portfolio?: string;
  summary?: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
}

export interface ResumeVersion {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  tags: string[];
}

export interface STARStory {
  id: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  tags: string[];
}

export interface OutreachTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'referral' | 'networking' | 'follow-up';
}

export interface JobDescription {
  id: string;
  url: string;
  platform: JobPlatform;
  title: string;
  company: string;
  location?: string;
  description: string;
  requirements: string[];
  preferredQualifications: string[];
  skills: string[];
  extractedAt: string;
}

export type JobPlatform = 
  | 'linkedin' 
  | 'indeed' 
  | 'greenhouse' 
  | 'lever' 
  | 'workday' 
  | 'generic';

export interface JobMatchAnalysis {
  jobId: string;
  matchScore: number;
  semanticMatchScore?: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
  optimizedResume?: string;
  resumeDiff?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  platform: JobPlatform;
  appliedAt: string;
  resumeVersionId: string;
  status: ApplicationStatus;
  notes?: string;
  interviewDate?: string;
  outcome?: ApplicationOutcome;
}

export type ApplicationStatus = 
  | 'draft' 
  | 'applied' 
  | 'under-review' 
  | 'interview' 
  | 'offer' 
  | 'rejected' 
  | 'withdrawn';

export type ApplicationOutcome = 
  | 'accepted' 
  | 'rejected' 
  | 'no-response' 
  | 'withdrawn';

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'file' | 'date';
  label: string;
  name: string;
  value?: string;
  required: boolean;
  suggestions?: string[];
}

export interface AutofillSuggestion {
  fieldId: string;
  suggestedValue: string;
  confidence: number;
  source: 'vault' | 'ai-generated' | 'template';
}

export interface AIRequest {
  type: 'optimize-resume' | 'analyze-job' | 'generate-answer' | 'draft-outreach';
  payload: any;
}

export interface StorageData {
  profile?: ProfessionalProfile;
  applications: Application[];
  jobDescriptions: JobDescription[];
  settings: ExtensionSettings;
}

export interface ExtensionSettings {
  autoActivate: boolean;
  showMatchScore: boolean;
  requireApproval: boolean;
  premium: boolean;
  aiProvider: 'openai' | 'anthropic' | 'local';
  apiKey?: string;
  anthropicModel?: string;
  openaiModel?: string;
}
