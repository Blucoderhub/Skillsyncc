// Professional Vault Management

import type {
  ProfessionalProfile,
  ResumeVersion,
  STARStory,
  PersonalInfo,
  Experience,
  Education
} from '../../types';
import { StorageManager } from '../storage/storage';

export class VaultManager {
  static async getProfile(): Promise<ProfessionalProfile | null> {
    return await StorageManager.getProfile();
  }

  static async createProfile(profile: Partial<ProfessionalProfile>): Promise<ProfessionalProfile> {
    const newProfile: ProfessionalProfile = {
      id: this.generateId(),
      personalInfo: profile.personalInfo || {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
      },
      skills: profile.skills || [],
      experiences: profile.experiences || [],
      achievements: profile.achievements || [],
      education: profile.education || [],
      resumeVersions: profile.resumeVersions || [],
      starStories: profile.starStories || [],
      outreachTemplates: profile.outreachTemplates || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await StorageManager.saveProfile(newProfile);
    return newProfile;
  }

  static async updateProfile(updates: Partial<ProfessionalProfile>): Promise<ProfessionalProfile> {
    const currentProfile = await this.getProfile();
    if (!currentProfile) {
      throw new Error('Profile not found. Please create a profile first.');
    }

    const updatedProfile: ProfessionalProfile = {
      ...currentProfile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await StorageManager.saveProfile(updatedProfile);
    return updatedProfile;
  }

  static async mergeLinkedInData(data: {
    personalInfo: Partial<PersonalInfo>;
    experiences: Experience[];
    education: Education[];
    skills: string[];
  }): Promise<ProfessionalProfile> {
    const profile = await this.getProfile();
    if (!profile) throw new Error('Profile not found');

    // Merge personal info (prefer LinkedIn if current is empty)
    profile.personalInfo.firstName = profile.personalInfo.firstName || data.personalInfo.firstName || '';
    profile.personalInfo.lastName = profile.personalInfo.lastName || data.personalInfo.lastName || '';
    profile.personalInfo.summary = profile.personalInfo.summary || data.personalInfo.summary || '';
    profile.personalInfo.linkedIn = data.personalInfo.linkedIn || profile.personalInfo.linkedIn;

    // Merge skills (add unique only)
    const currentSkills = new Set(profile.skills);
    data.skills.forEach(skill => currentSkills.add(skill));
    profile.skills = Array.from(currentSkills);

    // Merge experiences (add if not already there)
    data.experiences.forEach(exp => {
      const exists = profile.experiences.some(e => e.title === exp.title && e.company === exp.company);
      if (!exists) {
        profile.experiences.unshift({ ...exp, id: this.generateId() });
      }
    });

    profile.updatedAt = new Date().toISOString();
    await StorageManager.saveProfile(profile);
    return profile;
  }

  static async addResumeVersion(resume: Omit<ResumeVersion, 'id' | 'createdAt'>): Promise<ResumeVersion> {
    const profile = await this.getProfile();
    if (!profile) {
      throw new Error('Profile not found');
    }

    const newResume: ResumeVersion = {
      ...resume,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };

    profile.resumeVersions.push(newResume);
    await StorageManager.saveProfile(profile);
    return newResume;
  }

  static async updateResumeVersion(
    resumeId: string,
    updates: Partial<ResumeVersion>
  ): Promise<ResumeVersion> {
    const profile = await this.getProfile();
    if (!profile) {
      throw new Error('Profile not found');
    }

    const index = profile.resumeVersions.findIndex(r => r.id === resumeId);
    if (index === -1) {
      throw new Error('Resume version not found');
    }

    profile.resumeVersions[index] = {
      ...profile.resumeVersions[index],
      ...updates,
    };

    await StorageManager.saveProfile(profile);
    return profile.resumeVersions[index];
  }

  static async deleteResumeVersion(resumeId: string): Promise<void> {
    const profile = await this.getProfile();
    if (!profile) {
      throw new Error('Profile not found');
    }

    profile.resumeVersions = profile.resumeVersions.filter(r => r.id !== resumeId);
    await StorageManager.saveProfile(profile);
  }

  static async addSTARStory(story: Omit<STARStory, 'id'>): Promise<STARStory> {
    const profile = await this.getProfile();
    if (!profile) {
      throw new Error('Profile not found');
    }

    const newStory: STARStory = {
      ...story,
      id: this.generateId(),
    };

    profile.starStories.push(newStory);
    await StorageManager.saveProfile(profile);
    return newStory;
  }

  static async updateSTARStory(
    storyId: string,
    updates: Partial<STARStory>
  ): Promise<STARStory> {
    const profile = await this.getProfile();
    if (!profile) {
      throw new Error('Profile not found');
    }

    const index = profile.starStories.findIndex(s => s.id === storyId);
    if (index === -1) {
      throw new Error('STAR story not found');
    }

    profile.starStories[index] = {
      ...profile.starStories[index],
      ...updates,
    };

    await StorageManager.saveProfile(profile);
    return profile.starStories[index];
  }

  static async deleteSTARStory(storyId: string): Promise<void> {
    const profile = await this.getProfile();
    if (!profile) {
      throw new Error('Profile not found');
    }

    profile.starStories = profile.starStories.filter(s => s.id !== storyId);
    await StorageManager.saveProfile(profile);
  }

  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
