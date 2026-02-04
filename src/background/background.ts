// Background Service Worker for Job Application Copilot

import { StorageManager } from '../shared/storage/storage';
import { VaultManager } from '../shared/vault/vaultManager';
import { AIService } from '../shared/ai/aiService';
import type {
  JobDescription,
  Application
} from '../types';

// Initialize on install
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Job Application Copilot installed');

  // Set default settings if not exists
  const settings = await StorageManager.getSettings();
  if (!settings) {
    await StorageManager.saveSettings({
      autoActivate: true,
      showMatchScore: true,
      requireApproval: true,
      premium: false,
      aiProvider: 'openai',
    });
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender)
    .then(response => sendResponse({ success: true, data: response }))
    .catch(error => sendResponse({ success: false, error: error.message }));

  return true; // Keep channel open for async response
});

async function handleMessage(message: any, sender: chrome.runtime.MessageSender) {
  switch (message.type) {
    case 'EXTRACT_JOB_DESCRIPTION':
      return await handleExtractJobDescription(sender.tab?.id);

    case 'ANALYZE_JOB_MATCH':
      return await handleAnalyzeJobMatch(message.payload);

    case 'OPTIMIZE_RESUME':
      return await handleOptimizeResume(message.payload);

    case 'GENERATE_ANSWER':
      return await handleGenerateAnswer(message.payload);

    case 'DRAFT_OUTREACH':
      return await handleDraftOutreach(message.payload);

    case 'SAVE_APPLICATION':
      return await handleSaveApplication(message.payload);

    case 'PREP_INTERVIEW':
      return await handlePrepInterview(message.payload);

    case 'MAP_STAR_STORIES':
      return await handleMapStarStories(message.payload);

    case 'IMPORT_LINKEDIN_PROFILE':
      return await handleImportLinkedInProfile();

    case 'IDENTIFY_OUTREACH_TARGETS':
      return await handleIdentifyOutreachTargets(message.payload);

    case 'GENERATE_COLD_OUTREACH':
      return await handleGenerateColdOutreach(message.payload);

    case 'GET_APPLICATIONS':
      return await StorageManager.getApplications();

    case 'GET_PROFILE':
      return await StorageManager.getProfile();

    case 'GENERATE_TAILORED_BULLETS':
      return await handleGenerateTailoredBullets(message.payload);

    case 'SUGGEST_FORM_FIELD':
      return await handleSuggestFormFieldValue(message.payload);

    case 'ANALYZE_TECHNICAL_SYNERGY':
      return await handleAnalyzeTechnicalSynergy(message.payload);

    case 'GENERATE_PEER_ENDORSEMENT':
      return await handleGeneratePeerEndorsement(message.payload);

    case 'CHECK_ATS_COMPATIBILITY':
      return await handleCheckATSCompatibility(message.payload);

    case 'UPDATE_PROFILE':
      return await handleUpdateProfile(message.payload);

    case 'GET_DASHBOARD_STATS':
      return await handleGetDashboardStats();

    default:
      throw new Error(`Unknown message type: ${message.type}`);
  }
}

async function handleUpdateProfile(profile: any) {
  await StorageManager.saveProfile(profile);
  return { success: true };
}

async function handleGetDashboardStats() {
  const applications = await StorageManager.getApplications();
  const profile = await StorageManager.getProfile();

  // Calculate stats
  const totalApplications = applications.length;
  const interviews = applications.filter(app => app.status === 'interview').length;
  const offers = applications.filter(app => app.status === 'offer').length;

  // Calculate match rate based on applications with scores
  const matchRate = profile ? 92 : 0; // Placeholder - would calculate from actual match data

  return {
    applications: totalApplications,
    interviews,
    offers,
    matchRate
  };
}

async function handleExtractJobDescription(tabId?: number): Promise<JobDescription> {
  if (!tabId) {
    throw new Error('Tab ID not provided');
  }

  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: extractJobDescriptionFromPage,
  });

  const jobData = results[0]?.result;
  if (!jobData || !jobData.url) {
    throw new Error('Failed to extract valid job data from page');
  }

  const jobDescription: JobDescription = {
    id: generateJobId(jobData.url),
    url: jobData.url,
    platform: jobData.platform as any,
    title: jobData.title,
    company: jobData.company,
    location: jobData.location,
    description: jobData.description,
    requirements: jobData.requirements || [],
    preferredQualifications: jobData.preferredQualifications || [],
    skills: extractSkills(jobData.description),
    extractedAt: new Date().toISOString(),
  };

  await StorageManager.saveJobDescription(jobDescription);
  return jobDescription;
}

async function handleAnalyzeJobMatch(payload: { jobId: string }) {
  const profile = await StorageManager.getProfile();
  if (!profile) {
    throw new Error('Profile not found. Please set up your professional vault first.');
  }

  const jobs = await StorageManager.getJobDescriptions();
  const job = jobs.find(j => j.id === payload.jobId);
  if (!job) {
    throw new Error('Job description not found');
  }

  const result = await AIService.analyzeJobMatch(job, profile);
  if (!result.success) {
    throw new Error(result.error || 'Failed to analyze job match');
  }

  return result.data;
}

async function handleOptimizeResume(payload: {
  resumeId: string;
  jobId: string;
}) {
  const profile = await StorageManager.getProfile();
  if (!profile) {
    throw new Error('Profile not found');
  }

  const resume = profile.resumeVersions.find(r => r.id === payload.resumeId);
  if (!resume) {
    throw new Error('Resume not found');
  }

  const jobs = await StorageManager.getJobDescriptions();
  const job = jobs.find(j => j.id === payload.jobId);
  if (!job) {
    throw new Error('Job description not found');
  }

  const result = await AIService.optimizeResume(resume, job, profile);
  if (!result.success) {
    throw new Error(result.error || 'Failed to optimize resume');
  }

  return result.data;
}

async function handleGenerateAnswer(payload: {
  question: string;
  jobId: string;
}) {
  const profile = await StorageManager.getProfile();
  if (!profile) {
    throw new Error('Profile not found');
  }

  const jobs = await StorageManager.getJobDescriptions();
  const job = jobs.find(j => j.id === payload.jobId);
  if (!job) {
    throw new Error('Job description not found');
  }

  const result = await AIService.generateAnswer(payload.question, {
    jobDescription: job,
    profile,
  });

  if (!result.success) {
    throw new Error(result.error || 'Failed to generate answer');
  }

  return result.data;
}

async function handleDraftOutreach(payload: {
  recipientName: string;
  jobId: string;
  type: 'referral' | 'networking' | 'follow-up';
}) {
  const profile = await StorageManager.getProfile();
  if (!profile) {
    throw new Error('Profile not found');
  }

  const jobs = await StorageManager.getJobDescriptions();
  const job = jobs.find(j => j.id === payload.jobId);
  if (!job) {
    throw new Error('Job description not found');
  }

  const result = await AIService.draftOutreach(
    payload.recipientName,
    job,
    profile,
    payload.type
  );

  if (!result.success) {
    throw new Error(result.error || 'Failed to draft outreach');
  }

  return result.data;
}

async function handleSaveApplication(application: Application) {
  await StorageManager.saveApplication(application);
  return application;
}

async function handlePrepInterview(payload: { jobId: string }) {
  const profile = await StorageManager.getProfile();
  if (!profile) throw new Error('Profile not found');

  const jobs = await StorageManager.getJobDescriptions();
  const job = jobs.find(j => j.id === payload.jobId);
  if (!job) throw new Error('Job not found');

  const result = await AIService.prepInterview(job, profile);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

async function handleMapStarStories(payload: { jobId: string }) {
  const profile = await StorageManager.getProfile();
  if (!profile) throw new Error('Profile not found');

  const jobs = await StorageManager.getJobDescriptions();
  const job = jobs.find(j => j.id === payload.jobId);
  if (!job) throw new Error('Job not found');

  const result = await AIService.mapStarStories(job, profile);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

async function handleImportLinkedInProfile() {
  const tabs = await chrome.tabs.query({ url: '*://www.linkedin.com/in/*' });
  if (tabs.length === 0) {
    throw new Error('Please open your LinkedIn profile page first.');
  }

  const tabId = tabs[0].id!;

  // First, ensure the scraper is injected or available
  // For simplicity here, we'll execute a script that returns the data needed
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      // In-page scraper logic (simplified version of LinkedInScraper)
      const name = document.querySelector('.text-heading-xlarge')?.textContent?.trim() || '';
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const summary = document.querySelector('#about')?.parentElement?.querySelector('.display-flex.mt2')?.textContent?.trim() || '';

      const experiences: any[] = [];
      document.querySelectorAll('#experience ~ .pvs-list__outer-container > ul > li').forEach((el) => {
        const title = el.querySelector('.t-bold span')?.textContent?.trim() || '';
        const company = el.querySelector('.t-14.t-normal span')?.textContent?.trim() || '';
        experiences.push({ title, company, current: true });
      });

      const skills: string[] = [];
      document.querySelectorAll('#skills ~ .pvs-list__outer-container .pvs-list span[aria-hidden="true"]').forEach(el => {
        const skill = el.textContent?.trim();
        if (skill && !skills.includes(skill)) skills.push(skill);
      });

      return {
        personalInfo: { firstName, lastName, summary, linkedIn: window.location.href },
        experiences,
        education: [],
        skills
      };
    }
  });

  const scrapedData = results[0].result;
  await VaultManager.mergeLinkedInData(scrapedData as any);
  return { success: true };
}

async function handleIdentifyOutreachTargets(payload: { jobId: string }) {
  const jobs = await StorageManager.getJobDescriptions();
  const job = jobs.find(j => j.id === payload.jobId);
  if (!job) throw new Error('Job not found');
  const result = await AIService.identifyOutreachTargets(job);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

async function handleGenerateColdOutreach(payload: { jobId: string, targetRole: string }) {
  const profile = await StorageManager.getProfile();
  if (!profile) throw new Error('Profile not found');
  const jobs = await StorageManager.getJobDescriptions();
  const job = jobs.find(j => j.id === payload.jobId);
  if (!job) throw new Error('Job not found');
  const result = await AIService.generateColdOutreach(payload.targetRole, job, profile);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

async function handleGenerateTailoredBullets(payload: { jobId: string }) {
  const profile = await StorageManager.getProfile();
  if (!profile) throw new Error('Profile not found');
  const jobs = await StorageManager.getJobDescriptions();
  const job = jobs.find(j => j.id === payload.jobId);
  if (!job) throw new Error('Job not found');
  const result = await AIService.generateTailoredBullets(job, profile);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

async function handleSuggestFormFieldValue(payload: { fieldName: string, fieldLabel: string }) {
  const profile = await StorageManager.getProfile();
  if (!profile) throw new Error('Profile not found');
  const result = await AIService.suggestFormFieldValue(payload.fieldName, payload.fieldLabel, profile);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

async function handleAnalyzeTechnicalSynergy(payload: { jobId: string }) {
  const profile = await StorageManager.getProfile();
  const jobs = await StorageManager.getJobDescriptions();
  const job = jobs.find(j => j.id === payload.jobId);
  if (!profile || !job) throw new Error('Profile or job not found');
  const result = await AIService.analyzeTechnicalSynergy(job, profile);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

async function handleGeneratePeerEndorsement(payload: { jobId: string }) {
  const profile = await StorageManager.getProfile();
  const jobs = await StorageManager.getJobDescriptions();
  const job = jobs.find(j => j.id === payload.jobId);
  if (!profile || !job) throw new Error('Profile or job not found');
  const result = await AIService.generatePeerGradeEndorsement(job, profile);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

async function handleCheckATSCompatibility(payload: { jobId: string }) {
  const profile = await StorageManager.getProfile();
  const jobs = await StorageManager.getJobDescriptions();
  const job = jobs.find(j => j.id === payload.jobId);
  if (!profile || !job) throw new Error('Profile or job not found');
  const resume = profile.resumeVersions[0]; // Take primary
  const result = await AIService.checkATSCompatibility(resume, job);
  if (!result.success) throw new Error(result.error);
  return result.data;
}

// Helper function to extract job description from page
function extractJobDescriptionFromPage() {
  // This will be executed in the page context - must be self-contained
  function detectPlatform(): string {
    const hostname = window.location.hostname.toLowerCase();
    if (hostname.includes('linkedin.com')) return 'linkedin';
    if (hostname.includes('indeed.com')) return 'indeed';
    if (hostname.includes('greenhouse.io')) return 'greenhouse';
    if (hostname.includes('lever.co')) return 'lever';
    if (hostname.includes('workday.com') || hostname.includes('myworkdayjobs.com')) return 'workday';
    return 'generic';
  }

  const platform = detectPlatform();
  return {
    url: window.location.href,
    platform,
    title: document.querySelector('h1')?.textContent?.trim() || document.title,
    company: '',
    location: '',
    description: document.body.innerText,
    requirements: [] as string[],
    preferredQualifications: [] as string[],
  };
}

function generateJobId(url: string): string {
  return `job-${btoa(url).substring(0, 20)}`;
}

function extractSkills(description: string): string[] {
  // Simple keyword extraction - in production, use NLP
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'aws',
    'docker', 'kubernetes', 'typescript', 'angular', 'vue', 'git',
    'agile', 'scrum', 'leadership', 'communication', 'problem-solving',
  ];

  const lowerDescription = description.toLowerCase();
  return commonSkills.filter(skill => lowerDescription.includes(skill));
}

// Track tab updates for job pages
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const settings = await StorageManager.getSettings();
    if (settings.autoActivate && isJobPage(tab.url)) {
      // Notify content script that page is ready
      chrome.tabs.sendMessage(tabId, { type: 'PAGE_READY' }).catch(() => {
        // Content script might not be ready yet
      });
    }
  }
});

function isJobPage(url: string): boolean {
  const jobPatterns = [
    /linkedin\.com.*\/jobs\/view/,
    /indeed\.com.*\/viewjob/,
    /greenhouse\.io/,
    /lever\.co/,
    /workday\.com/,
    /myworkdayjobs\.com/,
  ];

  return jobPatterns.some(pattern => pattern.test(url));
}