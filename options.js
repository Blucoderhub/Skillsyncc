// Job Application Copilot - Options Script
console.log('Job Copilot options loaded');

document.addEventListener('DOMContentLoaded', function() {
  loadSettings();
  
  document.getElementById('save-settings').addEventListener('click', saveSettings);
});

async function loadSettings() {
  try {
    const settings = await chrome.storage.sync.get([
      'openaiApiKey',
      'anthropicApiKey',
      'anthropicModel',
      'openaiModel',
      'autoFillDelay',
      'enableAutoFill'
    ]);
    
    // Populate form fields
    if (settings.openaiApiKey) {
      document.getElementById('openai-key').value = settings.openaiApiKey;
    }
    
    if (settings.anthropicApiKey) {
      document.getElementById('anthropic-key').value = settings.anthropicApiKey;
    }
    
    document.getElementById('anthropic-model').value = settings.anthropicModel || 'claude-3-sonnet-20240229';
    document.getElementById('openai-model').value = settings.openaiModel || 'gpt-4';
    document.getElementById('auto-fill-delay').value = settings.autoFillDelay || 500;
    document.getElementById('enable-auto-fill').checked = settings.enableAutoFill !== false;
    
  } catch (error) {
    console.error('Error loading settings:', error);
    showStatus('Error loading settings', 'error');
  }
}

async function saveSettings() {
  const saveButton = document.getElementById('save-settings');
  saveButton.disabled = true;
  saveButton.textContent = 'Saving...';
  
  try {
    const settings = {
      openaiApiKey: document.getElementById('openai-key').value,
      anthropicApiKey: document.getElementById('anthropic-key').value,
      anthropicModel: document.getElementById('anthropic-model').value,
      openaiModel: document.getElementById('openai-model').value,
      autoFillDelay: parseInt(document.getElementById('auto-fill-delay').value),
      enableAutoFill: document.getElementById('enable-auto-fill').checked
    };
    
    await chrome.storage.sync.set(settings);
    showStatus('Settings saved successfully!', 'success');
    
  } catch (error) {
    console.error('Error saving settings:', error);
    showStatus('Error saving settings', 'error');
  } finally {
    saveButton.disabled = false;
    saveButton.textContent = 'Save Settings';
    
    // Clear status message after 3 seconds
    setTimeout(() => {
      const statusElement = document.getElementById('status-message');
      statusElement.style.display = 'none';
    }, 3000);
  }
}

function showStatus(message, type) {
  const statusElement = document.getElementById('status-message');
  statusElement.textContent = message;
  statusElement.className = `status ${type}`;
  statusElement.style.display = 'block';
}