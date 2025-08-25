'use client'

import { usePDF } from '@/store/pdf-store'
import { useUI } from '@/store/ui-store'
import { TrashIcon, DocumentDuplicateIcon, PlusIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import { useState, useRef } from 'react'

export default function ThumbnailsPanel() {
  const { state: pdfState, dispatch: pdfDispatch } = usePDF()
  const { state: uiState } = useUI()
  const [draggedPage, setDraggedPage] = useState<number | null>(null)
  const [dragOverPage, setDragOverPage] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const currentDocument = pdfState.activeDocument
  
  if (!currentDocument) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>No document loaded</p>
      </div>
    )
  }

  const handlePageClick = (pageNumber: number) => {
    pdfDispatch({
      type: 'SET_CURRENT_PAGE',
      payload: pageNumber
    })
  }

  const handleDeletePage = (pageNumber: number) => {
    if (currentDocument.pages.length <= 1) {
      toast.error('Cannot delete the last page')
      return
    }
    
    const updatedPages = currentDocument.pages.filter((_: any, index: number) => index + 1 !== pageNumber)
    
    pdfDispatch({
      type: 'UPDATE_DOCUMENT',
      payload: {
        id: currentDocument.id,
        pages: updatedPages,
        currentPage: pageNumber > updatedPages.length ? updatedPages.length : 
                    pageNumber === currentDocument.currentPage && pageNumber > 1 ? pageNumber - 1 : 
                    currentDocument.currentPage
      }
    })
    
    toast.success(`Page ${pageNumber} deleted`)
  }

  const handleDuplicatePage = (pageNumber: number) => {
    const pageIndex = pageNumber - 1
    const pageToClone = currentDocument.pages[pageIndex]
    
    const duplicatedPage = {
      ...pageToClone,
      id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    const updatedPages = [
      ...currentDocument.pages.slice(0, pageIndex + 1),
      duplicatedPage,
      ...currentDocument.pages.slice(pageIndex + 1)
    ]
    
    pdfDispatch({
      type: 'UPDATE_DOCUMENT',
      payload: {
        id: currentDocument.id,
        pages: updatedPages
      }
    })
    
    toast.success(`Page ${pageNumber} duplicated`)
  }

  const handleInsertPage = () => {
    const newPage = {
      id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pageNumber: currentDocument.currentPage + 1,
      width: 612,
      height: 792,
      rotation: 0,
      annotations: []
    }
    
    const insertIndex = currentDocument.currentPage
    const updatedPages = [
      ...currentDocument.pages.slice(0, insertIndex),
      newPage,
      ...currentDocument.pages.slice(insertIndex)
    ].map((page, index) => ({
      ...page,
      pageNumber: index + 1
    }))
    
    pdfDispatch({
      type: 'UPDATE_DOCUMENT',
      payload: {
        id: currentDocument.id,
        pages: updatedPages,
        currentPage: insertIndex + 1
      }
    })
    
    toast.success('New page inserted')
  }

  const handleDragStart = (e: React.DragEvent, pageNumber: number) => {
    setDraggedPage(pageNumber)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', pageNumber.toString())
  }

  const handleDragOver = (e: React.DragEvent, pageNumber: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverPage(pageNumber)
  }

  const handleDragLeave = () => {
    setDragOverPage(null)
  }

  const handleDrop = (e: React.DragEvent, targetPageNumber: number) => {
    e.preventDefault()
    
    if (!draggedPage || draggedPage === targetPageNumber) {
      setDraggedPage(null)
      setDragOverPage(null)
      return
    }
    
    const sourceIndex = draggedPage - 1
    const targetIndex = targetPageNumber - 1
    
    const updatedPages = [...currentDocument.pages]
    const [movedPage] = updatedPages.splice(sourceIndex, 1)
    updatedPages.splice(targetIndex, 0, movedPage)
    
    pdfDispatch({
      type: 'UPDATE_DOCUMENT',
      payload: {
        id: currentDocument.id,
        pages: updatedPages,
        currentPage: targetPageNumber
      }
    })
    
    setDraggedPage(null)
    setDragOverPage(null)
    toast.success(`Page ${draggedPage} moved to position ${targetPageNumber}`)
  }

  const handleInsertFromFile = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    // TODO: Implement actual PDF page insertion from file
    toast.success(`${files.length} file(s) selected for insertion`)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Pages</h3>
        <p className="text-xs text-gray-500 mt-1">
          {currentDocument.pages.length} page{currentDocument.pages.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="p-2 space-y-2">
        {currentDocument.pages.map((page: any, index: number) => {
          const pageNumber = index + 1
          const isCurrentPage = pageNumber === currentDocument.currentPage
          
          return (
            <div
              key={page.id}
              draggable
              onDragStart={(e) => handleDragStart(e, pageNumber)}
              onDragOver={(e) => handleDragOver(e, pageNumber)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, pageNumber)}
              className={`group relative cursor-pointer rounded-lg border-2 transition-all ${
                isCurrentPage
                  ? 'border-adobe-blue bg-adobe-blue/5'
                  : dragOverPage === pageNumber
                  ? 'border-blue-400 bg-blue-50'
                  : draggedPage === pageNumber
                  ? 'border-gray-400 bg-gray-100 opacity-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handlePageClick(pageNumber)}
            >
              {/* Thumbnail */}
              <div className="aspect-[8.5/11] bg-white rounded-md overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200">
                  {/* Placeholder thumbnail - in real implementation, this would be a rendered page */}
                  <div className="text-center">
                    <div className="w-8 h-10 bg-gray-300 rounded mx-auto mb-2"></div>
                    <span className="text-xs text-gray-500">Page {pageNumber}</span>
                  </div>
                </div>
              </div>
              
              {/* Page Info */}
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${
                    isCurrentPage ? 'text-adobe-blue' : 'text-gray-700'
                  }`}>
                    {pageNumber}
                  </span>
                  
                  {/* Page Actions */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDuplicatePage(pageNumber)
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                      title="Duplicate page"
                    >
                      <DocumentDuplicateIcon className="w-3 h-3" />
                    </button>
                    
                    {currentDocument.pages.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeletePage(pageNumber)
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                        title="Delete page"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    )}
                    
                    <div className="p-1 text-gray-400 cursor-move" title="Drag to reorder">
                      <ArrowsUpDownIcon className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                
                {/* Page annotations count */}
                {currentDocument.annotations.filter((ann: any) => ann.pageNumber === pageNumber).length > 0 && (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {currentDocument.annotations.filter((ann: any) => ann.pageNumber === pageNumber).length} notes
                    </span>
                  </div>
                )}
              </div>
              
              {/* Current page indicator */}
              {isCurrentPage && (
                <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-adobe-blue rounded-r"></div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Page Management Actions */}
      <div className="p-2 space-y-2">
        <button
          onClick={handleInsertPage}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="text-xs">Insert Blank Page</span>
        </button>
        
        <button
          onClick={handleInsertFromFile}
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2 text-xs"
        >
          <DocumentDuplicateIcon className="w-3 h-3" />
          <span>Insert from File</span>
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  )
}