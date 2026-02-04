// Auto-Fill Feature
console.log('Auto-Fill loaded');

class AutoFillManager {
  constructor() {
    this.profile = {};
    this.init();
    this.loadProfile();
  }

  init() {
    document.getElementById('test-btn').addEventListener('click', () => {
      this.testAutoFill();
    });
    
    document.getElementById('save-btn').addEventListener('click', () => {
      this.saveProfile();
    });
    
    // Load toggle state
    const toggle = document.getElementById('auto-fill-toggle');
    chrome.storage.sync.get(['autoFillEnabled'], (result) => {
      if (result.autoFillEnabled !== undefined) {
        toggle.checked = result.autoFillEnabled;
      }
    });
    
    toggle.addEventListener('change', () => {
      chrome.storage.sync.set({ autoFillEnabled: toggle.checked });
    });
  }

  loadProfile() {
    chrome.storage.sync.get([
      'fullName', 'email', 'phone', 'linkedin', 'portfolio', 'summary'
    ], (result) => {
      if (result.fullName) document.getElementById('full-name').value = result.fullName;
      if (result.email) document.getElementById('email').value = result.email;
      if (result.phone) document.getElementById('phone').value = result.phone;
      if (result.linkedin) document.getElementById('linkedin').value = result.linkedin;
      if (result.portfolio) document.getElementById('portfolio').value = result.portfolio;
      if (result.summary) document.getElementById('summary').value = result.summary;
    });
  }

  saveProfile() {
    const profile = {
      fullName: document.getElementById('full-name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      linkedin: document.getElementById('linkedin').value,
      portfolio: document.getElementById('portfolio').value,
      summary: document.getElementById('summary').value
    };
    
    chrome.storage.sync.set(profile, () => {
      alert('Profile saved successfully!');
    });
  }

  async testAutoFill() {
    const profile = {
      fullName: document.getElementById('full-name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      linkedin: document.getElementById('linkedin').value,
      portfolio: document.getElementById('portfolio').value,
      summary: document.getElementById('summary').value
    };

    if (!profile.fullName || !profile.email) {
      alert('Please fill in at least your name and email');
      return;
    }

    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('test-results').style.display = 'none';
    document.getElementById('test-btn').disabled = true;

    try {
      const suggestions = await this.simulateFieldSuggestions(profile);
      this.displaySuggestions(suggestions);
    } catch (error) {
      console.error('Auto-fill test failed:', error);
      alert('Failed to test auto-fill: ' + error.message);
    } finally {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('test-btn').disabled = false;
    }
  }

  async simulateFieldSuggestions(profile) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Common field types and suggested values
    const fieldSuggestions = [
      {
        fieldName: 'First Name',
        fieldLabel: 'First Name',
        suggestion: profile.fullName.split(' ')[0] || profile.fullName
      },
      {
        fieldName: 'Last Name',
        fieldLabel: 'Last Name', 
        suggestion: profile.fullName.split(' ').slice(1).join(' ') || 'Doe'
      },
      {
        fieldName: 'Email',
        fieldLabel: 'Email Address',
        suggestion: profile.email
      },
      {
        fieldName: 'Phone',
        fieldLabel: 'Phone Number',
        suggestion: profile.phone || '(555) 123-4567'
      },
      {
        fieldName: 'LinkedIn',
        fieldLabel: 'LinkedIn Profile',
        suggestion: profile.linkedin || 'https://linkedin.com/in/yourprofile'
      },
      {
        fieldName: 'Portfolio',
        fieldLabel: 'Portfolio/GitHub',
        suggestion: profile.portfolio || profile.linkedin
      },
      {
        fieldName: 'Summary',
        fieldLabel: 'Professional Summary',
        suggestion: profile.summary || 'Experienced professional with strong technical skills'
      },
      {
        fieldName: 'Current Company',
        fieldLabel: 'Current Company',
        suggestion: 'Current Employer'
      }
    ];
    
    return fieldSuggestions;
  }

  displaySuggestions(suggestions) {
    const container = document.getElementById('field-suggestions');
    container.innerHTML = '';
    
    suggestions.forEach(field => {
      const fieldElement = document.createElement('div');
      fieldElement.className = 'field-item';
      fieldElement.innerHTML = `
        <h4>${field.fieldLabel}</h4>
        <div class="field-value">${field.suggestion}</div>
        <div class="suggestion">
          <strong>Suggestion:</strong> Would fill with "${field.suggestion}"
        </div>
      `;
      container.appendChild(fieldElement);
    });
    
    document.getElementById('test-results').style.display = 'block';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AutoFillManager();
});