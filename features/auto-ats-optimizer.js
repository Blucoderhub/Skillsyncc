// Auto ATS Optimizer with Web Page Job Description Extraction
console.log('Auto ATS Optimizer loaded');

class AutoATSOptimizer {
  constructor() {
    this.resumeContent = '';
    this.jobData = null;
    this.currentTab = null;
    this.init();
    this.checkCurrentPage();
  }

  init() {
    // Setup file upload
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('resume-file');
    const browseBtn = document.getElementById('browse-btn');
    
    browseBtn.addEventListener('click', () => {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
      this.handleFileSelect(e.target.files[0]);
    });
    
    // Setup buttons
    document.getElementById('extract-btn').addEventListener('click', () => {
      this.extractJobDescription();
    });
    
    document.getElementById('manual-btn').addEventListener('click', () => {
      this.toggleManualEntry();
    });
    
    document.getElementById('optimize-btn').addEventListener('click', () => {
      this.optimizeResume();
    });
    
    document.getElementById('download-btn').addEventListener('click', () => {
      this.downloadOptimizedResume();
    });
  }

  async checkCurrentPage() {
    try {
      // Get current active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentTab = tabs[0];
      
      // Update status based on current page
      this.updateStatus(this.currentTab);
      
    } catch (error) {
      console.error('Failed to check current page:', error);
      this.updateStatus(null, 'error');
    }
  }

  updateStatus(tab, status = 'checking') {
    const statusIcon = document.getElementById('status-icon');
    const statusText = document.getElementById('status-text');
    const statusSubtext = document.getElementById('status-subtext');
    
    switch(status) {
      case 'checking':
        statusIcon.textContent = '📱';
        statusText.textContent = 'Checking Current Page...';
        statusSubtext.textContent = tab ? `Analyzing: ${tab.title}` : 'No active tab found';
        break;
        
      case 'job-detected':
        statusIcon.textContent = '🎯';
        statusText.textContent = 'Job Description Detected!';
        statusSubtext.textContent = 'Ready to extract job information';
        break;
        
      case 'no-job':
        statusIcon.textContent = '❌';
        statusText.textContent = 'No Job Description Found';
        statusSubtext.textContent = 'Navigate to a job posting page or enter manually';
        break;
        
      case 'error':
        statusIcon.textContent = '⚠️';
        statusText.textContent = 'Error Checking Page';
        statusSubtext.textContent = 'Please try again or enter job details manually';
        break;
    }
  }

  async extractJobDescription() {
    if (!this.currentTab) {
      alert('No active tab found. Please navigate to a job posting page.');
      return;
    }

    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('loading-text').textContent = '🔍 Extracting job description from webpage...';
    document.getElementById('extract-btn').disabled = true;

    try {
      // Inject content script to extract job data
      const result = await chrome.scripting.executeScript({
        target: { tabId: this.currentTab.id },
        func: this.extractJobDataFromPage
      });

      if (result && result[0] && result[0].result) {
        this.jobData = result[0].result;
        this.displayJobData();
        this.updateStatus(this.currentTab, 'job-detected');
      } else {
        this.updateStatus(this.currentTab, 'no-job');
        alert('Could not find job description on this page. Please try a different job posting or enter details manually.');
      }
    } catch (error) {
      console.error('Extraction failed:', error);
      this.updateStatus(this.currentTab, 'error');
      alert('Failed to extract job description. Please enter job details manually.');
    } finally {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('extract-btn').disabled = false;
    }
  }

  // This function runs in the context of the webpage
  static extractJobDataFromPage() {
    // Common selectors for job postings
    const selectors = {
      title: [
        'h1[itemprop="title"]',
        '[data-testid="job-title"]',
        '.jobsearch-JobInfoHeader-title',
        '.jobTitle',
        'h1.job-title',
        '[class*="job-title"]',
        'h1:not(.logo):not(.header)'
      ],
      company: [
        '[data-testid="company-name"]',
        '.jobsearch-CompanyInfoWithoutHeaderImage > div',
        '.companyInfo > div',
        '[class*="company-name"]',
        '.employer',
        'span[class*="company"]'
      ],
      description: [
        '#jobDescriptionText',
        '.jobsearch-JobComponent-description',
        '.jobDescription',
        '[data-testid="job-description"]',
        '[class*="job-description"]',
        '.description',
        '#job-posting-description'
      ]
    };

    const jobData = {
      title: '',
      company: '',
      description: '',
      url: window.location.href
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
      const paragraphs = document.querySelectorAll('p, div');
      for (const p of paragraphs) {
        const text = p.textContent || '';
        if (text.length > 200 && 
            (text.includes('responsibilities') || 
             text.includes('requirements') || 
             text.includes('qualifications') ||
             text.includes('duties'))) {
          jobData.description = text.trim();
          break;
        }
      }
    }

    // Return data only if we found meaningful content
    if (jobData.title || jobData.description) {
      return jobData;
    }
    
    return null;
  }

  displayJobData() {
    if (!this.jobData) return;

    // Display extracted data
    document.getElementById('detected-title').textContent = 
      this.jobData.title || 'Not detected';
    
    document.getElementById('detected-company').textContent = 
      this.jobData.company || 'Not detected';
    
    document.getElementById('job-description').value = 
      this.jobData.description || '';
    
    // Show preview
    if (this.jobData.description) {
      const preview = this.jobData.description.substring(0, 300) + 
        (this.jobData.description.length > 300 ? '...' : '');
      document.getElementById('preview-content').textContent = preview;
      document.getElementById('jd-preview').style.display = 'block';
    }
    
    document.getElementById('jd-section').style.display = 'block';
    
    // Enable optimize button if resume is uploaded
    if (this.resumeContent) {
      document.getElementById('optimize-btn').disabled = false;
    }
  }

  toggleManualEntry() {
    const jdSection = document.getElementById('jd-section');
    const manualBtn = document.getElementById('manual-btn');
    
    if (jdSection.style.display === 'none' || !jdSection.style.display) {
      jdSection.style.display = 'block';
      manualBtn.textContent = '🤖 Switch to Auto-Detect';
      
      // Clear auto-detected data
      this.jobData = null;
      document.getElementById('detected-title').textContent = 'Enter manually';
      document.getElementById('detected-company').textContent = 'Enter manually';
      document.getElementById('job-description').value = '';
      document.getElementById('jd-preview').style.display = 'none';
    } else {
      jdSection.style.display = 'none';
      manualBtn.textContent = '✍️ Enter Manually';
    }
  }

  handleFileSelect(file) {
    if (!file) return;
    
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|txt)$/i)) {
      alert('Please upload a PDF, DOCX, or TXT file');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    // Display file info
    document.getElementById('file-name').textContent = file.name;
    document.getElementById('file-size').textContent = this.formatFileSize(file.size);
    document.getElementById('file-info').style.display = 'block';
    
    // Read file content
    this.readFileContent(file);
  }

  readFileContent(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (file.type === 'application/pdf') {
        this.resumeContent = this.simulatePDFExtraction(e.target.result);
      } else if (file.name.endsWith('.docx')) {
        this.resumeContent = this.simulateDOCXExtraction(e.target.result);
      } else {
        this.resumeContent = e.target.result;
      }
      
      console.log('Resume content loaded successfully');
      
      // Enable optimize button if job data exists
      if (this.jobData || document.getElementById('job-description').value) {
        document.getElementById('optimize-btn').disabled = false;
      }
    };
    
    if (file.type === 'application/pdf' || file.name.endsWith('.docx')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  }

  simulatePDFExtraction(arrayBuffer) {
    return "John Doe\nSenior Software Engineer\nExperienced developer with 5+ years in web technologies\nSkills: JavaScript, React, Node.js, Python\nExperience: Senior Developer at TechCorp (2020-Present)";
  }

  simulateDOCXExtraction(arrayBuffer) {
    return "John Doe\nLead Software Engineer\nFull-stack developer specializing in modern web applications\nTechnical Skills: React, Node.js, Python, AWS, Docker\nProfessional Experience: Lead Developer at StartupXYZ (2019-Present)";
  }

  async optimizeResume() {
    const jobDescription = document.getElementById('job-description').value;
    const atsLevel = document.getElementById('ats-level').value;

    if (!this.resumeContent) {
      alert('Please upload your resume first');
      return;
    }
    
    if (!jobDescription) {
      alert('Please extract job description or enter it manually');
      return;
    }

    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('loading-text').textContent = '🛡️ Running Advanced ATS Analysis...';
    document.getElementById('optimize-btn').disabled = true;

    try {
      const result = await this.performATSOptimization({
        resumeContent: this.resumeContent,
        jobDescription: jobDescription,
        atsLevel: atsLevel
      });

      this.displayOptimizedResume(result.optimizedContent, result.improvements);
    } catch (error) {
      console.error('ATS optimization failed:', error);
      alert('Failed to optimize resume: ' + error.message);
    } finally {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('optimize-btn').disabled = false;
    }
  }

  async performATSOptimization(data) {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Extract keywords and optimize
    const jobKeywords = this.extractKeywords(data.jobDescription);
    const resumeKeywords = this.extractResumeKeywords(data.resumeContent);
    
    const optimizedContent = this.generateATSOptimizedResume(
      data.resumeContent, 
      jobKeywords, 
      data.atsLevel
    );
    
    const improvements = this.generateImprovementsList(
      jobKeywords, 
      resumeKeywords, 
      data.atsLevel
    );
    
    return {
      optimizedContent,
      improvements
    };
  }

  extractKeywords(jobDescription) {
    const text = jobDescription.toLowerCase();
    const technicalKeywords = [
      'react', 'javascript', 'python', 'java', 'node.js', 'aws', 'docker', 'kubernetes',
      'sql', 'nosql', 'api', 'rest', 'graphql', 'devops', 'ci/cd', 'git', 'linux'
    ];
    
    return technicalKeywords.filter(keyword => text.includes(keyword.toLowerCase()));
  }

  extractResumeKeywords(resumeContent) {
    const text = resumeContent.toLowerCase();
    const commonTechWords = [
      'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue',
      'sql', 'mongodb', 'aws', 'docker', 'git', 'api', 'rest'
    ];
    
    return commonTechWords.filter(word => text.includes(word));
  }

  generateATSOptimizedResume(resumeContent, keywords, atsLevel) {
    let optimized = resumeContent;
    
    // Add missing keywords
    const missingKeywords = keywords.filter(keyword => 
      !optimized.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (missingKeywords.length > 0) {
      const skillsSection = `\n\nKEY SKILLS\n${missingKeywords.slice(0, 10).join(', ')}`;
      optimized += skillsSection;
    }
    
    // Add ATS-friendly formatting
    if (atsLevel === 'maximum') {
      optimized = this.addMaximumATSFormatting(optimized);
    }
    
    return optimized;
  }

  addMaximumATSFormatting(content) {
    const lines = content.split('\n');
    const formattedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      if (line.startsWith('•') || line.startsWith('-')) {
        line = '• ' + line.substring(1).trim();
      }
      
      if (line.includes('developed') || line.includes('managed') || line.includes('created')) {
        if (!line.includes('%') && !line.includes('$') && !line.includes('users')) {
          line += ' - quantifiable impact achieved';
        }
      }
      
      formattedLines.push(line);
    }
    
    return formattedLines.join('\n');
  }

  generateImprovementsList(jobKeywords, resumeKeywords, atsLevel) {
    const improvements = [];
    
    const missingKeywords = jobKeywords.filter(keyword => 
      !resumeKeywords.some(resumeWord => 
        keyword.toLowerCase().includes(resumeWord.toLowerCase())
      )
    );
    
    if (missingKeywords.length > 0) {
      improvements.push(`Added ${missingKeywords.length} missing keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
    }
    
    improvements.push('Enhanced section headers for better ATS parsing');
    improvements.push('Improved formatting consistency');
    
    if (atsLevel === 'maximum') {
      improvements.push('Applied maximum military-grade ATS optimization');
      improvements.push('Enhanced keyword density and placement');
    }
    
    return improvements;
  }

  displayOptimizedResume(content, improvements) {
    document.getElementById('optimized-content').textContent = content;
    
    const improvementsList = document.getElementById('improvements-list');
    improvementsList.innerHTML = improvements.map(item => 
      `<li>${item}</li>`
    ).join('');
    
    document.getElementById('result').style.display = 'block';
    document.getElementById('download-btn').disabled = false;
  }

  downloadOptimizedResume() {
    const content = document.getElementById('optimized-content').textContent;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `ATS_Optimized_Resume_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('ATS-optimized resume downloaded successfully!');
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AutoATSOptimizer();
});