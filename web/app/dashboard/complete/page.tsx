'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import {
  User,
  Briefcase,
  FileText,
  Star,
  Plus,
  Save,
  Trash2,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Settings
} from 'lucide-react';

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  portfolio: string;
  summary: string;
}

export default function CompleteDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [starStories, setStarStories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      const [profileRes, expRes, skillsRes, appsRes, resumesRes, storiesRes] = await Promise.all([
        fetch('/api/profile').then(r => r.json()),
        fetch('/api/experiences').then(r => r.json()),
        fetch('/api/skills').then(r => r.json()),
        fetch('/api/applications').then(r => r.json()),
        fetch('/api/resumes').then(r => r.json()),
        fetch('/api/star-stories').then(r => r.json()),
      ]);

      if (profileRes.success) setProfile(profileRes.profile);
      if (expRes.success) setExperiences(expRes.experiences || []);
      if (skillsRes.success) setSkills(skillsRes.skills || []);
      if (appsRes.success) setApplications(appsRes.applications || []);
      if (resumesRes.success) setResumes(resumesRes.resumes || []);
      if (storiesRes.success) setStarStories(storiesRes.starStories || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        // Broadcast for extension sync
        const channel = new BroadcastChannel('skillsyncc_sync');
        channel.postMessage({ type: 'PROFILE_UPDATED', profile });
        channel.close();

        alert('✅ Profile synchronized successfully!');
      }
    } catch (error) {
      alert('❌ Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const stats = {
    applications: applications.length,
    interviews: applications.filter(app => app.status === 'interview').length,
    offers: applications.filter(app => app.status === 'offer').length,
    responseRate: applications.length > 0 ? Math.round((applications.filter(app => app.status !== 'draft').length / applications.length) * 100) : 0,
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center font-bold text-white">
                S
              </div>
              <span className="text-xl font-bold">Skillsyncc</span>
            </div>

            <div className="flex items-center gap-6">
              <button className="text-gray-600 hover:text-emerald-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Stats Overview */}
          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Applications', value: stats.applications, icon: Briefcase, color: 'blue' },
              { label: 'Interviews', value: stats.interviews, icon: Calendar, color: 'emerald' },
              { label: 'Offers', value: stats.offers, icon: Award, color: 'purple' },
              { label: 'Response Rate', value: `${stats.responseRate}%`, icon: TrendingUp, color: 'orange' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                  <span className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</span>
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex border-b border-gray-200">
              {[
                { id: 'overview', label: 'Overview', icon: Target },
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'experiences', label: 'Experience', icon: Briefcase },
                { id: 'skills', label: 'Skills', icon: Star },
                { id: 'applications', label: 'Applications', icon: FileText },
                { id: 'resumes', label: 'Resumes', icon: FileText },
                { id: 'star-stories', label: 'STAR Stories', icon: Star },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium transition-all border-b-2 ${activeTab === tab.id
                    ? 'text-emerald-600 border-emerald-500 bg-emerald-50'
                    : 'text-gray-600 border-transparent hover:text-emerald-600'
                    }`}
                >
                  <tab.icon className="w-4 h-4 inline mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {activeTab === 'overview' && <OverviewTab stats={stats} />}
            {activeTab === 'profile' && (
              <ProfileTab
                profile={profile}
                setProfile={setProfile}
                saving={saving}
                onSave={saveProfile}
              />
            )}
            {activeTab === 'experiences' && <ExperiencesTab experiences={experiences} setExperiences={setExperiences} />}
            {activeTab === 'skills' && <SkillsTab skills={skills} setSkills={setSkills} />}
            {activeTab === 'applications' && <ApplicationsTab applications={applications} setApplications={setApplications} />}
            {activeTab === 'resumes' && <ResumesTab resumes={resumes} setResumes={setResumes} />}
            {activeTab === 'star-stories' && <StarStoriesTab starStories={starStories} setStarStories={setStarStories} />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Tab Components
function OverviewTab({ stats }: { stats: Record<string, string | number> }) {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold mb-6">Welcome to Your Career Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
            <div className="text-3xl font-bold text-emerald-600">{String(value)}</div>
            <div className="text-sm text-emerald-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileTab({ profile, setProfile, saving, onSave }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Professional Profile</h3>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Profile</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          placeholder="First Name"
          value={profile?.firstName || ''}
          onChange={(e) => setProfile(prev => prev ? { ...prev, firstName: e.target.value } : null)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <input
          placeholder="Last Name"
          value={profile?.lastName || ''}
          onChange={(e) => setProfile(prev => prev ? { ...prev, lastName: e.target.value } : null)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <input
          placeholder="Email"
          value={profile?.email || ''}
          onChange={(e) => setProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <input
          placeholder="Phone"
          value={profile?.phone || ''}
          onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <textarea
        placeholder="Professional Summary"
        value={profile?.summary || ''}
        onChange={(e) => setProfile(prev => prev ? { ...prev, summary: e.target.value } : null)}
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
      />
    </div>
  );
}

function ExperiencesTab({ experiences, setExperiences }: any) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-6">Work Experience</h3>
      <div className="space-y-4">
        {experiences.map((exp: any, i: number) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold">{exp.title}</h4>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.description}</p>
              </div>
              <button className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>
    </div>
  );
}

function SkillsTab({ skills, setSkills }: any) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { name: newSkill.trim() }]);
      setNewSkill('');
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-6">Skills</h3>
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Add a skill..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill: any, i: number) => (
          <span key={i} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm flex items-center gap-2">
            {skill.name}
            <button className="text-emerald-600 hover:text-emerald-800">×</button>
          </span>
        ))}
      </div>
    </div>
  );
}

function ApplicationsTab({ applications }: any) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-6">Job Applications</h3>
      <div className="space-y-4">
        {applications.map((app: any, i: number) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
            <div>
              <h4 className="font-bold">{app.jobTitle}</h4>
              <p className="text-gray-600">{app.company}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${app.status === 'interview' ? 'bg-green-100 text-green-700' :
              app.status === 'offer' ? 'bg-purple-100 text-purple-700' :
                app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
              }`}>
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResumesTab({ resumes }: any) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-6">Resume Versions</h3>
      <div className="space-y-4">
        {resumes.map((resume: any, i: number) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
            <div>
              <h4 className="font-bold">{resume.name}</h4>
              <p className="text-sm text-gray-500">Created {new Date(resume.createdAt).toLocaleDateString()}</p>
            </div>
            <button className="text-red-500 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StarStoriesTab({ starStories }: any) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-6">STAR Stories</h3>
      <div className="space-y-4">
        {starStories.map((story: any, i: number) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-bold mb-2">{story.situation?.substring(0, 50)}...</h4>
            <p className="text-sm text-gray-600">{story.result?.substring(0, 100)}...</p>
          </div>
        ))}
      </div>
    </div>
  );
}