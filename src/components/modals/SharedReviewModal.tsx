import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useUI } from '../../store/ui-store'
import SharedReview from '../collaboration/SharedReview'

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

const SharedReviewModal: React.FC = () => {
  const { state, dispatch } = useUI()
  const [sessions, setSessions] = useState<ReviewSession[]>([])
  const [documentId] = useState('current-document')
  const [currentUser] = useState({ id: '1', name: 'Current User', email: 'user@example.com' })

  if (!state.modals.sharedReview) return null

  const handleClose = () => {
    dispatch({ type: 'CLOSE_MODAL', payload: 'sharedReview' })
  }

  const handleCreateSession = (session: Omit<ReviewSession, 'id' | 'createdAt'>) => {
    const newSession: ReviewSession = {
      ...session,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    setSessions(prev => [...prev, newSession])
  }

  const handleUpdateSession = (id: string, updates: Partial<ReviewSession>) => {
    setSessions(prev => prev.map(session => 
      session.id === id ? { ...session, ...updates } : session
    ))
  }

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id))
  }

  const handleInviteReviewer = (sessionId: string, reviewer: Omit<Reviewer, 'id' | 'joinedAt'>) => {
    const newReviewer: Reviewer = {
      ...reviewer,
      id: Date.now().toString(),
      joinedAt: new Date()
    }
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, reviewers: [...session.reviewers, newReviewer] }
        : session
    ))
  }

  const handleRemoveReviewer = (sessionId: string, reviewerId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, reviewers: session.reviewers.filter(r => r.id !== reviewerId) }
        : session
    ))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Shared Review
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <SharedReview
            documentId={documentId}
            onCreateSession={handleCreateSession}
            onUpdateSession={handleUpdateSession}
            onDeleteSession={handleDeleteSession}
            onInviteReviewer={handleInviteReviewer}
            onRemoveReviewer={handleRemoveReviewer}
            sessions={sessions}
            currentUser={currentUser}
            isActive={true}
            onClose={handleClose}
          />
        </div>
      </div>
    </div>
  )
}

export default SharedReviewModal