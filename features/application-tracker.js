// Application Tracker Feature
console.log('Application Tracker loaded');

class ApplicationTracker {
  constructor() {
    this.applications = [];
    this.init();
    this.loadApplications();
  }

  init() {
    // Set today's date as default
    document.getElementById('date-applied').valueAsDate = new Date();
    
    document.getElementById('add-btn').addEventListener('click', () => {
      this.addApplication();
    });
  }

  async loadApplications() {
    try {
      const result = await chrome.storage.sync.get(['applications']);
      this.applications = result.applications || [];
      this.displayApplications();
      this.updateStats();
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  }

  async saveApplications() {
    try {
      await chrome.storage.sync.set({ applications: this.applications });
    } catch (error) {
      console.error('Failed to save applications:', error);
    }
  }

  addApplication() {
    const jobTitle = document.getElementById('job-title').value;
    const company = document.getElementById('company').value;
    const location = document.getElementById('location').value;
    const status = document.getElementById('status').value;
    const dateApplied = document.getElementById('date-applied').value;
    const salary = document.getElementById('salary').value;
    const jobUrl = document.getElementById('job-url').value;
    const notes = document.getElementById('notes').value;

    if (!jobTitle || !company) {
      alert('Please fill in job title and company');
      return;
    }

    const newApplication = {
      id: Date.now().toString(),
      jobTitle,
      company,
      location,
      status,
      dateApplied,
      salary,
      jobUrl,
      notes,
      dateAdded: new Date().toISOString()
    };

    this.applications.unshift(newApplication);
    this.saveApplications();
    this.displayApplications();
    this.updateStats();
    this.clearForm();
    
    alert('Application added successfully!');
  }

  displayApplications() {
    const container = document.getElementById('applications-list');
    
    if (this.applications.length === 0) {
      container.innerHTML = '<p id="no-applications">No applications tracked yet. Add your first application above!</p>';
      return;
    }

    // Remove the "no applications" message if it exists
    const noAppsElement = document.getElementById('no-applications');
    if (noAppsElement) {
      noAppsElement.remove();
    }

    container.innerHTML = this.applications.map(app => `
      <div class="application-item">
        <div class="app-header">
          <div class="app-title">${app.jobTitle} at ${app.company}</div>
          <div class="app-status status-${app.status}">${this.formatStatus(app.status)}</div>
        </div>
        <div class="app-details">
          <div><strong>Location:</strong> ${app.location || 'Not specified'}</div>
          <div><strong>Date Applied:</strong> ${this.formatDate(app.dateApplied)}</div>
          <div><strong>Salary:</strong> ${app.salary || 'Not specified'}</div>
          <div><strong>Added:</strong> ${this.formatDate(app.dateAdded)}</div>
        </div>
        ${app.notes ? `<div style="margin-top: 10px; font-size: 13px; color: #6b7280;"><strong>Notes:</strong> ${app.notes}</div>` : ''}
        ${app.jobUrl ? `<div style="margin-top: 10px;"><a href="${app.jobUrl}" target="_blank" style="color: #6366f1; text-decoration: none;">View Job Posting</a></div>` : ''}
        <div class="app-actions">
          <button class="btn btn-small" onclick="tracker.editApplication('${app.id}')">Edit</button>
          <button class="btn btn-small btn-warning" onclick="tracker.updateStatus('${app.id}', 'interview')" ${app.status === 'interview' || app.status === 'offer' ? 'disabled' : ''}>Interview</button>
          <button class="btn btn-small btn-success" onclick="tracker.updateStatus('${app.id}', 'offer')" ${app.status === 'offer' ? 'disabled' : ''}>Offer</button>
          <button class="btn btn-small" style="background: #ef4444;" onclick="tracker.removeApplication('${app.id}')">Remove</button>
        </div>
      </div>
    `).join('');
  }

  updateStats() {
    const total = this.applications.length;
    const applied = this.applications.filter(app => app.status === 'applied').length;
    const interview = this.applications.filter(app => app.status === 'interview').length;
    const offer = this.applications.filter(app => app.status === 'offer').length;

    document.getElementById('total-applications').textContent = total;
    document.getElementById('applied-count').textContent = applied;
    document.getElementById('interview-count').textContent = interview;
    document.getElementById('offer-count').textContent = offer;
  }

  editApplication(id) {
    const app = this.applications.find(a => a.id === id);
    if (!app) return;

    // Populate form with application data
    document.getElementById('job-title').value = app.jobTitle;
    document.getElementById('company').value = app.company;
    document.getElementById('location').value = app.location || '';
    document.getElementById('status').value = app.status;
    document.getElementById('date-applied').value = app.dateApplied;
    document.getElementById('salary').value = app.salary || '';
    document.getElementById('job-url').value = app.jobUrl || '';
    document.getElementById('notes').value = app.notes || '';

    // Change button to update
    const addButton = document.getElementById('add-btn');
    addButton.textContent = 'Update Application';
    addButton.onclick = () => this.updateApplication(id);
    
    // Scroll to form
    document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
  }

  updateApplication(id) {
    const index = this.applications.findIndex(a => a.id === id);
    if (index === -1) return;

    // Update the application
    this.applications[index] = {
      ...this.applications[index],
      jobTitle: document.getElementById('job-title').value,
      company: document.getElementById('company').value,
      location: document.getElementById('location').value,
      status: document.getElementById('status').value,
      dateApplied: document.getElementById('date-applied').value,
      salary: document.getElementById('salary').value,
      jobUrl: document.getElementById('job-url').value,
      notes: document.getElementById('notes').value
    };

    this.saveApplications();
    this.displayApplications();
    this.updateStats();
    this.clearForm();
    
    // Reset button
    const addButton = document.getElementById('add-btn');
    addButton.textContent = 'Add Application';
    addButton.onclick = () => this.addApplication();
    
    alert('Application updated successfully!');
  }

  updateStatus(id, newStatus) {
    const app = this.applications.find(a => a.id === id);
    if (!app) return;

    app.status = newStatus;
    app.statusUpdated = new Date().toISOString();
    
    this.saveApplications();
    this.displayApplications();
    this.updateStats();
    
    alert(`Status updated to ${this.formatStatus(newStatus)}!`);
  }

  removeApplication(id) {
    if (!confirm('Are you sure you want to remove this application?')) {
      return;
    }

    this.applications = this.applications.filter(a => a.id !== id);
    this.saveApplications();
    this.displayApplications();
    this.updateStats();
  }

  clearForm() {
    document.getElementById('job-title').value = '';
    document.getElementById('company').value = '';
    document.getElementById('location').value = '';
    document.getElementById('status').value = 'applied';
    document.getElementById('date-applied').valueAsDate = new Date();
    document.getElementById('salary').value = '';
    document.getElementById('job-url').value = '';
    document.getElementById('notes').value = '';
  }

  formatStatus(status) {
    const statusMap = {
      'applied': 'Applied',
      'interview': 'Interview',
      'offer': 'Offer',
      'rejected': 'Rejected'
    };
    return statusMap[status] || status;
  }

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }
}

// Initialize global tracker instance
let tracker;
document.addEventListener('DOMContentLoaded', () => {
  tracker = new ApplicationTracker();
});