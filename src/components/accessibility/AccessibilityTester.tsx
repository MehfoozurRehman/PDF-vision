'use client'

import React, { useState, useEffect } from 'react'
import { Card, Badge } from '@/components/ui'
import {
  EyeIcon,
  EyeSlashIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  HandRaisedIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  SunIcon,
  MoonIcon,
  SwatchIcon,
  PaintBrushIcon,
  DocumentTextIcon,
  DocumentIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon as VolumeIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
  BugAntIcon,
  ShieldCheckIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  UsersIcon,
  GlobeAltIcon,
  LanguageIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleOvalLeftIcon,
  BookOpenIcon,
  AcademicCapIcon,
  LightBulbIcon,
  SparklesIcon,
  StarIcon,
  HeartIcon,
  FaceSmileIcon,
  HandThumbUpIcon,
  TrophyIcon,
  RocketLaunchIcon,
  FireIcon,
  BoltIcon,
  BeakerIcon,
  ScaleIcon,
  ChartBarIcon,
  ChartPieIcon,
  PresentationChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  LinkIcon,
  ShareIcon,
  ClipboardIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  ArchiveBoxIcon,
  InboxIcon,
  PaperAirplaneIcon,
  EnvelopeIcon,
  AtSymbolIcon,
  PhoneIcon,
  MapIcon,
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  TagIcon,
  BookmarkIcon,
  FlagIcon,
  BellIcon,
  BellAlertIcon,
  MegaphoneIcon,
  SpeakerWaveIcon as SoundIcon,
  MusicalNoteIcon,
  RadioIcon,
  TvIcon,
  VideoCameraIcon,
  CameraIcon,
  PhotoIcon,
  FilmIcon,
  MicrophoneIcon,
  PlayCircleIcon,
  PauseCircleIcon,
  StopCircleIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  PencilSquareIcon,
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
  FunnelIcon,
  AdjustmentsVerticalIcon,
  Bars3Icon,
  Bars4Icon,
  QueueListIcon,
  RectangleStackIcon,
  Square2StackIcon,
  Square3Stack3DIcon,
  CubeIcon,
  CubeTransparentIcon,
  PuzzlePieceIcon,
  SwatchIcon as ColorIcon,
  EyeDropperIcon,
  PaintBrushIcon as BrushIcon,
  WrenchIcon,
  WrenchScrewdriverIcon as ToolIcon,
  CogIcon,
  Cog8ToothIcon,
  CommandLineIcon,

  CodeBracketIcon,
  CodeBracketSquareIcon,
  CpuChipIcon,
  ServerIcon,
  CloudIcon,
  GlobeAmericasIcon,
  WifiIcon,
  SignalIcon,
  SignalSlashIcon,
  PowerIcon,

  Battery0Icon,
  Battery50Icon,
  Battery100Icon,
  LockClosedIcon,
  LockOpenIcon,
  KeyIcon,
  ShieldExclamationIcon,
  FingerPrintIcon,
  IdentificationIcon,
  CreditCardIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  GiftIcon,
  TruckIcon,

  RocketLaunchIcon as RocketIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface AccessibilityTest {
  id: string
  name: string
  description: string
  category: 'visual' | 'auditory' | 'motor' | 'cognitive' | 'keyboard' | 'screen_reader' | 'wcag'
  level: 'A' | 'AA' | 'AAA'
  guideline: string
  criterion: string
  status: 'pass' | 'fail' | 'warning' | 'not_tested' | 'not_applicable'
  score: number
  maxScore: number
  issues: AccessibilityIssue[]
  recommendations: string[]
  lastTested: Date
  testedBy: string
  automated: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  tags: string[]
}

interface AccessibilityIssue {
  id: string
  type: 'error' | 'warning' | 'info'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  element: string
  selector: string
  location: {
    page: number
    x: number
    y: number
  }
  wcagCriterion: string
  impact: string
  solution: string
  resources: string[]
  isFixed: boolean
  fixedAt?: Date
  fixedBy?: string
  notes?: string
}

interface AccessibilityProfile {
  id: string
  name: string
  description: string
  type: 'visual_impairment' | 'hearing_impairment' | 'motor_impairment' | 'cognitive_impairment' | 'custom'
  settings: {
    fontSize: number
    fontFamily: string
    lineHeight: number
    letterSpacing: number
    wordSpacing: number
    contrast: 'normal' | 'high' | 'inverted'
    colorScheme: 'light' | 'dark' | 'high_contrast'
    animations: 'enabled' | 'reduced' | 'disabled'
    sounds: 'enabled' | 'reduced' | 'disabled'
    screenReader: boolean
    keyboardNavigation: boolean
    voiceControl: boolean
    eyeTracking: boolean
    switchControl: boolean
    magnification: number
    cursorSize: 'small' | 'medium' | 'large' | 'extra_large'
    focusIndicator: 'default' | 'enhanced' | 'high_contrast'
    timeout: number
    autoplay: boolean
    captions: boolean
    audioDescription: boolean
    signLanguage: boolean
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface AccessibilityReport {
  id: string
  name: string
  description: string
  type: 'manual' | 'automated' | 'combined'
  scope: 'full' | 'partial' | 'specific'
  standards: ('WCAG_2_1' | 'WCAG_2_2' | 'Section_508' | 'ADA' | 'EN_301_549')[]
  level: 'A' | 'AA' | 'AAA'
  summary: {
    totalTests: number
    passedTests: number
    failedTests: number
    warningTests: number
    notTestedTests: number
    overallScore: number
    complianceLevel: string
  }
  categories: {
    [key: string]: {
      score: number
      maxScore: number
      issues: number
      status: 'pass' | 'fail' | 'warning'
    }
  }
  issues: AccessibilityIssue[]
  recommendations: AccessibilityRecommendation[]
  generatedAt: Date
  generatedBy: string
  isPublic: boolean
  tags: string[]
}

interface AccessibilityRecommendation {
  id: string
  type: 'fix' | 'enhancement' | 'best_practice'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  category: string
  wcagCriterion: string
  impact: 'low' | 'medium' | 'high'
  effort: 'low' | 'medium' | 'high'
  steps: RecommendationStep[]
  resources: {
    documentation: string[]
    tools: string[]
    examples: string[]
  }
  estimatedTime: number
  isImplemented: boolean
  implementedAt?: Date
  implementedBy?: string
}

interface RecommendationStep {
  id: string
  title: string
  description: string
  type: 'code' | 'design' | 'content' | 'testing'
  isCompleted: boolean
  completedAt?: Date
  notes?: string
}

interface AccessibilityTesterProps {
  tests: AccessibilityTest[]
  issues: AccessibilityIssue[]
  profiles: AccessibilityProfile[]
  reports: AccessibilityReport[]
  onRunTest: (testId: string) => void
  onRunAllTests: () => void
  onFixIssue: (issueId: string, fix: string) => void
  onCreateProfile: (profile: Partial<AccessibilityProfile>) => void
  onUpdateProfile: (profileId: string, updates: Partial<AccessibilityProfile>) => void
  onActivateProfile: (profileId: string) => void
  onGenerateReport: (config: Partial<AccessibilityReport>) => void
  onExportReport: (reportId: string, format: 'html' | 'pdf' | 'json') => void
  onImplementRecommendation: (recommendationId: string) => void
  isActive: boolean
  onClose: () => void
}

const ACCESSIBILITY_CATEGORIES = [
  {
    id: 'visual',
    name: 'Visual Accessibility',
    description: 'Color contrast, text size, visual indicators',
    icon: EyeIcon,
    color: 'text-blue-600 bg-blue-100'
  },
  {
    id: 'auditory',
    name: 'Auditory Accessibility',
    description: 'Audio content, captions, sound alternatives',
    icon: SpeakerWaveIcon,
    color: 'text-green-600 bg-green-100'
  },
  {
    id: 'motor',
    name: 'Motor Accessibility',
    description: 'Keyboard navigation, click targets, gestures',
    icon: HandRaisedIcon,
    color: 'text-purple-600 bg-purple-100'
  },
  {
    id: 'cognitive',
    name: 'Cognitive Accessibility',
    description: 'Clear language, consistent navigation, timing',
    icon: LightBulbIcon,
    color: 'text-yellow-600 bg-yellow-100'
  },
  {
    id: 'keyboard',
    name: 'Keyboard Navigation',
    description: 'Tab order, focus management, shortcuts',
    icon: CommandLineIcon,
    color: 'text-indigo-600 bg-indigo-100'
  },
  {
    id: 'screen_reader',
    name: 'Screen Reader Support',
    description: 'ARIA labels, semantic markup, announcements',
    icon: SpeakerWaveIcon,
    color: 'text-orange-600 bg-orange-100'
  },
  {
    id: 'wcag',
    name: 'WCAG Compliance',
    description: 'Web Content Accessibility Guidelines',
    icon: ShieldCheckIcon,
    color: 'text-pink-600 bg-pink-100'
  }
]

const WCAG_LEVELS = [
  { id: 'A', name: 'Level A', description: 'Minimum level of accessibility' },
  { id: 'AA', name: 'Level AA', description: 'Standard level of accessibility' },
  { id: 'AAA', name: 'Level AAA', description: 'Enhanced level of accessibility' }
]

const STATUS_COLORS = {
  pass: 'text-green-600 bg-green-100',
  fail: 'text-red-600 bg-red-100',
  warning: 'text-yellow-600 bg-yellow-100',
  not_tested: 'text-gray-600 bg-gray-100',
  not_applicable: 'text-blue-600 bg-blue-100'
}

const STATUS_ICONS = {
  pass: CheckCircleIcon,
  fail: XCircleIcon,
  warning: ExclamationTriangleIcon,
  not_tested: ClockIcon,
  not_applicable: InformationCircleIcon
}

const SEVERITY_COLORS = {
  low: 'text-blue-600 bg-blue-100',
  medium: 'text-yellow-600 bg-yellow-100',
  high: 'text-orange-600 bg-orange-100',
  critical: 'text-red-600 bg-red-100'
}

export default function AccessibilityTester({
  tests,
  issues,
  profiles,
  reports,
  onRunTest,
  onRunAllTests,
  onFixIssue,
  onCreateProfile,
  onUpdateProfile,
  onActivateProfile,
  onGenerateReport,
  onExportReport,
  onImplementRecommendation,
  isActive,
  onClose
}: AccessibilityTesterProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'issues' | 'profiles' | 'reports'>('overview')
  const [selectedTest, setSelectedTest] = useState<AccessibilityTest | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<AccessibilityIssue | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<AccessibilityProfile | null>(null)
  const [selectedReport, setSelectedReport] = useState<AccessibilityReport | null>(null)
  const [showTestModal, setShowTestModal] = useState(false)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [levelFilter, setLevelFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [severityFilter, setSeverityFilter] = useState<string>('')
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [testProgress, setTestProgress] = useState(0)

  const getComplianceScore = (): number => {
    if (tests.length === 0) return 0
    const passedTests = tests.filter(t => t.status === 'pass').length
    return Math.round((passedTests / tests.length) * 100)
  }

  const getComplianceLevel = (): string => {
    const score = getComplianceScore()
    if (score >= 95) return 'AAA'
    if (score >= 80) return 'AA'
    if (score >= 60) return 'A'
    return 'Non-compliant'
  }

  const filteredTests = tests.filter(test => {
    if (searchQuery && !test.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !test.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (categoryFilter && test.category !== categoryFilter) return false
    if (levelFilter && test.level !== levelFilter) return false
    if (statusFilter && test.status !== statusFilter) return false
    return true
  })

  const filteredIssues = issues.filter(issue => {
    if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !issue.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (severityFilter && issue.severity !== severityFilter) return false
    return true
  })

  const renderOverviewTab = () => {
    const passedTests = tests.filter(t => t.status === 'pass').length
    const failedTests = tests.filter(t => t.status === 'fail').length
    const warningTests = tests.filter(t => t.status === 'warning').length
    const notTestedTests = tests.filter(t => t.status === 'not_tested').length
    const criticalIssues = issues.filter(i => i.severity === 'critical' && !i.isFixed).length
    const highIssues = issues.filter(i => i.severity === 'high' && !i.isFixed).length
    const complianceScore = getComplianceScore()
    const complianceLevel = getComplianceLevel()

    return (
      <div className="space-y-6">
        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{complianceScore}%</div>
            <div className="text-sm text-gray-600">Compliance Score</div>
            <div className="text-xs text-gray-500 mt-1">{complianceLevel}</div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Passed Tests</p>
                <p className="text-2xl font-semibold text-gray-900">{passedTests}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Failed Tests</p>
                <p className="text-2xl font-semibold text-gray-900">{failedTests}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationCircleIcon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical Issues</p>
                <p className="text-2xl font-semibold text-gray-900">{criticalIssues}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Critical Issues */}
        {criticalIssues > 0 && (
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ExclamationCircleIcon className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Critical Accessibility Issues</h3>
            </div>
            
            <div className="space-y-3">
              {issues.filter(i => i.severity === 'critical' && !i.isFixed).slice(0, 5).map((issue) => (
                <div key={issue.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ExclamationCircleIcon className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">{issue.title}</p>
                      <p className="text-sm text-gray-600">{issue.description}</p>
                      <p className="text-xs text-gray-500">WCAG: {issue.wcagCriterion}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className="bg-red-100 text-red-800 text-xs mb-1">
                      {issue.severity.toUpperCase()}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      Page {issue.location.page}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Accessibility Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACCESSIBILITY_CATEGORIES.map((category) => {
            const categoryTests = tests.filter(t => t.category === category.id)
            const passedCount = categoryTests.filter(t => t.status === 'pass').length
            const failedCount = categoryTests.filter(t => t.status === 'fail').length
            const warningCount = categoryTests.filter(t => t.status === 'warning').length
            const categoryScore = categoryTests.length > 0 
              ? Math.round((passedCount / categoryTests.length) * 100) 
              : 0
            
            return (
              <Card key={category.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setCategoryFilter(category.id)
                      setActiveTab('tests')
                    }}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={cn('p-2 rounded-lg', category.color)}>
                      <category.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Tests</p>
                      <p className="font-semibold text-gray-900">{categoryTests.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Passed</p>
                      <p className="font-semibold text-green-600">{passedCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Failed</p>
                      <p className="font-semibold text-red-600">{failedCount}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Compliance</span>
                      <span className="font-medium">{categoryScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full transition-all duration-300',
                          categoryScore >= 80 ? 'bg-green-600' :
                          categoryScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                        )}
                        style={{ width: `${categoryScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setIsRunningTests(true)
                onRunAllTests()
                // Simulate test progress
                let progress = 0
                const interval = setInterval(() => {
                  progress += 10
                  setTestProgress(progress)
                  if (progress >= 100) {
                    clearInterval(interval)
                    setIsRunningTests(false)
                    setTestProgress(0)
                  }
                }, 200)
              }}
              disabled={isRunningTests}
              className="flex items-center justify-center space-x-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isRunningTests ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  <span>Running Tests... {testProgress}%</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-5 h-5" />
                  <span>Run All Tests</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => onGenerateReport({ type: 'automated', level: 'AA' })}
              className="flex items-center justify-center space-x-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <DocumentTextIcon className="w-5 h-5" />
              <span>Generate Report</span>
            </button>
            
            <button
              onClick={() => setActiveTab('profiles')}
              className="flex items-center justify-center space-x-2 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <UserIcon className="w-5 h-5" />
              <span>Accessibility Profiles</span>
            </button>
          </div>
        </Card>

        {/* Recent Reports */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {report.summary.overallScore}% ({report.level})
                  </p>
                  <p className="text-xs text-gray-500">
                    {report.generatedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  const renderTestsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {ACCESSIBILITY_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Levels</option>
            {WCAG_LEVELS.map((level) => (
              <option key={level.id} value={level.id}>{level.name}</option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="pass">Passed</option>
            <option value="fail">Failed</option>
            <option value="warning">Warning</option>
            <option value="not_tested">Not Tested</option>
            <option value="not_applicable">Not Applicable</option>
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
        </div>
      </div>
      
      {/* Tests Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const StatusIcon = STATUS_ICONS[test.status]
            const categoryConfig = ACCESSIBILITY_CATEGORIES.find(c => c.id === test.category)
            const CategoryIcon = categoryConfig?.icon || EyeIcon
            
            return (
              <Card key={test.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedTest(test)
                      setShowTestModal(true)
                    }}>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn('p-2 rounded-lg', categoryConfig?.color || 'text-gray-600 bg-gray-100')}>
                        <CategoryIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{test.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{test.description}</p>
                      </div>
                    </div>
                    
                    <Badge className={cn('text-xs', STATUS_COLORS[test.status])}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {test.status.replace('_', ' ').charAt(0).toUpperCase() + test.status.replace('_', ' ').slice(1)}
                    </Badge>
                  </div>
                  
                  {/* Score */}
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {test.score}/{test.maxScore}
                    </p>
                    <p className="text-sm text-gray-600">
                      {Math.round((test.score / test.maxScore) * 100)}% Score
                    </p>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">WCAG Level</span>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">{test.level}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Issues</span>
                      <span className="font-medium text-red-600">{test.issues.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Priority</span>
                      <Badge className={cn('text-xs', SEVERITY_COLORS[test.priority])}>
                        {test.priority.charAt(0).toUpperCase() + test.priority.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onRunTest(test.id)
                      }}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Run Test
                    </button>
                    
                    {test.issues.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveTab('issues')
                        }}
                        className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        View Issues
                      </button>
                    )}
                  </div>
                  
                  {/* Last Tested */}
                  <div className="text-xs text-gray-500 text-center">
                    Last tested: {test.lastTested.toLocaleDateString()}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTests.map((test) => {
            const StatusIcon = STATUS_ICONS[test.status]
            const categoryConfig = ACCESSIBILITY_CATEGORIES.find(c => c.id === test.category)
            const CategoryIcon = categoryConfig?.icon || EyeIcon
            
            return (
              <Card key={test.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedTest(test)
                      setShowTestModal(true)
                    }}>
                <div className="flex items-center space-x-4">
                  <div className={cn('p-2 rounded-lg flex-shrink-0', categoryConfig?.color || 'text-gray-600 bg-gray-100')}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{test.name}</h4>
                        <Badge className={cn('text-xs', STATUS_COLORS[test.status])}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {test.status.replace('_', ' ').charAt(0).toUpperCase() + test.status.replace('_', ' ').slice(1)}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">{test.level}</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {test.score}/{test.maxScore}
                          </p>
                          <p className="text-xs text-gray-600">
                            {Math.round((test.score / test.maxScore) * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{test.description}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Issues: {test.issues.length}</span>
                        <span>Priority: {test.priority}</span>
                        <span>Tested: {test.lastTested.toLocaleDateString()}</span>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onRunTest(test.id)
                            }}
                            className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          >
                            Run
                          </button>
                          
                          {test.issues.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveTab('issues')
                              }}
                              className="px-2 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors"
                            >
                              Issues
                            </button>
                          )}
                        </div>
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
            <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Accessibility Tester</h2>
            <Badge className="bg-blue-100 text-blue-800">
              {getComplianceScore()}% compliant
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onRunAllTests()}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Run All Tests
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
              { id: 'overview', name: 'Overview', icon: ChartPieIcon },
              { id: 'tests', name: 'Tests', icon: ClipboardDocumentCheckIcon },
              { id: 'issues', name: 'Issues', icon: ExclamationTriangleIcon },
              { id: 'profiles', name: 'Profiles', icon: UserIcon },
              { id: 'reports', name: 'Reports', icon: DocumentTextIcon }
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
          {activeTab === 'tests' && renderTestsTab()}
          {activeTab === 'issues' && (
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Accessibility Issues</h3>
              <p className="text-gray-600">View and manage accessibility issues</p>
            </div>
          )}
          {activeTab === 'profiles' && (
            <div className="text-center py-12">
              <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Accessibility Profiles</h3>
              <p className="text-gray-600">Manage accessibility user profiles and settings</p>
            </div>
          )}
          {activeTab === 'reports' && (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Accessibility Reports</h3>
              <p className="text-gray-600">Generate and view accessibility compliance reports</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}