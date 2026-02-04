// Job Application Copilot - Content Script
console.log('Job Application Copilot content script loaded');

// Content script that coordinates with the React component
(function initContentScript() {
  if (document.getElementById('job-copilot-dock-root')) return;
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtension);
  } else {
    initializeExtension();
  }
})();

async function initializeExtension() {
  // Create a container for the React app
  const container = document.createElement('div');
  container.id = 'job-copilot-dock-root';
  document.body.appendChild(container);
  
  // Load the React content script
  try {
    console.log('Content script initialized');
  } catch (error) {
    console.error('Error initializing content script:', error);
  }
}

// Set up message listeners for communication with background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  switch(request.type) {
    case 'EXTRACT_JOB_DATA_FROM_PAGE':
      // Extract job description data from the current page
      const jobData = extractJobDataFromPage();
      sendResponse({ success: true, data: jobData });
      break;
    
    case 'PAGE_READY':
      // Handle page ready events
      console.log('Page is ready for job copilot');
      break;
      
    case 'TOGGLE_OVERLAY':
      toggleOverlay();
      sendResponse({ success: true });
      break;
  }
  
  return true; // Keep message channel open for async response
});

function extractJobDataFromPage() {
  // Generic job data extraction logic
  const selectors = {
    title: [
      'h1[data-testid="job-title"]',
      'h1.jobsearch-JobInfoHeader-title',
      'h1',
      '[data-test="job-title"]',
      '[data-automation="job-title"]'
    ],
    company: [
      '[data-testid="company-name"]',
      '.jobsearch-CompanyInfoWithoutHeaderImage div:first-child',
      '[data-test="employer-name"]',
      '[data-automation="job-company-name"]'
    ],
    description: [
      '#jobDescriptionText',
      '.jobsearch-JobComponent-description',
      '.job-description',
      '[data-test="job-description"]',
      '[data-automation="job-description"]'
    ]
  };

  const jobData = {
    url: window.location.href,
    title: '',
    company: '',
    description: '',
    skills: [],
    requirements: []
  };

  // Extract title
  for (const selector of selectors.title) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      jobData.title = element.textContent.trim();
      break;
    }
  }

  // Extract company
  for (const selector of selectors.company) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      jobData.company = element.textContent.trim();
      break;
    }
  }

  // Extract description
  for (const selector of selectors.description) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      jobData.description = element.textContent.trim();
      break;
    }
  }

  // Fallback: search for job description patterns
  if (!jobData.description) {
    const paragraphs = document.querySelectorAll('p, div, span');
    for (const p of paragraphs) {
      const text = p.textContent || '';
      if (text.length > 200 && 
          (text.toLowerCase().includes('responsibilities') || 
           text.toLowerCase().includes('requirements') || 
           text.toLowerCase().includes('qualifications') ||
           text.toLowerCase().includes('duties'))) {
        jobData.description = text.trim();
        break;
      }
    }
  }

  return jobData;
}

function toggleOverlay() {
  // Toggle the React overlay if it exists
  const dockElement = document.getElementById('job-copilot-dock-root');
  if (dockElement) {
    const isVisible = dockElement.style.display !== 'none';
    dockElement.style.display = isVisible ? 'none' : 'block';
  }
}