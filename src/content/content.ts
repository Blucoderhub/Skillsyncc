// Content Script Entry Point - Simplified version without React for now

import { PlatformDetector } from '../shared/platforms/platformDetector';

// Initialize content script
(function initContentScript() {
  if (document.getElementById('job-copilot-root')) {
    return; // Already initialized
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtension);
  } else {
    initializeExtension();
  }
})();

async function initializeExtension() {
  const adapter = PlatformDetector.getAdapter();
  
  if (!adapter.detect()) {
    return; // Not a supported job page
  }

  // Create overlay container
  const container = document.createElement('div');
  container.id = 'job-copilot-root';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    min-width: 320px;
    max-width: 400px;
  `;
  document.body.appendChild(container);

  // Load job description and show UI
  await loadJobData(container, adapter);
}

async function loadJobData(container: HTMLElement, adapter: any) {
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Job Copilot</h2>
      <button id="close-copilot" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
    </div>
    <div id="copilot-content">
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 14px; color: #6b7280;">Analyzing job...</div>
      </div>
    </div>
  `;

  document.getElementById('close-copilot')?.addEventListener('click', () => {
    container.remove();
  });

  try {
    const response = await chrome.runtime.sendMessage({
      type: 'EXTRACT_JOB_DESCRIPTION',
    });

    if (response.success) {
      const jobData = response.data;
      await showJobAnalysis(container, jobData);
    } else {
      showError(container, response.error || 'Failed to extract job description');
    }
  } catch (err) {
    showError(container, err instanceof Error ? err.message : 'Unknown error');
  }
}

async function showJobAnalysis(container: HTMLElement, jobData: any) {
  // Analyze job match
  let matchAnalysis = null;
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'ANALYZE_JOB_MATCH',
      payload: { jobId: jobData.id },
    });
    if (response.success) {
      matchAnalysis = response.data;
    }
  } catch (err) {
    console.error('Failed to analyze job match:', err);
  }

  const content = document.getElementById('copilot-content');
  if (!content) return;

  let matchScoreHtml = '';
  if (matchAnalysis) {
    const scoreColor = matchAnalysis.matchScore >= 80 ? '#059669' : 
                      matchAnalysis.matchScore >= 60 ? '#d97706' : '#dc2626';
    
    matchScoreHtml = `
      <div style="margin-bottom: 16px;">
        <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Match Score</div>
        <div style="font-size: 32px; font-weight: bold; color: ${scoreColor};">
          ${matchAnalysis.matchScore}%
        </div>
      </div>
    `;

    if (matchAnalysis.matchedSkills?.length > 0) {
      matchScoreHtml += `
        <div style="margin-bottom: 12px;">
          <div style="font-size: 12px; font-weight: 600; color: #059669; margin-bottom: 4px;">Matched Skills</div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${matchAnalysis.matchedSkills.slice(0, 5).map((skill: string) => `
              <span style="padding: 4px 8px; background-color: #d1fae5; color: #065f46; border-radius: 4px; font-size: 12px;">
                ${skill}
              </span>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  content.innerHTML = matchScoreHtml + `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <button id="optimize-resume" style="padding: 10px 16px; background-color: #0ea5e9; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500;">
        Optimize Resume
      </button>
      <button id="smart-autofill" style="padding: 10px 16px; background-color: #f3f4f6; color: #374151; border: 1px solid #d1d5db; border-radius: 8px; cursor: pointer; font-size: 14px;">
        Smart Autofill
      </button>
    </div>
  `;

  document.getElementById('optimize-resume')?.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  document.getElementById('smart-autofill')?.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'SHOW_AUTOFILL' });
  });
}

function showError(container: HTMLElement, error: string) {
  const content = document.getElementById('copilot-content');
  if (!content) return;

  content.innerHTML = `
    <div style="padding: 12px; background-color: #fee2e2; border-radius: 8px;">
      <div style="font-size: 14px; color: #dc2626;">${error}</div>
    </div>
  `;
}
