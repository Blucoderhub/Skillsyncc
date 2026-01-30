// Application Tracking System

import { StorageManager } from '../storage/storage';
import type { Application, ApplicationStatus, ApplicationOutcome } from '../../types';

export class ApplicationTracker {
  static async trackApplication(application: Omit<Application, 'id' | 'appliedAt'>): Promise<Application> {
    const newApplication: Application = {
      ...application,
      id: this.generateId(),
      appliedAt: new Date().toISOString(),
    };

    await StorageManager.saveApplication(newApplication);
    return newApplication;
  }

  static async updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    notes?: string
  ): Promise<Application> {
    const applications = await StorageManager.getApplications();
    const application = applications.find(a => a.id === applicationId);
    
    if (!application) {
      throw new Error('Application not found');
    }

    const updated: Application = {
      ...application,
      status,
      notes: notes || application.notes,
    };

    await StorageManager.saveApplication(updated);
    return updated;
  }

  static async recordOutcome(
    applicationId: string,
    outcome: ApplicationOutcome,
    interviewDate?: string
  ): Promise<Application> {
    const applications = await StorageManager.getApplications();
    const application = applications.find(a => a.id === applicationId);
    
    if (!application) {
      throw new Error('Application not found');
    }

    const updated: Application = {
      ...application,
      outcome,
      interviewDate,
      status: outcome === 'accepted' ? 'offer' : 'rejected',
    };

    await StorageManager.saveApplication(updated);
    return updated;
  }

  static async getApplicationStats() {
    const applications = await StorageManager.getApplications();
    
    return {
      total: applications.length,
      byStatus: this.groupByStatus(applications),
      byOutcome: this.groupByOutcome(applications),
      averageResponseTime: this.calculateAverageResponseTime(applications),
    };
  }

  private static groupByStatus(applications: Application[]) {
    const grouped: Record<ApplicationStatus, number> = {
      draft: 0,
      applied: 0,
      'under-review': 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0,
    };

    applications.forEach(app => {
      grouped[app.status] = (grouped[app.status] || 0) + 1;
    });

    return grouped;
  }

  private static groupByOutcome(applications: Application[]) {
    const grouped: Record<ApplicationOutcome | 'pending', number> = {
      accepted: 0,
      rejected: 0,
      'no-response': 0,
      withdrawn: 0,
      pending: 0,
    };

    applications.forEach(app => {
      if (app.outcome) {
        grouped[app.outcome] = (grouped[app.outcome] || 0) + 1;
      } else {
        grouped.pending = (grouped.pending || 0) + 1;
      }
    });

    return grouped;
  }

  private static calculateAverageResponseTime(applications: Application[]): number | null {
    const applicationsWithOutcome = applications.filter(
      app => app.outcome && app.outcome !== 'pending'
    );

    if (applicationsWithOutcome.length === 0) {
      return null;
    }

    const responseTimes = applicationsWithOutcome
      .map(app => {
        const appliedDate = new Date(app.appliedAt);
        const outcomeDate = app.interviewDate 
          ? new Date(app.interviewDate)
          : new Date(); // Use current date if no interview date
        
        return Math.abs(outcomeDate.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24); // Days
      })
      .filter(time => !isNaN(time));

    if (responseTimes.length === 0) {
      return null;
    }

    const sum = responseTimes.reduce((a, b) => a + b, 0);
    return Math.round(sum / responseTimes.length);
  }

  private static generateId(): string {
    return `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
