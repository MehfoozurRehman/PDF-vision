'use client'

import React, { useState, useRef } from 'react'
import { Card } from '@/components/ui'
import {
  ShareIcon,
  XMarkIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  DocumentDuplicateIcon,
  LinkIcon,
  EnvelopeIcon,
  CalendarIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface Reviewer {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'reviewer' | 'approver' | 'observer'
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'completed'
  joinedAt?: Date
  lastActivity?: Date
  permissions: {
    canComment: boolean
    canApprove: boolean
    canEdit: boolean
    canShare: boolean
  }
}

interface ReviewSession {
  id: string
  title: string
  description: string
  createdBy: string
  createdAt: Date
  deadline?: Date
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  reviewers: Reviewer[]
  settings: {
    requireAllApprovals: boolean
    allowAnonymousComments: boolean
    autoReminders: boolean
    trackChanges: boolean
  }
  shareLink?: string
  notifications: {
    onComment: boolean
    onApproval: boolean
    onDeadline: boolean
  }
}

interface SharedReviewProps {
  documentId: string
  onCreateSession: (session: Omit<ReviewSession, 'id' | 'createdAt'>) => void
  onUpdateSession: (id: string, updates: Partial<ReviewSession>) => void
  onDeleteSession: (id: string) => void
  onInviteReviewer: (sessionId: string, reviewer: Omit<Reviewer, 'id' | 'joinedAt'>) => void
  onRemoveReviewer: (sessionId: string, reviewerId: string) => void
  sessions: ReviewSession[]
  currentUser: { id: string; name: string; email: string }
  isActive: boolean
  onClose: () => void
}

const REVIEWER_ROLES = [
  {
    id: 'reviewer' as const,
    name: 'Reviewer',
    description: 'Can add comments and suggestions',
    permissions: { canComment: true, canApprove: false, canEdit: false, canShare: false }
  },
  {
    id: 'approver' as const,
    name: 'Approver',
    description: 'Can approve or reject the document',
    permissions: { canComment: true, canApprove: true, canEdit: false, canShare: false }
  },
  {
    id: 'observer' as const,
    name: 'Observer',
    description: 'Can view comments but not add them',
    permissions: { canComment: false, canApprove: false, canEdit: false, canShare: false }
  }
]

const STATUS_COLORS = {
  pending: '#f59e0b',
  reviewing: '#3b82f6',
  approved: '#10b981',
  rejected: '#ef4444',
  completed: '#6b7280'
}

const SESSION_STATUS_COLORS = {
  draft: '#6b7280',
  active: '#3b82f6',
  completed: '#10b981',
  cancelled: '#ef4444'
}

export default function SharedReview({
  documentId,
  onCreateSession,
  onUpdateSession,
  onDeleteSession,
  onInviteReviewer,
  onRemoveReviewer,
  sessions,
  currentUser,
  isActive,
  onClose
}: SharedReviewProps) {
  const [activeTab, setActiveTab] = useState<'sessions' | 'create' | 'invite'>('sessions')
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  
  // Create session form
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    deadline: '',
    requireAllApprovals: false,
    allowAnonymousComments: true,
    autoReminders: true,
    trackChanges: true
  })
  
  // Invite reviewer form
  const [newReviewer, setNewReviewer] = useState({
    name: '',
    email: '',
    role: 'reviewer' as const
  })
  
  const [shareMethod, setShareMethod] = useState<'email' | 'link'>('email')
  const [emailMessage, setEmailMessage] = useState('')

  const activeSessions = sessions.filter(s => s.status === 'active')
  const completedSessions = sessions.filter(s => s.status === 'completed')

  const handleCreateSession = () => {
    if (!newSession.title.trim()) return
    
    const session: Omit<ReviewSession, 'id' | 'createdAt'> = {
      title: newSession.title,
      description: newSession.description,
      createdBy: currentUser.id,
      deadline: newSession.deadline ? new Date(newSession.deadline) : undefined,
      status: 'draft',
      reviewers: [],
      settings: {
        requireAllApprovals: newSession.requireAllApprovals,
        allowAnonymousComments: newSession.allowAnonymousComments,
        autoReminders: newSession.autoReminders,
        trackChanges: newSession.trackChanges
      },
      shareLink: `${window.location.origin}/review/${documentId}/${Date.now()}`,
      notifications: {
        onComment: true,
        onApproval: true,
        onDeadline: true
      }
    }
    
    onCreateSession(session)
    
    // Reset form
    setNewSession({
      title: '',
      description: '',
      deadline: '',
      requireAllApprovals: false,
      allowAnonymousComments: true,
      autoReminders: true,
      trackChanges: true
    })
    
    setActiveTab('sessions')
  }

  const handleInviteReviewer = () => {
    if (!selectedSession || !newReviewer.name.trim() || !newReviewer.email.trim()) return
    
    const roleConfig = REVIEWER_ROLES.find(r => r.id === newReviewer.role)
    if (!roleConfig) return
    
    const reviewer: Omit<Reviewer, 'id' | 'joinedAt'> = {
      name: newReviewer.name,
      email: newReviewer.email,
      role: newReviewer.role,
      status: 'pending',
      permissions: roleConfig.permissions
    }
    
    onInviteReviewer(selectedSession, reviewer)
    
    // Reset form
    setNewReviewer({
      name: '',
      email: '',
      role: 'reviewer'
    })
    
    setActiveTab('sessions')
  }

  const handleStartSession = (sessionId: string) => {
    onUpdateSession(sessionId, { status: 'active' })
  }

  const handleCompleteSession = (sessionId: string) => {
    onUpdateSession(sessionId, { status: 'completed' })
  }

  const copyShareLink = (link: string) => {
    navigator.clipboard.writeText(link)
    // You could add a toast notification here
  }

  const getSessionProgress = (session: ReviewSession) => {
    const totalReviewers = session.reviewers.length
    const completedReviewers = session.reviewers.filter(r => 
      r.status === 'approved' || r.status === 'rejected' || r.status === 'completed'
    ).length
    
    return totalReviewers > 0 ? (completedReviewers / totalReviewers) * 100 : 0
  }

  const renderSessionCard = (session: ReviewSession) => {
    const progress = getSessionProgress(session)
    const approvedCount = session.reviewers.filter(r => r.status === 'approved').length
    const rejectedCount = session.reviewers.filter(r => r.status === 'rejected').length
    const pendingCount = session.reviewers.filter(r => r.status === 'pending').length
    
    return (
      <div key={session.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900">{session.title}</h3>
              <span
                className="px-2 py-1 text-xs rounded-full text-white"
                style={{ backgroundColor: SESSION_STATUS_COLORS[session.status] }}
              >
                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
              </span>
            </div>
            {session.description && (
              <p className="text-sm text-gray-600 mt-1">{session.description}</p>
            )}
            {session.deadline && (
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <CalendarIcon className="w-3 h-3 mr-1" />
                Deadline: {new Date(session.deadline).toLocaleDateString()}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {session.status === 'draft' && (
              <button
                onClick={() => handleStartSession(session.id)}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Start Review
              </button>
            )}
            {session.status === 'active' && (
              <button
                onClick={() => handleCompleteSession(session.id)}
                className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
              >
                Complete
              </button>
            )}
            <button
              onClick={() => {
                setSelectedSession(session.id)
                setActiveTab('invite')
              }}
              className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Invite
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Reviewers Summary */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <UserGroupIcon className="w-3 h-3" />
              <span>{session.reviewers.length} reviewers</span>
            </div>
            {approvedCount > 0 && (
              <div className="flex items-center space-x-1 text-green-600">
                <CheckCircleIcon className="w-3 h-3" />
                <span>{approvedCount} approved</span>
              </div>
            )}
            {rejectedCount > 0 && (
              <div className="flex items-center space-x-1 text-red-600">
                <XCircleIcon className="w-3 h-3" />
                <span>{rejectedCount} rejected</span>
              </div>
            )}
            {pendingCount > 0 && (
              <div className="flex items-center space-x-1 text-yellow-600">
                <ClockIcon className="w-3 h-3" />
                <span>{pendingCount} pending</span>
              </div>
            )}
          </div>
          
          {session.shareLink && (
            <button
              onClick={() => copyShareLink(session.shareLink!)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
              title="Copy share link"
            >
              <LinkIcon className="w-3 h-3" />
              <span>Copy Link</span>
            </button>
          )}
        </div>
        
        {/* Reviewers List */}
        {session.reviewers.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-gray-700">Reviewers:</h4>
            <div className="space-y-1">
              {session.reviewers.map((reviewer) => (
                <div key={reviewer.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[reviewer.status] }}
                    />
                    <span>{reviewer.name}</span>
                    <span className="text-gray-500">({reviewer.role})</span>
                  </div>
                  <button
                    onClick={() => onRemoveReviewer(session.id, reviewer.id)}
                    className="text-red-600 hover:text-red-700"
                    title="Remove reviewer"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center">
            <ShareIcon className="w-5 h-5 mr-2" />
            Shared Review
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'sessions', name: 'Review Sessions', icon: ChatBubbleLeftRightIcon },
            { id: 'create', name: 'Create Session', icon: DocumentDuplicateIcon },
            { id: 'invite', name: 'Invite Reviewers', icon: EnvelopeIcon }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              {/* Active Sessions */}
              {activeSessions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Active Sessions ({activeSessions.length})</h3>
                  <div className="space-y-3">
                    {activeSessions.map(renderSessionCard)}
                  </div>
                </div>
              )}
              
              {/* Completed Sessions */}
              {completedSessions.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Completed Sessions ({completedSessions.length})</h3>
                  <div className="space-y-3">
                    {completedSessions.map(renderSessionCard)}
                  </div>
                </div>
              )}
              
              {sessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No review sessions yet</p>
                  <p className="text-sm">Create a session to start collaborating</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Create Review Session</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Session Title</label>
                <input
                  type="text"
                  value={newSession.title}
                  onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter session title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  value={newSession.description}
                  onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe what needs to be reviewed..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (Optional)</label>
                <input
                  type="datetime-local"
                  value={newSession.deadline}
                  onChange={(e) => setNewSession({ ...newSession, deadline: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Settings</h4>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newSession.requireAllApprovals}
                    onChange={(e) => setNewSession({ ...newSession, requireAllApprovals: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm">Require all approvals</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newSession.allowAnonymousComments}
                    onChange={(e) => setNewSession({ ...newSession, allowAnonymousComments: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm">Allow anonymous comments</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newSession.autoReminders}
                    onChange={(e) => setNewSession({ ...newSession, autoReminders: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm">Send automatic reminders</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newSession.trackChanges}
                    onChange={(e) => setNewSession({ ...newSession, trackChanges: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm">Track changes</span>
                </label>
              </div>
              
              <button
                onClick={handleCreateSession}
                disabled={!newSession.title.trim()}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create Session
              </button>
            </div>
          )}

          {activeTab === 'invite' && (
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Invite Reviewers</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Session</label>
                <select
                  value={selectedSession || ''}
                  onChange={(e) => setSelectedSession(e.target.value || null)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a session...</option>
                  {sessions.filter(s => s.status !== 'completed').map((session) => (
                    <option key={session.id} value={session.id}>{session.title}</option>
                  ))}
                </select>
              </div>
              
              {selectedSession && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer Name</label>
                    <input
                      type="text"
                      value={newReviewer.name}
                      onChange={(e) => setNewReviewer({ ...newReviewer, name: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter reviewer name..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={newReviewer.email}
                      onChange={(e) => setNewReviewer({ ...newReviewer, email: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={newReviewer.role}
                      onChange={(e) => setNewReviewer({ ...newReviewer, role: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {REVIEWER_ROLES.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name} - {role.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={handleInviteReviewer}
                    disabled={!newReviewer.name.trim() || !newReviewer.email.trim()}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Send Invitation
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}