'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui'
import {
  PencilIcon,
  Square3Stack3DIcon,
  ArrowRightIcon,
  EllipsisHorizontalIcon,
  MinusIcon,
  XMarkIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  SwatchIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

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

interface DrawingToolsProps {
  pageNumber: number
  onAddDrawing: (drawing: Omit<DrawingElement, 'id' | 'createdAt'>) => void
  onUpdateDrawing: (id: string, updates: Partial<DrawingElement>) => void
  onDeleteDrawing: (id: string) => void
  drawings: DrawingElement[]
  isActive: boolean
  onClose: () => void
}

const DRAWING_TOOLS = [
  { id: 'pen', name: 'Freehand Pen', icon: PencilIcon },
  { id: 'line', name: 'Line', icon: MinusIcon },
  { id: 'rectangle', name: 'Rectangle', icon: Square3Stack3DIcon },
  { id: 'circle', name: 'Circle', icon: EllipsisHorizontalIcon },
  { id: 'arrow', name: 'Arrow', icon: ArrowRightIcon }
] as const

const COLORS = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
]

const STROKE_WIDTHS = [1, 2, 3, 5, 8, 12]

export default function DrawingTools({
  pageNumber,
  onAddDrawing,
  onUpdateDrawing,
  onDeleteDrawing,
  drawings,
  isActive,
  onClose
}: DrawingToolsProps) {
  const [selectedTool, setSelectedTool] = useState<'pen' | 'line' | 'rectangle' | 'circle' | 'arrow'>('pen')
  const [selectedColor, setSelectedColor] = useState('#FF0000')
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [opacity, setOpacity] = useState(1)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentDrawing, setCurrentDrawing] = useState<{ x: number; y: number }[]>([])
  const [history, setHistory] = useState<DrawingElement[][]>([[]])
  const [historyIndex, setHistoryIndex] = useState(0)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)

  const pageDrawings = drawings.filter(d => d.pageNumber === pageNumber)

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isActive) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    setIsDrawing(true)
    setStartPoint({ x, y })
    
    if (selectedTool === 'pen') {
      setCurrentDrawing([{ x, y }])
    } else {
      setCurrentDrawing([{ x, y }, { x, y }])
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isActive) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    if (selectedTool === 'pen') {
      setCurrentDrawing(prev => [...prev, { x, y }])
    } else {
      setCurrentDrawing([startPoint!, { x, y }])
    }
  }

  const handleMouseUp = () => {
    if (!isDrawing || !isActive) return
    
    setIsDrawing(false)
    
    if (currentDrawing.length > 0) {
      const newDrawing = {
        type: selectedTool,
        points: currentDrawing,
        color: selectedColor,
        strokeWidth,
        opacity,
        pageNumber
      }
      
      onAddDrawing(newDrawing)
      
      // Add to history
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push([...drawings, { ...newDrawing, id: `drawing-${Date.now()}`, createdAt: new Date() }])
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
    
    setCurrentDrawing([])
    setStartPoint(null)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      // Apply previous state
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      // Apply next state
    }
  }

  const handleClearAll = () => {
    pageDrawings.forEach(drawing => onDeleteDrawing(drawing.id))
  }

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold flex items-center">
            <PencilIcon className="w-5 h-5 mr-2" />
            Drawing Tools
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
          <div className="w-64 border-r border-gray-200 p-4 space-y-4 overflow-y-auto">
            {/* Drawing Tools */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                {DRAWING_TOOLS.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedTool(tool.id)}
                      className={cn(
                        'p-3 rounded-lg border text-sm font-medium transition-colors',
                        selectedTool === tool.id
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      )}
                      title={tool.name}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-xs">{tool.name}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Color</h3>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      'w-8 h-8 rounded border-2 transition-all',
                      selectedColor === color
                        ? 'border-gray-400 scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full mt-2 h-8 rounded border border-gray-200"
              />
            </div>

            {/* Stroke Width */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Stroke Width</h3>
              <div className="space-y-2">
                {STROKE_WIDTHS.map((width) => (
                  <button
                    key={width}
                    onClick={() => setStrokeWidth(width)}
                    className={cn(
                      'w-full p-2 rounded border text-left transition-colors',
                      strokeWidth === width
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <div
                      className="bg-current rounded"
                      style={{ height: `${width}px` }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Opacity */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Opacity</h3>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">{Math.round(opacity * 100)}%</div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="w-full btn btn-secondary btn-sm disabled:opacity-50"
              >
                <ArrowUturnLeftIcon className="w-4 h-4 mr-1" />
                Undo
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="w-full btn btn-secondary btn-sm disabled:opacity-50"
              >
                <ArrowUturnRightIcon className="w-4 h-4 mr-1" />
                Redo
              </button>
              <button
                onClick={handleClearAll}
                disabled={pageDrawings.length === 0}
                className="w-full btn btn-danger btn-sm disabled:opacity-50"
              >
                <TrashIcon className="w-4 h-4 mr-1" />
                Clear All
              </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 p-4 bg-gray-50">
            <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
              
              {/* Instructions */}
              <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 text-sm text-gray-600">
                <div className="font-medium mb-1">Drawing Instructions:</div>
                <div>• Select a tool from the left panel</div>
                <div>• Click and drag to draw</div>
                <div>• Use Undo/Redo to manage changes</div>
                <div>• Current tool: <span className="font-medium">{selectedTool}</span></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}