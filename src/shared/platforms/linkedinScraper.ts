// LinkedIn Profile Scraper for automated vault population

import type { PersonalInfo, Experience, Education } from '../../types';

export class LinkedInScraper {
    static async scrapeProfile(): Promise<{
        personalInfo: Partial<PersonalInfo>;
        experiences: Experience[];
        education: Education[];
        skills: string[];
    }> {
        // This runs in the context of a LinkedIn profile page
        const name = document.querySelector('.text-heading-xlarge')?.textContent?.trim() || '';
        const nameParts = name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const summary = document.querySelector('#about')?.parentElement?.querySelector('.display-flex.mt2')?.textContent?.trim() || '';

        const experiences: Experience[] = [];
        const experienceElements = document.querySelectorAll('#experience-section + .pvs-list__outer-container > ul > li');

        experienceElements.forEach((el, index) => {
            const title = el.querySelector('.t-bold span')?.textContent?.trim() || '';
            const company = el.querySelector('.t-14.t-normal span')?.textContent?.trim() || '';
            const dateRange = el.querySelector('.t-14.t-normal.t-black--light span')?.textContent?.split('·')[0].trim() || '';

            experiences.push({
                id: `li-exp-${index}`,
                company,
                title,
                startDate: dateRange.split('-')[0].trim(),
                endDate: dateRange.includes('Present') ? undefined : dateRange.split('-')[1]?.trim(),
                current: dateRange.includes('Present'),
                description: '', // Scraped as empty, user can refine
                achievements: [],
                skills: []
            });
        });

        const skills: string[] = [];
        const skillElements = document.querySelectorAll('#skills + .pvs-list__outer-container .pvs-list span[aria-hidden="true"]');
        skillElements.forEach(el => {
            const skill = el.textContent?.trim();
            if (skill && !skills.includes(skill)) skills.push(skill);
        });

        return {
            personalInfo: {
                firstName,
                lastName,
                summary,
                linkedIn: window.location.href
            },
            experiences: experiences.slice(0, 5), // Take latest 5
            education: [], // Placeholder
            skills: skills.slice(0, 20)
        };
    }
}
