'use client'

import React, { useState, useEffect } from 'react'
import { Card, Badge } from '@/components/ui'
import {
  MagnifyingGlassIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  DocumentIcon,
  DocumentTextIcon,
  DocumentMagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  CalendarIcon,
  CalendarDaysIcon,
  TagIcon,
  BookmarkIcon,
  StarIcon,
  HeartIcon,
  FlagIcon,
  MapPinIcon,
  GlobeAltIcon,
  LanguageIcon,
  ChatBubbleLeftIcon,
  ChatBubbleOvalLeftIcon,
  SpeakerWaveIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  FilmIcon,
  CameraIcon,
  MicrophoneIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ForwardIcon,
  BackwardIcon,
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
  UserIcon,
  UsersIcon,
  BuildingOfficeIcon,
  HomeIcon,
  MapIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  IdentificationIcon,
  CreditCardIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  GiftIcon,
  TruckIcon,
  ChartBarIcon,
  ChartPieIcon,
  PresentationChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BoltIcon,
  RocketLaunchIcon,
  FireIcon,
  SparklesIcon,
  LightBulbIcon,
  BeakerIcon,
  ScaleIcon,
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
  CogIcon,
  CommandLineIcon,
  CodeBracketIcon,
  CpuChipIcon,
  ServerIcon,
  CloudIcon,
  WifiIcon,
  SignalIcon,
  PowerIcon,
  Battery100Icon,
  LockClosedIcon,
  LockOpenIcon,
  KeyIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  FingerPrintIcon,
  EyeIcon,
  EyeSlashIcon,
  SunIcon,
  MoonIcon,
  SwatchIcon,
  PaintBrushIcon,
  EyeDropperIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  BellIcon,
  BellAlertIcon,
  MegaphoneIcon,
  HandRaisedIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  TvIcon,
  RadioIcon,
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
  AdjustmentsVerticalIcon,
  Bars3Icon,
  Bars4Icon,
  QueueListIcon,
  RectangleStackIcon,
  Square2StackIcon,
  CubeIcon,
  PuzzlePieceIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  documentId: string
  documentName: string
  documentPath: string
  type: 'text' | 'annotation' | 'comment' | 'metadata' | 'ocr' | 'form_field'
  content: string
  snippet: string
  page: number
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  relevanceScore: number
  matchType: 'exact' | 'partial' | 'fuzzy' | 'semantic'
  highlights: SearchHighlight[]
  context: {
    before: string
    after: string
  }
  metadata: {
    author?: string
    createdAt?: Date
    modifiedAt?: Date
    tags?: string[]
    category?: string
  }
  lastAccessed: Date
  accessCount: number
}

interface SearchHighlight {
  start: number
  end: number
  type: 'exact' | 'partial' | 'fuzzy'
  confidence: number
}

interface SearchFilter {
  id: string
  name: string
  type: 'text' | 'date' | 'number' | 'select' | 'multiselect' | 'range' | 'boolean'
  field: string
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'between' | 'in' | 'not_in'
  value: any
  isActive: boolean
}

interface SearchQuery {
  id: string
  text: string
  filters: SearchFilter[]
  sortBy: 'relevance' | 'date' | 'name' | 'page' | 'access_count'
  sortOrder: 'asc' | 'desc'
  searchType: 'simple' | 'advanced' | 'semantic' | 'fuzzy'
  options: {
    caseSensitive: boolean
    wholeWords: boolean
    regex: boolean
    includeAnnotations: boolean
    includeComments: boolean
    includeMetadata: boolean
    includeOCR: boolean
    includeFormFields: boolean
    maxResults: number
    threshold: number
  }
  createdAt: Date
  lastUsed: Date
  useCount: number
  isSaved: boolean
  tags: string[]
}

interface SearchIndex {
  id: string
  name: string
  description: string
  type: 'full_text' | 'semantic' | 'metadata' | 'custom'
  status: 'building' | 'ready' | 'updating' | 'error'
  progress: number
  documents: number
  size: number
  lastUpdated: Date
  settings: {
    language: string
    stemming: boolean
    stopWords: boolean
    synonyms: boolean
    fuzzyMatching: boolean
    semanticSearch: boolean
    ocrEnabled: boolean
    updateFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'manual'
  }
  statistics: {
    totalTerms: number
    uniqueTerms: number
    averageDocumentLength: number
    searchesPerDay: number
    averageResponseTime: number
  }
}

interface SearchSuggestion {
  id: string
  text: string
  type: 'query' | 'term' | 'phrase' | 'filter' | 'document'
  score: number
  frequency: number
  category?: string
  metadata?: Record<string, any>
}

interface SearchAnalytics {
  id: string
  period: {
    start: Date
    end: Date
  }
  metrics: {
    totalSearches: number
    uniqueUsers: number
    averageResultsPerSearch: number
    averageResponseTime: number
    clickThroughRate: number
    zeroResultsRate: number
    popularQueries: string[]
    popularFilters: string[]
    popularDocuments: string[]
  }
  trends: {
    searchVolume: { date: Date; count: number }[]
    responseTime: { date: Date; time: number }[]
    satisfaction: { date: Date; score: number }[]
  }
  insights: {
    type: 'trend' | 'anomaly' | 'opportunity'
    title: string
    description: string
    impact: 'low' | 'medium' | 'high'
    recommendation: string
  }[]
}

interface DocumentSearchProps {
  results: SearchResult[]
  queries: SearchQuery[]
  indexes: SearchIndex[]
  suggestions: SearchSuggestion[]
  analytics: SearchAnalytics[]
  onSearch: (query: SearchQuery) => void
  onSaveQuery: (query: SearchQuery) => void
  onDeleteQuery: (queryId: string) => void
  onCreateIndex: (index: Partial<SearchIndex>) => void
  onUpdateIndex: (indexId: string, updates: Partial<SearchIndex>) => void
  onRebuildIndex: (indexId: string) => void
  onDeleteIndex: (indexId: string) => void
  onNavigateToResult: (result: SearchResult) => void
  onExportResults: (format: 'csv' | 'json' | 'pdf') => void
  isActive: boolean
  onClose: () => void
}

const SEARCH_TYPES = [
  {
    id: 'simple',
    name: 'Simple Search',
    description: 'Basic text search with exact matching',
    icon: MagnifyingGlassIcon
  },
  {
    id: 'advanced',
    name: 'Advanced Search',
    description: 'Complex queries with filters and operators',
    icon: AdjustmentsHorizontalIcon
  },
  {
    id: 'semantic',
    name: 'Semantic Search',
    description: 'AI-powered search based on meaning',
    icon: SparklesIcon
  },
  {
    id: 'fuzzy',
    name: 'Fuzzy Search',
    description: 'Tolerant search for typos and variations',
    icon: MagnifyingGlassPlusIcon
  }
]

const RESULT_TYPES = [
  {
    id: 'text',
    name: 'Text Content',
    icon: DocumentTextIcon,
    color: 'text-blue-600 bg-blue-100'
  },
  {
    id: 'annotation',
    name: 'Annotations',
    icon: PencilSquareIcon,
    color: 'text-green-600 bg-green-100'
  },
  {
    id: 'comment',
    name: 'Comments',
    icon: ChatBubbleLeftIcon,
    color: 'text-purple-600 bg-purple-100'
  },
  {
    id: 'metadata',
    name: 'Metadata',
    icon: TagIcon,
    color: 'text-yellow-600 bg-yellow-100'
  },
  {
    id: 'ocr',
    name: 'OCR Text',
    icon: EyeIcon,
    color: 'text-indigo-600 bg-indigo-100'
  },
  {
    id: 'form_field',
    name: 'Form Fields',
    icon: RectangleStackIcon,
    color: 'text-orange-600 bg-orange-100'
  }
]

const SORT_OPTIONS = [
  { id: 'relevance', name: 'Relevance', icon: StarIcon },
  { id: 'date', name: 'Date', icon: CalendarIcon },
  { id: 'name', name: 'Name', icon: DocumentIcon },
  { id: 'page', name: 'Page', icon: DocumentTextIcon },
  { id: 'access_count', name: 'Popularity', icon: ArrowTrendingUpIcon }
]

export default function DocumentSearch({
  results,
  queries,
  indexes,
  suggestions,
  analytics,
  onSearch,
  onSaveQuery,
  onDeleteQuery,
  onCreateIndex,
  onUpdateIndex,
  onRebuildIndex,
  onDeleteIndex,
  onNavigateToResult,
  onExportResults,
  isActive,
  onClose
}: DocumentSearchProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'results' | 'queries' | 'indexes' | 'analytics'>('search')
  const [searchText, setSearchText] = useState('')
  const [searchType, setSearchType] = useState<'simple' | 'advanced' | 'semantic' | 'fuzzy'>('simple')
  const [selectedFilters, setSelectedFilters] = useState<SearchFilter[]>([])
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'name' | 'page' | 'access_count'>('relevance')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [selectedQuery, setSelectedQuery] = useState<SearchQuery | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<SearchIndex | null>(null)
  const [showResultModal, setShowResultModal] = useState(false)
  const [showQueryModal, setShowQueryModal] = useState(false)
  const [showIndexModal, setShowIndexModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [dateFilter, setDateFilter] = useState<string>('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchProgress, setSearchProgress] = useState(0)

  const handleSearch = () => {
    if (!searchText.trim()) return
    
    setIsSearching(true)
    setSearchProgress(0)
    
    const query: SearchQuery = {
      id: Date.now().toString(),
      text: searchText,
      filters: selectedFilters,
      sortBy,
      sortOrder,
      searchType,
      options: {
        caseSensitive: false,
        wholeWords: false,
        regex: false,
        includeAnnotations: true,
        includeComments: true,
        includeMetadata: true,
        includeOCR: true,
        includeFormFields: true,
        maxResults: 100,
        threshold: 0.5
      },
      createdAt: new Date(),
      lastUsed: new Date(),
      useCount: 1,
      isSaved: false,
      tags: []
    }
    
    // Simulate search progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 20
      setSearchProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setIsSearching(false)
        setSearchProgress(0)
        onSearch(query)
        setActiveTab('results')
      }
    }, 200)
  }

  const highlightText = (text: string, highlights: SearchHighlight[]): React.ReactNode => {
    if (!highlights.length) return text
    
    let lastIndex = 0
    const elements: React.ReactNode[] = []
    
    highlights.forEach((highlight, index) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>
            {text.slice(lastIndex, highlight.start)}
          </span>
        )
      }
      
      // Add highlighted text
      elements.push(
        <mark key={`highlight-${index}`} className="bg-yellow-200 px-1 rounded">
          {text.slice(highlight.start, highlight.end)}
        </mark>
      )
      
      lastIndex = highlight.end
    })
    
    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(
        <span key="text-end">
          {text.slice(lastIndex)}
        </span>
      )
    }
    
    return elements
  }

  const renderSearchTab = () => (
    <div className="space-y-6">
      {/* Search Input */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              onClick={handleSearch}
              disabled={!searchText.trim() || isSearching}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching ? (
                <div className="flex items-center space-x-2">
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  <span>Searching... {searchProgress}%</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  <span>Search</span>
                </div>
              )}
            </button>
          </div>
          
          {/* Search Type Selection */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Search Type:</span>
            <div className="flex items-center space-x-2">
              {SEARCH_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSearchType(type.id as any)}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors',
                    searchType === type.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  <type.icon className="w-4 h-4" />
                  <span>{type.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Advanced Options Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              <span>Advanced Options</span>
              <ChevronDownIcon className={cn(
                'w-4 h-4 transition-transform',
                showAdvancedOptions ? 'rotate-180' : ''
              )} />
            </button>
            
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
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
            </div>
          </div>
          
          {/* Advanced Options */}
          {showAdvancedOptions && (
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Types
                  </label>
                  <div className="space-y-2">
                    {RESULT_TYPES.map((type) => (
                      <label key={type.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <type.icon className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{type.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Options
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Case sensitive</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Whole words only</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Regular expressions</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filters
                  </label>
                  <div className="space-y-2">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">All dates</option>
                      <option value="today">Today</option>
                      <option value="week">This week</option>
                      <option value="month">This month</option>
                      <option value="year">This year</option>
                    </select>
                    
                    <input
                      type="text"
                      placeholder="Author"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    
                    <input
                      type="text"
                      placeholder="Tags"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Suggestions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.slice(0, 6).map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => {
                  setSearchText(suggestion.text)
                  handleSearch()
                }}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-600" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{suggestion.text}</p>
                  <p className="text-sm text-gray-600">
                    {suggestion.frequency} searches
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}
      
      {/* Saved Queries */}
      {queries.filter(q => q.isSaved).length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Saved Queries</h3>
            <button
              onClick={() => setActiveTab('queries')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {queries.filter(q => q.isSaved).slice(0, 5).map((query) => (
              <div key={query.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BookmarkIcon className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{query.text}</p>
                    <p className="text-sm text-gray-600">
                      {query.useCount} uses • {query.lastUsed.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSearchText(query.text)
                      setSearchType(query.searchType)
                      setSelectedFilters(query.filters)
                      setSortBy(query.sortBy)
                      setSortOrder(query.sortOrder)
                    }}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Load
                  </button>
                  
                  <button
                    onClick={() => onDeleteQuery(query.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )

  const renderResultsTab = () => (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Search Results ({results.length})
          </h3>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            {RESULT_TYPES.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onExportResults('csv')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Export Results
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
      
      {/* Results List */}
      <div className="space-y-4">
        {results.filter(result => !typeFilter || result.type === typeFilter).map((result) => {
          const typeConfig = RESULT_TYPES.find(t => t.id === result.type)
          const TypeIcon = typeConfig?.icon || DocumentIcon
          
          return (
            <Card key={result.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onNavigateToResult(result)}>
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn('p-2 rounded-lg', typeConfig?.color || 'text-gray-600 bg-gray-100')}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{result.documentName}</h4>
                      <p className="text-sm text-gray-600">Page {result.page}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={cn('text-xs', typeConfig?.color || 'text-gray-600 bg-gray-100')}>
                      {typeConfig?.name || result.type}
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      {Math.round(result.relevanceScore * 100)}% match
                    </Badge>
                  </div>
                </div>
                
                {/* Content */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-900">
                    {highlightText(result.snippet, result.highlights)}
                  </p>
                  
                  {result.context.before && (
                    <p className="text-xs text-gray-500 mt-2">
                      ...{result.context.before}
                    </p>
                  )}
                  
                  {result.context.after && (
                    <p className="text-xs text-gray-500">
                      {result.context.after}...
                    </p>
                  )}
                </div>
                
                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    {result.metadata.author && (
                      <span>Author: {result.metadata.author}</span>
                    )}
                    {result.metadata.createdAt && (
                      <span>Created: {result.metadata.createdAt.toLocaleDateString()}</span>
                    )}
                    {result.metadata.tags && result.metadata.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <TagIcon className="w-3 h-3" />
                        <span>{result.metadata.tags.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span>Accessed {result.accessCount} times</span>
                    <span>•</span>
                    <span>{result.lastAccessed.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      
      {results.length === 0 && (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
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
            <DocumentMagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Document Search</h2>
            <Badge className="bg-blue-100 text-blue-800">
              {results.length} results
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onExportResults('json')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Export Data
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
              { id: 'search', name: 'Search', icon: MagnifyingGlassIcon },
              { id: 'results', name: 'Results', icon: DocumentTextIcon },
              { id: 'queries', name: 'Saved Queries', icon: BookmarkIcon },
              { id: 'indexes', name: 'Search Indexes', icon: ServerIcon },
              { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
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
          {activeTab === 'search' && renderSearchTab()}
          {activeTab === 'results' && renderResultsTab()}
          {activeTab === 'queries' && (
            <div className="text-center py-12">
              <BookmarkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Saved Queries</h3>
              <p className="text-gray-600">Manage your saved search queries</p>
            </div>
          )}
          {activeTab === 'indexes' && (
            <div className="text-center py-12">
              <ServerIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search Indexes</h3>
              <p className="text-gray-600">Manage document search indexes</p>
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search Analytics</h3>
              <p className="text-gray-600">View search usage and performance analytics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}