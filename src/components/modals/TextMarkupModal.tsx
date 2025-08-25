import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useUI } from '../../store/ui-store'
import TextMarkup from '../collaboration/TextMarkup'

interface TextMarkupType {
  id: string
  type: 'highlight' | 'underline' | 'strikethrough'
  text: string
  position: { x: number; y: number; width: number; height: number }
  color: string
  opacity: number
  pageNumber: number
  createdAt: Date
  author: string
  isVisible: boolean
}

const TextMarkupModal: React.FC = () => {
  const { state, dispatch } = useUI()
  const [markups, setMarkups] = useState<TextMarkupType[]>([])
  const [currentPage] = useState(1)

  if (!state.modals.textMarkup) return null

  const handleClose = () => {
    dispatch({ type: 'CLOSE_MODAL', payload: 'textMarkup' })
  }

  const handleAddMarkup = (markup: Omit<TextMarkupType, 'id' | 'createdAt'>) => {
    const newMarkup: TextMarkupType = {
      ...markup,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    setMarkups(prev => [...prev, newMarkup])
  }

  const handleUpdateMarkup = (id: string, updates: Partial<TextMarkupType>) => {
    setMarkups(prev => prev.map(markup => 
      markup.id === id ? { ...markup, ...updates } : markup
    ))
  }

  const handleDeleteMarkup = (id: string) => {
    setMarkups(prev => prev.filter(markup => markup.id !== id))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Text Markup
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <TextMarkup
            pageNumber={currentPage}
            onAddMarkup={handleAddMarkup}
            onUpdateMarkup={handleUpdateMarkup}
            onDeleteMarkup={handleDeleteMarkup}
            markups={markups}
            isActive={true}
            onClose={handleClose}
          />
        </div>
      </div>
    </div>
  )
}

export default TextMarkupModal