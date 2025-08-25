'use client'

import { useState } from 'react'
import { useUI } from '@/store/ui-store'
import { usePDF } from '@/store/pdf-store'
import {
  XMarkIcon,
  DocumentIcon,
  CalculatorIcon,
  EyeIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

interface BatesSettings {
  prefix: string
  suffix: string
  startNumber: number
  digits: number
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  fontSize: number
  fontColor: string
  backgroundColor: string
  opacity: number
  margin: number
}

interface BatesFile {
  id: string
  name: string
  path: string
  pages: number
  size: string
  file: File
  arrayBuffer?: ArrayBuffer
}

export default function BatesModal() {
  const { state: uiState, dispatch: uiDispatch } = useUI()
  const { dispatch: pdfDispatch } = usePDF()
  const [files, setFiles] = useState<BatesFile[]>([])
  const [settings, setSettings] = useState<BatesSettings>({
    prefix: 'BATES',
    suffix: '',
    startNumber: 1,
    digits: 6,
    position: 'bottom-right',
    fontSize: 10,
    fontColor: '#000000',
    backgroundColor: '#ffffff',
    opacity: 0.8,
    margin: 20
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  if (!uiState.modals.bates) return null

  const closeModal = () => {
    uiDispatch({ type: 'CLOSE_MODAL', payload: 'bates' })
    setFiles([])
    setSettings({
      prefix: 'BATES',
      suffix: '',
      startNumber: 1,
      digits: 6,
      position: 'bottom-right',
      fontSize: 10,
      fontColor: '#000000',
      backgroundColor: '#ffffff',
      opacity: 0.8,
      margin: 20
    })
  }

  const onDrop = async (acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length !== acceptedFiles.length) {
      toast.error('Only PDF files are allowed')
    }

    const newFiles: (BatesFile | null)[] = await Promise.all(
      pdfFiles.map(async (file) => {
        try {
          const arrayBuffer = await file.arrayBuffer()
          // TODO: Get actual page count from PDF
          const pageCount = Math.floor(Math.random() * 50) + 10 // Placeholder
          
          return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            path: file.name,
            pages: pageCount,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            file: file,
            arrayBuffer: arrayBuffer
          }
        } catch (error) {
          toast.error(`Failed to load ${file.name}`)
          return null
        }
      })
    )

    const validFiles = newFiles.filter((file): file is BatesFile => file !== null)
    setFiles(prev => [...prev, ...validFiles])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  })

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  const moveFile = (id: string, direction: 'up' | 'down') => {
    setFiles(prev => {
      const index = prev.findIndex(file => file.id === id)
      if (index === -1) return prev
      
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev
      
      const newFiles = [...prev]
      const [movedFile] = newFiles.splice(index, 1)
      newFiles.splice(newIndex, 0, movedFile)
      return newFiles
    })
  }

  const updateSetting = <K extends keyof BatesSettings>(key: K, value: BatesSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const formatBatesNumber = (number: number) => {
    const paddedNumber = number.toString().padStart(settings.digits, '0')
    return `${settings.prefix}${paddedNumber}${settings.suffix}`
  }

  const getTotalPages = () => {
    return files.reduce((sum, file) => sum + file.pages, 0)
  }

  const getPreviewNumbers = () => {
    const totalPages = getTotalPages()
    const firstNumber = formatBatesNumber(settings.startNumber)
    const lastNumber = formatBatesNumber(settings.startNumber + totalPages - 1)
    return { firstNumber, lastNumber, totalPages }
  }

  const handleApplyBates = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one PDF file')
      return
    }

    setIsProcessing(true)
    
    try {
      // TODO: Implement actual Bates numbering logic
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing
      
      toast.success('Bates numbering applied successfully!')
      closeModal()
    } catch (error) {
      console.error('Error applying Bates numbering:', error)
      toast.error('Failed to apply Bates numbering')
    } finally {
      setIsProcessing(false)
    }
  }

  const { firstNumber, lastNumber, totalPages } = getPreviewNumbers()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <CalculatorIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Bates Numbering</h2>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel - Files */}
          <div className="w-1/2 border-r border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
            
            {/* Drop Zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors mb-4 ${isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <DocumentIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                {isDragActive ? 'Drop PDF files here' : 'Add PDF files'}
              </p>
              <p className="text-xs text-gray-600">
                Drag & drop or click to browse
              </p>
            </div>

            {/* Files List */}
            {files.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                        <DocumentIcon className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-600">
                          {file.pages} pages • {file.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => moveFile(file.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveFile(file.id, 'down')}
                        disabled={index === files.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {files.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>{files.length}</strong> files • <strong>{totalPages}</strong> total pages
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Numbers: {firstNumber} to {lastNumber}
                </p>
              </div>
            )}
          </div>

          {/* Right Panel - Settings */}
          <div className="w-1/2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Settings</h3>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Cog6ToothIcon className="w-4 h-4" />
                <span>{showAdvanced ? 'Basic' : 'Advanced'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Basic Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prefix
                  </label>
                  <input
                    type="text"
                    value={settings.prefix}
                    onChange={(e) => updateSetting('prefix', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="BATES"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suffix
                  </label>
                  <input
                    type="text"
                    value={settings.suffix}
                    onChange={(e) => updateSetting('suffix', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Number
                  </label>
                  <input
                    type="number"
                    value={settings.startNumber}
                    onChange={(e) => updateSetting('startNumber', parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Digits
                  </label>
                  <select
                    value={settings.digits}
                    onChange={(e) => updateSetting('digits', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={3}>3 digits</option>
                    <option value={4}>4 digits</option>
                    <option value={5}>5 digits</option>
                    <option value={6}>6 digits</option>
                    <option value={7}>7 digits</option>
                    <option value={8}>8 digits</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <select
                  value={settings.position}
                  onChange={(e) => updateSetting('position', e.target.value as BatesSettings['position'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>

              {/* Advanced Settings */}
              {showAdvanced && (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Appearance</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Font Size
                        </label>
                        <input
                          type="number"
                          value={settings.fontSize}
                          onChange={(e) => updateSetting('fontSize', parseInt(e.target.value) || 10)}
                          min="6"
                          max="24"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Margin
                        </label>
                        <input
                          type="number"
                          value={settings.margin}
                          onChange={(e) => updateSetting('margin', parseInt(e.target.value) || 20)}
                          min="0"
                          max="100"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Text Color
                        </label>
                        <input
                          type="color"
                          value={settings.fontColor}
                          onChange={(e) => updateSetting('fontColor', e.target.value)}
                          className="w-full h-10 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Background
                        </label>
                        <input
                          type="color"
                          value={settings.backgroundColor}
                          onChange={(e) => updateSetting('backgroundColor', e.target.value)}
                          className="w-full h-10 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Opacity: {Math.round(settings.opacity * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={settings.opacity}
                        onChange={(e) => updateSetting('opacity', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Preview */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                <div className="p-3 bg-gray-100 rounded-lg text-center">
                  <div
                    className="inline-block px-2 py-1 rounded text-sm"
                    style={{
                      fontSize: `${settings.fontSize}px`,
                      color: settings.fontColor,
                      backgroundColor: settings.backgroundColor,
                      opacity: settings.opacity
                    }}
                  >
                    {formatBatesNumber(settings.startNumber)}
                  </div>
                </div>
                {files.length > 0 && (
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    Range: {firstNumber} - {lastNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isProcessing ? (
                <span>Processing Bates numbering...</span>
              ) : files.length > 0 ? (
                <span>
                  Ready to apply Bates numbering to {files.length} file(s) ({totalPages} pages)
                </span>
              ) : (
                <span>Select PDF files to apply Bates numbering</span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyBates}
                disabled={files.length === 0 || isProcessing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Apply Bates Numbering'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}