// Job Application Copilot - Background Script
console.log('Job Application Copilot background script loaded');

class JobCopilotBackground {
  constructor() {
    this.init();
  }

  init() {
    console.log('Initializing Job Copilot Background Script');
    this.setupListeners();
    this.setupCommands();
  }

  setupListeners() {
    // Handle extension installation
    chrome.runtime.onInstalled.addListener((details) => {
      console.log('Extension installed/updated:', details.reason);
      if (details.reason === 'install') {
        this.openWelcomePage();
      }
    });

    // Handle messages from content scripts
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('Background received message:', request);
      
      switch(request.type) {
        case 'GET_DASHBOARD_STATS':
          this.getDashboardStats(sendResponse);
          return true; // Keep message channel open for async response
          
        case 'analyzeJob':
          this.analyzeJobDescription(request.data);
          sendResponse({ success: true });
          break;
      }
      
      return true;
    });

    // Handle tab updates
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete' && tab.url) {
        this.handleTabUpdate(tab);
      }
    });
  }

  setupCommands() {
    chrome.commands.onCommand.addListener((command) => {
      console.log('Command received:', command);
      
      if (command === 'toggle-copilot') {
        this.toggleCopilot();
      }
    });
  }

  async getDashboardStats(sendResponse) {
    try {
      // In a real implementation, this would fetch from storage
      // For now, returning mock data
      const stats = {
        applications: 24,
        interviews: 8,
        offers: 3,
        matchRate: 92
      };
      sendResponse({ success: true, data: stats });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }

  async handleTabUpdate(tab) {
    // Check if this is a job-related page
    const jobSites = [
      'linkedin.com/jobs',
      'indeed.com',
      'glassdoor.com',
      'monster.com',
      'ziprecruiter.com'
    ];

    const isJobSite = jobSites.some(site => tab.url.includes(site));
    
    if (isJobSite) {
      console.log('Job site detected:', tab.url);
      // Notify content script
      chrome.tabs.sendMessage(tab.id, {
        action: 'jobSiteDetected',
        url: tab.url
      }).catch(() => {
        // Content script might not be ready yet
        console.log('Content script not ready');
      });
    }
  }

  toggleCopilot() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggleOverlay'
        }).catch(console.error);
      }
    });
  }

  analyzeJobDescription(data) {
    console.log('Analyzing job description:', data);
    // Placeholder for actual analysis logic
    return {
      success: true,
      analysis: 'Job analysis completed'
    };
  }

  openWelcomePage() {
    chrome.tabs.create({
      url: chrome.runtime.getURL('welcome.html')
    });
  }
}

// Initialize background script
new JobCopilotBackground();