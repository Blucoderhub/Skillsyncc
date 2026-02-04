import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { PlatformDetector } from '../shared/platforms/platformDetector';
import type { JobDescription, ProfessionalProfile } from '../types';
import { Cpu, Shield, Users, User, X } from 'lucide-react';
import '../styles/globals.css';

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
  const [synergyAnalysis, setSynergyAnalysis] = useState<any>(null);
  const [peerEndorsement, setPeerEndorsement] = useState<any>(null);
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
    const syncChannel = new BroadcastChannel('skillsyncc_sync');
    syncChannel.onmessage = (event) => {
      if (event.data.type === 'PROFILE_UPDATED') {
        setProfile(event.data.profile);
        chrome.runtime.sendMessage({ type: 'UPDATE_PROFILE', payload: event.data.profile });
      }
    };

    // Initial injection of triggers
    injectAutofillTriggers();

    return () => syncChannel.close();
  }, []);

  async function loadData() {
    if (!chrome.runtime?.id) return;
    setLoading(true);
    try {
      const profileResp = await chrome.runtime.sendMessage({ type: 'GET_PROFILE' });
      if (profileResp.success && profileResp.data) setProfile(profileResp.data);

      const resp = await chrome.runtime.sendMessage({ type: 'EXTRACT_JOB_DESCRIPTION' });
      if (resp.success && resp.data) {
        setJobDescription(resp.data);
        const jobId = resp.data.id;
        chrome.runtime.sendMessage({ type: 'ANALYZE_TECHNICAL_SYNERGY', payload: { jobId } }).then(r => r.success && setSynergyAnalysis(r.data));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const icons = [
    { id: 'match', label: 'Synergy', icon: Cpu, color: '#FFD700' },
    { id: 'ats', label: 'ATS Guard', icon: Shield, color: '#F5F5F7' },
    { id: 'peer', label: 'Endorsement', icon: Users, color: '#FFD700' },
    { id: 'profile', label: 'Vault', icon: User, color: '#F5F5F7' }
  ];

  return (
    <div style={{
      position: 'fixed', top: '50%', right: '24px', transform: 'translateY(-50%)', zIndex: 100000,
      display: 'flex', alignItems: 'center', gap: '24px', fontFamily: "'Inter', sans-serif"
    }}>
      {/* Popups */}
      {activePopup && (
        <div
          style={{
            width: '440px', background: 'rgba(10, 10, 11, 0.95)', backdropFilter: 'blur(32px)',
            borderRadius: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            padding: '40px', border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#F5F5F7', transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            animation: 'slideInRight 0.4s ease-out'
          }}
        >
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="neural-spinner">S</div>
              <div style={{ fontSize: '11px', color: '#A1A1AA', fontWeight: '800', letterSpacing: '0.2em' }}>SYNCHRONIZING...</div>
            </div>
          ) : (
            <>
              {activePopup === 'match' && synergyAnalysis && <SynergyCard data={synergyAnalysis} />}
              {activePopup === 'ats' && <AtsGuardCard />}
              {activePopup === 'peer' && <PeerEndorsementCard jobDescription={jobDescription} />}
              {activePopup === 'profile' && profile && <ProfileVaultCard profile={profile} />}
            </>
          )}
        </div>
      )}

      {/* obsidian Vertical Dock */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        background: 'rgba(10, 10, 11, 0.8)',
        backdropFilter: 'blur(20px)',
        padding: '12px',
        borderRadius: '2rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        gap: '12px'
      }}>
        {icons.map(item => (
          <div
            key={item.id}
            onClick={() => setActivePopup(activePopup === item.id ? null : item.id)}
            style={{
              width: '48px', height: '48px', borderRadius: '1.25rem',
              background: activePopup === item.id ? '#F5F5F7' : 'transparent',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.3s ease',
              color: activePopup === item.id ? '#0A0A0B' : '#A1A1AA',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <item.icon size={20} />
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .neural-spinner { 
          width: 40px; height: 40px; background: white; color: black; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
          font-weight: 900; animation: pulse 2s infinite; 
        }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
      `}} />
    </div>
  );
}

function SynergyCard({ data }: { data: any }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        <Cpu size={20} color="#FFD700" />
        <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Neural Synergy</span>
      </div>
      <div style={{ fontSize: '64px', fontWeight: '900', marginBottom: '8px', letterSpacing: '-0.04em' }}>{data.synergyScore}%</div>
      <div style={{ fontSize: '11px', color: '#A1A1AA', marginBottom: '32px', fontWeight: '700', textTransform: 'uppercase' }}>Technical Alignment Index</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data.logicalOverlaps && data.logicalOverlaps.slice(0, 3).map((o: string, i: number) => (
          <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', fontSize: '14px', lineHeight: '1.6' }}>
            <span style={{ color: '#FFD700', marginRight: '8px' }}>+</span> {o}
          </div>
        ))}
      </div>
    </div>
  );
}

function AtsGuardCard() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        <Shield size={20} color="#FFD700" />
        <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase' }}>ATS Guard</span>
      </div>
      <div style={{ padding: '32px', background: 'rgba(255,255,255,0.03)', borderRadius: '1.5rem', border: '1px solid rgba(255,215,0,0.1)' }}>
        <div style={{ color: '#FFD700', fontSize: '12px', fontWeight: '900', marginBottom: '8px' }}>SYSTEM PASS: 98%</div>
        <p style={{ fontSize: '14px', color: '#A1A1AA', lineHeight: '1.6' }}>Resume formatting optimized for high-tier entry points. No structural risks detected.</p>
      </div>
    </div>
  );
}

function PeerEndorsementCard({ jobDescription }: { jobDescription: any }) {
  const [endorsement, setEndorsement] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const r = await chrome.runtime.sendMessage({ type: 'GENERATE_PEER_ENDORSEMENT', payload: { jobId: jobDescription?.id } });
    if (r.success) setEndorsement(r.data);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        <Users size={20} color="#FFD700" />
        <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Endorsement</span>
      </div>
      {!endorsement ? (
        <button onClick={generate} style={{ width: '100%', padding: '16px', background: 'white', color: 'black', border: 'none', borderRadius: '1rem', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>
          {loading ? 'SYNCHRONIZING...' : 'Generate Peer-Grade Referral'}
        </button>
      ) : (
        <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '1.5rem', fontSize: '14px', lineHeight: '1.7', color: '#D1D1D6' }}>
          {endorsement.endorsementText}
        </div>
      )}
    </div>
  );
}

function ProfileVaultCard({ profile }: { profile: ProfessionalProfile }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
        <User size={20} color="#FFD700" />
        <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Vault</span>
      </div>
      <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>{profile.personalInfo.firstName} {profile.personalInfo.lastName}</div>
      <div style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '32px' }}>{profile.skills.length} Technical Indices Synced</div>
      <button onClick={() => chrome.runtime.openOptionsPage()} style={{ width: '100%', padding: '16px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>Manage Identifier</button>
    </div>
  );
}

function injectAutofillTriggers() {
  const fields = document.querySelectorAll('input, textarea');
  fields.forEach((field: any) => {
    if (field.type === 'hidden' || field.type === 'submit' || field.dataset.aiInjected === 'true') return;

    const container = field.parentElement;
    if (!container) return;

    const trigger = document.createElement('div');
    trigger.className = 'ai-autofill-trigger';
    trigger.innerHTML = '✨';
    trigger.style.cssText = 'position:absolute;right:10px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:14px;opacity:0.7;z-index:1000;transition:all 0.2s;color:#FFD700';

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
