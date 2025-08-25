'use client'

import React, { useState, useEffect } from 'react'
import { Card, Badge } from '@/components/ui'
import {
  ShieldCheckIcon,
  KeyIcon,
  UserGroupIcon,
  LockClosedIcon,
  LockOpenIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  FingerPrintIcon,
  CogIcon,
  DocumentIcon,
  UserIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  BellIcon,
  ShieldExclamationIcon,
  CpuChipIcon,
  ServerIcon,
  WifiIcon,
  NoSymbolIcon,
  CheckIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  ChartBarIcon,
  FireIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  lastLogin: Date
  createdAt: Date
  permissions: Permission[]
  mfaEnabled: boolean
  loginAttempts: number
  lastLoginIP: string
  devices: Device[]
  sessions: Session[]
}

interface UserRole {
  id: string
  name: string
  description: string
  permissions: Permission[]
  level: number
  isSystem: boolean
  color: string
}

interface Permission {
  id: string
  name: string
  description: string
  category: 'document' | 'user' | 'system' | 'admin'
  action: 'create' | 'read' | 'update' | 'delete' | 'share' | 'admin'
  resource: string
}

interface Device {
  id: string
  name: string
  type: 'desktop' | 'mobile' | 'tablet'
  browser: string
  os: string
  lastUsed: Date
  trusted: boolean
  location: string
  ipAddress: string
}

interface Session {
  id: string
  userId: string
  deviceId: string
  startTime: Date
  lastActivity: Date
  ipAddress: string
  location: string
  active: boolean
  duration: number
}

interface SecurityEvent {
  id: string
  type: 'login' | 'logout' | 'failed_login' | 'permission_change' | 'document_access' | 'suspicious_activity' | 'mfa_setup' | 'password_change'
  userId: string
  timestamp: Date
  details: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  ipAddress: string
  location: string
  userAgent: string
  resolved: boolean
}

interface DocumentPermission {
  documentId: string
  userId: string
  permissions: ('view' | 'edit' | 'comment' | 'share' | 'delete')[]
  grantedBy: string
  grantedAt: Date
  expiresAt?: Date
  conditions?: {
    ipWhitelist?: string[]
    timeRestriction?: { start: string; end: string }
    deviceRestriction?: string[]
  }
}

interface SecuritySettings {
  passwordPolicy: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
    maxAge: number
    preventReuse: number
  }
  mfaPolicy: {
    required: boolean
    methods: ('totp' | 'sms' | 'email' | 'hardware')[]
    gracePeriod: number
  }
  sessionPolicy: {
    maxDuration: number
    idleTimeout: number
    maxConcurrentSessions: number
    requireReauth: boolean
  }
  accessPolicy: {
    ipWhitelist: string[]
    geoRestrictions: string[]
    deviceTrust: boolean
    suspiciousActivityThreshold: number
  }
  auditPolicy: {
    logRetention: number
    realTimeAlerts: boolean
    exportEnabled: boolean
  }
}

interface SecurityManagerProps {
  users: User[]
  roles: UserRole[]
  permissions: Permission[]
  securityEvents: SecurityEvent[]
  documentPermissions: DocumentPermission[]
  settings: SecuritySettings
  onUserUpdate: (user: User) => void
  onRoleUpdate: (role: UserRole) => void
  onPermissionGrant: (permission: DocumentPermission) => void
  onPermissionRevoke: (documentId: string, userId: string) => void
  onSecurityEventResolve: (eventId: string) => void
  onSettingsUpdate: (settings: SecuritySettings) => void
  onUserSuspend: (userId: string) => void
  onUserActivate: (userId: string) => void
  onSessionTerminate: (sessionId: string) => void
  onDeviceRevoke: (deviceId: string) => void
  isActive: boolean
  onClose: () => void
}

const DEFAULT_ROLES: UserRole[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access',
    permissions: [],
    level: 100,
    isSystem: true,
    color: 'red'
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Can create and edit documents',
    permissions: [],
    level: 75,
    isSystem: true,
    color: 'blue'
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    description: 'Can review and comment on documents',
    permissions: [],
    level: 50,
    isSystem: true,
    color: 'green'
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: [],
    level: 25,
    isSystem: true,
    color: 'gray'
  }
]

const SEVERITY_CONFIG = {
  low: { color: 'text-gray-600', bg: 'bg-gray-100', icon: InformationCircleIcon },
  medium: { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: ExclamationTriangleIcon },
  high: { color: 'text-orange-600', bg: 'bg-orange-100', icon: ExclamationCircleIcon },
  critical: { color: 'text-red-600', bg: 'bg-red-100', icon: ShieldExclamationIcon }
}

const DEVICE_ICONS = {
  desktop: ComputerDesktopIcon,
  mobile: DevicePhoneMobileIcon,
  tablet: ComputerDesktopIcon
}

export default function SecurityManager({
  users,
  roles,
  permissions,
  securityEvents,
  documentPermissions,
  settings,
  onUserUpdate,
  onRoleUpdate,
  onPermissionGrant,
  onPermissionRevoke,
  onSecurityEventResolve,
  onSettingsUpdate,
  onUserSuspend,
  onUserActivate,
  onSessionTerminate,
  onDeviceRevoke,
  isActive,
  onClose
}: SecurityManagerProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions' | 'events' | 'settings'>('users')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

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

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      case 'suspended': return 'text-red-600 bg-red-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRoleColor = (role: UserRole) => {
    const colors = {
      red: 'text-red-600 bg-red-100',
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      purple: 'text-purple-600 bg-purple-100',
      gray: 'text-gray-600 bg-gray-100'
    }
    return colors[role.color as keyof typeof colors] || colors.gray
  }

  const filteredUsers = users.filter(user => {
    if (filterStatus !== 'all' && user.status !== filterStatus) return false
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const filteredEvents = securityEvents.filter(event => {
    if (filterSeverity !== 'all' && event.severity !== filterSeverity) return false
    if (searchQuery && !event.details.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const renderUsersList = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        
        <button
          onClick={() => setShowUserModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>
      
      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedUser(user)}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              
              <Badge className={cn('text-xs', getStatusColor(user.status))}>
                {user.status}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Role:</span>
                <Badge className={cn('text-xs', getRoleColor(user.role))}>
                  {user.role.name}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Login:</span>
                <span className="text-gray-900">{formatTimeAgo(user.lastLogin)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">MFA:</span>
                <div className="flex items-center space-x-1">
                  {user.mfaEnabled ? (
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircleIcon className="w-4 h-4 text-red-600" />
                  )}
                  <span className={user.mfaEnabled ? 'text-green-600' : 'text-red-600'}>
                    {user.mfaEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Sessions:</span>
                <span className="text-gray-900">{user.sessions.filter(s => s.active).length}</span>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center space-x-2">
              {user.status === 'active' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onUserSuspend(user.id)
                  }}
                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Suspend
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onUserActivate(user.id)
                  }}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Activate
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedUser(user)
                  setShowUserModal(true)
                }}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                Edit
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderRolesList = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">User Roles</h3>
        <button
          onClick={() => setShowRoleModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Create Role</span>
        </button>
      </div>
      
      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <Card key={role.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                  <Badge className={cn('text-xs', getRoleColor(role))}>
                    Level {role.level}
                  </Badge>
                  {role.isSystem && (
                    <Badge className="bg-gray-100 text-gray-600 text-xs">
                      System
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions</h4>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((permission) => (
                    <Badge key={permission.id} className="bg-blue-100 text-blue-700 text-xs">
                      {permission.name}
                    </Badge>
                  ))}
                  {role.permissions.length > 3 && (
                    <Badge className="bg-gray-100 text-gray-600 text-xs">
                      +{role.permissions.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Users</h4>
                <p className="text-sm text-gray-600">
                  {users.filter(u => u.role.id === role.id).length} users assigned
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center space-x-2">
              <button
                onClick={() => {
                  setSelectedRole(role)
                  setShowRoleModal(true)
                }}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                Edit
              </button>
              
              {!role.isSystem && (
                <button className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                  Delete
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderSecurityEvents = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Log
          </button>
        </div>
      </div>
      
      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.map((event) => {
          const severityConfig = SEVERITY_CONFIG[event.severity]
          const IconComponent = severityConfig.icon
          
          return (
            <Card key={event.id} className="p-4">
              <div className="flex items-start space-x-4">
                <div className={cn('p-2 rounded-lg', severityConfig.bg)}>
                  <IconComponent className={cn('w-5 h-5', severityConfig.color)} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 capitalize">
                          {event.type.replace('_', ' ')}
                        </h4>
                        <Badge className={cn('text-xs', severityConfig.bg, severityConfig.color)}>
                          {event.severity}
                        </Badge>
                        {!event.resolved && event.severity === 'critical' && (
                          <Badge className="bg-red-100 text-red-700 text-xs">
                            Unresolved
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{event.details}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>User: {users.find(u => u.id === event.userId)?.name || 'Unknown'}</span>
                        <span>IP: {event.ipAddress}</span>
                        <span>Location: {event.location}</span>
                        <span>{formatTimeAgo(event.timestamp)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!event.resolved && (
                        <button
                          onClick={() => onSecurityEventResolve(event.id)}
                          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                      
                      <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      {/* Password Policy */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Policy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Length</label>
            <input
              type="number"
              value={settings.passwordPolicy.minLength}
              onChange={(e) => onSettingsUpdate({
                ...settings,
                passwordPolicy: { ...settings.passwordPolicy, minLength: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Age (days)</label>
            <input
              type="number"
              value={settings.passwordPolicy.maxAge}
              onChange={(e) => onSettingsUpdate({
                ...settings,
                passwordPolicy: { ...settings.passwordPolicy, maxAge: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          {[
            { key: 'requireUppercase', label: 'Require Uppercase Letters' },
            { key: 'requireLowercase', label: 'Require Lowercase Letters' },
            { key: 'requireNumbers', label: 'Require Numbers' },
            { key: 'requireSpecialChars', label: 'Require Special Characters' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">{item.label}</label>
              <input
                type="checkbox"
                checked={settings.passwordPolicy[item.key as keyof typeof settings.passwordPolicy] as boolean}
                onChange={(e) => onSettingsUpdate({
                  ...settings,
                  passwordPolicy: { ...settings.passwordPolicy, [item.key]: e.target.checked }
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </Card>
      
      {/* MFA Policy */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Multi-Factor Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Require MFA</label>
              <p className="text-xs text-gray-500">Force all users to enable MFA</p>
            </div>
            <input
              type="checkbox"
              checked={settings.mfaPolicy.required}
              onChange={(e) => onSettingsUpdate({
                ...settings,
                mfaPolicy: { ...settings.mfaPolicy, required: e.target.checked }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allowed Methods</label>
            <div className="space-y-2">
              {['totp', 'sms', 'email', 'hardware'].map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={settings.mfaPolicy.methods.includes(method as any)}
                    onChange={(e) => {
                      const methods = e.target.checked
                        ? [...settings.mfaPolicy.methods, method as any]
                        : settings.mfaPolicy.methods.filter(m => m !== method)
                      onSettingsUpdate({
                        ...settings,
                        mfaPolicy: { ...settings.mfaPolicy, methods }
                      })
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700 capitalize">{method}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Session Policy */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Duration (hours)</label>
            <input
              type="number"
              value={settings.sessionPolicy.maxDuration}
              onChange={(e) => onSettingsUpdate({
                ...settings,
                sessionPolicy: { ...settings.sessionPolicy, maxDuration: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Idle Timeout (minutes)</label>
            <input
              type="number"
              value={settings.sessionPolicy.idleTimeout}
              onChange={(e) => onSettingsUpdate({
                ...settings,
                sessionPolicy: { ...settings.sessionPolicy, idleTimeout: parseInt(e.target.value) }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </Card>
      
      {/* Access Policy */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Control</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IP Whitelist</label>
            <textarea
              value={settings.accessPolicy.ipWhitelist.join('\n')}
              onChange={(e) => onSettingsUpdate({
                ...settings,
                accessPolicy: { ...settings.accessPolicy, ipWhitelist: e.target.value.split('\n').filter(ip => ip.trim()) }
              })}
              placeholder="Enter IP addresses, one per line"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Device Trust Required</label>
              <p className="text-xs text-gray-500">Require device verification for new logins</p>
            </div>
            <input
              type="checkbox"
              checked={settings.accessPolicy.deviceTrust}
              onChange={(e) => onSettingsUpdate({
                ...settings,
                accessPolicy: { ...settings.accessPolicy, deviceTrust: e.target.checked }
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>
    </div>
  )

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Security Manager</h2>
            <Badge className="bg-blue-100 text-blue-800">
              {users.filter(u => u.status === 'active').length} active users
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowPathIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'users', name: 'Users', icon: UserGroupIcon },
              { id: 'roles', name: 'Roles', icon: KeyIcon },
              { id: 'permissions', name: 'Permissions', icon: LockClosedIcon },
              { id: 'events', name: 'Security Events', icon: ShieldExclamationIcon },
              { id: 'settings', name: 'Settings', icon: CogIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {activeTab === 'users' && renderUsersList()}
          {activeTab === 'roles' && renderRolesList()}
          {activeTab === 'permissions' && (
            <div className="text-center py-12">
              <LockClosedIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Document Permissions</h3>
              <p className="text-gray-500">Manage document-level access controls and permissions.</p>
            </div>
          )}
          {activeTab === 'events' && renderSecurityEvents()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  )
}