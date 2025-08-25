'use client'

import React, { useState, useEffect } from 'react'
import { Card, Badge } from '@/components/ui'
import {
  CpuChipIcon,
  DocumentTextIcon,
  EyeIcon,
  LanguageIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  DocumentMagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
  LanguageIcon as TranslateIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  LightBulbIcon,
  BookOpenIcon,
  TagIcon,
  FolderIcon,
  UserIcon,
  CalendarIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  BeakerIcon,
  RocketLaunchIcon,
  FireIcon,
  BoltIcon,
  StarIcon,
  HeartIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  DocumentArrowUpIcon,
  CloudArrowUpIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ListBulletIcon,
  TableCellsIcon,
  PhotoIcon,
  FilmIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  CommandLineIcon,
  CubeIcon,
  PuzzlePieceIcon,
  WrenchScrewdriverIcon,
  BugAntIcon,
  ShieldExclamationIcon,
  LockClosedIcon,
  KeyIcon,
  FingerPrintIcon,
  EyeSlashIcon,
  NoSymbolIcon,
  ExclamationTriangleIcon as ExclamationIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface AIProcessingTask {
  id: string
  type: 'ocr' | 'extraction' | 'analysis' | 'translation' | 'summarization' | 'classification' | 'sentiment' | 'entities' | 'keywords' | 'qa' | 'generation'
  name: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  progress: number
  startTime: Date
  endTime?: Date
  duration?: number
  input: {
    documentId: string
    pages?: number[]
    language?: string
    options?: Record<string, any>
  }
  output?: {
    text?: string
    data?: any
    confidence?: number
    metadata?: Record<string, any>
  }
  error?: string
  model: string
  cost?: number
  tokens?: {
    input: number
    output: number
  }
}

interface OCRResult {
  text: string
  confidence: number
  language: string
  blocks: TextBlock[]
  words: Word[]
  lines: TextLine[]
  metadata: {
    pageNumber: number
    orientation: number
    skew: number
    resolution: { width: number; height: number }
  }
}

interface TextBlock {
  id: string
  text: string
  confidence: number
  boundingBox: BoundingBox
  type: 'paragraph' | 'heading' | 'list' | 'table' | 'image_caption'
}

interface Word {
  text: string
  confidence: number
  boundingBox: BoundingBox
  language?: string
}

interface TextLine {
  text: string
  confidence: number
  boundingBox: BoundingBox
  words: Word[]
}

interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

interface DocumentAnalysis {
  summary: string
  keyPoints: string[]
  topics: Topic[]
  entities: Entity[]
  sentiment: SentimentAnalysis
  language: LanguageDetection
  classification: DocumentClassification
  readability: ReadabilityScore
  structure: DocumentStructure
  metadata: AnalysisMetadata
}

interface Topic {
  name: string
  confidence: number
  keywords: string[]
  relevance: number
}

interface Entity {
  text: string
  type: 'person' | 'organization' | 'location' | 'date' | 'money' | 'email' | 'phone' | 'url' | 'custom'
  confidence: number
  startOffset: number
  endOffset: number
  metadata?: Record<string, any>
}

interface SentimentAnalysis {
  overall: 'positive' | 'negative' | 'neutral' | 'mixed'
  confidence: number
  scores: {
    positive: number
    negative: number
    neutral: number
  }
  emotions?: {
    joy: number
    sadness: number
    anger: number
    fear: number
    surprise: number
    disgust: number
  }
}

interface LanguageDetection {
  primary: string
  confidence: number
  alternatives: { language: string; confidence: number }[]
}

interface DocumentClassification {
  category: string
  confidence: number
  subcategories: { name: string; confidence: number }[]
  tags: string[]
}

interface ReadabilityScore {
  fleschKincaid: number
  fleschReading: number
  gunningFog: number
  smog: number
  automatedReadability: number
  colemanLiau: number
  grade: string
  description: string
}

interface DocumentStructure {
  sections: DocumentSection[]
  headings: Heading[]
  tables: TableInfo[]
  images: ImageInfo[]
  lists: ListInfo[]
  footnotes: FootnoteInfo[]
}

interface DocumentSection {
  title: string
  level: number
  startPage: number
  endPage: number
  wordCount: number
  summary: string
}

interface Heading {
  text: string
  level: number
  page: number
  position: BoundingBox
}

interface TableInfo {
  id: string
  page: number
  position: BoundingBox
  rows: number
  columns: number
  caption?: string
  data?: any[][]
}

interface ImageInfo {
  id: string
  page: number
  position: BoundingBox
  type: 'photo' | 'diagram' | 'chart' | 'logo' | 'signature'
  caption?: string
  description?: string
}

interface ListInfo {
  type: 'ordered' | 'unordered'
  items: string[]
  page: number
  position: BoundingBox
}

interface FootnoteInfo {
  id: string
  text: string
  page: number
  reference: string
}

interface AnalysisMetadata {
  processingTime: number
  model: string
  version: string
  confidence: number
  wordCount: number
  characterCount: number
  pageCount: number
  language: string
}

interface TranslationResult {
  originalText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  confidence: number
  model: string
  alternatives?: string[]
  metadata: {
    wordCount: number
    characterCount: number
    processingTime: number
  }
}

interface QAResult {
  question: string
  answer: string
  confidence: number
  context: string
  sources: {
    page: number
    text: string
    relevance: number
  }[]
  metadata: {
    model: string
    processingTime: number
  }
}

interface AIModel {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'google' | 'azure' | 'aws' | 'huggingface' | 'custom'
  type: 'language' | 'vision' | 'multimodal' | 'specialized'
  capabilities: string[]
  languages: string[]
  maxTokens: number
  costPer1kTokens: {
    input: number
    output: number
  }
  latency: 'low' | 'medium' | 'high'
  accuracy: 'low' | 'medium' | 'high' | 'very_high'
  description: string
}

interface AIDocumentProcessorProps {
  documentId: string
  tasks: AIProcessingTask[]
  models: AIModel[]
  onTaskCreate: (task: Partial<AIProcessingTask>) => void
  onTaskCancel: (taskId: string) => void
  onTaskRetry: (taskId: string) => void
  onTaskDelete: (taskId: string) => void
  onModelChange: (taskType: string, modelId: string) => void
  onExportResults: (taskId: string, format: 'json' | 'csv' | 'txt' | 'pdf') => void
  isActive: boolean
  onClose: () => void
}

const TASK_TYPES = [
  {
    id: 'ocr',
    name: 'OCR (Text Recognition)',
    description: 'Extract text from images and scanned documents',
    icon: EyeIcon,
    color: 'text-blue-600 bg-blue-100',
    models: ['tesseract', 'google-vision', 'azure-ocr', 'aws-textract']
  },
  {
    id: 'extraction',
    name: 'Data Extraction',
    description: 'Extract structured data, forms, and key information',
    icon: DocumentTextIcon,
    color: 'text-green-600 bg-green-100',
    models: ['gpt-4', 'claude-3', 'form-recognizer']
  },
  {
    id: 'analysis',
    name: 'Document Analysis',
    description: 'Comprehensive analysis including structure, topics, and insights',
    icon: DocumentMagnifyingGlassIcon,
    color: 'text-purple-600 bg-purple-100',
    models: ['gpt-4', 'claude-3', 'palm-2']
  },
  {
    id: 'translation',
    name: 'Translation',
    description: 'Translate document content to different languages',
    icon: TranslateIcon,
    color: 'text-orange-600 bg-orange-100',
    models: ['gpt-4', 'google-translate', 'azure-translator']
  },
  {
    id: 'summarization',
    name: 'Summarization',
    description: 'Generate concise summaries and key points',
    icon: ClipboardDocumentListIcon,
    color: 'text-indigo-600 bg-indigo-100',
    models: ['gpt-4', 'claude-3', 'bart-large']
  },
  {
    id: 'classification',
    name: 'Classification',
    description: 'Categorize and tag documents automatically',
    icon: TagIcon,
    color: 'text-pink-600 bg-pink-100',
    models: ['bert', 'roberta', 'distilbert']
  },
  {
    id: 'sentiment',
    name: 'Sentiment Analysis',
    description: 'Analyze emotional tone and sentiment',
    icon: HeartIcon,
    color: 'text-red-600 bg-red-100',
    models: ['vader', 'textblob', 'bert-sentiment']
  },
  {
    id: 'entities',
    name: 'Entity Recognition',
    description: 'Identify people, places, organizations, and other entities',
    icon: UserIcon,
    color: 'text-teal-600 bg-teal-100',
    models: ['spacy', 'stanford-ner', 'azure-ner']
  },
  {
    id: 'keywords',
    name: 'Keyword Extraction',
    description: 'Extract important keywords and phrases',
    icon: MagnifyingGlassIcon,
    color: 'text-yellow-600 bg-yellow-100',
    models: ['yake', 'rake', 'textrank']
  },
  {
    id: 'qa',
    name: 'Question Answering',
    description: 'Answer questions about document content',
    icon: ChatBubbleLeftRightIcon,
    color: 'text-cyan-600 bg-cyan-100',
    models: ['gpt-4', 'claude-3', 'bert-qa']
  },
  {
    id: 'generation',
    name: 'Content Generation',
    description: 'Generate new content based on document context',
    icon: SparklesIcon,
    color: 'text-violet-600 bg-violet-100',
    models: ['gpt-4', 'claude-3', 'palm-2']
  }
]

const STATUS_CONFIG = {
  pending: { color: 'text-gray-600 bg-gray-100', icon: ClockIcon },
  processing: { color: 'text-blue-600 bg-blue-100', icon: ArrowPathIcon },
  completed: { color: 'text-green-600 bg-green-100', icon: CheckCircleIcon },
  failed: { color: 'text-red-600 bg-red-100', icon: XCircleIcon },
  cancelled: { color: 'text-orange-600 bg-orange-100', icon: StopIcon }
}

export default function AIDocumentProcessor({
  documentId,
  tasks,
  models,
  onTaskCreate,
  onTaskCancel,
  onTaskRetry,
  onTaskDelete,
  onModelChange,
  onExportResults,
  isActive,
  onClose
}: AIDocumentProcessorProps) {
  const [activeTab, setActiveTab] = useState<'tasks' | 'results' | 'models' | 'analytics'>('tasks')
  const [selectedTask, setSelectedTask] = useState<AIProcessingTask | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [newTaskType, setNewTaskType] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set())

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  const formatCost = (cost: number): string => {
    return `$${cost.toFixed(4)}`
  }

  const getTaskTypeConfig = (type: string) => {
    return TASK_TYPES.find(t => t.id === type) || TASK_TYPES[0]
  }

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false
    if (filterType !== 'all' && task.type !== filterType) return false
    if (searchQuery && !task.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const completedTasks = tasks.filter(task => task.status === 'completed')
  const processingTasks = tasks.filter(task => task.status === 'processing')
  const failedTasks = tasks.filter(task => task.status === 'failed')

  const totalCost = tasks.reduce((sum, task) => sum + (task.cost || 0), 0)
  const totalTokens = tasks.reduce((sum, task) => {
    if (task.tokens) {
      return sum + task.tokens.input + task.tokens.output
    }
    return sum
  }, 0)

  const toggleResultExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedResults)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedResults(newExpanded)
  }

  const renderTasksList = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            {TASK_TYPES.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <button
          onClick={() => setShowTaskModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClockIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-lg font-semibold text-gray-900">{processingTasks.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-lg font-semibold text-gray-900">{completedTasks.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircleIcon className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-lg font-semibold text-gray-900">{failedTasks.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CpuChipIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-lg font-semibold text-gray-900">{formatCost(totalCost)}</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const typeConfig = getTaskTypeConfig(task.type)
          const statusConfig = STATUS_CONFIG[task.status]
          const TypeIcon = typeConfig.icon
          const StatusIcon = statusConfig.icon
          
          return (
            <Card key={task.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={cn('p-2 rounded-lg', typeConfig.color)}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{task.name}</h4>
                      <Badge className={cn('text-xs', statusConfig.color)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {task.status}
                      </Badge>
                      {task.status === 'processing' && (
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          {task.progress}%
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Model:</span>
                        <p className="text-gray-900">{task.model}</p>
                      </div>
                      
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <p className="text-gray-900">
                          {task.duration ? formatDuration(task.duration) : 'N/A'}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-gray-600">Cost:</span>
                        <p className="text-gray-900">
                          {task.cost ? formatCost(task.cost) : 'N/A'}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-gray-600">Tokens:</span>
                        <p className="text-gray-900">
                          {task.tokens ? (task.tokens.input + task.tokens.output).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    {task.status === 'processing' && (
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {task.error && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <ExclamationCircleIcon className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-800">Error</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">{task.error}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {task.status === 'completed' && (
                    <button
                      onClick={() => {
                        setSelectedTask(task)
                        setShowResultModal(true)
                      }}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      View Results
                    </button>
                  )}
                  
                  {task.status === 'processing' && (
                    <button
                      onClick={() => onTaskCancel(task.id)}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  
                  {task.status === 'failed' && (
                    <button
                      onClick={() => onTaskRetry(task.id)}
                      className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Retry
                    </button>
                  )}
                  
                  <button
                    onClick={() => onTaskDelete(task.id)}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderResults = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Processing Results</h3>
      
      <div className="space-y-3">
        {completedTasks.map((task) => {
          const typeConfig = getTaskTypeConfig(task.type)
          const TypeIcon = typeConfig.icon
          const isExpanded = expandedResults.has(task.id)
          
          return (
            <Card key={task.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={cn('p-2 rounded-lg', typeConfig.color)}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{task.name}</h4>
                    <p className="text-sm text-gray-500">{typeConfig.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleResultExpansion(task.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => onExportResults(task.id, 'json')}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Export
                  </button>
                </div>
              </div>
              
              {isExpanded && task.output && (
                <div className="mt-4 space-y-4">
                  {task.type === 'ocr' && task.output.text && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Extracted Text</h5>
                      <div className="p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{task.output.text}</p>
                      </div>
                      {task.output.confidence && (
                        <p className="text-sm text-gray-600 mt-2">
                          Confidence: {Math.round(task.output.confidence * 100)}%
                        </p>
                      )}
                    </div>
                  )}
                  
                  {task.type === 'analysis' && task.output.data && (
                    <div className="space-y-3">
                      {task.output.data.summary && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Summary</h5>
                          <p className="text-sm text-gray-700">{task.output.data.summary}</p>
                        </div>
                      )}
                      
                      {task.output.data.keyPoints && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Key Points</h5>
                          <ul className="list-disc list-inside space-y-1">
                            {task.output.data.keyPoints.map((point: string, index: number) => (
                              <li key={index} className="text-sm text-gray-700">{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {task.output.data.entities && (
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Entities</h5>
                          <div className="flex flex-wrap gap-2">
                            {task.output.data.entities.slice(0, 10).map((entity: Entity, index: number) => (
                              <Badge key={index} className="bg-purple-100 text-purple-700 text-xs">
                                {entity.text} ({entity.type})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {task.type === 'translation' && task.output.data && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Translation</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="text-sm font-medium text-gray-700 mb-1">Original ({task.output.data.sourceLanguage})</h6>
                          <div className="p-3 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                            <p className="text-sm text-gray-700">{task.output.data.originalText}</p>
                          </div>
                        </div>
                        <div>
                          <h6 className="text-sm font-medium text-gray-700 mb-1">Translated ({task.output.data.targetLanguage})</h6>
                          <div className="p-3 bg-blue-50 rounded-lg max-h-32 overflow-y-auto">
                            <p className="text-sm text-gray-700">{task.output.data.translatedText}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Confidence: {Math.round(task.output.data.confidence * 100)}%
                      </p>
                    </div>
                  )}
                  
                  {task.type === 'sentiment' && task.output.data && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Sentiment Analysis</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Overall Sentiment</p>
                          <Badge className={cn(
                            'text-sm',
                            task.output.data.overall === 'positive' ? 'bg-green-100 text-green-700' :
                            task.output.data.overall === 'negative' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          )}>
                            {task.output.data.overall}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Confidence</p>
                          <p className="text-sm font-medium text-gray-900">
                            {Math.round(task.output.data.confidence * 100)}%
                          </p>
                        </div>
                      </div>
                      
                      {task.output.data.scores && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">Score Breakdown</p>
                          <div className="space-y-2">
                            {Object.entries(task.output.data.scores).map(([emotion, score]) => (
                              <div key={emotion} className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 capitalize">{emotion}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${(score as number) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-gray-600 w-10">
                                    {Math.round((score as number) * 100)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderModels = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">AI Models</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <Card key={model.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{model.name}</h4>
                <p className="text-sm text-gray-500 capitalize">{model.provider}</p>
              </div>
              
              <Badge className={cn(
                'text-xs',
                model.accuracy === 'very_high' ? 'bg-green-100 text-green-700' :
                model.accuracy === 'high' ? 'bg-blue-100 text-blue-700' :
                model.accuracy === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              )}>
                {model.accuracy.replace('_', ' ')}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{model.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Type:</span>
                <span className="text-gray-900 capitalize">{model.type}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Max Tokens:</span>
                <span className="text-gray-900">{model.maxTokens.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Cost (1K tokens):</span>
                <span className="text-gray-900">
                  ${model.costPer1kTokens.input.toFixed(4)} / ${model.costPer1kTokens.output.toFixed(4)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Latency:</span>
                <Badge className={cn(
                  'text-xs',
                  model.latency === 'low' ? 'bg-green-100 text-green-700' :
                  model.latency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                )}>
                  {model.latency}
                </Badge>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Capabilities</p>
              <div className="flex flex-wrap gap-1">
                {model.capabilities.slice(0, 3).map((capability) => (
                  <Badge key={capability} className="bg-blue-100 text-blue-700 text-xs">
                    {capability}
                  </Badge>
                ))}
                {model.capabilities.length > 3 && (
                  <Badge className="bg-gray-100 text-gray-600 text-xs">
                    +{model.capabilities.length - 3}
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Languages</p>
              <div className="flex flex-wrap gap-1">
                {model.languages.slice(0, 4).map((language) => (
                  <Badge key={language} className="bg-gray-100 text-gray-700 text-xs">
                    {language}
                  </Badge>
                ))}
                {model.languages.length > 4 && (
                  <Badge className="bg-gray-100 text-gray-600 text-xs">
                    +{model.languages.length - 4}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Analytics & Insights</h3>
      
      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CpuChipIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CpuChipIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Tokens</p>
              <p className="text-2xl font-bold text-gray-900">{totalTokens.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Task Type Distribution */}
      <Card className="p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Task Type Distribution</h4>
        <div className="space-y-3">
          {TASK_TYPES.map((type) => {
            const count = tasks.filter(task => task.type === type.id).length
            const percentage = tasks.length > 0 ? (count / tasks.length) * 100 : 0
            
            return (
              <div key={type.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn('p-1 rounded', type.color)}>
                    <type.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-gray-700">{type.name}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
      
      {/* Cost Analysis */}
      <Card className="p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Cost Analysis</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Cost</span>
            <span className="text-lg font-semibold text-gray-900">{formatCost(totalCost)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Average Cost per Task</span>
            <span className="text-sm text-gray-900">
              {tasks.length > 0 ? formatCost(totalCost / tasks.length) : '$0.0000'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Cost per Token</span>
            <span className="text-sm text-gray-900">
              {totalTokens > 0 ? `$${(totalCost / totalTokens).toFixed(6)}` : '$0.000000'}
            </span>
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
            <CpuChipIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">AI Document Processor</h2>
            <Badge className="bg-blue-100 text-blue-800">
              {processingTasks.length} processing
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
              { id: 'tasks', name: 'Tasks', icon: ListBulletIcon },
              { id: 'results', name: 'Results', icon: DocumentTextIcon },
              { id: 'models', name: 'Models', icon: CpuChipIcon },
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
          {activeTab === 'tasks' && renderTasksList()}
          {activeTab === 'results' && renderResults()}
          {activeTab === 'models' && renderModels()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>
    </div>
  )
}