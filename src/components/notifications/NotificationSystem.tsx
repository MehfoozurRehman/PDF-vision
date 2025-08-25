'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, Badge } from '@/components/ui'
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  DocumentIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  CogIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  ArchiveBoxIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  StarIcon,
  FireIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  HeartIcon,
  HandThumbUpIcon,
  ChatBubbleOvalLeftEllipsisIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'system' | 'collaboration' | 'security'
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'document' | 'user' | 'system' | 'collaboration' | 'security' | 'update'
  actionable: boolean
  actions?: NotificationAction[]
  metadata?: {
    documentId?: string
    userId?: string
    sessionId?: string
    ipAddress?: string
    userAgent?: string
    location?: string
  }
  persistent: boolean
  autoHide: boolean
  hideAfter?: number // milliseconds
  sound?: boolean
  vibration?: boolean
  desktop?: boolean
  email?: boolean
  sms?: boolean
}

interface NotificationAction {
  id: string
  label: string
  type: 'primary' | 'secondary' | 'danger'
  action: () => void
}

interface NotificationSettings {
  enabled: boolean
  sound: boolean
  desktop: boolean
  email: boolean
  sms: boolean
  vibration: boolean
  categories: {
    document: boolean
    user: boolean
    system: boolean
    collaboration: boolean
    security: boolean
    update: boolean
  }
  priorities: {
    low: boolean
    medium: boolean
    high: boolean
    urgent: boolean
  }
  quietHours: {
    enabled: boolean
    start: string // HH:MM format
    end: string // HH:MM format
  }
  frequency: {
    instant: boolean
    digest: boolean
    digestFrequency: 'hourly' | 'daily' | 'weekly'
  }
}

interface NotificationSystemProps {
  notifications: Notification[]
  settings: NotificationSettings
  onNotificationRead: (id: string) => void
  onNotificationDelete: (id: string) => void
  onNotificationAction: (notificationId: string, actionId: string) => void
  onMarkAllRead: () => void
  onClearAll: () => void
  onSettingsChange: (settings: NotificationSettings) => void
  isActive: boolean
  onClose: () => void
  unreadCount: number
}

const NOTIFICATION_TYPES = {
  info: {
    icon: InformationCircleIcon,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  success: {
    icon: CheckCircleIcon,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200'
  },
  warning: {
    icon: ExclamationTriangleIcon,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200'
  },
  error: {
    icon: XCircleIcon,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200'
  },
  system: {
    icon: CogIcon,
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200'
  },
  collaboration: {
    icon: ChatBubbleLeftRightIcon,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  },
  security: {
    icon: ShieldCheckIcon,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200'
  }
}

const PRIORITY_INDICATORS = {
  low: { color: 'text-gray-500', bg: 'bg-gray-100' },
  medium: { color: 'text-blue-600', bg: 'bg-blue-100' },
  high: { color: 'text-orange-600', bg: 'bg-orange-100' },
  urgent: { color: 'text-red-600', bg: 'bg-red-100' }
}

const CATEGORY_ICONS = {
  document: DocumentIcon,
  user: UserIcon,
  system: CogIcon,
  collaboration: ChatBubbleLeftRightIcon,
  security: ShieldCheckIcon,
  update: LightBulbIcon
}

export default function NotificationSystem({
  notifications,
  settings,
  onNotificationRead,
  onNotificationDelete,
  onNotificationAction,
  onMarkAllRead,
  onClearAll,
  onSettingsChange,
  isActive,
  onClose,
  unreadCount
}: NotificationSystemProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'settings'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'timestamp' | 'priority' | 'category'>('timestamp')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter(notification => {
      if (activeTab === 'unread' && notification.read) return false
      if (selectedCategory !== 'all' && notification.category !== selectedCategory) return false
      if (selectedPriority !== 'all' && notification.priority !== selectedPriority) return false
      if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !notification.message.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'timestamp':
          comparison = a.timestamp.getTime() - b.timestamp.getTime()
          break
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        case 'category':
          comparison = a.category.localeCompare(b.category)
          break
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })

  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}m ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}h ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days}d ago`
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onNotificationRead(notification.id)
    }
  }

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id))
    }
  }

  const handleBulkAction = (action: 'read' | 'delete' | 'archive') => {
    selectedNotifications.forEach(id => {
      switch (action) {
        case 'read':
          onNotificationRead(id)
          break
        case 'delete':
          onNotificationDelete(id)
          break
        case 'archive':
          // Handle archive action
          break
      }
    })
    setSelectedNotifications([])
  }

  const playNotificationSound = () => {
    if (settings.sound && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Handle audio play failure silently
      })
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }

  const showDesktopNotification = (notification: Notification) => {
    if (settings.desktop && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      })
    }
  }

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  const renderNotificationItem = (notification: Notification) => {
    const typeConfig = NOTIFICATION_TYPES[notification.type]
    const IconComponent = typeConfig.icon
    const CategoryIcon = CATEGORY_ICONS[notification.category]
    
    return (
      <div
        key={notification.id}
        className={cn(
          'p-4 border rounded-lg transition-all duration-200 cursor-pointer',
          notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200',
          selectedNotifications.includes(notification.id) && 'ring-2 ring-blue-500'
        )}
        onClick={() => handleNotificationClick(notification)}
      >
        <div className="flex items-start space-x-3">
          {/* Selection Checkbox */}
          <input
            type="checkbox"
            checked={selectedNotifications.includes(notification.id)}
            onChange={(e) => {
              e.stopPropagation()
              handleSelectNotification(notification.id)
            }}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          
          {/* Icon */}
          <div className={cn('p-2 rounded-lg', typeConfig.bg)}>
            <IconComponent className={cn('w-5 h-5', typeConfig.color)} />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className={cn(
                    'text-sm font-medium truncate',
                    notification.read ? 'text-gray-900' : 'text-gray-900 font-semibold'
                  )}>
                    {notification.title}
                  </h4>
                  
                  {/* Priority Badge */}
                  <Badge className={cn(
                    'text-xs px-2 py-0.5',
                    PRIORITY_INDICATORS[notification.priority].bg,
                    PRIORITY_INDICATORS[notification.priority].color
                  )}>
                    {notification.priority}
                  </Badge>
                  
                  {/* Category Icon */}
                  <CategoryIcon className="w-4 h-4 text-gray-400" />
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                
                {/* Actions */}
                {notification.actionable && notification.actions && (
                  <div className="flex items-center space-x-2 mb-2">
                    {notification.actions.map((action) => (
                      <button
                        key={action.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onNotificationAction(notification.id, action.id)
                        }}
                        className={cn(
                          'px-3 py-1 text-xs font-medium rounded transition-colors',
                          action.type === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
                          action.type === 'secondary' && 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                          action.type === 'danger' && 'bg-red-600 text-white hover:bg-red-700'
                        )}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Metadata */}
                {notification.metadata && (
                  <div className="text-xs text-gray-500 space-y-1">
                    {notification.metadata.documentId && (
                      <div>Document: {notification.metadata.documentId}</div>
                    )}
                    {notification.metadata.userId && (
                      <div>User: {notification.metadata.userId}</div>
                    )}
                    {notification.metadata.location && (
                      <div>Location: {notification.metadata.location}</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Timestamp and Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {formatTimeAgo(notification.timestamp)}
                </span>
                
                {/* Quick Actions */}
                <div className="flex items-center space-x-1">
                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onNotificationRead(notification.id)
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Mark as read"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onNotificationDelete(notification.id)
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSettings = () => (
    <div className="space-y-6">
      {/* General Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable Notifications</label>
              <p className="text-xs text-gray-500">Receive all types of notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => onSettingsChange({ ...settings, enabled: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Sound Notifications</label>
              <p className="text-xs text-gray-500">Play sound for new notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={(e) => onSettingsChange({ ...settings, sound: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Desktop Notifications</label>
              <p className="text-xs text-gray-500">Show browser notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.desktop}
              onChange={(e) => onSettingsChange({ ...settings, desktop: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Notifications</label>
              <p className="text-xs text-gray-500">Send important notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.email}
              onChange={(e) => onSettingsChange({ ...settings, email: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>
      
      {/* Category Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(settings.categories).map(([category, enabled]) => {
            const IconComponent = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]
            return (
              <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                </div>
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    categories: { ...settings.categories, [category]: e.target.checked }
                  })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            )
          })}
        </div>
      </Card>
      
      {/* Priority Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Levels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(settings.priorities).map(([priority, enabled]) => (
            <div key={priority} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  'w-3 h-3 rounded-full',
                  PRIORITY_INDICATORS[priority as keyof typeof PRIORITY_INDICATORS].bg
                )} />
                <span className="text-sm font-medium text-gray-700 capitalize">{priority}</span>
              </div>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  priorities: { ...settings.priorities, [priority]: e.target.checked }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </Card>
      
      {/* Quiet Hours */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiet Hours</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Enable Quiet Hours</label>
              <p className="text-xs text-gray-500">Suppress notifications during specified hours</p>
            </div>
            <input
              type="checkbox"
              checked={settings.quietHours.enabled}
              onChange={(e) => onSettingsChange({
                ...settings,
                quietHours: { ...settings.quietHours, enabled: e.target.checked }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          {settings.quietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={settings.quietHours.start}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    quietHours: { ...settings.quietHours, start: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  value={settings.quietHours.end}
                  onChange={(e) => onSettingsChange({
                    ...settings,
                    quietHours: { ...settings.quietHours, end: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )

  if (!isActive) return null

  return (
    <>
      {/* Audio element for notification sounds */}
      <audio ref={audioRef} preload="auto">
        <source src="/notification-sound.mp3" type="audio/mpeg" />
        <source src="/notification-sound.ogg" type="audio/ogg" />
      </audio>
      
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <BellIcon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <Badge className="bg-red-100 text-red-800">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Bulk Actions */}
              {selectedNotifications.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('read')}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Mark Read
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
              
              {/* Settings */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  showSettings ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                )}
                title="Settings"
              >
                <CogIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {showSettings ? (
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {renderSettings()}
            </div>
          ) : (
            <>
              {/* Tabs and Filters */}
              <div className="border-b border-gray-200">
                <div className="flex items-center justify-between px-6 py-4">
                  {/* Tabs */}
                  <nav className="flex space-x-8">
                    {[
                      { id: 'all', name: 'All', count: notifications.length },
                      { id: 'unread', name: 'Unread', count: unreadCount }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                          'py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2',
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        )}
                      >
                        <span>{tab.name}</span>
                        {tab.count > 0 && (
                          <Badge className="bg-gray-100 text-gray-600 text-xs">
                            {tab.count}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </nav>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    {/* Search */}
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    {/* Filters */}
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={cn(
                        'p-2 rounded-lg transition-colors',
                        showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                      )}
                      title="Filters"
                    >
                      <FunnelIcon className="w-4 h-4" />
                    </button>
                    
                    {/* Mark All Read */}
                    {unreadCount > 0 && (
                      <button
                        onClick={onMarkAllRead}
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark All Read
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Filters Panel */}
                {showFilters && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Category:</label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">All Categories</option>
                          <option value="document">Document</option>
                          <option value="user">User</option>
                          <option value="system">System</option>
                          <option value="collaboration">Collaboration</option>
                          <option value="security">Security</option>
                          <option value="update">Update</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Priority:</label>
                        <select
                          value={selectedPriority}
                          onChange={(e) => setSelectedPriority(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">All Priorities</option>
                          <option value="urgent">Urgent</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">Sort by:</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="timestamp">Time</option>
                          <option value="priority">Priority</option>
                          <option value="category">Category</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-1 text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                      >
                        <AdjustmentsHorizontalIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications List */}
              <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                {filteredNotifications.length > 0 && (
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.length === filteredNotifications.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        {selectedNotifications.length > 0 
                          ? `${selectedNotifications.length} selected`
                          : `${filteredNotifications.length} notifications`
                        }
                      </span>
                    </div>
                    
                    {filteredNotifications.length > 0 && (
                      <button
                        onClick={onClearAll}
                        className="text-sm text-red-600 hover:text-red-700 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                )}
                
                <div className="space-y-3">
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map(renderNotificationItem)
                  ) : (
                    <div className="text-center py-12">
                      <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                      <p className="text-gray-500">
                        {searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all'
                          ? 'No notifications match your current filters.'
                          : activeTab === 'unread'
                            ? 'All caught up! No unread notifications.'
                            : 'You have no notifications at this time.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}