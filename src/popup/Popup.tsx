// Popup Component - Main extension popup UI

import React, { useEffect, useState } from 'react';
import { StorageManager } from '../shared/storage/storage';
import type { ProfessionalProfile, Application } from '../types';
import { Briefcase, User, Clock, CheckCircle, XCircle, AlertTriangle, Eye, FileText, Plus } from 'lucide-react';

export default function Popup() {
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [profileData, applicationsData] = await Promise.all([
        StorageManager.getProfile(),
        StorageManager.getApplications(),
      ]);
      setProfile(profileData);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="w-80 p-4">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-80 p-4">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-4">Welcome to Job Copilot</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Set up your professional vault to get started
          </p>
          <button
            onClick={() => chrome.runtime.openOptionsPage()}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Set Up Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 min-h-96 bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4">
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="w-5 h-5" />
          <h1 className="text-lg font-bold">Skillsyncc</h1>
        </div>
        <p className="text-emerald-100 text-xs mt-1 truncate">
          {profile.personalInfo.firstName} {profile.personalInfo.lastName}
        </p>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 px-4 text-xs font-medium flex items-center justify-center gap-1 ${
            activeTab === 'overview'
              ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50'
              : 'text-gray-500 hover:text-emerald-600'
          }`}
        >
          <Eye className="w-3 h-3" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 py-3 px-4 text-xs font-medium flex items-center justify-center gap-1 ${
            activeTab === 'applications'
              ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50'
              : 'text-gray-500 hover:text-emerald-600'
          }`}
        >
          <Briefcase className="w-3 h-3" />
          Apps ({applications.length})
        </button>
      </div>

      <div className="p-3 max-h-80 overflow-y-auto">
        {activeTab === 'overview' ? (
          <OverviewTab profile={profile} applications={applications} />
        ) : (
          <ApplicationsTab applications={applications} />
        )}
      </div>

      <div className="border-t border-gray-200 p-3 bg-gray-50">
        <button
          onClick={() => chrome.runtime.openOptionsPage()}
          className="w-full text-xs text-gray-600 hover:text-emerald-600 py-2 flex items-center justify-center gap-1 font-medium"
        >
          <User className="w-3 h-3" />
          Settings & Profile
        </button>
      </div>
    </div>
  );
}

function OverviewTab({ profile, applications }: { profile: ProfessionalProfile; applications: Application[] }) {
  const recentApplications = applications.slice(0, 3);
  const activeApplications = applications.filter(
    app => app.status === 'applied' || app.status === 'under-review' || app.status === 'interview'
  );

  return (
    <div className="space-y-3">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Resume Versions
          </span>
          <span className="text-xs font-bold text-emerald-700">{profile.resumeVersions.length}</span>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <User className="w-3 h-3" />
            Skills
          </span>
          <span className="text-xs font-bold text-emerald-700">{profile.skills.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            Active Apps
          </span>
          <span className="text-xs font-bold text-emerald-700">{activeApplications.length}</span>
        </div>
      </div>

      {recentApplications.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Recent Applications
          </h3>
          <div className="space-y-2">
            {recentApplications.map(app => (
              <div
                key={app.id}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:bg-emerald-50 cursor-pointer transition-colors"
                onClick={() => chrome.runtime.openOptionsPage()}
              >
                <div className="font-medium text-sm text-gray-800 truncate">{app.jobTitle}</div>
                <div className="text-xs text-gray-600 mt-1 truncate">{app.company}</div>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      app.status === 'applied'
                        ? 'bg-blue-100 text-blue-700'
                        : app.status === 'interview'
                        ? 'bg-green-100 text-green-700'
                        : app.status === 'under-review'
                        ? 'bg-yellow-100 text-yellow-700'
                        : app.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={() => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { type: 'ACTIVATE_COPILOT' });
              }
            });
          }}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2.5 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all text-sm shadow-sm"
        >
          Analyze Current Page
        </button>
      </div>
    </div>
  );
}

function ApplicationsTab({ applications }: { applications: Application[] }) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="text-gray-500 text-sm mb-3 flex justify-center">
          <Briefcase className="w-8 h-8" />
        </div>
        <div className="text-gray-500 text-sm mb-4">No applications yet</div>
        <button
          onClick={() => chrome.runtime.openOptionsPage()}
          className="text-emerald-600 text-xs font-medium hover:text-emerald-700 flex items-center justify-center gap-1"
        >
          <Plus className="w-3 h-3" />
          Add Application
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {applications.map(app => (
        <div
          key={app.id}
          className="bg-white border border-gray-200 rounded-lg p-3 hover:bg-emerald-50 transition-colors"
        >
          <div className="font-medium text-sm text-gray-800 truncate">{app.jobTitle}</div>
          <div className="text-xs text-gray-600 mt-1 truncate">{app.company}</div>
          <div className="flex items-center justify-between mt-2">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                app.status === 'applied'
                  ? 'bg-blue-100 text-blue-700'
                  : app.status === 'interview'
                  ? 'bg-green-100 text-green-700'
                  : app.status === 'rejected'
                  ? 'bg-red-100 text-red-700'
                  : app.status === 'under-review'
                  ? 'bg-yellow-100 text-yellow-700'
                  : app.status === 'offer'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {app.status}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(app.appliedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
