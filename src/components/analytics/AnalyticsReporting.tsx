'use client'

import React, { useState, useEffect } from 'react'
import { Card, Badge } from '@/components/ui'
import {
  ChartBarIcon,
  ChartPieIcon,
  PresentationChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  UsersIcon,
  DocumentIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  PrinterIcon,
  PencilSquareIcon,
  ChatBubbleLeftIcon,
  TagIcon,
  FolderIcon,
  ServerIcon,
  CpuChipIcon,
  CloudIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  GlobeAltIcon,
  MapPinIcon,
  LanguageIcon,
  BoltIcon,
  FireIcon,
  SparklesIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  BellIcon,
  MegaphoneIcon,
  TrophyIcon,
  StarIcon,
  HeartIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  LinkIcon,
  ClipboardIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  InboxIcon,
  PaperAirplaneIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  HomeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ShoppingCartIcon,
  TruckIcon,
  ScaleIcon,
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  FingerPrintIcon,
  KeyIcon,
  SunIcon,
  MoonIcon,
  SwatchIcon,
  PaintBrushIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ForwardIcon,
  BackwardIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  TrashIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  ViewColumnsIcon,
  Bars3Icon,
  QueueListIcon,
  RectangleStackIcon,
  CubeIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface AnalyticsMetric {
  id: string
  name: string
  value: number
  previousValue: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  unit: string
  format: 'number' | 'percentage' | 'currency' | 'duration' | 'bytes'
  category: 'usage' | 'performance' | 'engagement' | 'quality' | 'security' | 'business'
  description: string
  target?: number
  threshold?: {
    warning: number
    critical: number
  }
  trend: {
    period: string
    data: { date: Date; value: number }[]
  }
  lastUpdated: Date
}

interface AnalyticsReport {
  id: string
  name: string
  description: string
  type: 'dashboard' | 'summary' | 'detailed' | 'custom'
  category: 'usage' | 'performance' | 'engagement' | 'quality' | 'security' | 'business'
  period: {
    start: Date
    end: Date
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  }
  metrics: string[]
  filters: {
    users?: string[]
    documents?: string[]
    actions?: string[]
    devices?: string[]
    locations?: string[]
    tags?: string[]
  }
  visualizations: {
    type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap' | 'table'
    title: string
    data: any[]
    config: Record<string, any>
  }[]
  insights: {
    type: 'trend' | 'anomaly' | 'correlation' | 'prediction' | 'recommendation'
    title: string
    description: string
    confidence: number
    impact: 'low' | 'medium' | 'high'
    actionable: boolean
    actions?: string[]
  }[]
  schedule?: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly'
    time: string
    recipients: string[]
    format: 'pdf' | 'html' | 'csv' | 'json'
  }
  createdAt: Date
  lastGenerated: Date
  status: 'generating' | 'ready' | 'error' | 'scheduled'
  size: number
  version: number
}

interface UserActivity {
  id: string
  userId: string
  userName: string
  action: 'view' | 'download' | 'share' | 'edit' | 'comment' | 'annotate' | 'search' | 'upload' | 'delete'
  documentId: string
  documentName: string
  timestamp: Date
  duration?: number
  device: {
    type: 'desktop' | 'tablet' | 'mobile'
    os: string
    browser: string
  }
  location: {
    country: string
    city: string
    ip: string
  }
  metadata: {
    pageViewed?: number
    searchQuery?: string
    shareMethod?: string
    editType?: string
    commentText?: string
    annotationType?: string
  }
  sessionId: string
  referrer?: string
}

interface DocumentStatistics {
  id: string
  documentId: string
  documentName: string
  documentType: string
  size: number
  pages: number
  createdAt: Date
  lastModified: Date
  metrics: {
    views: number
    uniqueViews: number
    downloads: number
    shares: number
    comments: number
    annotations: number
    searches: number
    averageViewTime: number
    bounceRate: number
    completionRate: number
    popularPages: number[]
    searchTerms: string[]
  }
  engagement: {
    rating: number
    reviews: number
    bookmarks: number
    favorites: number
    recommendations: number
  }
  performance: {
    loadTime: number
    renderTime: number
    searchTime: number
    errorRate: number
    availability: number
  }
  trends: {
    period: string
    views: { date: Date; count: number }[]
    engagement: { date: Date; score: number }[]
    performance: { date: Date; time: number }[]
  }
}

interface SystemPerformance {
  id: string
  timestamp: Date
  metrics: {
    cpu: {
      usage: number
      cores: number
      frequency: number
    }
    memory: {
      used: number
      total: number
      available: number
      cached: number
    }
    storage: {
      used: number
      total: number
      available: number
      iops: number
    }
    network: {
      inbound: number
      outbound: number
      latency: number
      errors: number
    }
    database: {
      connections: number
      queries: number
      slowQueries: number
      cacheHitRate: number
    }
    application: {
      requests: number
      responses: number
      errors: number
      averageResponseTime: number
    }
  }
  alerts: {
    level: 'info' | 'warning' | 'error' | 'critical'
    message: string
    component: string
    timestamp: Date
  }[]
  health: {
    overall: 'healthy' | 'warning' | 'critical'
    components: {
      name: string
      status: 'healthy' | 'warning' | 'critical'
      message?: string
    }[]
  }
}

interface AnalyticsReportingProps {
  metrics: AnalyticsMetric[]
  reports: AnalyticsReport[]
  activities: UserActivity[]
  documentStats: DocumentStatistics[]
  systemPerformance: SystemPerformance[]
  onGenerateReport: (config: Partial<AnalyticsReport>) => void
  onScheduleReport: (reportId: string, schedule: AnalyticsReport['schedule']) => void
  onExportReport: (reportId: string, format: 'pdf' | 'html' | 'csv' | 'json') => void
  onDeleteReport: (reportId: string) => void
  onCreateAlert: (metric: string, threshold: number) => void
  onUpdateMetric: (metricId: string, updates: Partial<AnalyticsMetric>) => void
  isActive: boolean
  onClose: () => void
}

const METRIC_CATEGORIES = [
  {
    id: 'usage',
    name: 'Usage Analytics',
    description: 'Document views, downloads, and user activity',
    icon: ChartBarIcon,
    color: 'text-blue-600 bg-blue-100'
  },
  {
    id: 'performance',
    name: 'Performance Metrics',
    description: 'System performance and response times',
    icon: BoltIcon,
    color: 'text-green-600 bg-green-100'
  },
  {
    id: 'engagement',
    name: 'User Engagement',
    description: 'User interactions and satisfaction',
    icon: HeartIcon,
    color: 'text-purple-600 bg-purple-100'
  },
  {
    id: 'quality',
    name: 'Content Quality',
    description: 'Document quality and user feedback',
    icon: StarIcon,
    color: 'text-yellow-600 bg-yellow-100'
  },
  {
    id: 'security',
    name: 'Security Metrics',
    description: 'Access control and security events',
    icon: ShieldCheckIcon,
    color: 'text-red-600 bg-red-100'
  },
  {
    id: 'business',
    name: 'Business Intelligence',
    description: 'ROI and business impact metrics',
    icon: CurrencyDollarIcon,
    color: 'text-indigo-600 bg-indigo-100'
  }
]

const REPORT_TYPES = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Real-time overview of key metrics',
    icon: PresentationChartBarIcon
  },
  {
    id: 'summary',
    name: 'Executive Summary',
    description: 'High-level insights for leadership',
    icon: DocumentTextIcon
  },
  {
    id: 'detailed',
    name: 'Detailed Analysis',
    description: 'Comprehensive data analysis',
    icon: ChartBarIcon
  },
  {
    id: 'custom',
    name: 'Custom Report',
    description: 'Tailored reports for specific needs',
    icon: AdjustmentsHorizontalIcon
  }
]

const VISUALIZATION_TYPES = [
  { id: 'line', name: 'Line Chart', icon: ArrowTrendingUpIcon },
  { id: 'bar', name: 'Bar Chart', icon: ChartBarIcon },
  { id: 'pie', name: 'Pie Chart', icon: ChartPieIcon },
  { id: 'area', name: 'Area Chart', icon: PresentationChartBarIcon },
  { id: 'table', name: 'Data Table', icon: TableCellsIcon },
  { id: 'heatmap', name: 'Heat Map', icon: Squares2X2Icon }
]

export default function AnalyticsReporting({
  metrics,
  reports,
  activities,
  documentStats,
  systemPerformance,
  onGenerateReport,
  onScheduleReport,
  onExportReport,
  onDeleteReport,
  onCreateAlert,
  onUpdateMetric,
  isActive,
  onClose
}: AnalyticsReportingProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'reports' | 'activities' | 'performance'>('overview')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d')
  const [selectedReport, setSelectedReport] = useState<AnalyticsReport | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showMetricModal, setShowMetricModal] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<AnalyticsMetric | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'change' | 'updated'>('value')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const formatValue = (value: number, format: string, unit: string): string => {
    switch (format) {
      case 'percentage':
        return `${value.toFixed(1)}%`
      case 'currency':
        return `$${value.toLocaleString()}`
      case 'duration':
        if (unit === 'ms') return `${value}ms`
        if (unit === 's') return `${value}s`
        if (unit === 'm') return `${Math.floor(value / 60)}m ${value % 60}s`
        return `${value}${unit}`
      case 'bytes':
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        let i = 0
        let bytes = value
        while (bytes >= 1024 && i < sizes.length - 1) {
          bytes /= 1024
          i++
        }
        return `${bytes.toFixed(1)} ${sizes[i]}`
      default:
        return `${value.toLocaleString()} ${unit}`
    }
  }

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
      case 'decrease':
        return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
      default:
        return <MinusIcon className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating':
        return <ArrowPathIcon className="w-4 h-4 text-blue-600 animate-spin" />
      case 'ready':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />
      case 'error':
        return <XCircleIcon className="w-4 h-4 text-red-600" />
      case 'scheduled':
        return <ClockIcon className="w-4 h-4 text-yellow-600" />
      default:
        return <InformationCircleIcon className="w-4 h-4 text-gray-400" />
    }
  }

  const filteredMetrics = metrics.filter(metric => {
    const matchesCategory = !selectedCategory || metric.category === selectedCategory
    const matchesSearch = !searchQuery || 
      metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedMetrics = [...filteredMetrics].sort((a, b) => {
    let aValue, bValue
    switch (sortBy) {
      case 'name':
        aValue = a.name
        bValue = b.name
        break
      case 'value':
        aValue = a.value
        bValue = b.value
        break
      case 'change':
        aValue = a.change
        bValue = b.change
        break
      case 'updated':
        aValue = a.lastUpdated.getTime()
        bValue = b.lastUpdated.getTime()
        break
      default:
        return 0
    }
    
    if (typeof aValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue as string) : (bValue as string).localeCompare(aValue)
    }
    
    return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
  })

  const renderOverviewTab = () => {
    const keyMetrics = metrics.slice(0, 8)
    const recentActivities = activities.slice(0, 10)
    const topDocuments = documentStats.slice(0, 5)
    const currentPerformance = systemPerformance[0]

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric) => {
            const categoryConfig = METRIC_CATEGORIES.find(c => c.id === metric.category)
            const CategoryIcon = categoryConfig?.icon || ChartBarIcon
            
            return (
              <Card key={metric.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('p-2 rounded-lg', categoryConfig?.color || 'text-gray-600 bg-gray-100')}>
                    <CategoryIcon className="w-6 h-6" />
                  </div>
                  {getChangeIcon(metric.changeType)}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {formatValue(metric.value, metric.format, metric.unit)}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      'text-sm font-medium',
                      metric.changeType === 'increase' ? 'text-green-600' :
                      metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                    )}>
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                    <span className="text-sm text-gray-500">vs last period</span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage Trends */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Usage Trends</h3>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
            
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Usage trend chart would be displayed here</p>
              </div>
            </div>
          </Card>
          
          {/* Performance Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">System Performance</h3>
              <Badge className={cn(
                currentPerformance?.health.overall === 'healthy' ? 'bg-green-100 text-green-800' :
                currentPerformance?.health.overall === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              )}>
                {currentPerformance?.health.overall || 'Unknown'}
              </Badge>
            </div>
            
            {currentPerformance && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">CPU Usage</span>
                      <span className="text-sm font-medium">{currentPerformance.metrics.cpu.usage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${currentPerformance.metrics.cpu.usage}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Memory Usage</span>
                      <span className="text-sm font-medium">
                        {Math.round((currentPerformance.metrics.memory.used / currentPerformance.metrics.memory.total) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(currentPerformance.metrics.memory.used / currentPerformance.metrics.memory.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {currentPerformance.health.components.slice(0, 4).map((component, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{component.name}</span>
                      <Badge className={cn(
                        component.status === 'healthy' ? 'bg-green-100 text-green-800' :
                        component.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      )}>
                        {component.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
        
        {/* Recent Activities & Top Documents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <button
                onClick={() => setActiveTab('activities')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {recentActivities.map((activity) => {
                const getActionIcon = (action: string) => {
                  switch (action) {
                    case 'view': return <EyeIcon className="w-4 h-4" />
                    case 'download': return <ArrowDownTrayIcon className="w-4 h-4" />
                    case 'share': return <ShareIcon className="w-4 h-4" />
                    case 'edit': return <PencilSquareIcon className="w-4 h-4" />
                    case 'comment': return <ChatBubbleLeftIcon className="w-4 h-4" />
                    case 'search': return <MagnifyingGlassIcon className="w-4 h-4" />
                    default: return <DocumentIcon className="w-4 h-4" />
                  }
                }
                
                return (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      {getActionIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.userName} {activity.action}ed {activity.documentName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      {activity.device.type}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </Card>
          
          {/* Top Documents */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Documents</h3>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="views">By Views</option>
                <option value="downloads">By Downloads</option>
                <option value="engagement">By Engagement</option>
              </select>
            </div>
            
            <div className="space-y-3">
              {topDocuments.map((doc, index) => (
                <div key={doc.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-lg font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.documentName}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{doc.metrics.views} views</span>
                      <span>{doc.metrics.downloads} downloads</span>
                      <span>{doc.metrics.shares} shares</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{doc.engagement.rating.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">rating</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const renderMetricsTab = () => (
    <div className="space-y-6">
      {/* Metrics Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Analytics Metrics</h3>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {METRIC_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="value">Sort by Value</option>
            <option value="name">Sort by Name</option>
            <option value="change">Sort by Change</option>
            <option value="updated">Sort by Updated</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {sortOrder === 'asc' ? (
              <ArrowUpIcon className="w-4 h-4" />
            ) : (
              <ArrowDownIcon className="w-4 h-4" />
            )}
          </button>
          
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
        </div>
      </div>
      
      {/* Metrics Grid/List */}
      <div className={cn(
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      )}>
        {sortedMetrics.map((metric) => {
          const categoryConfig = METRIC_CATEGORIES.find(c => c.id === metric.category)
          const CategoryIcon = categoryConfig?.icon || ChartBarIcon
          
          return (
            <Card key={metric.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedMetric(metric)
                    setShowMetricModal(true)
                  }}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className={cn('p-2 rounded-lg', categoryConfig?.color || 'text-gray-600 bg-gray-100')}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center space-x-2">
                    {getChangeIcon(metric.changeType)}
                    <span className={cn(
                      'text-sm font-medium',
                      metric.changeType === 'increase' ? 'text-green-600' :
                      metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                    )}>
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                {/* Value */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {formatValue(metric.value, metric.format, metric.unit)}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                </div>
                
                {/* Progress Bar (if target exists) */}
                {metric.target && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Progress to target</span>
                      <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {/* Threshold Indicators */}
                {metric.threshold && (
                  <div className="flex items-center space-x-2">
                    {metric.value >= metric.threshold.critical ? (
                      <Badge className="bg-red-100 text-red-800 text-xs">Critical</Badge>
                    ) : metric.value >= metric.threshold.warning ? (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">Warning</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 text-xs">Normal</Badge>
                    )}
                  </div>
                )}
                
                {/* Last Updated */}
                <div className="text-xs text-gray-500">
                  Updated {metric.lastUpdated.toLocaleString()}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      
      {sortedMetrics.length === 0 && (
        <div className="text-center py-12">
          <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Metrics Found</h3>
          <p className="text-gray-600">Try adjusting your search or category filter</p>
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
            <PresentationChartBarIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Analytics & Reporting</h2>
            <Badge className="bg-blue-100 text-blue-800">
              {metrics.length} metrics
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setIsGenerating(true)
                setTimeout(() => setIsGenerating(false), 2000)
              }}
              disabled={isGenerating}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>Generate Report</span>
                </div>
              )}
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
              { id: 'overview', name: 'Overview', icon: PresentationChartBarIcon },
              { id: 'metrics', name: 'Metrics', icon: ChartBarIcon },
              { id: 'reports', name: 'Reports', icon: DocumentTextIcon },
              { id: 'activities', name: 'Activities', icon: UserIcon },
              { id: 'performance', name: 'Performance', icon: BoltIcon }
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
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'metrics' && renderMetricsTab()}
          {activeTab === 'reports' && (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Reports</h3>
              <p className="text-gray-600">Generate and manage analytics reports</p>
            </div>
          )}
          {activeTab === 'activities' && (
            <div className="text-center py-12">
              <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">User Activities</h3>
              <p className="text-gray-600">Track and analyze user activities</p>
            </div>
          )}
          {activeTab === 'performance' && (
            <div className="text-center py-12">
              <BoltIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">System Performance</h3>
              <p className="text-gray-600">Monitor system performance and health</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}