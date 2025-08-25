'use client'

import React, { useState } from 'react'
import {
  XMarkIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon,
  PresentationChartBarIcon,
  PhotoIcon,
  DocumentIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import { Modal } from '@/components/ui'

interface ExportFormat {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  extension: string
  category: 'document' | 'image' | 'presentation' | 'other'
  quality?: 'low' | 'medium' | 'high'
  supportsPages?: boolean
}

interface ExportSettings {
  format: string
  quality: 'low' | 'medium' | 'high'
  pageRange: 'all' | 'current' | 'range'
  pageStart: number
  pageEnd: number
  includeAnnotations: boolean
  includeFormData: boolean
  optimizeForWeb: boolean
  password?: string
  watermark?: string
}

interface ExportModalProps {
  isVisible: boolean
  onClose: () => void
  onExport: (settings: ExportSettings) => void
  documentName: string
  totalPages: number
  currentPage: number
}

const EXPORT_FORMATS: ExportFormat[] = [
  {
    id: 'pdf',
    name: 'PDF',
    description: 'Portable Document Format',
    icon: DocumentIcon,
    extension: 'pdf',
    category: 'document',
    supportsPages: true
  },
  {
    id: 'docx',
    name: 'Word Document',
    description: 'Microsoft Word format',
    icon: DocumentTextIcon,
    extension: 'docx',
    category: 'document',
    supportsPages: true
  },
  {
    id: 'xlsx',
    name: 'Excel Spreadsheet',
    description: 'Microsoft Excel format',
    icon: TableCellsIcon,
    extension: 'xlsx',
    category: 'document',
    supportsPages: false
  },
  {
    id: 'pptx',
    name: 'PowerPoint',
    description: 'Microsoft PowerPoint format',
    icon: PresentationChartBarIcon,
    extension: 'pptx',
    category: 'presentation',
    supportsPages: true
  },
  {
    id: 'png',
    name: 'PNG Image',
    description: 'Portable Network Graphics',
    icon: PhotoIcon,
    extension: 'png',
    category: 'image',
    quality: 'high',
    supportsPages: true
  },
  {
    id: 'jpg',
    name: 'JPEG Image',
    description: 'Joint Photographic Experts Group',
    icon: PhotoIcon,
    extension: 'jpg',
    category: 'image',
    quality: 'medium',
    supportsPages: true
  },
  {
    id: 'txt',
    name: 'Plain Text',
    description: 'Text file format',
    icon: DocumentTextIcon,
    extension: 'txt',
    category: 'other',
    supportsPages: false
  },
  {
    id: 'html',
    name: 'HTML',
    description: 'HyperText Markup Language',
    icon: DocumentIcon,
    extension: 'html',
    category: 'other',
    supportsPages: false
  }
]

const QUALITY_OPTIONS = [
  { value: 'low', label: 'Low (Smaller file)', description: 'Optimized for file size' },
  { value: 'medium', label: 'Medium (Balanced)', description: 'Good balance of quality and size' },
  { value: 'high', label: 'High (Best quality)', description: 'Maximum quality, larger file' }
] as const

export const ExportModal: React.FC<ExportModalProps> = ({
  isVisible,
  onClose,
  onExport,
  documentName,
  totalPages,
  currentPage
}) => {
  const [selectedFormat, setSelectedFormat] = useState<string>('pdf')
  const [settings, setSettings] = useState<ExportSettings>({
    format: 'pdf',
    quality: 'medium',
    pageRange: 'all',
    pageStart: 1,
    pageEnd: totalPages,
    includeAnnotations: true,
    includeFormData: true,
    optimizeForWeb: false
  })
  const [showAdvanced, setShowAdvanced] = useState(false)

  const selectedFormatData = EXPORT_FORMATS.find(f => f.id === selectedFormat)

  const handleFormatChange = (formatId: string) => {
    const format = EXPORT_FORMATS.find(f => f.id === formatId)
    if (!format) return

    setSelectedFormat(formatId)
    setSettings(prev => ({
      ...prev,
      format: formatId,
      quality: format.quality || 'medium',
      pageRange: format.supportsPages ? prev.pageRange : 'all'
    }))
  }

  const handleSettingChange = <K extends keyof ExportSettings>(
    key: K,
    value: ExportSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleExport = () => {
    onExport(settings)
    onClose()
  }

  const getFileName = () => {
    const baseName = documentName.replace(/\.[^/.]+$/, '')
    const extension = selectedFormatData?.extension || 'pdf'
    return `${baseName}.${extension}`
  }

  const groupedFormats = EXPORT_FORMATS.reduce((acc, format) => {
    if (!acc[format.category]) {
      acc[format.category] = []
    }
    acc[format.category].push(format)
    return acc
  }, {} as Record<string, ExportFormat[]>)

  if (!isVisible) return null

  return (
    <Modal isOpen={isVisible} onClose={onClose} className="max-w-4xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Export Document</h2>
            <p className="text-sm text-neutral-600 mt-1">
              Export "{documentName}" to various formats
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm text-neutral-500 hover:text-neutral-700"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Format Selection */}
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Choose Format</h3>
            
            {Object.entries(groupedFormats).map(([category, formats]) => (
              <div key={category} className="mb-6">
                <h4 className="text-sm font-medium text-neutral-700 mb-3 capitalize">
                  {category === 'other' ? 'Other Formats' : `${category} Formats`}
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {formats.map(format => {
                    const Icon = format.icon
                    return (
                      <button
                        key={format.id}
                        onClick={() => handleFormatChange(format.id)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          selectedFormat === format.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-6 h-6 text-neutral-600" />
                          <div>
                            <div className="font-medium text-neutral-900">{format.name}</div>
                            <div className="text-sm text-neutral-600">{format.description}</div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Export Settings */}
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-4">Export Settings</h3>
            
            <div className="space-y-4">
              {/* File Name Preview */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  File Name
                </label>
                <div className="p-2 bg-neutral-50 rounded border text-sm text-neutral-600">
                  {getFileName()}
                </div>
              </div>

              {/* Quality Settings */}
              {selectedFormatData?.category === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Quality
                  </label>
                  <div className="space-y-2">
                    {QUALITY_OPTIONS.map(option => (
                      <label key={option.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="quality"
                          value={option.value}
                          checked={settings.quality === option.value}
                          onChange={(e) => handleSettingChange('quality', e.target.value as any)}
                          className="radio"
                        />
                        <div>
                          <div className="text-sm font-medium text-neutral-900">{option.label}</div>
                          <div className="text-xs text-neutral-600">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Page Range */}
              {selectedFormatData?.supportsPages && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Page Range
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="pageRange"
                        value="all"
                        checked={settings.pageRange === 'all'}
                        onChange={(e) => handleSettingChange('pageRange', e.target.value as any)}
                        className="radio"
                      />
                      <span className="text-sm">All pages ({totalPages} pages)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="pageRange"
                        value="current"
                        checked={settings.pageRange === 'current'}
                        onChange={(e) => handleSettingChange('pageRange', e.target.value as any)}
                        className="radio"
                      />
                      <span className="text-sm">Current page ({currentPage})</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="pageRange"
                        value="range"
                        checked={settings.pageRange === 'range'}
                        onChange={(e) => handleSettingChange('pageRange', e.target.value as any)}
                        className="radio"
                      />
                      <span className="text-sm">Page range</span>
                    </label>
                    {settings.pageRange === 'range' && (
                      <div className="ml-6 flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={settings.pageStart}
                          onChange={(e) => handleSettingChange('pageStart', parseInt(e.target.value) || 1)}
                          className="input input-sm w-20"
                        />
                        <span className="text-sm text-neutral-600">to</span>
                        <input
                          type="number"
                          min={settings.pageStart}
                          max={totalPages}
                          value={settings.pageEnd}
                          onChange={(e) => handleSettingChange('pageEnd', parseInt(e.target.value) || totalPages)}
                          className="input input-sm w-20"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Advanced Settings */}
              <div>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  <CogIcon className="w-4 h-4" />
                  <span>Advanced Settings</span>
                </button>
                
                {showAdvanced && (
                  <div className="mt-3 space-y-3 p-3 bg-neutral-50 rounded">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.includeAnnotations}
                        onChange={(e) => handleSettingChange('includeAnnotations', e.target.checked)}
                        className="checkbox"
                      />
                      <span className="text-sm">Include annotations</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.includeFormData}
                        onChange={(e) => handleSettingChange('includeFormData', e.target.checked)}
                        className="checkbox"
                      />
                      <span className="text-sm">Include form data</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.optimizeForWeb}
                        onChange={(e) => handleSettingChange('optimizeForWeb', e.target.checked)}
                        className="checkbox"
                      />
                      <span className="text-sm">Optimize for web</span>
                    </label>
                    
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">
                        Password Protection (optional)
                      </label>
                      <input
                        type="password"
                        placeholder="Enter password"
                        value={settings.password || ''}
                        onChange={(e) => handleSettingChange('password', e.target.value || undefined)}
                        className="input input-sm w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-neutral-600 mb-1">
                        Watermark Text (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Enter watermark text"
                        value={settings.watermark || ''}
                        onChange={(e) => handleSettingChange('watermark', e.target.value || undefined)}
                        className="input input-sm w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200">
          <div className="text-sm text-neutral-600">
            Export format: <span className="font-medium">{selectedFormatData?.name}</span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              className="btn btn-primary"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ExportModal