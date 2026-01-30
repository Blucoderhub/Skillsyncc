// Platform detection and adapter system

import type { JobPlatform, JobDescription, FormField } from '../../types';

export interface PlatformAdapter {
  platform: JobPlatform;
  detect: () => boolean;
  extractJobDescription: () => Promise<Partial<JobDescription>>;
  detectFormFields: () => FormField[];
  canAutofill: () => boolean;
}

export class PlatformDetector {
  static detectPlatform(): JobPlatform {
    const hostname = window.location.hostname.toLowerCase();

    if (hostname.includes('linkedin.com')) return 'linkedin';
    if (hostname.includes('indeed.com')) return 'indeed';
    if (hostname.includes('greenhouse.io')) return 'greenhouse';
    if (hostname.includes('lever.co')) return 'lever';
    if (hostname.includes('workday.com') || hostname.includes('myworkdayjobs.com')) return 'workday';

    return 'generic';
  }

  static getAdapter(): PlatformAdapter {
    const platform = this.detectPlatform();

    switch (platform) {
      case 'linkedin':
        return new LinkedInAdapter();
      case 'indeed':
        return new IndeedAdapter();
      case 'greenhouse':
        return new GreenhouseAdapter();
      case 'lever':
        return new LeverAdapter();
      case 'workday':
        return new WorkdayAdapter();
      default:
        return new GenericAdapter();
    }
  }
}

class LinkedInAdapter implements PlatformAdapter {
  platform: JobPlatform = 'linkedin';

  detect(): boolean {
    return window.location.hostname.includes('linkedin.com') &&
      window.location.pathname.includes('/jobs/view/');
  }

  async extractJobDescription(): Promise<Partial<JobDescription>> {
    const titleEl = document.querySelector('.jobs-details-top-card__job-title');
    const companyEl = document.querySelector('.jobs-details-top-card__company-name');
    const descriptionEl = document.querySelector('.jobs-description-content__text');

    return {
      title: titleEl?.textContent?.trim() || '',
      company: companyEl?.textContent?.trim() || '',
      description: descriptionEl?.textContent?.trim() || '',
      requirements: this.extractRequirements(descriptionEl?.textContent || ''),
    };
  }

  detectFormFields(): FormField[] {
    const fields: FormField[] = [];
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach((input) => {
      const element = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      const label = this.findLabel(element);
      const type = element.tagName.toLowerCase() === 'select' ? 'select' :
        element.tagName.toLowerCase() === 'textarea' ? 'textarea' :
          (element as HTMLInputElement).type === 'email' ? 'email' :
            (element as HTMLInputElement).type === 'tel' ? 'phone' : 'text';

      fields.push({
        id: element.id || element.name || Math.random().toString(36).substring(7),
        type: type as any,
        label: label || (element instanceof HTMLInputElement ? element.placeholder : '') || element.name,
        name: element.name || element.id,
        required: element.hasAttribute('required'),
      });
    });

    return fields;
  }

  canAutofill(): boolean {
    return this.detectFormFields().length > 0;
  }

  private extractRequirements(text: string): string[] {
    const requirements: string[] = [];
    const lines = text.split('\n');
    let inRequirements = false;

    for (const line of lines) {
      if (line.toLowerCase().includes('requirements') ||
        line.toLowerCase().includes('qualifications')) {
        inRequirements = true;
        continue;
      }

      if (inRequirements && line.trim().startsWith('•')) {
        requirements.push(line.trim().substring(1).trim());
      }
    }

    return requirements;
  }

  private findLabel(element: HTMLElement): string | null {
    const id = element.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent?.trim() || null;
    }

    const parent = element.parentElement;
    const label = parent?.querySelector('label');
    return label?.textContent?.trim() || null;
  }
}

class IndeedAdapter implements PlatformAdapter {
  platform: JobPlatform = 'indeed';

  detect(): boolean {
    return window.location.hostname.includes('indeed.com') &&
      window.location.pathname.includes('/viewjob');
  }

  async extractJobDescription(): Promise<Partial<JobDescription>> {
    const titleEl = document.querySelector('[data-testid="job-title"]');
    const companyEl = document.querySelector('[data-testid="company-name"]');
    const descriptionEl = document.querySelector('#jobDescriptionText');

    return {
      title: titleEl?.textContent?.trim() || '',
      company: companyEl?.textContent?.trim() || '',
      description: descriptionEl?.textContent?.trim() || '',
      requirements: this.extractRequirements(descriptionEl?.textContent || ''),
    };
  }

  detectFormFields(): FormField[] {
    // Indeed typically redirects to external sites
    return [];
  }

  canAutofill(): boolean {
    return false;
  }

  private extractRequirements(text: string): string[] {
    const requirements: string[] = [];
    const requirementPattern = /(?:requirements?|qualifications?)[:\s]+(.*?)(?:\n\n|\n[A-Z]|$)/gi;
    const matches = text.match(requirementPattern);

    if (matches) {
      matches.forEach(match => {
        const items = match.split(/[•\-\*]/).filter(item => item.trim());
        requirements.push(...items.map(item => item.trim()));
      });
    }

    return requirements;
  }
}

class GreenhouseAdapter implements PlatformAdapter {
  platform: JobPlatform = 'greenhouse';

  detect(): boolean {
    return window.location.hostname.includes('greenhouse.io');
  }

  async extractJobDescription(): Promise<Partial<JobDescription>> {
    const titleEl = document.querySelector('.app-title');
    const companyEl = document.querySelector('.company-name');
    const descriptionEl = document.querySelector('#content');

    return {
      title: titleEl?.textContent?.trim() || '',
      company: companyEl?.textContent?.trim() || '',
      description: descriptionEl?.textContent?.trim() || '',
      requirements: [],
    };
  }

  detectFormFields(): FormField[] {
    const fields: FormField[] = [];
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach((input) => {
      const element = input as HTMLInputElement;
      const label = this.findLabel(element);
      const type = element.type === 'email' ? 'email' :
        element.type === 'tel' ? 'phone' : 'text';

      fields.push({
        id: element.id || element.name || Math.random().toString(36).substring(7),
        type: type as any,
        label: label || element.placeholder || element.name,
        name: element.name || element.id,
        required: element.hasAttribute('required'),
      });
    });

    return fields;
  }

  canAutofill(): boolean {
    return this.detectFormFields().length > 0;
  }

  private findLabel(element: HTMLElement): string | null {
    const id = element.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent?.trim() || null;
    }

    return null;
  }
}

class LeverAdapter implements PlatformAdapter {
  platform: JobPlatform = 'lever';

  detect(): boolean {
    return window.location.hostname.includes('lever.co');
  }

  async extractJobDescription(): Promise<Partial<JobDescription>> {
    const titleEl = document.querySelector('.posting-headline h2');
    const companyEl = document.querySelector('.main-header-logo img')?.getAttribute('alt');
    const descriptionEl = document.querySelector('.content');

    return {
      title: titleEl?.textContent?.trim() || '',
      company: companyEl || '',
      description: descriptionEl?.textContent?.trim() || '',
      requirements: [],
    };
  }

  detectFormFields(): FormField[] {
    const fields: FormField[] = [];
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach((input) => {
      const element = input as HTMLInputElement;
      const type = element.type === 'email' ? 'email' :
        element.type === 'tel' ? 'phone' : 'text';
      fields.push({
        id: element.id || element.name || Math.random().toString(36).substring(7),
        type: type,
        label: element.placeholder || element.name,
        name: element.name || element.id,
        required: element.hasAttribute('required'),
      });
    });

    return fields;
  }

  canAutofill(): boolean {
    return this.detectFormFields().length > 0;
  }
}

class WorkdayAdapter implements PlatformAdapter {
  platform: JobPlatform = 'workday';

  detect(): boolean {
    return window.location.hostname.includes('workday.com') ||
      window.location.hostname.includes('myworkdayjobs.com');
  }

  async extractJobDescription(): Promise<Partial<JobDescription>> {
    const titleEl = document.querySelector('[data-automation-id="jobPostingHeader"]');
    const companyEl = document.querySelector('[data-automation-id="jobPostingCompanyName"]');
    const descriptionEl = document.querySelector('[data-automation-id="jobPostingDescription"]');

    return {
      title: titleEl?.textContent?.trim() || '',
      company: companyEl?.textContent?.trim() || '',
      description: descriptionEl?.textContent?.trim() || '',
      requirements: [],
    };
  }

  detectFormFields(): FormField[] {
    const fields: FormField[] = [];
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach((input) => {
      const element = input as HTMLInputElement;
      const label = this.findLabel(element);
      const type = element.type === 'email' ? 'email' :
        element.type === 'tel' ? 'phone' : 'text';

      fields.push({
        id: element.id || element.name || Math.random().toString(36).substring(7),
        type: type as any,
        label: label || element.getAttribute('aria-label') || element.name,
        name: element.name || element.id,
        required: element.hasAttribute('required'),
      });
    });

    return fields;
  }

  canAutofill(): boolean {
    return this.detectFormFields().length > 0;
  }

  private findLabel(element: HTMLElement): string | null {
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    const id = element.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent?.trim() || null;
    }

    return null;
  }
}

class GenericAdapter implements PlatformAdapter {
  platform: JobPlatform = 'generic';

  detect(): boolean {
    // IMPORTANT: don't show the overlay everywhere.
    // Only activate when the page looks like a job posting.
    return this.isLikelyJobPostingPage();
  }

  async extractJobDescription(): Promise<Partial<JobDescription>> {
    // Generic extraction using common patterns
    const titleSelectors = ['h1', '.job-title', '[class*="title"]'];
    const companySelectors = ['.company', '[class*="company"]'];
    const descriptionSelectors = ['.description', '[class*="description"]', 'main'];

    let title = '';
    let company = '';
    let description = '';

    for (const selector of titleSelectors) {
      const el = document.querySelector(selector);
      if (el?.textContent) {
        title = el.textContent.trim();
        break;
      }
    }

    for (const selector of companySelectors) {
      const el = document.querySelector(selector);
      if (el?.textContent) {
        company = el.textContent.trim();
        break;
      }
    }

    for (const selector of descriptionSelectors) {
      const el = document.querySelector(selector);
      if (el?.textContent) {
        description = el.textContent.trim();
        break;
      }
    }

    return { title, company, description, requirements: [] };
  }

  detectFormFields(): FormField[] {
    const fields: FormField[] = [];
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');

    inputs.forEach((input) => {
      const element = input as HTMLInputElement;
      const type = element.type === 'email' ? 'email' : 'text';
      fields.push({
        id: element.id || element.name || Math.random().toString(36).substring(7),
        type: type,
        label: element.placeholder || element.name || element.id,
        name: element.name || element.id,
        required: element.hasAttribute('required'),
      });
    });

    return fields;
  }

  canAutofill(): boolean {
    return this.detectFormFields().length > 0;
  }

  private isLikelyJobPostingPage(): boolean {
    // 1) Structured data is the strongest signal (schema.org JobPosting)
    const ldJsonScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    for (const script of ldJsonScripts) {
      const text = script.textContent?.trim();
      if (!text) continue;
      try {
        const data = JSON.parse(text);
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          const type = (item?.['@type'] || item?.type || '') as string | string[];
          const types = Array.isArray(type) ? type : [type];
          if (types.some(t => String(t).toLowerCase() === 'jobposting')) {
            return true;
          }
        }
      } catch {
        // ignore malformed JSON-LD
      }
    }

    // 2) URL patterns
    const url = window.location.href.toLowerCase();
    const urlSignals = ['job', 'jobs', 'career', 'careers', 'position', 'opening', 'opportunity', 'apply', 'requisition'];
    const urlScore = urlSignals.reduce((acc, s) => acc + (url.includes(s) ? 1 : 0), 0);

    // 3) On-page text signals (title/body)
    const title = (document.querySelector('h1')?.textContent || document.title || '').toLowerCase();
    const bodyText = (document.body?.innerText || '').toLowerCase();

    const textSignals = [
      'job description',
      'responsibilities',
      'requirements',
      'qualifications',
      'what you will do',
      'what you’ll do',
      'about the role',
      'apply now',
      'submit application',
    ];
    const textScore =
      textSignals.reduce((acc, s) => acc + ((title.includes(s) || bodyText.includes(s)) ? 1 : 0), 0);

    // 4) Heuristic threshold: URL + text typically identifies job pages well.
    // Keep this conservative to avoid showing on random pages.
    return urlScore >= 2 || (urlScore >= 1 && textScore >= 1) || textScore >= 2;
  }
}
