'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, Badge } from '@/components/ui'
import {
  ChatBubbleLeftRightIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  ArrowUturnLeftIcon,
  HeartIcon,
  FlagIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  createdAt: Date
  updatedAt?: Date
  position: {
    page: number
    x: number
    y: number
  }
  replies: Reply[]
  likes: string[] // user IDs who liked
  status: 'open' | 'resolved' | 'archived'
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  isEditing?: boolean
}

interface Reply {
  id: string
  content: string
  author: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  createdAt: Date
  updatedAt?: Date
  likes: string[]
  isEditing?: boolean
}

interface CommentSystemProps {
  comments: Comment[]
  currentUser: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  onAddComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'replies' | 'likes'>) => void
  onUpdateComment: (id: string, content: string) => void
  onDeleteComment: (id: string) => void
  onReplyToComment: (commentId: string, reply: Omit<Reply, 'id' | 'createdAt' | 'likes'>) => void
  onUpdateReply: (commentId: string, replyId: string, content: string) => void
  onDeleteReply: (commentId: string, replyId: string) => void
  onLikeComment: (id: string) => void
  onLikeReply: (commentId: string, replyId: string) => void
  onResolveComment: (id: string) => void
  onChangeCommentStatus: (id: string, status: Comment['status']) => void
  selectedCommentId?: string
  onSelectComment: (id: string | undefined) => void
}

interface NewCommentData {
  content: string
  position: { page: number; x: number; y: number }
  priority: Comment['priority']
  tags: string[]
}

export default function CommentSystem({
  comments,
  currentUser,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onReplyToComment,
  onUpdateReply,
  onDeleteReply,
  onLikeComment,
  onLikeReply,
  onResolveComment,
  onChangeCommentStatus,
  selectedCommentId,
  onSelectComment
}: CommentSystemProps) {
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [newComment, setNewComment] = useState<NewCommentData>({
    content: '',
    position: { page: 1, x: 0, y: 0 },
    priority: 'medium',
    tags: []
  })
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved' | 'archived'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest')
  const [searchQuery, setSearchQuery] = useState('')

  const commentInputRef = useRef<HTMLTextAreaElement>(null)
  const replyInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isAddingComment && commentInputRef.current) {
      commentInputRef.current.focus()
    }
  }, [isAddingComment])

  useEffect(() => {
    if (replyingTo && replyInputRef.current) {
      replyInputRef.current.focus()
    }
  }, [replyingTo])

  const filteredComments = comments
    .filter(comment => {
      if (filter !== 'all' && comment.status !== filter) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          comment.content.toLowerCase().includes(query) ||
          comment.author.name.toLowerCase().includes(query) ||
          comment.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        default:
          return 0
      }
    })

  const handleAddComment = () => {
    if (!newComment.content.trim()) return
    
    onAddComment({
      content: newComment.content,
      author: currentUser,
      position: newComment.position,
      status: 'open',
      priority: newComment.priority,
      tags: newComment.tags
    })
    
    setNewComment({
      content: '',
      position: { page: 1, x: 0, y: 0 },
      priority: 'medium',
      tags: []
    })
    setIsAddingComment(false)
  }

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) return
    
    onReplyToComment(commentId, {
      content: replyContent,
      author: currentUser
    })
    
    setReplyContent('')
    setReplyingTo(null)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const getPriorityColor = (priority: Comment['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
    }
  }

  const getStatusColor = (status: Comment['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
    }
  }

  const CommentCard = ({ comment }: { comment: Comment }) => {
    const [editContent, setEditContent] = useState(comment.content)
    const isLiked = comment.likes.includes(currentUser.id)
    const isSelected = selectedCommentId === comment.id
    const canEdit = comment.author.id === currentUser.id
    const canDelete = comment.author.id === currentUser.id

    return (
      <Card 
        className={cn(
          'transition-all duration-200 cursor-pointer hover:shadow-md',
          isSelected && 'ring-2 ring-primary-500 shadow-lg'
        )}
        onClick={() => onSelectComment(isSelected ? undefined : comment.id)}
        padding="lg"
      >
        <div className="space-y-3">
          {/* Comment Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                {comment.author.avatar ? (
                  <img 
                    src={comment.author.avatar} 
                    alt={comment.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-primary-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-neutral-900">{comment.author.name}</p>
                <p className="text-xs text-neutral-500">
                  Page {comment.position.page} • {formatDate(comment.createdAt)}
                  {comment.updatedAt && ' (edited)'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge size="sm" className={getPriorityColor(comment.priority)}>
                {comment.priority}
              </Badge>
              <Badge size="sm" className={getStatusColor(comment.status)}>
                {comment.status}
              </Badge>
              
              <div className="relative">
                <button className="p-1 hover:bg-neutral-100 rounded">
                  <EllipsisVerticalIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Comment Content */}
          <div className="pl-11">
            {comment.isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="input w-full h-20 resize-none"
                  placeholder="Edit your comment..."
                />
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => onUpdateComment(comment.id, comment.content)}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => onUpdateComment(comment.id, editContent)}
                    className="btn btn-primary btn-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-neutral-700 whitespace-pre-wrap">{comment.content}</p>
            )}
            
            {/* Tags */}
            {comment.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {comment.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" size="sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Comment Actions */}
          <div className="flex items-center justify-between pl-11">
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onLikeComment(comment.id)
                }}
                className={cn(
                  'flex items-center space-x-1 text-sm transition-colors',
                  isLiked ? 'text-red-500' : 'text-neutral-500 hover:text-red-500'
                )}
              >
                {isLiked ? (
                  <HeartSolidIcon className="w-4 h-4" />
                ) : (
                  <HeartIcon className="w-4 h-4" />
                )}
                <span>{comment.likes.length}</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setReplyingTo(comment.id)
                }}
                className="flex items-center space-x-1 text-sm text-neutral-500 hover:text-primary-500 transition-colors"
              >
                <ArrowUturnLeftIcon className="w-4 h-4" />
                <span>Reply</span>
              </button>
            </div>
            
            {comment.replies.length > 0 && (
              <span className="text-sm text-neutral-500">
                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </span>
            )}
          </div>

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <div className="pl-11 space-y-2">
              <textarea
                ref={replyInputRef}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="input w-full h-20 resize-none"
                placeholder="Write a reply..."
              />
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyContent('')
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleReply(comment.id)}
                  className="btn btn-primary btn-sm"
                  disabled={!replyContent.trim()}
                >
                  Reply
                </button>
              </div>
            </div>
          )}

          {/* Replies */}
          {comment.replies.length > 0 && (
            <div className="pl-11 space-y-3 border-l-2 border-neutral-100 ml-5">
              {comment.replies.map((reply) => {
                const isReplyLiked = reply.likes.includes(currentUser.id)
                const canEditReply = reply.author.id === currentUser.id
                
                return (
                  <div key={reply.id} className="pl-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                          {reply.author.avatar ? (
                            <img 
                              src={reply.author.avatar} 
                              alt={reply.author.name}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <UserIcon className="w-3 h-3 text-primary-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{reply.author.name}</p>
                          <p className="text-xs text-neutral-500">
                            {formatDate(reply.createdAt)}
                            {reply.updatedAt && ' (edited)'}
                          </p>
                        </div>
                      </div>
                      
                      {canEditReply && (
                        <div className="relative">
                          <button className="p-1 hover:bg-neutral-100 rounded">
                            <EllipsisVerticalIcon className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-neutral-700 pl-8">{reply.content}</p>
                    
                    <div className="flex items-center pl-8">
                      <button
                        onClick={() => onLikeReply(comment.id, reply.id)}
                        className={cn(
                          'flex items-center space-x-1 text-xs transition-colors',
                          isReplyLiked ? 'text-red-500' : 'text-neutral-500 hover:text-red-500'
                        )}
                      >
                        {isReplyLiked ? (
                          <HeartSolidIcon className="w-3 h-3" />
                        ) : (
                          <HeartIcon className="w-3 h-3" />
                        )}
                        <span>{reply.likes.length}</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
            Comments ({filteredComments.length})
          </h2>
          
          <button
            onClick={() => setIsAddingComment(true)}
            className="btn btn-primary btn-sm"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Comment
          </button>
        </div>
        
        {/* Search and Filters */}
        <div className="space-y-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search comments..."
            className="input input-sm w-full"
          />
          
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="input input-sm flex-1"
            >
              <option value="all">All Comments</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="input input-sm flex-1"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">By Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* New Comment Form */}
      {isAddingComment && (
        <div className="p-4 border-b border-neutral-200 bg-neutral-50">
          <div className="space-y-3">
            <textarea
              ref={commentInputRef}
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              className="input w-full h-24 resize-none"
              placeholder="Write your comment..."
            />
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <select
                  value={newComment.priority}
                  onChange={(e) => setNewComment({ ...newComment, priority: e.target.value as Comment['priority'] })}
                  className="input input-sm"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setIsAddingComment(false)
                    setNewComment({
                      content: '',
                      position: { page: 1, x: 0, y: 0 },
                      priority: 'medium',
                      tags: []
                    })
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddComment}
                  className="btn btn-primary btn-sm"
                  disabled={!newComment.content.trim()}
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredComments.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-500">
              {searchQuery ? 'No comments match your search' : 'No comments yet'}
            </p>
            <p className="text-sm text-neutral-400">
              {searchQuery ? 'Try adjusting your search terms' : 'Be the first to add a comment'}
            </p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  )
}