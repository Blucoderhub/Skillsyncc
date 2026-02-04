// Job Analyzer Feature
console.log('Job Analyzer loaded');

class JobAnalyzer {
  constructor() {
    this.init();
  }

  init() {
    document.getElementById('analyze-btn').addEventListener('click', () => {
      this.analyzeJob();
    });
  }

  async analyzeJob() {
    const jobTitle = document.getElementById('job-title').value;
    const jobCompany = document.getElementById('job-company').value;
    const jobDescription = document.getElementById('job-description').value;
    const jobSkills = document.getElementById('job-skills').value;
    const yourSkills = document.getElementById('your-skills').value;
    const experience = document.getElementById('experience').value;

    // Validate inputs
    if (!jobTitle || !jobDescription || !yourSkills) {
      alert('Please fill in all required fields');
      return;
    }

    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    document.getElementById('analyze-btn').disabled = true;

    try {
      const result = await this.simulateAnalysis({
        jobTitle,
        jobCompany,
        jobDescription,
        jobSkills: jobSkills.split(',').map(s => s.trim()).filter(s => s),
        yourSkills: yourSkills.split(',').map(s => s.trim()).filter(s => s),
        experience
      });

      this.displayResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze job: ' + error.message);
    } finally {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('analyze-btn').disabled = false;
    }
  }

  async simulateAnalysis(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const jobSkills = data.jobSkills;
    const yourSkills = data.yourSkills;
    
    // Calculate match score
    const matchedSkills = jobSkills.filter(skill => 
      yourSkills.some(yourSkill => 
        yourSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(yourSkill.toLowerCase())
      )
    );
    
    const missingSkills = jobSkills.filter(skill => 
      !matchedSkills.includes(skill)
    );
    
    const matchScore = Math.round((matchedSkills.length / jobSkills.length) * 100);
    
    // Generate recommendations
    const recommendations = [];
    if (matchScore >= 80) {
      recommendations.push("Excellent match! You have most of the required skills.");
      recommendations.push("Consider highlighting your relevant experience in your application.");
    } else if (matchScore >= 60) {
      recommendations.push("Good match with some skill gaps to address.");
      recommendations.push("Focus on transferable skills in your application materials.");
    } else {
      recommendations.push("Significant skill gaps identified.");
      recommendations.push("Consider upskilling in the missing areas or highlighting transferable experience.");
    }
    
    if (missingSkills.length > 0) {
      recommendations.push(`Missing key skills: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    
    return {
      matchScore,
      matchedSkills,
      missingSkills,
      recommendations
    };
  }

  displayResult(result) {
    // Display match score
    const matchScoreElement = document.getElementById('match-score');
    matchScoreElement.textContent = `${result.matchScore}%`;
    
    // Color code the score
    if (result.matchScore >= 80) {
      matchScoreElement.style.borderColor = '#10b981';
      matchScoreElement.style.color = '#10b981';
    } else if (result.matchScore >= 60) {
      matchScoreElement.style.borderColor = '#f59e0b';
      matchScoreElement.style.color = '#f59e0b';
    } else {
      matchScoreElement.style.borderColor = '#ef4444';
      matchScoreElement.style.color = '#ef4444';
    }
    
    // Display matched skills
    const matchedSkillsElement = document.getElementById('matched-skills');
    if (result.matchedSkills.length > 0) {
      matchedSkillsElement.innerHTML = result.matchedSkills
        .map(skill => `<span class="skill-tag">${skill}</span>`)
        .join('');
    } else {
      matchedSkillsElement.innerHTML = '<p>No matching skills found</p>';
    }
    
    // Display missing skills
    const missingSkillsElement = document.getElementById('missing-skills');
    if (result.missingSkills.length > 0) {
      missingSkillsElement.innerHTML = result.missingSkills
        .map(skill => `<span class="skill-tag missing-skill">${skill}</span>`)
        .join('');
    } else {
      missingSkillsElement.innerHTML = '<p>All required skills matched!</p>';
    }
    
    // Display recommendations
    const recommendationsElement = document.getElementById('recommendations');
    recommendationsElement.innerHTML = result.recommendations
      .map(rec => `<p>• ${rec}</p>`)
      .join('');
    
    document.getElementById('result').style.display = 'block';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new JobAnalyzer();
});