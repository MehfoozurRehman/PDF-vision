'use client'

import React, { useState, useEffect } from 'react'
import { Card, Badge } from '@/components/ui'
import {
  DocumentDuplicateIcon,
  ClockIcon,
  UserIcon,
  EyeIcon,
  ArrowPathIcon,
  TagIcon,
  ArrowsRightLeftIcon,
  ArrowsPointingInIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  LockClosedIcon,
  LockOpenIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
  DocumentIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  ArchiveBoxIcon,
  TrashIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface DocumentVersion {
  id: string
  versionNumber: string
  title: string
  description: string
  createdBy: string
  createdAt: Date
  fileSize: number
  fileUrl: string
  thumbnailUrl?: string
  status: 'draft' | 'review' | 'approved' | 'archived' | 'deprecated'
  tags: string[]
  parentVersion?: string
  branchName?: string
  isMajorVersion: boolean
  changesSummary: string
  approvedBy?: string
  approvedAt?: Date
  downloadCount: number
  viewCount: number
  isLocked: boolean
  lockedBy?: string
  lockedAt?: Date
  comments: VersionComment[]
  metadata: {
    pageCount: number
    wordCount?: number
    lastModified: Date
    checksum: string
    format: string
    compression?: string
  }
}

interface VersionComment {
  id: string
  content: string
  author: string
  createdAt: Date
  type: 'general' | 'approval' | 'rejection' | 'suggestion'
  isResolved: boolean
  resolvedBy?: string
  resolvedAt?: Date
}

interface VersionBranch {
  id: string
  name: string
  description: string
  createdBy: string
  createdAt: Date
  baseVersion: string
  isActive: boolean
  versionsCount: number
  lastActivity: Date
  mergeStatus?: 'pending' | 'approved' | 'rejected' | 'merged'
  mergeTarget?: string
}

interface VersionControlProps {
  documentId: string
  versions: DocumentVersion[]
  branches: VersionBranch[]
  currentVersion: string
  onCreateVersion: (version: Omit<DocumentVersion, 'id' | 'createdAt' | 'downloadCount' | 'viewCount' | 'comments'>) => void
  onUpdateVersion: (id: string, updates: Partial<DocumentVersion>) => void
  onDeleteVersion: (id: string) => void
  onRestoreVersion: (id: string) => void
  onCompareVersions: (version1: string, version2: string) => void
  onDownloadVersion: (id: string) => void
  onLockVersion: (id: string) => void
  onUnlockVersion: (id: string) => void
  onCreateBranch: (branch: Omit<VersionBranch, 'id' | 'createdAt' | 'versionsCount' | 'lastActivity'>) => void
  onMergeBranch: (branchId: string, targetBranch: string) => void
  onAddComment: (versionId: string, comment: Omit<VersionComment, 'id' | 'createdAt'>) => void
  currentUser: { id: string; name: string; email: string }
  isActive: boolean
  onClose: () => void
}

const VERSION_STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  archived: 'bg-blue-100 text-blue-800',
  deprecated: 'bg-red-100 text-red-800'
}

const COMMENT_TYPE_COLORS = {
  general: 'bg-blue-100 text-blue-800',
  approval: 'bg-green-100 text-green-800',
  rejection: 'bg-red-100 text-red-800',
  suggestion: 'bg-purple-100 text-purple-800'
}

const MERGE_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  merged: 'bg-blue-100 text-blue-800'
}

export default function VersionControl({
  documentId,
  versions,
  branches,
  currentVersion,
  onCreateVersion,
  onUpdateVersion,
  onDeleteVersion,
  onRestoreVersion,
  onCompareVersions,
  onDownloadVersion,
  onLockVersion,
  onUnlockVersion,
  onCreateBranch,
  onMergeBranch,
  onAddComment,
  currentUser,
  isActive,
  onClose
}: VersionControlProps) {
  const [activeTab, setActiveTab] = useState<'versions' | 'branches' | 'compare' | 'create'>('versions')
  const [selectedVersions, setSelectedVersions] = useState<string[]>([])
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set())
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'list' | 'tree' | 'timeline'>('list')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'version' | 'author'>('date')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Create version form
  const [newVersion, setNewVersion] = useState({
    title: '',
    description: '',
    isMajorVersion: false,
    branchName: 'main',
    tags: [] as string[],
    changesSummary: ''
  })
  
  // Create branch form
  const [newBranch, setNewBranch] = useState({
    name: '',
    description: '',
    baseVersion: currentVersion
  })
  
  // Comment form
  const [newComment, setNewComment] = useState({
    versionId: '',
    content: '',
    type: 'general' as const
  })
  
  const [showCommentForm, setShowCommentForm] = useState<string | null>(null)
  const [newTag, setNewTag] = useState('')

  // Filter and sort versions
  const filteredVersions = versions
    .filter(version => {
      if (filterStatus !== 'all' && version.status !== filterStatus) return false
      if (searchTerm && !version.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !version.description.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.createdAt.getTime() - a.createdAt.getTime()
        case 'version':
          return b.versionNumber.localeCompare(a.versionNumber, undefined, { numeric: true })
        case 'author':
          return a.createdBy.localeCompare(b.createdBy)
        default:
          return 0
      }
    })

  const handleCreateVersion = () => {
    if (!newVersion.title.trim()) return
    
    const version: Omit<DocumentVersion, 'id' | 'createdAt' | 'downloadCount' | 'viewCount' | 'comments'> = {
      versionNumber: generateVersionNumber(),
      title: newVersion.title,
      description: newVersion.description,
      createdBy: currentUser.id,
      fileSize: 0, // Will be set when file is uploaded
      fileUrl: '', // Will be set when file is uploaded
      status: 'draft',
      tags: newVersion.tags,
      branchName: newVersion.branchName,
      isMajorVersion: newVersion.isMajorVersion,
      changesSummary: newVersion.changesSummary,
      isLocked: false,
      metadata: {
        pageCount: 0,
        lastModified: new Date(),
        checksum: '',
        format: 'pdf'
      }
    }
    
    onCreateVersion(version)
    
    // Reset form
    setNewVersion({
      title: '',
      description: '',
      isMajorVersion: false,
      branchName: 'main',
      tags: [],
      changesSummary: ''
    })
    
    setActiveTab('versions')
  }

  const handleCreateBranch = () => {
    if (!newBranch.name.trim()) return
    
    const branch: Omit<VersionBranch, 'id' | 'createdAt' | 'versionsCount' | 'lastActivity'> = {
      name: newBranch.name,
      description: newBranch.description,
      createdBy: currentUser.id,
      baseVersion: newBranch.baseVersion,
      isActive: true
    }
    
    onCreateBranch(branch)
    
    // Reset form
    setNewBranch({
      name: '',
      description: '',
      baseVersion: currentVersion
    })
  }

  const handleAddComment = (versionId: string) => {
    if (!newComment.content.trim()) return
    
    const comment: Omit<VersionComment, 'id' | 'createdAt'> = {
      content: newComment.content,
      author: currentUser.id,
      type: newComment.type,
      isResolved: false
    }
    
    onAddComment(versionId, comment)
    
    setNewComment({ versionId: '', content: '', type: 'general' })
    setShowCommentForm(null)
  }

  const generateVersionNumber = (): string => {
    const latestVersion = versions
      .filter(v => v.branchName === newVersion.branchName)
      .sort((a, b) => b.versionNumber.localeCompare(a.versionNumber, undefined, { numeric: true }))[0]
    
    if (!latestVersion) return newVersion.isMajorVersion ? '1.0.0' : '0.1.0'
    
    const [major, minor, patch] = latestVersion.versionNumber.split('.').map(Number)
    
    if (newVersion.isMajorVersion) {
      return `${major + 1}.0.0`
    } else {
      return `${major}.${minor}.${patch + 1}`
    }
  }

  const toggleVersionSelection = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId)
      } else if (prev.length < 2) {
        return [...prev, versionId]
      } else {
        return [prev[1], versionId]
      }
    })
  }

  const toggleVersionExpansion = (versionId: string) => {
    setExpandedVersions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(versionId)) {
        newSet.delete(versionId)
      } else {
        newSet.add(versionId)
      }
      return newSet
    })
  }

  const toggleBranchExpansion = (branchId: string) => {
    setExpandedBranches(prev => {
      const newSet = new Set(prev)
      if (newSet.has(branchId)) {
        newSet.delete(branchId)
      } else {
        newSet.add(branchId)
      }
      return newSet
    })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <DocumentDuplicateIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Version Control</h2>
            <Badge className="bg-blue-100 text-blue-800">
              {versions.length} versions
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { id: 'list', icon: DocumentIcon, label: 'List' },
                { id: 'tree', icon: FolderIcon, label: 'Tree' },
                { id: 'timeline', icon: ClockIcon, label: 'Timeline' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id as any)}
                  className={cn(
                    'p-2 rounded transition-colors',
                    viewMode === mode.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                  title={mode.label}
                >
                  <mode.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircleIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'versions', name: 'Versions', count: versions.length },
              { id: 'branches', name: 'Branches', count: branches.length },
              { id: 'compare', name: 'Compare', count: selectedVersions.length },
              { id: 'create', name: 'Create New', count: null }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.name}
                {tab.count !== null && (
                  <span className={cn(
                    'ml-2 py-0.5 px-2 rounded-full text-xs',
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {activeTab === 'versions' && (
            <div>
              {/* Filters and Search */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Status:</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All</option>
                      <option value="draft">Draft</option>
                      <option value="review">Review</option>
                      <option value="approved">Approved</option>
                      <option value="archived">Archived</option>
                      <option value="deprecated">Deprecated</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="date">Date</option>
                      <option value="version">Version</option>
                      <option value="author">Author</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Search versions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
                  {selectedVersions.length === 2 && (
                    <button
                      onClick={() => onCompareVersions(selectedVersions[0], selectedVersions[1])}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <ArrowsRightLeftIcon className="w-4 h-4" />
                      <span>Compare</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Versions List */}
              <div className="space-y-4">
                {filteredVersions.length === 0 ? (
                  <div className="text-center py-12">
                    <DocumentDuplicateIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Versions Found</h3>
                    <p className="text-gray-500 mb-4">No versions match your current filters.</p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create First Version
                    </button>
                  </div>
                ) : (
                  filteredVersions.map((version) => (
                    <Card key={version.id} className={cn(
                      'p-6 transition-all',
                      selectedVersions.includes(version.id) ? 'ring-2 ring-blue-500 bg-blue-50' : '',
                      version.id === currentVersion ? 'border-green-500 bg-green-50' : ''
                    )}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Selection Checkbox */}
                          <input
                            type="checkbox"
                            checked={selectedVersions.includes(version.id)}
                            onChange={() => toggleVersionSelection(version.id)}
                            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          
                          {/* Version Info */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                v{version.versionNumber}
                              </h3>
                              {version.id === currentVersion && (
                                <Badge className="bg-green-100 text-green-800">
                                  Current
                                </Badge>
                              )}
                              <Badge className={VERSION_STATUS_COLORS[version.status]}>
                                {version.status}
                              </Badge>
                              {version.isMajorVersion && (
                                <Badge className="bg-purple-100 text-purple-800">
                                  Major
                                </Badge>
                              )}
                              {version.isLocked && (
                                <LockClosedIcon className="w-4 h-4 text-red-500" title="Locked" />
                              )}
                            </div>
                            
                            <h4 className="font-medium text-gray-900 mb-1">{version.title}</h4>
                            <p className="text-gray-600 text-sm mb-3">{version.description}</p>
                            
                            {/* Metadata */}
                            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                              <div className="flex items-center space-x-1">
                                <UserIcon className="w-4 h-4" />
                                <span>{version.createdBy}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ClockIcon className="w-4 h-4" />
                                <span>{formatDate(version.createdAt)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DocumentIcon className="w-4 h-4" />
                                <span>{formatFileSize(version.fileSize)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <EyeIcon className="w-4 h-4" />
                                <span>{version.viewCount} views</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <ArrowDownTrayIcon className="w-4 h-4" />
                                <span>{version.downloadCount} downloads</span>
                              </div>
                            </div>
                            
                            {/* Tags */}
                            {version.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {version.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                                  >
                                    <TagIcon className="w-3 h-3 mr-1" />
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {/* Changes Summary */}
                            {version.changesSummary && (
                              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                <h5 className="font-medium text-gray-900 mb-1">Changes Summary</h5>
                                <p className="text-sm text-gray-600">{version.changesSummary}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onDownloadVersion(version.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Download"
                          >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          </button>
                          
                          {version.id !== currentVersion && (
                            <button
                              onClick={() => onRestoreVersion(version.id)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Restore"
                            >
                              <ArrowPathIcon className="w-4 h-4" />
                            </button>
                          )}
                          
                          {version.isLocked ? (
                            <button
                              onClick={() => onUnlockVersion(version.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Unlock"
                              disabled={version.lockedBy !== currentUser.id}
                            >
                              <LockOpenIcon className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onLockVersion(version.id)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Lock"
                            >
                              <LockClosedIcon className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => setShowCommentForm(
                              showCommentForm === version.id ? null : version.id
                            )}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Add Comment"
                          >
                            <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => toggleVersionExpansion(version.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {expandedVersions.has(version.id) ? (
                              <ChevronDownIcon className="w-4 h-4" />
                            ) : (
                              <ChevronRightIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* Comment Form */}
                      {showCommentForm === version.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-start space-x-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <select
                                  value={newComment.type}
                                  onChange={(e) => setNewComment({ ...newComment, type: e.target.value as any })}
                                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="general">General</option>
                                  <option value="approval">Approval</option>
                                  <option value="rejection">Rejection</option>
                                  <option value="suggestion">Suggestion</option>
                                </select>
                              </div>
                              <textarea
                                value={newComment.content}
                                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                                placeholder="Add your comment..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => handleAddComment(version.id)}
                                disabled={!newComment.content.trim()}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => {
                                  setShowCommentForm(null)
                                  setNewComment({ versionId: '', content: '', type: 'general' })
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Expanded Details */}
                      {expandedVersions.has(version.id) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          {/* Comments */}
                          {version.comments.length > 0 && (
                            <div className="mb-4">
                              <h5 className="font-medium text-gray-900 mb-3">Comments ({version.comments.length})</h5>
                              <div className="space-y-3">
                                {version.comments.map((comment) => (
                                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-medium text-gray-900">{comment.author}</span>
                                        <Badge className={COMMENT_TYPE_COLORS[comment.type]}>
                                          {comment.type}
                                        </Badge>
                                        {comment.isResolved && (
                                          <CheckCircleIcon className="w-4 h-4 text-green-500" title="Resolved" />
                                        )}
                                      </div>
                                      <span className="text-sm text-gray-500">
                                        {formatDate(comment.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-gray-700">{comment.content}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Detailed Metadata */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Pages:</span>
                              <span className="ml-2 text-gray-600">{version.metadata.pageCount}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Format:</span>
                              <span className="ml-2 text-gray-600">{version.metadata.format.toUpperCase()}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Checksum:</span>
                              <span className="ml-2 text-gray-600 font-mono text-xs">
                                {version.metadata.checksum.substring(0, 8)}...
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Branch:</span>
                              <span className="ml-2 text-gray-600">{version.branchName || 'main'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'branches' && (
            <div>
              {/* Branch Actions */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Branches</h3>
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Create Branch</span>
                </button>
              </div>
              
              {/* Branches List */}
              <div className="space-y-4">
                {branches.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Branches</h3>
                    <p className="text-gray-500 mb-4">Create branches to work on different versions in parallel.</p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create First Branch
                    </button>
                  </div>
                ) : (
                  branches.map((branch) => (
                    <Card key={branch.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                            {branch.isActive && (
                              <Badge className="bg-green-100 text-green-800">
                                Active
                              </Badge>
                            )}
                            {branch.mergeStatus && (
                              <Badge className={MERGE_STATUS_COLORS[branch.mergeStatus]}>
                                {branch.mergeStatus}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-3">{branch.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <UserIcon className="w-4 h-4" />
                              <span>{branch.createdBy}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="w-4 h-4" />
                              <span>{formatDate(branch.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DocumentDuplicateIcon className="w-4 h-4" />
                              <span>{branch.versionsCount} versions</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="w-4 h-4" />
                              <span>Last activity: {formatDate(branch.lastActivity)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {branch.mergeStatus === 'pending' && (
                            <button
                              onClick={() => onMergeBranch(branch.id, 'main')}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
                            >
                              <ArrowsPointingInIcon className="w-4 h-4" />
                              <span>Merge</span>
                            </button>
                          )}
                          
                          <button
                            onClick={() => toggleBranchExpansion(branch.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {expandedBranches.has(branch.id) ? (
                              <ChevronDownIcon className="w-4 h-4" />
                            ) : (
                              <ChevronRightIcon className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      {/* Expanded Branch Details */}
                      {expandedBranches.has(branch.id) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Base Version:</span>
                              <span className="ml-2 text-gray-600">{branch.baseVersion}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Merge Target:</span>
                              <span className="ml-2 text-gray-600">{branch.mergeTarget || 'main'}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'compare' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Compare Versions</h3>
              
              {selectedVersions.length < 2 ? (
                <div className="text-center py-12">
                  <ArrowsRightLeftIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select Versions to Compare</h3>
                  <p className="text-gray-500">Select two versions from the Versions tab to compare them.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {selectedVersions.map((versionId, index) => {
                    const version = versions.find(v => v.id === versionId)
                    if (!version) return null
                    
                    return (
                      <Card key={versionId} className="p-6">
                        <div className="text-center mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">
                            Version {index + 1}
                          </h4>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <span className="font-medium text-gray-700">Version:</span>
                            <span className="ml-2 text-gray-600">v{version.versionNumber}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Title:</span>
                            <span className="ml-2 text-gray-600">{version.title}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Created:</span>
                            <span className="ml-2 text-gray-600">{formatDate(version.createdAt)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Author:</span>
                            <span className="ml-2 text-gray-600">{version.createdBy}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Size:</span>
                            <span className="ml-2 text-gray-600">{formatFileSize(version.fileSize)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Pages:</span>
                            <span className="ml-2 text-gray-600">{version.metadata.pageCount}</span>
                          </div>
                          
                          {version.changesSummary && (
                            <div>
                              <span className="font-medium text-gray-700">Changes:</span>
                              <p className="mt-1 text-gray-600 text-sm">{version.changesSummary}</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
              
              {selectedVersions.length === 2 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => onCompareVersions(selectedVersions[0], selectedVersions[1])}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <ArrowsRightLeftIcon className="w-5 h-5" />
                    <span>Start Comparison</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Create New Version or Branch</h3>
              
              {/* Toggle between version and branch creation */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setActiveTab('create')}
                  className="flex-1 py-2 px-4 rounded text-sm font-medium transition-colors bg-white text-blue-600 shadow-sm"
                >
                  Create Version
                </button>
                <button
                  onClick={() => {/* Handle branch creation mode */}}
                  className="flex-1 py-2 px-4 rounded text-sm font-medium transition-colors text-gray-600 hover:text-gray-900"
                >
                  Create Branch
                </button>
              </div>
              
              {/* Create Version Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version Title *
                  </label>
                  <input
                    type="text"
                    value={newVersion.title}
                    onChange={(e) => setNewVersion({ ...newVersion, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter version title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newVersion.description}
                    onChange={(e) => setNewVersion({ ...newVersion, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the changes in this version"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Changes Summary
                  </label>
                  <textarea
                    value={newVersion.changesSummary}
                    onChange={(e) => setNewVersion({ ...newVersion, changesSummary: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Summarize the key changes made"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch
                    </label>
                    <select
                      value={newVersion.branchName}
                      onChange={(e) => setNewVersion({ ...newVersion, branchName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="main">main</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.name}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newVersion.isMajorVersion}
                        onChange={(e) => setNewVersion({ ...newVersion, isMajorVersion: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Major version</span>
                    </label>
                  </div>
                </div>
                
                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newVersion.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          onClick={() => setNewVersion({
                            ...newVersion,
                            tags: newVersion.tags.filter((_, i) => i !== index)
                          })}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newTag.trim()) {
                          setNewVersion({
                            ...newVersion,
                            tags: [...newVersion.tags, newTag.trim()]
                          })
                          setNewTag('')
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add tag and press Enter"
                    />
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setNewVersion({
                        title: '',
                        description: '',
                        isMajorVersion: false,
                        branchName: 'main',
                        tags: [],
                        changesSummary: ''
                      })
                      setActiveTab('versions')
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateVersion}
                    disabled={!newVersion.title.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Create Version
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}