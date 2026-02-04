// Job Application Copilot - Popup Script
console.log('Job Copilot popup loaded');

document.addEventListener('DOMContentLoaded', function() {
  // Add click handlers for features
  document.getElementById('resumeOptimize').addEventListener('click', () => {
    openFeaturePage('resume');
  });
  
  document.getElementById('atsOptimizer').addEventListener('click', () => {
    openFeaturePage('ats');
  });
  
  document.getElementById('autoAtsOptimizer').addEventListener('click', () => {
    openFeaturePage('autoats');
  });
  
  document.getElementById('jobAnalyze').addEventListener('click', () => {
    openFeaturePage('analyze');
  });
  
  document.getElementById('autoFill').addEventListener('click', () => {
    openFeaturePage('autofill');
  });
  
  document.getElementById('trackApps').addEventListener('click', () => {
    openFeaturePage('track');
  });
  
  document.getElementById('dashboard').addEventListener('click', () => {
    openFeaturePage('dashboard');
  });
});

function openFeaturePage(feature) {
  let url;
  
  switch(feature) {
    case 'resume':
      url = chrome.runtime.getURL('features/resume-optimizer.html');
      break;
    case 'ats':
      url = chrome.runtime.getURL('features/ats-resume-optimizer.html');
      break;
    case 'autoats':
      url = chrome.runtime.getURL('features/auto-ats-optimizer.html');
      break;
    case 'analyze':
      url = chrome.runtime.getURL('features/job-analyzer.html');
      break;
    case 'autofill':
      url = chrome.runtime.getURL('features/autofill.html');
      break;
    case 'track':
      url = chrome.runtime.getURL('features/application-tracker.html');
      break;
    case 'dashboard':
      url = chrome.runtime.getURL('dashboard.html');
      break;
    default:
      alert(`Feature not found: ${feature}`);
      return;
  }
  
  // Open the feature page in a new tab
  chrome.tabs.create({ url: url });
  
  // Close the popup
  window.close();
}