// Storage management for chrome.storage API

import type { 
  ProfessionalProfile, 
  Application, 
  JobDescription, 
  ExtensionSettings,
  StorageData 
} from '../../types';

const STORAGE_KEYS = {
  PROFILE: 'professional_profile',
  APPLICATIONS: 'applications',
  JOB_DESCRIPTIONS: 'job_descriptions',
  SETTINGS: 'extension_settings',
} as const;

export class StorageManager {
  // Profile Management
  static async getProfile(): Promise<ProfessionalProfile | null> {
    const result = await chrome.storage.sync.get(STORAGE_KEYS.PROFILE);
    const profile = result[STORAGE_KEYS.PROFILE] || null;
    
    // Validate profile data to prevent potential XSS
    if (profile) {
      this.validateProfileData(profile);
    }
    
    return profile;
  }

  static async saveProfile(profile: ProfessionalProfile): Promise<void> {
    // Validate profile data before saving to prevent potential XSS
    this.validateProfileData(profile);
    
    await chrome.storage.sync.set({
      [STORAGE_KEYS.PROFILE]: {
        ...profile,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  // Validation method to prevent XSS and other injection attacks
  private static validateProfileData(profile: ProfessionalProfile): void {
    // Sanitize personal info
    if (profile.personalInfo) {
      profile.personalInfo.firstName = this.sanitizeString(profile.personalInfo.firstName) || '';
      profile.personalInfo.lastName = this.sanitizeString(profile.personalInfo.lastName) || '';
      profile.personalInfo.email = this.sanitizeString(profile.personalInfo.email) || '';
      profile.personalInfo.phone = this.sanitizeString(profile.personalInfo.phone) || '';
      profile.personalInfo.location = this.sanitizeString(profile.personalInfo.location) || '';
      profile.personalInfo.summary = this.sanitizeString(profile.personalInfo.summary) || '';
      profile.personalInfo.linkedIn = this.sanitizeUrl(profile.personalInfo.linkedIn);
    }
    
    // Sanitize skills
    if (profile.skills) {
      profile.skills = profile.skills.map(skill => this.sanitizeString(skill) || '');
    }
    
    // Sanitize experiences
    if (profile.experiences) {
      profile.experiences = profile.experiences.map(exp => ({
        ...exp,
        company: this.sanitizeString(exp.company) || '',
        title: this.sanitizeString(exp.title) || '',
        description: this.sanitizeString(exp.description) || '',
        achievements: exp.achievements.map(achievement => this.sanitizeString(achievement) || ''),
        skills: exp.skills.map(skill => this.sanitizeString(skill) || '')
      }));
    }
    
    // Sanitize resume versions
    if (profile.resumeVersions) {
      profile.resumeVersions = profile.resumeVersions.map(resume => ({
        ...resume,
        name: this.sanitizeString(resume.name) || '',
        content: this.sanitizeString(resume.content) || '',
        tags: resume.tags.map(tag => this.sanitizeString(tag) || '')
      }));
    }
    
    // Sanitize STAR stories
    if (profile.starStories) {
      profile.starStories = profile.starStories.map(story => ({
        ...story,
        situation: this.sanitizeString(story.situation) || '',
        task: this.sanitizeString(story.task) || '',
        action: this.sanitizeString(story.action) || '',
        result: this.sanitizeString(story.result) || '',
        tags: story.tags.map(tag => this.sanitizeString(tag) || '')
      }));
    }
  }

  private static sanitizeString(str: string | undefined): string | undefined {
    if (!str) return str;
    
    // Remove potentially dangerous characters and patterns
    return str
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '') // Remove iframe tags
      .replace(/<object[^>]*>.*?<\/object>/gi, '') // Remove object tags
      .replace(/<embed[^>]*>.*?<\/embed>/gi, '') // Remove embed tags
      .replace(/<img[^>]*on\w+\s*=\s*["'][^"']*["'][^>]*>/gi, '') // Remove img tags with event handlers
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, ''); // Remove event handlers
  }

  private static sanitizeUrl(url: string | undefined): string | undefined {
    if (!url) return url;
    
    try {
      const urlObj = new URL(url);
      // Only allow http and https protocols
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return undefined;
      }
      return url;
    } catch {
      // If URL is malformed, return undefined
      return undefined;
    }
  }

  // Applications Management
  static async getApplications(): Promise<Application[]> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.APPLICATIONS);
    return result[STORAGE_KEYS.APPLICATIONS] || [];
  }

  static async saveApplication(application: Application): Promise<void> {
    const applications = await this.getApplications();
    const index = applications.findIndex(a => a.id === application.id);
    
    if (index >= 0) {
      applications[index] = application;
    } else {
      applications.push(application);
    }
    
    await chrome.storage.local.set({
      [STORAGE_KEYS.APPLICATIONS]: applications,
    });
  }

  static async deleteApplication(applicationId: string): Promise<void> {
    const applications = await this.getApplications();
    const filtered = applications.filter(a => a.id !== applicationId);
    await chrome.storage.local.set({
      [STORAGE_KEYS.APPLICATIONS]: filtered,
    });
  }

  // Job Descriptions Management
  static async getJobDescriptions(): Promise<JobDescription[]> {
    const result = await chrome.storage.local.get(STORAGE_KEYS.JOB_DESCRIPTIONS);
    return result[STORAGE_KEYS.JOB_DESCRIPTIONS] || [];
  }

  static async saveJobDescription(job: JobDescription): Promise<void> {
    const jobs = await this.getJobDescriptions();
    const index = jobs.findIndex(j => j.id === job.id);
    
    if (index >= 0) {
      jobs[index] = job;
    } else {
      jobs.push(job);
    }
    
    await chrome.storage.local.set({
      [STORAGE_KEYS.JOB_DESCRIPTIONS]: jobs,
    });
  }

  // Settings Management
  static async getSettings(): Promise<ExtensionSettings> {
    const result = await chrome.storage.sync.get(STORAGE_KEYS.SETTINGS);
    return result[STORAGE_KEYS.SETTINGS] || {
      autoActivate: true,
      showMatchScore: true,
      requireApproval: true,
      premium: false,
      aiProvider: 'openai',
    };
  }

  static async saveSettings(settings: ExtensionSettings): Promise<void> {
    await chrome.storage.sync.set({
      [STORAGE_KEYS.SETTINGS]: settings,
    });
  }

  // Bulk Operations
  static async getAllData(): Promise<StorageData> {
    const [profile, applications, jobDescriptions, settings] = await Promise.all([
      this.getProfile(),
      this.getApplications(),
      this.getJobDescriptions(),
      this.getSettings(),
    ]);

    return {
      profile: profile || undefined,
      applications,
      jobDescriptions,
      settings,
    };
  }

  static async clearAllData(): Promise<void> {
    await Promise.all([
      chrome.storage.sync.clear(),
      chrome.storage.local.clear(),
    ]);
  }
}
