// Resume Optimizer Feature
console.log('Resume Optimizer loaded');

class ResumeOptimizer {
  constructor() {
    this.init();
  }

  init() {
    document.getElementById('optimize-btn').addEventListener('click', () => {
      this.optimizeResume();
    });
    
    document.getElementById('save-btn').addEventListener('click', () => {
      this.saveOptimizedResume();
    });
  }

  async optimizeResume() {
    const jobTitle = document.getElementById('job-title').value;
    const jobCompany = document.getElementById('job-company').value;
    const jobDescription = document.getElementById('job-description').value;
    const jobSkills = document.getElementById('job-skills').value;
    const currentResume = document.getElementById('current-resume').value;

    // Validate inputs
    if (!jobTitle || !jobDescription || !currentResume) {
      alert('Please fill in all required fields');
      return;
    }

    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('optimize-btn').disabled = true;

    try {
      // In a real implementation, this would call the AI service
      // For now, we'll simulate the optimization
      const result = await this.simulateOptimization({
        jobTitle,
        jobCompany,
        jobDescription,
        jobSkills: jobSkills.split(',').map(s => s.trim()).filter(s => s),
        currentResume
      });

      this.displayResult(result);
    } catch (error) {
      console.error('Optimization failed:', error);
      alert('Failed to optimize resume: ' + error.message);
    } finally {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('optimize-btn').disabled = false;
    }
  }

  async simulateOptimization(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple keyword optimization simulation
    const keywords = data.jobSkills;
    let optimizedResume = data.currentResume;
    
    // Add some job-specific keywords
    if (keywords.length > 0) {
      const keywordSection = `\n\nKEY SKILLS: ${keywords.join(', ')}`;
      optimizedResume += keywordSection;
    }
    
    // Add job title mention
    if (data.jobTitle) {
      optimizedResume = optimizedResume.replace(
        new RegExp(data.jobTitle.split(' ')[0], 'gi'),
        `**${data.jobTitle.split(' ')[0]}**`
      );
    }
    
    return {
      optimizedResume,
      changes: [
        "Added relevant keywords section",
        "Emphasized job-specific terminology",
        "Improved ATS compatibility",
        "Enhanced keyword density for matching"
      ]
    };
  }

  displayResult(result) {
    document.getElementById('optimized-content').innerHTML = 
      `<pre style="white-space: pre-wrap; font-family: inherit;">${result.optimizedResume}</pre>`;
    
    document.getElementById('changes').innerHTML = 
      `<strong>Changes Made:</strong><br>• ${result.changes.join('<br>• ')}`;
    
    document.getElementById('result').style.display = 'block';
    document.getElementById('save-btn').disabled = false;
  }

  saveOptimizedResume() {
    const optimizedContent = document.getElementById('optimized-content').textContent;
    
    // Create blob and download
    const blob = new Blob([optimizedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized-resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert('Optimized resume saved successfully!');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ResumeOptimizer();
});