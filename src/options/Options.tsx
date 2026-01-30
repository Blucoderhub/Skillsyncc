// Options Page - Professional Vault Management

import { useEffect, useState } from 'react';
import { StorageManager } from '../shared/storage/storage';
import { VaultManager } from '../shared/vault/vaultManager';
import type { ProfessionalProfile, ExtensionSettings } from '../types';
import { User, FileText, Briefcase, Target, Star, Settings, ChevronRight, ExternalLink, Upload, Download, Save, CheckCircle, AlertCircle, Lock, Plus } from 'lucide-react';

export default function Options() {
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<
    'profile' | 'resumes' | 'experiences' | 'skills' | 'star-stories' | 'settings'
  >('profile');

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const profileData = await StorageManager.getProfile();
      if (!profileData) {
        // Create default profile
        const newProfile = await VaultManager.createProfile({});
        setProfile(newProfile);
      } else {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: Partial<ProfessionalProfile>) {
    if (!profile) return;
    const updated = await VaultManager.updateProfile(updates);
    setProfile(updated);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold">Skillsyncc Professional Vault</h1>
          </div>
          <p className="text-emerald-100 text-sm ml-13">Securely manage your professional data and application materials</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1 bg-white rounded-xl p-2 shadow-sm border border-gray-200">
              {[
                { id: 'profile', label: 'Personal Info', icon: User },
                { id: 'resumes', label: 'Resume Versions', icon: FileText },
                { id: 'experiences', label: 'Experiences', icon: Briefcase },
                { id: 'skills', label: 'Skills', icon: Target },
                { id: 'star-stories', label: 'STAR Stories', icon: Star },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as any)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${activeSection === item.id
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {item.label}
                    <ChevronRight className={`ml-auto w-4 h-4 transition-transform ${activeSection === item.id ? 'rotate-90' : ''}`} />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {activeSection === 'profile' && (
                <ProfileSection profile={profile} onUpdate={updateProfile} />
              )}
              {activeSection === 'resumes' && (
                <ResumesSection profile={profile} onUpdate={loadProfile} />
              )}
              {activeSection === 'experiences' && (
                <ExperiencesSection profile={profile} onUpdate={loadProfile} />
              )}
              {activeSection === 'skills' && (
                <SkillsSection profile={profile} onUpdate={updateProfile} />
              )}
              {activeSection === 'star-stories' && (
                <STARStoriesSection profile={profile} onUpdate={loadProfile} />
              )}
              {activeSection === 'settings' && <SettingsSection />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSection({
  profile,
  onUpdate,
}: {
  profile: ProfessionalProfile;
  onUpdate: (updates: Partial<ProfessionalProfile>) => Promise<void>;
}) {
  const [formData, setFormData] = useState(profile.personalInfo);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onUpdate({ personalInfo: formData });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
        <h3 className="text-lg font-bold text-emerald-900 mb-2 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Quick Start: Setup Your Vault
        </h3>
        <p className="text-emerald-700 text-sm mb-4">Link your LinkedIn profile and upload your resume to unlock all AI features.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={async () => {
              setSaving(true);
              try {
                const resp = await chrome.runtime.sendMessage({ type: 'IMPORT_LINKEDIN_PROFILE' });
                if (resp.success) {
                  alert('Profile imported from LinkedIn!');
                  window.location.reload();
                }
              } catch (e) {
                alert(e instanceof Error ? e.message : 'Import failed');
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
            className="bg-[#0077b5] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#006097] flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
          >
            <span className="text-lg">in</span>
            Import from LinkedIn
          </button>

          <label className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all">
            <Upload className="w-4 h-4" />
            Upload Resume (.txt)
            <input
              type="file"
              accept=".txt"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (event) => {
                  const content = event.target?.result as string;
                  await VaultManager.addResumeVersion({
                    name: file.name,
                    content,
                    tags: ['uploaded']
                  });
                  alert('Resume uploaded successfully!');
                  window.location.reload();
                };
                reader.readAsText(file);
              }}
            />
          </label>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <User className="w-5 h-5" />
        Personal Information
      </h2>
      <div className="space-y-4 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <User className="w-3 h-3" />
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <User className="w-3 h-3" />
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <User className="w-3 h-3" />
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <User className="w-3 h-3" />
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Target className="w-3 h-3" />
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            LinkedIn
          </label>
          <input
            type="url"
            value={formData.linkedIn || ''}
            onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Professional Summary
          </label>
          <textarea
            value={formData.summary || ''}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 flex items-center gap-2 transition-all"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ResumesSection({
  profile,
  onUpdate,
}: {
  profile: ProfessionalProfile;
  onUpdate: () => Promise<void>;
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResume, setNewResume] = useState({ name: '', content: '', tags: '' });

  async function handleAddResume() {
    try {
      await VaultManager.addResumeVersion({
        name: newResume.name,
        content: newResume.content,
        tags: newResume.tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      setShowAddForm(false);
      setNewResume({ name: '', content: '', tags: '' });
      await onUpdate();
    } catch (error) {
      console.error('Failed to add resume:', error);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Resume Versions
        </h2>
        <div className="flex gap-2">
          <label className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 cursor-pointer flex items-center gap-1 transition-all">
            <Upload className="w-4 h-4" />
            Upload (.txt)
            <input
              type="file"
              accept=".txt"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (event) => {
                  const content = event.target?.result as string;
                  await VaultManager.addResumeVersion({
                    name: file.name,
                    content,
                    tags: ['uploaded']
                  });
                  await onUpdate();
                };
                reader.readAsText(file);
              }}
            />
          </label>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 flex items-center gap-1 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Manual
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Resume Name"
              value={newResume.name}
              onChange={(e) => setNewResume({ ...newResume, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
            />
            <textarea
              placeholder="Paste resume content here..."
              value={newResume.content}
              onChange={(e) => setNewResume({ ...newResume, content: e.target.value })}
              rows={10}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={newResume.tags}
              onChange={(e) => setNewResume({ ...newResume, tags: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddResume}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {profile.resumeVersions.map((resume) => (
          <div key={resume.id} className="border border-gray-200 rounded-xl p-4 bg-white hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{resume.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Created {new Date(resume.createdAt).toLocaleDateString()}
                </p>
                {resume.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {resume.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={async () => {
                  if (confirm('Delete this resume version?')) {
                    await VaultManager.deleteResumeVersion(resume.id);
                    await onUpdate();
                  }
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {profile.resumeVersions.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No resume versions yet. Add your first resume to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ExperiencesSection({
  profile,
  onUpdate,
}: {
  profile: ProfessionalProfile;
  onUpdate: () => Promise<void>;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-6">Work Experiences</h2>
      <div className="space-y-4">
        {profile.experiences.map((exp) => (
          <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900">{exp.title}</h3>
            <p className="text-sm text-gray-600">{exp.company}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(exp.startDate).toLocaleDateString()} -{' '}
              {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ''}
            </p>
          </div>
        ))}
        {profile.experiences.length === 0 && (
          <div className="text-center py-8 text-gray-500">No experiences added yet.</div>
        )}
      </div>
    </div>
  );
}

function SkillsSection({
  profile,
  onUpdate,
}: {
  profile: ProfessionalProfile;
  onUpdate: (updates: Partial<ProfessionalProfile>) => Promise<void>;
}) {
  const [newSkill, setNewSkill] = useState('');

  async function handleAddSkill() {
    if (!newSkill.trim()) return;
    await onUpdate({ skills: [...profile.skills, newSkill.trim()] });
    setNewSkill('');
  }

  async function handleRemoveSkill(skill: string) {
    await onUpdate({ skills: profile.skills.filter(s => s !== skill) });
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Target className="w-5 h-5" />
        Skills
      </h2>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          placeholder="Add a skill"
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
        />
        <button
          onClick={handleAddSkill}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2.5 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {profile.skills.map((skill) => (
          <span
            key={skill}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-full text-sm flex items-center gap-2 border border-emerald-200"
          >
            {skill}
            <button
              onClick={() => handleRemoveSkill(skill)}
              className="text-emerald-700 hover:text-emerald-900 w-5 h-5 flex items-center justify-center rounded-full hover:bg-emerald-200 transition-colors"
            >
              ×
            </button>
          </span>
        ))}
        {profile.skills.length === 0 && (
          <div className="text-gray-500 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            No skills added yet.
          </div>
        )}
      </div>
    </div>
  );
}

function STARStoriesSection({
  profile,
  onUpdate,
}: {
  profile: ProfessionalProfile;
  onUpdate: () => Promise<void>;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-6">STAR Stories</h2>
      <div className="space-y-4">
        {profile.starStories.map((story) => (
          <div key={story.id} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Situation</h3>
            <p className="text-sm text-gray-700 mb-4">{story.situation}</p>
            <h3 className="font-medium text-gray-900 mb-2">Task</h3>
            <p className="text-sm text-gray-700 mb-4">{story.task}</p>
            <h3 className="font-medium text-gray-900 mb-2">Action</h3>
            <p className="text-sm text-gray-700 mb-4">{story.action}</p>
            <h3 className="font-medium text-gray-900 mb-2">Result</h3>
            <p className="text-sm text-gray-700">{story.result}</p>
          </div>
        ))}
        {profile.starStories.length === 0 && (
          <div className="text-center py-8 text-gray-500">No STAR stories added yet.</div>
        )}
      </div>
    </div>
  );
}

function SettingsSection() {
  const [settings, setSettings] = useState<ExtensionSettings>({
    autoActivate: true,
    showMatchScore: true,
    requireApproval: true,
    premium: false,
    aiProvider: 'openai',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const loadedSettings = await StorageManager.getSettings();
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSettings() {
    await StorageManager.saveSettings(settings);
    alert('Settings saved!');
  }

  if (loading) {
    return <div className="text-gray-500">Loading settings...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Settings className="w-5 h-5" />
        Extension Settings
      </h2>
      <div className="space-y-5 max-w-2xl">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Auto-activate on job pages
            </label>
            <p className="text-xs text-gray-500 mt-1">Automatically show copilot on job listing pages</p>
          </div>
          <input
            type="checkbox"
            checked={settings.autoActivate}
            onChange={(e) => setSettings({ ...settings, autoActivate: e.target.checked })}
            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Target className="w-3 h-3" />
              Show match score
            </label>
            <p className="text-xs text-gray-500 mt-1">Display skill match score on job pages</p>
          </div>
          <input
            type="checkbox"
            checked={settings.showMatchScore}
            onChange={(e) => setSettings({ ...settings, showMatchScore: e.target.checked })}
            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Require approval
            </label>
            <p className="text-xs text-gray-500 mt-1">Always require user approval before autofill</p>
          </div>
          <input
            type="checkbox"
            checked={settings.requireApproval}
            onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
            className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Target className="w-3 h-3" />
            AI Provider
          </label>
          <select
            value={settings.aiProvider}
            onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value as any })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
          >
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="local">Local Model</option>
          </select>
        </div>
        {settings.aiProvider !== 'local' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              API Key
            </label>
            <input
              type="password"
              value={settings.apiKey || ''}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              placeholder="Enter your API key"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>
        )}
        <button
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2.5 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
