import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useUI } from '../../store/ui-store'
import DrawingTools from '../collaboration/DrawingTools'

interface DrawingElement {
  id: string
  type: 'pen' | 'line' | 'rectangle' | 'circle' | 'arrow'
  points: { x: number; y: number }[]
  color: string
  strokeWidth: number
  opacity: number
  pageNumber: number
  createdAt: Date
}

const DrawingToolsModal: React.FC = () => {
  const { state, dispatch } = useUI()
  const [drawings, setDrawings] = useState<DrawingElement[]>([])
  const [currentPage] = useState(1)

  if (!state.modals.drawingTools) return null

  const handleClose = () => {
    dispatch({ type: 'CLOSE_MODAL', payload: 'drawingTools' })
  }

  const handleAddDrawing = (drawing: Omit<DrawingElement, 'id' | 'createdAt'>) => {
    const newDrawing: DrawingElement = {
      ...drawing,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    setDrawings(prev => [...prev, newDrawing])
  }

  const handleUpdateDrawing = (id: string, updates: Partial<DrawingElement>) => {
    setDrawings(prev => prev.map(drawing => 
      drawing.id === id ? { ...drawing, ...updates } : drawing
    ))
  }

  const handleDeleteDrawing = (id: string) => {
    setDrawings(prev => prev.filter(drawing => drawing.id !== id))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Drawing Tools
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <DrawingTools
            pageNumber={currentPage}
            onAddDrawing={handleAddDrawing}
            onUpdateDrawing={handleUpdateDrawing}
            onDeleteDrawing={handleDeleteDrawing}
            drawings={drawings}
            isActive={true}
            onClose={handleClose}
          />
        </div>
      </div>
    </div>
  )
}

export default DrawingToolsModal