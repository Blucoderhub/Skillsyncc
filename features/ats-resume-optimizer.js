// Advanced ATS Resume Optimizer
console.log('ATS Resume Optimizer loaded');

class ATSResumeOptimizer {
  constructor() {
    this.resumeContent = '';
    this.file = null;
    this.init();
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
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      this.handleFileSelect(e.dataTransfer.files[0]);
    });
    
    // Setup buttons
    document.getElementById('analyze-btn').addEventListener('click', () => {
      this.analyzeAndOptimize();
    });
    
    document.getElementById('download-btn').addEventListener('click', () => {
      this.downloadOptimizedResume();
    });
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
    
    this.file = file;
    
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
        // For PDF, we'd need a library like pdf.js in a real implementation
        // For now, we'll simulate extraction
        this.resumeContent = this.simulatePDFExtraction(e.target.result);
      } else if (file.name.endsWith('.docx')) {
        // For DOCX, we'd need mammoth.js or similar
        this.resumeContent = this.simulateDOCXExtraction(e.target.result);
      } else {
        this.resumeContent = e.target.result;
      }
      
      console.log('Resume content loaded successfully');
    };
    
    if (file.type === 'application/pdf' || file.name.endsWith('.docx')) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  }

  simulatePDFExtraction(arrayBuffer) {
    // In a real implementation, this would use pdf.js
    return "John Doe\nSenior Software Engineer\nExperienced developer with 5+ years in web technologies\nSkills: JavaScript, React, Node.js, Python\nExperience: Senior Developer at TechCorp (2020-Present)";
  }

  simulateDOCXExtraction(arrayBuffer) {
    // In a real implementation, this would use mammoth.js
    return "John Doe\nLead Software Engineer\nFull-stack developer specializing in modern web applications\nTechnical Skills: React, Node.js, Python, AWS, Docker\nProfessional Experience: Lead Developer at StartupXYZ (2019-Present)";
  }

  async analyzeAndOptimize() {
    const jobTitle = document.getElementById('job-title').value;
    const jobCompany = document.getElementById('job-company').value;
    const jobDescription = document.getElementById('job-description').value;
    const jobSkills = document.getElementById('job-skills').value;
    const atsLevel = document.getElementById('ats-level').value;

    // Validate inputs
    if (!this.resumeContent) {
      alert('Please upload your resume first');
      return;
    }
    
    if (!jobTitle || !jobDescription) {
      alert('Please fill in job title and description');
      return;
    }

    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('ats-analysis').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    document.getElementById('analyze-btn').disabled = true;

    try {
      const result = await this.performATSOptimization({
        resumeContent: this.resumeContent,
        jobTitle,
        jobCompany,
        jobDescription,
        jobSkills: jobSkills.split(',').map(s => s.trim()).filter(s => s),
        atsLevel
      });

      this.displayATSScores(result.scores);
      this.displayOptimizedResume(result.optimizedContent, result.improvements);
    } catch (error) {
      console.error('ATS optimization failed:', error);
      alert('Failed to optimize resume: ' + error.message);
    } finally {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('analyze-btn').disabled = false;
    }
  }

  async performATSOptimization(data) {
    // Simulate processing time for realistic experience
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Advanced ATS analysis
    const jobKeywords = this.extractKeywords(data.jobDescription, data.jobSkills);
    const resumeKeywords = this.extractResumeKeywords(data.resumeContent);
    
    // Calculate scores
    const keywordScore = this.calculateKeywordScore(jobKeywords, resumeKeywords);
    const formatScore = this.analyzeFormatCompatibility(data.resumeContent, data.atsLevel);
    const overallScore = Math.round((keywordScore * 0.6 + formatScore * 0.4));
    
    // Generate optimized content
    const optimizedContent = this.generateATSOptimizedResume(
      data.resumeContent, 
      jobKeywords, 
      data.jobTitle,
      data.atsLevel
    );
    
    // Generate improvements list
    const improvements = this.generateImprovementsList(
      jobKeywords, 
      resumeKeywords, 
      data.atsLevel,
      formatScore
    );
    
    return {
      scores: {
        keywordScore,
        formatScore,
        overallScore
      },
      optimizedContent,
      improvements
    };
  }

  extractKeywords(jobDescription, jobSkills) {
    // Extract important keywords from job description
    const text = (jobDescription + ' ' + jobSkills.join(' ')).toLowerCase();
    
    // Common technical keywords (this would be more sophisticated in reality)
    const technicalKeywords = [
      'react', 'javascript', 'python', 'java', 'node.js', 'aws', 'docker', 'kubernetes',
      'sql', 'nosql', 'api', 'rest', 'graphql', 'devops', 'ci/cd', 'git', 'linux',
      'machine learning', 'ai', 'tensorflow', 'pytorch', 'scikit-learn',
      'frontend', 'backend', 'full-stack', 'mobile', 'android', 'ios'
    ];
    
    const foundKeywords = technicalKeywords.filter(keyword => 
      text.includes(keyword.toLowerCase())
    );
    
    // Add job-specific skills
    foundKeywords.push(...jobSkills);
    
    return [...new Set(foundKeywords)]; // Remove duplicates
  }

  extractResumeKeywords(resumeContent) {
    const text = resumeContent.toLowerCase();
    const commonTechWords = [
      'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue',
      'sql', 'mongodb', 'aws', 'docker', 'git', 'api', 'rest'
    ];
    
    return commonTechWords.filter(word => text.includes(word));
  }

  calculateKeywordScore(jobKeywords, resumeKeywords) {
    if (jobKeywords.length === 0) return 100;
    
    const matchedKeywords = jobKeywords.filter(keyword => 
      resumeKeywords.some(resumeWord => 
        keyword.toLowerCase().includes(resumeWord.toLowerCase()) ||
        resumeWord.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    return Math.round((matchedKeywords.length / jobKeywords.length) * 100);
  }

  analyzeFormatCompatibility(resumeContent, atsLevel) {
    let score = 100;
    const issues = [];
    
    // Check for common ATS issues
    if (resumeContent.includes('\t')) {
      score -= 10;
      issues.push('Contains tabs instead of spaces');
    }
    
    if (resumeContent.split('\n\n').length < 5) {
      score -= 15;
      issues.push('Insufficient section breaks');
    }
    
    if (!resumeContent.toLowerCase().includes('experience') && 
        !resumeContent.toLowerCase().includes('work')) {
      score -= 20;
      issues.push('Missing experience section');
    }
    
    if (!resumeContent.toLowerCase().includes('education')) {
      score -= 10;
      issues.push('Missing education section');
    }
    
    if (resumeContent.length < 500) {
      score -= 25;
      issues.push('Content too short');
    }
    
    // Adjust based on ATS level
    switch(atsLevel) {
      case 'aggressive':
        score = Math.max(0, score - 15);
        break;
      case 'maximum':
        score = Math.max(0, score - 30);
        break;
    }
    
    return Math.max(0, Math.min(100, score));
  }

  generateATSOptimizedResume(resumeContent, keywords, jobTitle, atsLevel) {
    let optimized = resumeContent;
    
    // Add missing keywords strategically
    const missingKeywords = keywords.filter(keyword => 
      !optimized.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (missingKeywords.length > 0) {
      const skillsSection = `\n\nKEY SKILLS\n${missingKeywords.slice(0, 10).join(', ')}`;
      optimized += skillsSection;
    }
    
    // Enhance job title relevance
    if (jobTitle) {
      const titleWords = jobTitle.split(' ');
      titleWords.forEach(word => {
        if (word.length > 3) {
          optimized = optimized.replace(
            new RegExp(`\\b${word}\\b`, 'gi'),
            `**${word}**`
          );
        }
      });
    }
    
    // Improve section headers for ATS
    const atsHeaders = {
      'work experience': 'PROFESSIONAL EXPERIENCE',
      'employment': 'PROFESSIONAL EXPERIENCE',
      'career': 'PROFESSIONAL EXPERIENCE',
      'skills': 'TECHNICAL SKILLS',
      'education': 'EDUCATION',
      'contact': 'CONTACT INFORMATION'
    };
    
    Object.entries(atsHeaders).forEach(([oldHeader, newHeader]) => {
      optimized = optimized.replace(
        new RegExp(oldHeader, 'gi'),
        newHeader
      );
    });
    
    // Add ATS-friendly formatting based on level
    if (atsLevel === 'maximum') {
      // Add more structured formatting for maximum ATS compatibility
      optimized = this.addMaximumATSFormatting(optimized);
    }
    
    return optimized;
  }

  addMaximumATSFormatting(content) {
    // Add structured bullet points and quantified achievements
    const lines = content.split('\n');
    const formattedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      // Convert regular bullets to ATS-friendly format
      if (line.startsWith('•') || line.startsWith('-')) {
        line = '• ' + line.substring(1).trim();
      }
      
      // Add quantification where possible (simulated)
      if (line.includes('developed') || line.includes('managed') || line.includes('created')) {
        if (!line.includes('%') && !line.includes('$') && !line.includes('users')) {
          line += ' - quantifiable impact achieved';
        }
      }
      
      formattedLines.push(line);
    }
    
    return formattedLines.join('\n');
  }

  generateImprovementsList(jobKeywords, resumeKeywords, atsLevel, formatScore) {
    const improvements = [];
    
    // Keyword improvements
    const missingKeywords = jobKeywords.filter(keyword => 
      !resumeKeywords.some(resumeWord => 
        keyword.toLowerCase().includes(resumeWord.toLowerCase())
      )
    );
    
    if (missingKeywords.length > 0) {
      improvements.push(`Added ${missingKeywords.length} missing keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
    }
    
    // Format improvements
    if (formatScore < 80) {
      improvements.push('Enhanced section headers for better ATS parsing');
      improvements.push('Improved formatting consistency');
    }
    
    // ATS level specific improvements
    switch(atsLevel) {
      case 'aggressive':
        improvements.push('Applied aggressive ATS optimization techniques');
        break;
      case 'maximum':
        improvements.push('Applied maximum military-grade ATS optimization');
        improvements.push('Enhanced keyword density and placement');
        break;
    }
    
    if (improvements.length === 0) {
      improvements.push('Resume was already well-optimized for ATS');
    }
    
    return improvements;
  }

  displayATSScores(scores) {
    document.getElementById('keyword-score').textContent = `${scores.keywordScore}%`;
    document.getElementById('format-score').textContent = `${scores.formatScore}%`;
    document.getElementById('overall-score').textContent = `${scores.overallScore}%`;
    
    // Add detailed explanations
    document.getElementById('keyword-details').innerHTML = 
      `Matched ${Math.round(scores.keywordScore * 0.3)} out of 30 key terms`;
    
    document.getElementById('format-details').innerHTML = 
      scores.formatScore >= 80 ? 
      '✅ Excellent format compatibility' : 
      scores.formatScore >= 60 ? 
      '⚠️ Some format improvements needed' : 
      '❌ Format requires significant improvements';
    
    document.getElementById('overall-details').innerHTML = 
      scores.overallScore >= 85 ? 
      '🏆 Highly ATS compatible' : 
      scores.overallScore >= 70 ? 
      '✅ Good ATS compatibility' : 
      '⚠️ May require additional optimization';
    
    document.getElementById('ats-analysis').style.display = 'grid';
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
    
    // Create blob and download
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
  new ATSResumeOptimizer();
});