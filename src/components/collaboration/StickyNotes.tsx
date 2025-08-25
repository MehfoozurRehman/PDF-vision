'use client'

import React, { useState, useRef } from 'react'
import { Card } from '@/components/ui'
import {
  DocumentTextIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

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

interface StickyNotesProps {
  pageNumber: number
  onAddNote: (note: Omit<StickyNote, 'id' | 'createdAt' | 'modifiedAt'>) => void
  onUpdateNote: (id: string, updates: Partial<StickyNote>) => void
  onDeleteNote: (id: string) => void
  notes: StickyNote[]
  isActive: boolean
  onClose: () => void
}

const NOTE_COLORS = [
  { name: 'Yellow', value: '#fef3c7', border: '#f59e0b' },
  { name: 'Pink', value: '#fce7f3', border: '#ec4899' },
  { name: 'Blue', value: '#dbeafe', border: '#3b82f6' },
  { name: 'Green', value: '#d1fae5', border: '#10b981' },
  { name: 'Purple', value: '#e9d5ff', border: '#8b5cf6' },
  { name: 'Orange', value: '#fed7aa', border: '#f97316' },
  { name: 'Red', value: '#fee2e2', border: '#ef4444' },
  { name: 'Gray', value: '#f3f4f6', border: '#6b7280' }
]

const NOTE_SIZES = [
  { name: 'Small', width: 150, height: 100 },
  { name: 'Medium', width: 200, height: 150 },
  { name: 'Large', width: 250, height: 200 }
]

const PRIORITY_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444'
}

const CATEGORIES = [
  'General',
  'Review',
  'Question',
  'Important',
  'To Do',
  'Feedback',
  'Error',
  'Suggestion'
]

export default function StickyNotes({
  pageNumber,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  notes,
  isActive,
  onClose
}: StickyNotesProps) {
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0])
  const [selectedSize, setSelectedSize] = useState(NOTE_SIZES[1])
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [selectedCategory, setSelectedCategory] = useState('General')
  const [isPlacing, setIsPlacing] = useState(false)
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [filter, setFilter] = useState<'all' | 'visible' | 'hidden'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'category'>('date')
  
  const canvasRef = useRef<HTMLDivElement>(null)

  const pageNotes = notes.filter(n => n.pageNumber === pageNumber)
  const filteredNotes = pageNotes.filter(note => {
    if (filter === 'visible') return note.isVisible
    if (filter === 'hidden') return !note.isVisible
    return true
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'category':
        return a.category.localeCompare(b.category)
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlacing) return
    
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    // Ensure note doesn't go outside canvas
    const maxX = rect.width - selectedSize.width
    const maxY = rect.height - selectedSize.height
    const finalX = Math.max(0, Math.min(x - selectedSize.width / 2, maxX))
    const finalY = Math.max(0, Math.min(y - selectedSize.height / 2, maxY))
    
    onAddNote({
      content: 'New note...',
      position: { x: finalX, y: finalY },
      color: selectedColor.value,
      size: selectedSize,
      pageNumber,
      author: 'Current User',
      isVisible: true,
      isMinimized: false,
      priority: selectedPriority,
      category: selectedCategory
    })
    
    setIsPlacing(false)
  }

  const handleStartEdit = (note: StickyNote) => {
    setEditingNote(note.id)
    setEditContent(note.content)
  }

  const handleSaveEdit = () => {
    if (editingNote) {
      onUpdateNote(editingNote, { 
        content: editContent,
        modifiedAt: new Date()
      })
      setEditingNote(null)
      setEditContent('')
    }
  }

  const handleCancelEdit = () => {
    setEditingNote(null)
    setEditContent('')
  }

  const handleToggleVisibility = (noteId: string) => {
    const note = notes.find(n => n.id === noteId)
    if (note) {
      onUpdateNote(noteId, { isVisible: !note.isVisible })
    }
  }

  const handleToggleMinimize = (noteId: string) => {
    const note = notes.find(n => n.id === noteId)
    if (note) {
      onUpdateNote(noteId, { isMinimized: !note.isMinimized })
    }
  }

  const renderNote = (note: StickyNote) => {
    if (!note.isVisible) return null
    
    const isEditing = editingNote === note.id
    const colorConfig = NOTE_COLORS.find(c => c.value === note.color) || NOTE_COLORS[0]
    
    return (
      <div
        key={note.id}
        className="absolute shadow-lg rounded-lg border-2 transition-all hover:shadow-xl"
        style={{
          left: note.position.x,
          top: note.position.y,
          width: note.size.width,
          height: note.isMinimized ? 40 : note.size.height,
          backgroundColor: colorConfig.value,
          borderColor: colorConfig.border,
          zIndex: isEditing ? 50 : 10
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-2 border-b cursor-move"
          style={{ borderColor: colorConfig.border }}
        >
          <div className="flex items-center space-x-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: PRIORITY_COLORS[note.priority] }}
              title={`Priority: ${note.priority}`}
            />
            <span className="text-xs font-medium text-gray-600">{note.category}</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleToggleMinimize(note.id)}
              className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
              title={note.isMinimized ? 'Expand' : 'Minimize'}
            >
              <ChatBubbleLeftIcon className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleToggleVisibility(note.id)}
              className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
              title="Hide"
            >
              <EyeSlashIcon className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDeleteNote(note.id)}
              className="p-1 hover:bg-red-500 hover:bg-opacity-20 text-red-600 rounded"
              title="Delete"
            >
              <TrashIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        {!note.isMinimized && (
          <div className="p-2 h-full">
            {isEditing ? (
              <div className="h-full flex flex-col">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 w-full p-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                  placeholder="Enter note content..."
                  autoFocus
                />
                <div className="flex justify-end space-x-1 mt-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="h-full cursor-text text-sm text-gray-700 overflow-y-auto"
                onClick={() => handleStartEdit(note)}
              >
                {note.content || 'Click to edit...'}
                <div className="absolute bottom-1 right-1">
                  <PencilIcon className="w-3 h-3 text-gray-400" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            Sticky Notes
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Tools Panel */}
          <div className="w-80 border-r border-gray-200 p-4 space-y-4 overflow-y-auto">
            {/* Add Note */}
            <div>
              <button
                onClick={() => setIsPlacing(!isPlacing)}
                className={cn(
                  'w-full p-3 rounded-lg border-2 border-dashed transition-colors flex items-center justify-center',
                  isPlacing
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                )}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                {isPlacing ? 'Click on canvas to place note' : 'Add New Note'}
              </button>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Note Color</h3>
              <div className="grid grid-cols-4 gap-2">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      'w-full h-10 rounded border-2 transition-all',
                      selectedColor.value === color.value
                        ? 'border-gray-400 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Note Size</h3>
              <div className="space-y-2">
                {NOTE_SIZES.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'w-full p-2 rounded border text-left transition-colors',
                      selectedSize.name === size.name
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <div className="font-medium">{size.name}</div>
                    <div className="text-xs text-gray-500">{size.width} × {size.height}px</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Priority</h3>
              <div className="space-y-1">
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setSelectedPriority(priority)}
                    className={cn(
                      'w-full p-2 rounded border text-left transition-colors flex items-center',
                      selectedPriority === priority
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: PRIORITY_COLORS[priority] }}
                    />
                    <span className="capitalize">{priority}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Existing Notes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Notes ({sortedNotes.length})</h3>
                <div className="flex space-x-1">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="text-xs border border-gray-200 rounded px-1 py-1"
                  >
                    <option value="all">All</option>
                    <option value="visible">Visible</option>
                    <option value="hidden">Hidden</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs border border-gray-200 rounded px-1 py-1"
                  >
                    <option value="date">Date</option>
                    <option value="priority">Priority</option>
                    <option value="category">Category</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {sortedNotes.map((note) => {
                  const colorConfig = NOTE_COLORS.find(c => c.value === note.color) || NOTE_COLORS[0]
                  return (
                    <div
                      key={note.id}
                      className="p-2 rounded border text-sm"
                      style={{ 
                        backgroundColor: note.isVisible ? colorConfig.value : '#f3f4f6',
                        borderColor: note.isVisible ? colorConfig.border : '#d1d5db'
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: PRIORITY_COLORS[note.priority] }}
                          />
                          <span className="font-medium">{note.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleToggleVisibility(note.id)}
                            className="p-1 hover:bg-gray-200 rounded"
                            title={note.isVisible ? 'Hide' : 'Show'}
                          >
                            {note.isVisible ? (
                              <EyeIcon className="w-3 h-3" />
                            ) : (
                              <EyeSlashIcon className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            onClick={() => onDeleteNote(note.id)}
                            className="p-1 hover:bg-red-100 text-red-600 rounded"
                            title="Delete"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {note.content || 'Empty note'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {note.author} • {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 p-4 bg-gray-50">
            <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 relative overflow-hidden">
              <div
                ref={canvasRef}
                className={cn(
                  'absolute inset-0 w-full h-full',
                  isPlacing ? 'cursor-crosshair' : 'cursor-default'
                )}
                onClick={handleCanvasClick}
              >
                {/* Render all notes */}
                {sortedNotes.map(renderNote)}
              </div>
              
              {/* Instructions */}
              <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 text-sm text-gray-600">
                <div className="font-medium mb-1">Sticky Notes Instructions:</div>
                <div>• Click "Add New Note" to start placing</div>
                <div>• Click on canvas to place note</div>
                <div>• Click on note content to edit</div>
                <div>• Use controls to hide/show/delete notes</div>
                {isPlacing && (
                  <div className="mt-2 text-blue-600 font-medium">
                    Click anywhere to place note
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}