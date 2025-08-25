'use client'

import React, { useState, useEffect } from 'react'
import { Card, Badge } from '@/components/ui'
import {
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  ServerIcon,
  ShieldCheckIcon,
  ClockIcon,
  CalendarIcon,
  CalendarDaysIcon,
  DocumentIcon,
  DocumentTextIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  FolderIcon,
  FolderOpenIcon,
  ArchiveBoxIcon,
  InboxIcon,
  CpuChipIcon,
  CommandLineIcon,
  CodeBracketIcon,
  Cog6ToothIcon,
  AdjustmentsHorizontalIcon,
  WrenchScrewdriverIcon,
  BugAntIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ForwardIcon,
  BackwardIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ShareIcon,
  ArrowTopRightOnSquareIcon,
  ClipboardIcon,
  DocumentDuplicateIcon,
  Square2StackIcon,
  RectangleStackIcon,
  CircleStackIcon,
  WindowIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
  ViewfinderCircleIcon,
  MagnifyingGlassIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  FunnelIcon,
  AdjustmentsVerticalIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ScaleIcon,
  BeakerIcon,
  PrinterIcon,
  CameraIcon,
  VideoCameraIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  RadioIcon,
  TvIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  DevicePhoneMobileIcon,
  WifiIcon,
  SignalIcon,
  SignalSlashIcon,
  PowerIcon,
  SunIcon,
  MoonIcon,
  FireIcon,
  SparklesIcon,
  LightBulbIcon,
  BoltIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  GlobeAmericasIcon,
  BuildingOfficeIcon,
  HomeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  CurrencyDollarIcon,
  GiftIcon,
  TruckIcon,
  ChartBarIcon,
  ChartPieIcon,
  PresentationChartBarIcon,
  TableCellsIcon,
  ListBulletIcon,
  QueueListIcon,
  Bars3Icon,
  Bars4Icon,
  UserIcon,
  UserGroupIcon,
  UsersIcon,
  IdentificationIcon,
  TagIcon,
  BookmarkIcon,
  StarIcon,
  HeartIcon,
  FlagIcon,
  MapIcon,
  MapPinIcon,
  EnvelopeIcon,
  AtSymbolIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  BellAlertIcon,
  SpeakerWaveIcon,
  MegaphoneIcon,
  LockClosedIcon,
  LockOpenIcon,
  KeyIcon,
  ShieldExclamationIcon,
  FingerPrintIcon,
  EyeDropperIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface BackupJob {
  id: string
  name: string
  description: string
  type: 'full' | 'incremental' | 'differential' | 'selective'
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  schedule: BackupSchedule
  source: BackupSource
  destination: BackupDestination
  encryption: EncryptionConfig
  compression: CompressionConfig
  retention: RetentionPolicy
  notifications: NotificationConfig
  createdAt: Date
  updatedAt: Date
  lastRun?: Date
  nextRun?: Date
  runCount: number
  successCount: number
  failureCount: number
  totalSize: number
  compressedSize: number
  duration: number
  progress: number
  estimatedTimeRemaining?: number
  isActive: boolean
  tags: string[]
}

interface BackupSchedule {
  type: 'manual' | 'interval' | 'cron' | 'event'
  interval?: {
    value: number
    unit: 'minutes' | 'hours' | 'days' | 'weeks' | 'months'
  }
  cron?: string
  events?: string[]
  timezone: string
  enabled: boolean
  startDate?: Date
  endDate?: Date
  excludeDays?: number[]
  excludeHours?: number[]
}

interface BackupSource {
  type: 'documents' | 'settings' | 'database' | 'files' | 'custom'
  paths: string[]
  filters: BackupFilter[]
  includeMetadata: boolean
  includeVersions: boolean
  includeDeleted: boolean
  maxFileSize?: number
  excludePatterns: string[]
  includePatterns: string[]
}

interface BackupFilter {
  type: 'extension' | 'size' | 'date' | 'name' | 'path'
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'regex'
  value: any
  enabled: boolean
}

interface BackupDestination {
  type: 'local' | 'cloud' | 'network' | 'external'
  path: string
  credentials?: {
    accessKey?: string
    secretKey?: string
    token?: string
    username?: string
    password?: string
  }
  settings: {
    region?: string
    bucket?: string
    endpoint?: string
    port?: number
    ssl?: boolean
    timeout?: number
  }
  verification: {
    enabled: boolean
    method: 'checksum' | 'hash' | 'signature'
    algorithm?: string
  }
}

interface EncryptionConfig {
  enabled: boolean
  algorithm: 'AES-256' | 'AES-192' | 'AES-128' | 'ChaCha20' | 'Blowfish'
  keyDerivation: 'PBKDF2' | 'Argon2' | 'scrypt'
  keySize: number
  iterations: number
  salt?: string
  password?: string
  keyFile?: string
}

interface CompressionConfig {
  enabled: boolean
  algorithm: 'gzip' | 'bzip2' | 'lzma' | 'zstd' | 'lz4'
  level: number
  blockSize?: number
  threads?: number
}

interface RetentionPolicy {
  enabled: boolean
  keepDaily: number
  keepWeekly: number
  keepMonthly: number
  keepYearly: number
  maxAge: number
  maxCount: number
  autoCleanup: boolean
  cleanupSchedule?: string
}

interface NotificationConfig {
  enabled: boolean
  onSuccess: boolean
  onFailure: boolean
  onStart: boolean
  methods: ('email' | 'webhook' | 'desktop' | 'sms')[]
  recipients: string[]
  webhookUrl?: string
  template?: string
}

interface BackupHistory {
  id: string
  jobId: string
  jobName: string
  type: string
  status: 'completed' | 'failed' | 'cancelled'
  startTime: Date
  endTime: Date
  duration: number
  filesProcessed: number
  filesSkipped: number
  filesError: number
  totalSize: number
  compressedSize: number
  compressionRatio: number
  transferSpeed: number
  errorMessage?: string
  logs: BackupLog[]
  verificationResult?: VerificationResult
}

interface BackupLog {
  timestamp: Date
  level: 'info' | 'warning' | 'error' | 'debug'
  message: string
  details?: any
}

interface VerificationResult {
  status: 'passed' | 'failed' | 'warning'
  checksumMatch: boolean
  fileCount: number
  corruptedFiles: string[]
  missingFiles: string[]
  extraFiles: string[]
  details: string
}

interface RestoreJob {
  id: string
  name: string
  description: string
  backupId: string
  backupName: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  source: string
  destination: string
  options: RestoreOptions
  progress: number
  filesRestored: number
  filesSkipped: number
  filesError: number
  startTime?: Date
  endTime?: Date
  duration: number
  estimatedTimeRemaining?: number
  errorMessage?: string
  createdAt: Date
}

interface RestoreOptions {
  overwriteExisting: boolean
  restorePermissions: boolean
  restoreTimestamps: boolean
  restoreMetadata: boolean
  restoreVersions: boolean
  selectiveRestore: boolean
  selectedFiles: string[]
  targetLocation: string
  renamePattern?: string
  verification: boolean
}

interface BackupManagerProps {
  jobs: BackupJob[]
  history: BackupHistory[]
  restoreJobs: RestoreJob[]
  onCreateJob: (job: Partial<BackupJob>) => void
  onUpdateJob: (jobId: string, updates: Partial<BackupJob>) => void
  onDeleteJob: (jobId: string) => void
  onRunJob: (jobId: string) => void
  onCancelJob: (jobId: string) => void
  onRestoreBackup: (backupId: string, options: RestoreOptions) => void
  onDeleteBackup: (backupId: string) => void
  onVerifyBackup: (backupId: string) => void
  onExportJob: (jobId: string) => void
  onImportJob: (jobData: any) => void
  isActive: boolean
  onClose: () => void
}

const BACKUP_TYPES = [
  {
    id: 'full',
    name: 'Full Backup',
    description: 'Complete backup of all selected data',
    icon: CircleStackIcon,
    color: 'text-blue-600 bg-blue-100'
  },
  {
    id: 'incremental',
    name: 'Incremental',
    description: 'Only changed files since last backup',
    icon: ArrowUpIcon,
    color: 'text-green-600 bg-green-100'
  },
  {
    id: 'differential',
    name: 'Differential',
    description: 'Changed files since last full backup',
    icon: ArrowsUpDownIcon,
    color: 'text-yellow-600 bg-yellow-100'
  },
  {
    id: 'selective',
    name: 'Selective',
    description: 'Backup specific files and folders',
    icon: FunnelIcon,
    color: 'text-purple-600 bg-purple-100'
  }
]

const DESTINATION_TYPES = [
  {
    id: 'local',
    name: 'Local Storage',
    description: 'Save to local disk or network drive',
    icon: ComputerDesktopIcon,
    color: 'text-gray-600 bg-gray-100'
  },
  {
    id: 'cloud',
    name: 'Cloud Storage',
    description: 'AWS S3, Google Cloud, Azure, etc.',
    icon: CloudArrowUpIcon,
    color: 'text-blue-600 bg-blue-100'
  },
  {
    id: 'network',
    name: 'Network Storage',
    description: 'FTP, SFTP, SMB, NFS',
    icon: ServerIcon,
    color: 'text-green-600 bg-green-100'
  },
  {
    id: 'external',
    name: 'External Drive',
    description: 'USB drive, external HDD/SSD',
    icon: ArchiveBoxIcon,
    color: 'text-orange-600 bg-orange-100'
  }
]

const STATUS_COLORS = {
  pending: 'text-yellow-600 bg-yellow-100',
  running: 'text-blue-600 bg-blue-100',
  completed: 'text-green-600 bg-green-100',
  failed: 'text-red-600 bg-red-100',
  cancelled: 'text-gray-600 bg-gray-100'
}

export default function BackupManager({
  jobs,
  history,
  restoreJobs,
  onCreateJob,
  onUpdateJob,
  onDeleteJob,
  onRunJob,
  onCancelJob,
  onRestoreBackup,
  onDeleteBackup,
  onVerifyBackup,
  onExportJob,
  onImportJob,
  isActive,
  onClose
}: BackupManagerProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'history' | 'restore' | 'settings'>('jobs')
  const [selectedJob, setSelectedJob] = useState<BackupJob | null>(null)
  const [selectedHistory, setSelectedHistory] = useState<BackupHistory | null>(null)
  const [selectedRestore, setSelectedRestore] = useState<RestoreJob | null>(null)
  const [showJobModal, setShowJobModal] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'lastRun' | 'nextRun' | 'size'>('lastRun')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (milliseconds: number): string => {
    if (milliseconds < 1000) return `${milliseconds}ms`
    if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}s`
    if (milliseconds < 3600000) return `${(milliseconds / 60000).toFixed(1)}m`
    return `${(milliseconds / 3600000).toFixed(1)}h`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return ClockIcon
      case 'running':
        return ArrowPathIcon
      case 'completed':
        return CheckCircleIcon
      case 'failed':
        return XCircleIcon
      case 'cancelled':
        return StopIcon
      default:
        return InformationCircleIcon
    }
  }

  const getTypeIcon = (type: string) => {
    const typeConfig = BACKUP_TYPES.find(t => t.id === type)
    return typeConfig?.icon || CircleStackIcon
  }

  const filteredJobs = jobs.filter(job => {
    if (searchQuery && !job.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false
    }
    if (statusFilter && job.status !== statusFilter) return false
    if (typeFilter && job.type !== typeFilter) return false
    return true
  })

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'created':
        comparison = a.createdAt.getTime() - b.createdAt.getTime()
        break
      case 'lastRun':
        comparison = (a.lastRun?.getTime() || 0) - (b.lastRun?.getTime() || 0)
        break
      case 'nextRun':
        comparison = (a.nextRun?.getTime() || 0) - (b.nextRun?.getTime() || 0)
        break
      case 'size':
        comparison = a.totalSize - b.totalSize
        break
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const renderJobsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search backup jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            {BACKUP_TYPES.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="lastRun">Last Run</option>
            <option value="nextRun">Next Run</option>
            <option value="name">Name</option>
            <option value="created">Created</option>
            <option value="size">Size</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
              )}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
              )}
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={() => setShowJobModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>New Backup Job</span>
          </button>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CircleStackIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-2xl font-semibold text-gray-900">{jobs.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Jobs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {jobs.filter(j => j.isActive).length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CloudArrowUpIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Backups</p>
              <p className="text-2xl font-semibold text-gray-900">
                {jobs.reduce((sum, j) => sum + j.runCount, 0)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ArchiveBoxIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Size</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatBytes(jobs.reduce((sum, j) => sum + j.totalSize, 0))}
              </p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Jobs Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedJobs.map((job) => {
            const StatusIcon = getStatusIcon(job.status)
            const TypeIcon = getTypeIcon(job.type)
            const typeConfig = BACKUP_TYPES.find(t => t.id === job.type)
            const destinationConfig = DESTINATION_TYPES.find(d => d.id === job.destination.type)
            
            return (
              <Card key={job.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedJob(job)
                      setShowJobModal(true)
                    }}>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn('p-2 rounded-lg', typeConfig?.color || 'text-gray-600 bg-gray-100')}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{job.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{job.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Badge className={cn('text-xs', STATUS_COLORS[job.status])}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  {job.status === 'running' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{job.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                      {job.estimatedTimeRemaining && (
                        <p className="text-xs text-gray-500">
                          {formatDuration(job.estimatedTimeRemaining)} remaining
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Type</span>
                      <span className="font-medium">{typeConfig?.name || job.type}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Destination</span>
                      <div className="flex items-center space-x-1">
                        {destinationConfig && (
                          <destinationConfig.icon className="w-3 h-3 text-gray-500" />
                        )}
                        <span className="font-medium">{destinationConfig?.name || job.destination.type}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Size</span>
                      <span className="font-medium">{formatBytes(job.totalSize)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="font-medium">
                        {job.runCount > 0 ? Math.round((job.successCount / job.runCount) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Schedule */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Run</span>
                      <span className="font-medium">
                        {job.lastRun ? job.lastRun.toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                    
                    {job.nextRun && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Next Run</span>
                        <span className="font-medium">{job.nextRun.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {job.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} className="bg-gray-100 text-gray-700 text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {job.tags.length > 3 && (
                      <Badge className="bg-gray-100 text-gray-600 text-xs">
                        +{job.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {job.status === 'running' ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onCancelJob(job.id)
                        }}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onRunJob(job.id)
                        }}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Run Now
                      </button>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedJob(job)
                        setShowJobModal(true)
                      }}
                      className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onExportJob(job.id)
                      }}
                      className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      <ShareIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedJobs.map((job) => {
            const StatusIcon = getStatusIcon(job.status)
            const TypeIcon = getTypeIcon(job.type)
            const typeConfig = BACKUP_TYPES.find(t => t.id === job.type)
            const destinationConfig = DESTINATION_TYPES.find(d => d.id === job.destination.type)
            
            return (
              <Card key={job.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedJob(job)
                      setShowJobModal(true)
                    }}>
                <div className="flex items-center space-x-4">
                  <div className={cn('p-2 rounded-lg flex-shrink-0', typeConfig?.color || 'text-gray-600 bg-gray-100')}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{job.name}</h4>
                        <Badge className={cn('text-xs', STATUS_COLORS[job.status])}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                        <Badge className={cn('text-xs', typeConfig?.color || 'text-gray-600 bg-gray-100')}>
                          {typeConfig?.name || job.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatBytes(job.totalSize)}</span>
                        <span>{job.runCount} runs</span>
                        <span>{job.runCount > 0 ? Math.round((job.successCount / job.runCount) * 100) : 0}% success</span>
                        <span>{job.lastRun ? job.lastRun.toLocaleDateString() : 'Never run'}</span>
                      </div>
                    </div>
                    
                    {job.status === 'running' && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress: {job.progress}%</span>
                          {job.estimatedTimeRemaining && (
                            <span className="text-gray-500">
                              {formatDuration(job.estimatedTimeRemaining)} remaining
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{job.description}</p>
                      
                      <div className="flex items-center space-x-2">
                        {job.status === 'running' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onCancelJob(job.id)
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onRunJob(job.id)
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Run
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onExportJob(job.id)
                          }}
                          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                        >
                          <ShareIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <CloudArrowUpIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Backup Manager</h2>
            <Badge className="bg-blue-100 text-blue-800">
              {jobs.length} jobs
            </Badge>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'jobs', name: 'Backup Jobs', icon: CircleStackIcon },
              { id: 'history', name: 'History', icon: ClockIcon },
              { id: 'restore', name: 'Restore', icon: CloudArrowDownIcon },
              { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
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
          {activeTab === 'jobs' && renderJobsTab()}
          {activeTab === 'history' && (
            <div className="text-center py-12">
              <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Backup History</h3>
              <p className="text-gray-600">View detailed backup execution history</p>
            </div>
          )}
          {activeTab === 'restore' && (
            <div className="text-center py-12">
              <CloudArrowDownIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Restore Data</h3>
              <p className="text-gray-600">Restore files and data from backups</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Cog6ToothIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Backup Settings</h3>
              <p className="text-gray-600">Configure global backup preferences</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}