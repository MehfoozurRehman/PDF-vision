import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useUI } from '../../store/ui-store'
import StickyNotes from '../collaboration/StickyNotes'

interface StickyNote {
  id: string
  content: string
  position: { x: number; y: number }
  color: string
  size: { width: number; height: number }
  pageNumber: number
  createdAt: Date
  modifiedAt: Date
  author: string
  isVisible: boolean
  isMinimized: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
}

const StickyNotesModal: React.FC = () => {
  const { state, dispatch } = useUI()
  const [notes, setNotes] = useState<StickyNote[]>([])
  const [currentPage] = useState(1)

  if (!state.modals.stickyNotes) return null

  const handleClose = () => {
    dispatch({ type: 'CLOSE_MODAL', payload: 'stickyNotes' })
  }

  const handleAddNote = (note: Omit<StickyNote, 'id' | 'createdAt' | 'modifiedAt'>) => {
    const newNote: StickyNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
      modifiedAt: new Date()
    }
    setNotes(prev => [...prev, newNote])
  }

  const handleUpdateNote = (id: string, updates: Partial<StickyNote>) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updates, modifiedAt: new Date() } : note
    ))
  }

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sticky Notes
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <StickyNotes
            pageNumber={currentPage}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            notes={notes}
            isActive={true}
            onClose={handleClose}
          />
        </div>
      </div>
    </div>
  )
}

export default StickyNotesModal