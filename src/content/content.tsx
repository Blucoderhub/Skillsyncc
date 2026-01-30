import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { PlatformDetector } from '../shared/platforms/platformDetector';
import type { JobDescription, JobMatchAnalysis, ProfessionalProfile } from '../types';
import { Target, Sparkles, Brain, Star, Mail, User, Zap, CheckCircle, XCircle, AlertTriangle, Copy, Download, ExternalLink } from 'lucide-react';

// Main content script initialization
(function initContentScript() {
  if (document.getElementById('job-copilot-dock-root')) return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExtension);
  } else {
    initializeExtension();
  }
})();

async function initializeExtension() {
  const adapter = PlatformDetector.getAdapter();
  if (!adapter.detect()) return;

  const container = document.createElement('div');
  container.id = 'job-copilot-dock-root';
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(<JobCopilotDock adapter={adapter} />);
}

function JobCopilotDock({ adapter }: { adapter: any }) {
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
  const [matchAnalysis, setMatchAnalysis] = useState<JobMatchAnalysis | null>(null);
  const [interviewPrep, setInterviewPrep] = useState<any>(null);
  const [starMapping, setStarMapping] = useState<any>(null);
  const [outreachTargets, setOutreachTargets] = useState<any>(null);
  const [tailorData, setTailorData] = useState<any>(null);
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
    
    // Debounced function to inject autofill triggers
    let debounceTimer: NodeJS.Timeout;
    
    const debouncedInjectAutofillTriggers = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        injectAutofillTriggers();
      }, 500); // Debounce for 500ms
    };
    
    // Use a mutation observer instead of interval for better performance
    const observer = new MutationObserver((mutations) => {
      let shouldInject = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Element node
              const element = node as Element;
              // Check if new inputs or forms are added
              if (element.tagName === 'FORM' || element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' ||
                  element.querySelector('input, textarea, select')) {
                shouldInject = true;
              }
            }
          });
        }
      }
      if (shouldInject) {
        debouncedInjectAutofillTriggers();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Initial injection
    injectAutofillTriggers();
    
    // Sync Bridge: Listen for updates from Skillsyncc.com
    const syncChannel = new BroadcastChannel('skillsyncc_sync');
    syncChannel.onmessage = (event) => {
      if (event.data.type === 'PROFILE_UPDATED') {
        setProfile(event.data.profile);
        chrome.runtime.sendMessage({ type: 'UPDATE_PROFILE', payload: event.data.profile });
      }
    };

    return () => {
      clearTimeout(debounceTimer);
      observer.disconnect();
      syncChannel.close();
    };
  }, []);

  async function loadData() {
    if (!chrome.runtime?.id) return;
    setLoading(true);
    try {
      const profileResp = await chrome.runtime.sendMessage({ type: 'GET_PROFILE' });
      if (profileResp.success && profileResp.data) {
        setProfile(profileResp.data);
      }

      const resp = await chrome.runtime.sendMessage({ type: 'EXTRACT_JOB_DESCRIPTION' });
      if (resp.success && resp.data) {
        setJobDescription(resp.data);
        const jobId = resp.data.id;

        Promise.all([
          chrome.runtime.sendMessage({ type: 'ANALYZE_JOB_MATCH', payload: { jobId } }).then(r => r.success && setMatchAnalysis(r.data)),
          chrome.runtime.sendMessage({ type: 'PREP_INTERVIEW', payload: { jobId } }).then(r => r.success && setInterviewPrep(r.data)),
          chrome.runtime.sendMessage({ type: 'MAP_STAR_STORIES', payload: { jobId } }).then(r => r.success && setStarMapping(r.data)),
          chrome.runtime.sendMessage({ type: 'IDENTIFY_OUTREACH_TARGETS', payload: { jobId } }).then(r => r.success && setOutreachTargets(r.data)),
          chrome.runtime.sendMessage({ type: 'GENERATE_TAILORED_BULLETS', payload: { jobId } }).then(r => r.success && setTailorData(r.data))
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function injectAutofillTriggers() {
    const fields = document.querySelectorAll('input, textarea');
    fields.forEach((field: any) => {
      // Logic to ignore already processed fields or hidden/submit fields
      if (field.type === 'hidden' || field.type === 'submit' || field.dataset.aiInjected === 'true') return;

      const container = field.parentElement;
      if (!container) return;

      const trigger = document.createElement('div');
      trigger.className = 'ai-autofill-trigger';
      trigger.innerHTML = '✨';
      trigger.style.cssText = 'position:absolute;right:10px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:14px;opacity:0.7;z-index:1000;transition:all 0.2s';

      trigger.onmouseover = () => trigger.style.opacity = '1';
      trigger.onmouseleave = () => trigger.style.opacity = '0.7';

      trigger.onclick = async (e) => {
        e.stopPropagation();
        trigger.innerHTML = '🌀';
        try {
          const resp = await chrome.runtime.sendMessage({
            type: 'SUGGEST_FORM_FIELD',
            payload: { fieldName: field.name, fieldLabel: field.id || field.placeholder || field.name }
          });
          if (resp.success) {
            field.value = resp.data.suggestion;
            trigger.innerHTML = '✅';
            setTimeout(() => trigger.innerHTML = '✨', 2500);
          } else {
            trigger.innerHTML = '❌';
            setTimeout(() => trigger.innerHTML = '✨', 2500);
          }
        } catch (err) {
          trigger.innerHTML = '⚠️';
        }
      };

      if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
      container.appendChild(trigger);
      field.dataset.aiInjected = 'true';
    });
  }

  const icons = [
    { id: 'match', label: 'Analysis', icon: Target, color: '#6366f1' },
    { id: 'tailor', label: 'Magic Tailor', icon: Sparkles, color: '#ec4899' },
    { id: 'prep', label: 'Interview', icon: Brain, color: '#8b5cf6' },
    { id: 'star', label: 'Stories', icon: Star, color: '#f59e0b' },
    { id: 'outreach', label: 'Outreach', icon: Mail, color: '#10b981' },
    { id: 'profile', label: 'Vault', icon: User, color: '#475569' }
  ];

  const profileExists = profile && profile.skills.length > 0;

  return (
    <div style={{
      position: 'fixed', top: '50%', right: '24px', transform: 'translateY(-50%)', zIndex: 100000,
      display: 'flex', alignItems: 'center', gap: '20px'
    }}>
      {/* Popups */}
      {activePopup && (
        <div
          onMouseEnter={() => setActivePopup(activePopup)}
          onMouseLeave={() => setActivePopup(null)}
          style={{
            width: '420px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(40px)',
            borderRadius: '28px', boxShadow: '0 30px 70px rgba(0,0,0,0.3)',
            padding: '32px', border: '1px solid rgba(255,255,255,0.5)',
            animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div className="premium-spinner" style={{ marginBottom: '16px' }}>💫</div>
              <div style={{ fontSize: '15px', color: '#64748b', fontWeight: '700' }}>Aligning Expertise...</div>
            </div>
          ) : (
            <>
              {!profileExists && (
                <div style={{ marginBottom: '24px', padding: '18px', background: 'linear-gradient(135deg, #fef2f2, #fffbeb)', borderRadius: '20px', border: '1px solid #fed7d7', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <AlertTriangle style={{ color: '#dc2626', fontSize: '24px', marginBottom: '8px' }} />
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#dc2626', textAlign: 'center' }}>Vault Empty</div>
                  <button onClick={() => chrome.runtime.openOptionsPage()} style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', marginTop: '12px', cursor: 'pointer', fontWeight: '700', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)' }}>Setup Profile</button>
                </div>
              )}

              {activePopup === 'match' && matchAnalysis && <ExpertMatchCard data={matchAnalysis} />}
              {activePopup === 'tailor' && tailorData && <MagicTailorCard data={tailorData} />}
              {activePopup === 'prep' && interviewPrep && <PrepCard data={interviewPrep} />}
              {activePopup === 'star' && starMapping && <StarCard data={starMapping} />}
              {activePopup === 'outreach' && outreachTargets && <OutreachCard targets={outreachTargets} jobId={jobDescription?.id} />}
              {activePopup === 'profile' && profile && <ProfileVaultCard profile={profile} />}
            </>
          )}
        </div>
      )}

      {/* Vertical Dock */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
        backdropFilter: 'blur(10px)',
        padding: '16px',
        borderRadius: '24px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        gap: '16px'
      }}>
        {icons.map(item => (
          <DockIcon
            key={item.id}
            {...item}
            isActive={activePopup === item.id}
            onClick={() => setActivePopup(activePopup === item.id ? null : item.id)}
            onHover={() => setActivePopup(item.id)}
          />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .premium-spinner { font-size: 36px; animation: spin 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}

function MagicTailorCard({ data }: { data: any }) {
  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied!`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} style={{ color: '#ec4899' }} />
          Magic Tailor
        </h3>
        <div style={{ background: '#fdf2f8', color: '#ec4899', padding: '6px 12px', borderRadius: '20px', fontWeight: '800', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>AI TUNED</div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <User size={14} style={{ color: '#64748b' }} />
          Targeted Summary
        </div>
        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', fontSize: '14px', color: '#475569', lineHeight: '1.6', border: '1px solid #e2e8f0', position: 'relative', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
          {data.summary}
          <button
            onClick={() => copy(data.summary, 'Summary')}
            style={{ width: '100%', marginTop: '12px', background: 'linear-gradient(135deg, #ec4899, #db2777)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Copy size={14} />
            Copy Summary
          </button>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={14} style={{ color: '#64748b' }} />
          High-Impact Bullets
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.bullets.map((b: string, i: number) => (
            <div key={i} style={{ padding: '14px', background: '#fdf2f8', borderRadius: '14px', fontSize: '13px', color: '#9d174d', border: '1px solid #fbcfe8', position: 'relative', lineHeight: '1.5', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              {b}
              <button
                onClick={() => copy(b, 'Bullet')}
                style={{ position: 'absolute', right: '10px', top: '10px', background: 'white', border: '1px solid #f9a8d4', borderRadius: '6px', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Copy size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DockIcon({ icon: IconComponent, color, isActive, onClick, onHover }: any) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onHover}
      style={{
        width: '56px', height: '56px', borderRadius: '28px', background: isActive ? color : 'rgba(255, 255, 255, 0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
        cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        boxShadow: isActive ? `0 15px 35px ${color}77` : '0 5px 15px rgba(0,0,0,0.1)',
        transform: isActive ? 'scale(1.25)' : 'scale(1)',
        color: isActive ? 'white' : '#475569',
        backdropFilter: 'blur(10px)',
        border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
      }}
    >
      <IconComponent size={24} style={{ color: isActive ? 'white' : color }} />
    </div>
  );
}

function ExpertMatchCard({ data }: { data: any }) {
  const scoreColor = data.semanticMatchScore > 85 ? '#10b981' : data.semanticMatchScore > 60 ? '#f59e0b' : '#ef4444';
  const scoreBg = data.semanticMatchScore > 85 ? '#dcfce7' : data.semanticMatchScore > 60 ? '#fef3c7' : '#fee2e2';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={20} style={{ color: '#6366f1' }} />
          Expert Alignment
        </h3>
        <div style={{ background: scoreBg, color: scoreColor, padding: '8px 16px', borderRadius: '24px', fontWeight: '800', fontSize: '16px', border: `1px solid ${scoreColor}30`, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Target size={16} style={{ color: scoreColor }} />
          {data.semanticMatchScore}% Match
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle size={14} style={{ color: '#64748b' }} />
          Precision Breakdown
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {data.matchedSkills.slice(0, 8).map((s: any, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: '20px', fontSize: '13px', fontWeight: '600', color: '#065f46', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              <CheckCircle size={14} style={{ color: '#10b981' }} />
              {s.skill || s}
              {s.type === 'Exact' && <span style={{ fontSize: '10px', background: '#10b981', color: 'white', padding: '2px 6px', borderRadius: '12px', marginLeft: '4px' }}>EXACT</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ fontWeight: '700', fontSize: '13px', color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
          Gap Recommendation
        </div>
        <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>{data.recommendations[0]}</div>
      </div>
    </div>
  );
}

function ProfileVaultCard({ profile }: { profile: ProfessionalProfile }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: 'white', boxShadow: '0 6px 16px rgba(99,102,241,0.2)' }}>
          {profile.personalInfo.firstName[0]}
        </div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>{profile.personalInfo.firstName} {profile.personalInfo.lastName}</div>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{profile.personalInfo.summary?.slice(0, 70) || 'Expert profile pending sync...'}...</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#6366f1' }}>{profile.skills.length}</div>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skills</div>
        </div>
        <div style={{ padding: '14px', background: '#f8fafc', borderRadius: '16px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#a855f7' }}>{profile.starStories.length}</div>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stories</div>
        </div>
      </div>

      <button onClick={() => chrome.runtime.openOptionsPage()} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '14px', boxShadow: '0 6px 16px rgba(30, 41, 59, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Open Control Center</button>
    </div>
  );
}

function PrepCard({ data }: { data: any }) {
  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px', color: '#1e293b' }}>Neural Prep</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {data.talkingPoints.slice(0, 3).map((p: string, i: number) => (
          <div key={i} style={{ padding: '16px', background: '#f5f3ff', color: '#5b21b6', borderRadius: '16px', fontSize: '14px', borderLeft: '5px solid #8b5cf6', lineHeight: '1.5' }}>{p}</div>
        ))}
      </div>
    </div>
  );
}

function StarCard({ data }: { data: any }) {
  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px', color: '#1e293b' }}>Story Alignment</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data.recommendations.slice(0, 3).map((r: any, i: number) => (
          <div key={i} style={{ padding: '16px', background: '#fffbeb', borderRadius: '18px', border: '1px solid #fef3c7' }}>
            <div style={{ fontWeight: '900', fontSize: '14px', color: '#92400e' }}>{r.reason}</div>
            <div style={{ fontSize: '13px', color: '#b45309', marginTop: '8px', fontStyle: 'italic', lineHeight: '1.5' }}>{r.adaptation}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutreachCard({ targets, jobId }: { targets: any, jobId?: string }) {
  const [generated, setGenerated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async (role: string) => {
    setLoading(true);
    try {
      const resp = await chrome.runtime.sendMessage({ type: 'GENERATE_COLD_OUTREACH', payload: { jobId, targetRole: role } });
      if (resp.success) setGenerated(resp.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (generated) {
    return (
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px' }}>Expert Outreach</h3>
        <textarea value={generated} readOnly style={{ width: '100%', height: '220px', padding: '18px', borderRadius: '18px', border: '1px solid #e2e8f0', fontSize: '14px', lineHeight: '1.7', background: '#f8fafc', color: '#1e293b' }} />
        <button
          onClick={() => { navigator.clipboard.writeText(generated); alert('Expert message copied!'); }}
          style={{ width: '100%', marginTop: '16px', padding: '16px', background: '#10b981', color: 'white', borderRadius: '16px', border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '14px' }}
        >
          Copy Message
        </button>
        <button onClick={() => setGenerated(null)} style={{ width: '100%', marginTop: '12px', background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>← Back to Contacts</button>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '20px' }}>Competitive Networking</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {targets.targets.map((t: any, i: number) => (
          <div key={i} style={{ padding: '18px', background: '#f0fdfa', borderRadius: '20px', border: '1px solid #ccfbf1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontWeight: '900', color: '#134e4a', fontSize: '15px' }}>{t.role}</div>
              <button
                onClick={() => generate(t.role)}
                disabled={loading}
                style={{ background: '#0d9488', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}
              >
                {loading ? '...' : 'Generate'}
              </button>
            </div>
            <div style={{ fontSize: '13px', color: '#0f766e', lineHeight: '1.5' }}>{t.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
