// Smart Autofill System

import { StorageManager } from '../storage/storage';
import type { ProfessionalProfile, FormField, AutofillSuggestion } from '../../types';

export class AutofillManager {
  static async generateSuggestions(fields: FormField[]): Promise<AutofillSuggestion[]> {
    const profile = await StorageManager.getProfile();
    if (!profile) {
      throw new Error('Profile not found. Please set up your professional vault.');
    }

    const suggestions: AutofillSuggestion[] = [];

    for (const field of fields) {
      const suggestion = this.matchFieldToProfile(field, profile);
      if (suggestion) {
        suggestions.push(suggestion);
      }
    }

    return suggestions;
  }

  static async applySuggestions(
    suggestions: AutofillSuggestion[],
    requireApproval: boolean = true
  ): Promise<void> {
    if (requireApproval) {
      // In a real implementation, this would show a review modal
      // For now, we'll just log the suggestions
      console.log('Autofill suggestions (pending approval):', suggestions);
      return;
    }

    // Apply suggestions directly
    for (const suggestion of suggestions) {
      const element = document.querySelector(`[name="${suggestion.fieldId}"]`) as HTMLInputElement;
      if (element) {
        element.value = suggestion.suggestedValue;
        // Trigger input event to notify React/Vue components
        element.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }

  private static matchFieldToProfile(
    field: FormField,
    profile: ProfessionalProfile
  ): AutofillSuggestion | null {
    const fieldName = field.name.toLowerCase();
    const fieldLabel = field.label.toLowerCase();

    // Email matching
    if (field.type === 'email' || fieldName.includes('email') || fieldLabel.includes('email')) {
      return {
        fieldId: field.name,
        suggestedValue: profile.personalInfo.email,
        confidence: 0.95,
        source: 'vault',
      };
    }

    // Phone matching
    if (field.type === 'phone' || fieldName.includes('phone') || fieldLabel.includes('phone')) {
      return {
        fieldId: field.name,
        suggestedValue: profile.personalInfo.phone,
        confidence: 0.95,
        source: 'vault',
      };
    }

    // Name matching
    if (fieldName.includes('firstname') || fieldLabel.includes('first name')) {
      return {
        fieldId: field.name,
        suggestedValue: profile.personalInfo.firstName,
        confidence: 0.95,
        source: 'vault',
      };
    }

    if (fieldName.includes('lastname') || fieldLabel.includes('last name')) {
      return {
        fieldId: field.name,
        suggestedValue: profile.personalInfo.lastName,
        confidence: 0.95,
        source: 'vault',
      };
    }

    if (fieldName.includes('fullname') || fieldLabel.includes('full name')) {
      return {
        fieldId: field.name,
        suggestedValue: `${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`,
        confidence: 0.95,
        source: 'vault',
      };
    }

    // Location matching
    if (fieldName.includes('location') || fieldName.includes('city') || fieldLabel.includes('location')) {
      return {
        fieldId: field.name,
        suggestedValue: profile.personalInfo.location,
        confidence: 0.85,
        source: 'vault',
      };
    }

    // LinkedIn matching
    if (fieldName.includes('linkedin') || fieldLabel.includes('linkedin')) {
      if (profile.personalInfo.linkedIn) {
        return {
          fieldId: field.name,
          suggestedValue: profile.personalInfo.linkedIn,
          confidence: 0.95,
          source: 'vault',
        };
      }
    }

    // Portfolio/Website matching
    if (fieldName.includes('portfolio') || fieldName.includes('website') || fieldLabel.includes('portfolio')) {
      if (profile.personalInfo.portfolio) {
        return {
          fieldId: field.name,
          suggestedValue: profile.personalInfo.portfolio,
          confidence: 0.95,
          source: 'vault',
        };
      }
    }

    // Summary/About matching
    if (field.type === 'textarea' && (fieldName.includes('summary') || fieldName.includes('about'))) {
      if (profile.personalInfo.summary) {
        return {
          fieldId: field.name,
          suggestedValue: profile.personalInfo.summary,
          confidence: 0.80,
          source: 'vault',
        };
      }
    }

    return null;
  }
}
