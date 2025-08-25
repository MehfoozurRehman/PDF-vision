'use client'

import { useState } from 'react'
import { useUI } from '@/store/ui-store'
import { usePDF } from '@/store/pdf-store'
import {
  XMarkIcon,
  DocumentIcon,
  PlusIcon,
  ScissorsIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { useStirlingAPI } from '@/hooks/useStirlingAPI'
import { SplitOptions } from '@/api/types'

interface SplitRange {
  id: string
  name: string
  startPage: number
  endPage: number
}

export default function SplitModal() {
  const { state: uiState, dispatch: uiDispatch } = useUI()
  const { dispatch: pdfDispatch } = usePDF()
  const { state: apiState, operations } = useStirlingAPI()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  const [splitRanges, setSplitRanges] = useState<SplitRange[]>([])
  const [splitMode, setSplitMode] = useState<'pages' | 'ranges' | 'extract'>('pages')
  const [pagesPerSplit, setPagesPerSplit] = useState(1)
  const [extractPages, setExtractPages] = useState('')

  if (!uiState.modals.split) return null

  const closeModal = () => {
    uiDispatch({ type: 'CLOSE_MODAL', payload: 'split' })
  }

  const parsePageNumbers = (input: string, maxPages: number): number[] => {
    const pages: number[] = []
    const parts = input.split(',').map(part => part.trim())
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(num => parseInt(num.trim()))
        if (start && end && start <= end && start >= 1 && end <= maxPages) {
          for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i)
          }
        }
      } else {
        const pageNum = parseInt(part)
        if (pageNum && pageNum >= 1 && pageNum <= maxPages && !pages.includes(pageNum)) {
          pages.push(pageNum)
        }
      }
    }
    
    return pages.sort((a, b) => a - b)
  }

  const onDrop = async (acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf')
    
    if (!pdfFile) {
      toast.error('Please select a PDF file')
      return
    }

    if (acceptedFiles.length > 1) {
      toast.error('Please select only one PDF file')
      return
    }

    setSelectedFile(pdfFile)
    
    try {
      const pdfInfo = await operations.getPDFInfo(pdfFile)
      setTotalPages(pdfInfo?.pageCount || 0)
    } catch (error) {
      setTotalPages(0)
      toast.error('Failed to load PDF information')
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  })

  const addSplitRange = () => {
    const newRange: SplitRange = {
      id: Date.now().toString(),
      name: `Split ${splitRanges.length + 1}`,
      startPage: 1,
      endPage: totalPages
    }
    setSplitRanges(prev => [...prev, newRange])
  }

  const updateSplitRange = (id: string, field: keyof SplitRange, value: string | number) => {
    setSplitRanges(prev => prev.map(range => 
      range.id === id ? { ...range, [field]: value } : range
    ))
  }

  const removeSplitRange = (id: string) => {
    setSplitRanges(prev => prev.filter(range => range.id !== id))
  }

  const handleSplit = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF file')
      return
    }

    try {
      let splitOptions: SplitOptions
      
      if (splitMode === 'pages') {
        splitOptions = {
          splitType: 'pages',
          splitAfterPages: pagesPerSplit
        }
      } else if (splitMode === 'ranges') {
        if (splitRanges.length === 0) {
          toast.error('Please add at least one split range')
          return
        }
        splitOptions = {
          splitType: 'pages',
          pageRanges: splitRanges.map(range => `${range.startPage}-${range.endPage}`).join(',')
        }
      } else if (splitMode === 'extract') {
        if (!extractPages.trim()) {
          toast.error('Please specify pages to extract')
          return
        }
        const pageNumbers = parsePageNumbers(extractPages, totalPages)
        if (pageNumbers.length === 0) {
          toast.error('No valid page numbers found')
          return
        }
        splitOptions = {
          splitType: 'pages',
          pages: pageNumbers
        }
      } else {
        toast.error('Invalid split mode')
        return
      }
      
      const result = await operations.splitPDF(selectedFile, splitOptions)
      
      if (result) {
        // For split operations, the result might be a zip file or multiple files
        const fileName = `${selectedFile.name.replace('.pdf', '')}_split.${splitMode === 'extract' ? 'pdf' : 'zip'}`
        await operations.downloadFile(result, fileName)
        closeModal()
      }
    } catch (error) {
      console.error('Error splitting PDF:', error)
    }
  }

  const getPreviewText = () => {
    if (!selectedFile || totalPages === 0) return ''
    
    switch (splitMode) {
      case 'pages':
        const numSplits = Math.ceil(totalPages / pagesPerSplit)
        return `Will create ${numSplits} files with ${pagesPerSplit} page(s) each`
      case 'ranges':
        return `Will create ${splitRanges.length} files based on custom ranges`
      case 'extract':
        const pages = extractPages.split(',').filter(p => p.trim()).length
        return `Will extract ${pages} page(s) into separate files`
      default:
        return ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Split PDF</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragActive ? 'border-adobe-blue bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}>
            <input {...getInputProps()} />
            <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {selectedFile ? (
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">{totalPages} pages</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  {isDragActive ? 'Drop the PDF file here' : 'Drag and drop a PDF file here, or click to select'}
                </p>
                <p className="text-xs text-gray-500">Only PDF files are supported</p>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="mt-6">
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setSplitMode('pages')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    splitMode === 'pages' ? 'bg-adobe-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  By Pages
                </button>
                <button
                  onClick={() => setSplitMode('ranges')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    splitMode === 'ranges' ? 'bg-adobe-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Custom Ranges
                </button>
                <button
                  onClick={() => setSplitMode('extract')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    splitMode === 'extract' ? 'bg-adobe-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Extract Pages
                </button>
              </div>

              {splitMode === 'pages' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pages per split
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={pagesPerSplit}
                      onChange={(e) => setPagesPerSplit(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adobe-blue focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {splitMode === 'ranges' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">Custom Ranges</h3>
                    <button
                      onClick={addSplitRange}
                      className="flex items-center space-x-1 px-3 py-1 bg-adobe-blue text-white rounded-lg hover:bg-adobe-blue-dark transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span className="text-sm">Add Range</span>
                    </button>
                  </div>
                  {splitRanges.map((range) => (
                    <div key={range.id} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="text"
                        value={range.name}
                        onChange={(e) => updateSplitRange(range.id, 'name', e.target.value)}
                        placeholder="Range name"
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-adobe-blue focus:border-transparent"
                      />
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={range.startPage}
                        onChange={(e) => updateSplitRange(range.id, 'startPage', parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-adobe-blue focus:border-transparent"
                      />
                      <span className="text-sm text-gray-500">to</span>
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={range.endPage}
                        onChange={(e) => updateSplitRange(range.id, 'endPage', parseInt(e.target.value) || totalPages)}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-adobe-blue focus:border-transparent"
                      />
                      <button
                        onClick={() => removeSplitRange(range.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {splitMode === 'extract' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pages to extract (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={extractPages}
                      onChange={(e) => setExtractPages(e.target.value)}
                      placeholder="e.g., 1, 3, 5-8, 10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adobe-blue focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use commas to separate pages and hyphens for ranges
                    </p>
                  </div>
                </div>
              )}

              {getPreviewText() && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <EyeIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800">{getPreviewText()}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSplit}
            disabled={!selectedFile || apiState.loading}
            className="px-4 py-2 bg-adobe-blue text-white rounded-lg hover:bg-adobe-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {apiState.loading ? 'Splitting...' : 'Split PDF'}
          </button>
        </div>
      </div>
    </div>
  )
}