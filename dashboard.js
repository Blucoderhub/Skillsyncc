// Dashboard functionality
console.log('Dashboard loaded');

document.addEventListener('DOMContentLoaded', function() {
  // Add click handlers for features
  const featureCards = document.querySelectorAll('.feature-card');
  
  featureCards.forEach(card => {
    card.addEventListener('click', function() {
      const featureFile = this.getAttribute('onclick').match(/'([^']+)'/)[1];
      openFeature(featureFile);
    });
  });

  // Load dashboard stats
  loadDashboardStats();
});

function openFeature(featureFile) {
  // Open the feature page in a new tab
  chrome.tabs.create({ 
    url: chrome.runtime.getURL(`features/${featureFile}`) 
  });
}

async function loadDashboardStats() {
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'GET_DASHBOARD_STATS'
    });
    
    if (response.success) {
      updateStats(response.data);
    }
  } catch (error) {
    console.log('Stats not available yet');
    // Use default values
    updateStats({
      applications: 24,
      interviews: 8,
      offers: 3,
      matchRate: 92
    });
  }
}

function updateStats(stats) {
  document.querySelector('.stat-number:nth-child(1)').textContent = stats.applications;
  document.querySelector('.stat-number:nth-child(3)').textContent = stats.interviews;
  document.querySelector('.stat-number:nth-child(5)').textContent = stats.offers;
  document.querySelector('.stat-number:nth-child(7)').textContent = `${stats.matchRate}%`;
}