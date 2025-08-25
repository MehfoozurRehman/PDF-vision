'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui'
import {
  BookmarkIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface Stamp {
  id: string
  text: string
  color: string
  backgroundColor: string
  borderColor: string
  icon?: React.ComponentType<{ className?: string }>
  category: 'approval' | 'status' | 'priority' | 'custom'
  isCustom: boolean
}

interface StampElement {
  id: string
  stampId: string
  position: { x: number; y: number }
  pageNumber: number
  rotation: number
  scale: number
  createdAt: Date
  author: string
}

interface StampsProps {
  pageNumber: number
  onAddStamp: (stamp: Omit<StampElement, 'id' | 'createdAt'>) => void
  onDeleteStamp: (id: string) => void
  stamps: StampElement[]
  isActive: boolean
  onClose: () => void
}

const PREDEFINED_STAMPS: Stamp[] = [
  // Approval Stamps
  {
    id: 'approved',
    text: 'APPROVED',
    color: '#ffffff',
    backgroundColor: '#10b981',
    borderColor: '#059669',
    icon: CheckIcon,
    category: 'approval',
    isCustom: false
  },
  {
    id: 'rejected',
    text: 'REJECTED',
    color: '#ffffff',
    backgroundColor: '#ef4444',
    borderColor: '#dc2626',
    icon: XMarkIcon,
    category: 'approval',
    isCustom: false
  },
  {
    id: 'reviewed',
    text: 'REVIEWED',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
    icon: DocumentCheckIcon,
    category: 'approval',
    isCustom: false
  },
  {
    id: 'verified',
    text: 'VERIFIED',
    color: '#ffffff',
    backgroundColor: '#8b5cf6',
    borderColor: '#7c3aed',
    icon: ShieldCheckIcon,
    category: 'approval',
    isCustom: false
  },
  
  // Status Stamps
  {
    id: 'draft',
    text: 'DRAFT',
    color: '#374151',
    backgroundColor: '#f3f4f6',
    borderColor: '#9ca3af',
    icon: PencilIcon,
    category: 'status',
    isCustom: false
  },
  {
    id: 'confidential',
    text: 'CONFIDENTIAL',
    color: '#ffffff',
    backgroundColor: '#dc2626',
    borderColor: '#b91c1c',
    icon: ExclamationTriangleIcon,
    category: 'status',
    isCustom: false
  },
  {
    id: 'urgent',
    text: 'URGENT',
    color: '#ffffff',
    backgroundColor: '#f59e0b',
    borderColor: '#d97706',
    icon: ClockIcon,
    category: 'priority',
    isCustom: false
  },
  {
    id: 'important',
    text: 'IMPORTANT',
    color: '#ffffff',
    backgroundColor: '#f59e0b',
    borderColor: '#d97706',
    icon: StarIcon,
    category: 'priority',
    isCustom: false
  }
]

export default function Stamps({
  pageNumber,
  onAddStamp,
  onDeleteStamp,
  stamps,
  isActive,
  onClose
}: StampsProps) {
  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(null)
  const [customStamps, setCustomStamps] = useState<Stamp[]>([])
  const [isCreatingCustom, setIsCreatingCustom] = useState(false)
  const [customStampData, setCustomStampData] = useState({
    text: '',
    color: '#000000',
    backgroundColor: '#ffffff',
    borderColor: '#000000'
  })
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'approval' | 'status' | 'priority' | 'custom'>('all')
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)

  const allStamps = [...PREDEFINED_STAMPS, ...customStamps]
  const filteredStamps = allStamps.filter(stamp => 
    selectedCategory === 'all' || stamp.category === selectedCategory
  )

  const pageStamps = stamps.filter(s => s.pageNumber === pageNumber)

  const handleStampClick = (stamp: Stamp) => {
    setSelectedStamp(stamp)
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedStamp) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    onAddStamp({
      stampId: selectedStamp.id,
      position: { x, y },
      pageNumber,
      rotation,
      scale,
      author: 'Current User'
    })
  }

  const handleCreateCustomStamp = () => {
    if (!customStampData.text.trim()) return

    const newStamp: Stamp = {
      id: `custom-${Date.now()}`,
      text: customStampData.text.toUpperCase(),
      color: customStampData.color,
      backgroundColor: customStampData.backgroundColor,
      borderColor: customStampData.borderColor,
      category: 'custom',
      isCustom: true
    }

    setCustomStamps(prev => [...prev, newStamp])
    setCustomStampData({
      text: '',
      color: '#000000',
      backgroundColor: '#ffffff',
      borderColor: '#000000'
    })
    setIsCreatingCustom(false)
  }

  const handleDeleteCustomStamp = (stampId: string) => {
    setCustomStamps(prev => prev.filter(s => s.id !== stampId))
    if (selectedStamp?.id === stampId) {
      setSelectedStamp(null)
    }
  }

  const renderStamp = (stamp: Stamp, size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizeClasses = {
      small: 'text-xs px-2 py-1',
      medium: 'text-sm px-3 py-2',
      large: 'text-lg px-4 py-3'
    }

    const Icon = stamp.icon

    return (
      <div
        className={cn(
          'inline-flex items-center font-bold border-2 rounded transform transition-all',
          sizeClasses[size]
        )}
        style={{
          color: stamp.color,
          backgroundColor: stamp.backgroundColor,
          borderColor: stamp.borderColor,
          transform: `rotate(${rotation}deg) scale(${scale})`
        }}
      >
        {Icon && <Icon className="w-4 h-4 mr-1" />}
        {stamp.text}
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
            <BookmarkIcon className="w-5 h-5 mr-2" />
            Stamps
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Stamps Panel */}
          <div className="w-80 border-r border-gray-200 p-4 space-y-4 overflow-y-auto">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {['all', 'approval', 'status', 'priority', 'custom'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category as any)}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Stamps Grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Available Stamps</h3>
                <button
                  onClick={() => setIsCreatingCustom(true)}
                  className="btn btn-primary btn-sm"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Custom
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {filteredStamps.map((stamp) => (
                  <div key={stamp.id} className="relative">
                    <button
                      onClick={() => handleStampClick(stamp)}
                      className={cn(
                        'w-full p-3 rounded-lg border transition-all text-left',
                        selectedStamp?.id === stamp.id
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      )}
                    >
                      {renderStamp(stamp, 'small')}
                    </button>
                    
                    {stamp.isCustom && (
                      <button
                        onClick={() => handleDeleteCustomStamp(stamp.id)}
                        className="absolute top-1 right-1 p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stamp Properties */}
            {selectedStamp && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Stamp Properties</h3>
                
                {/* Preview */}
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  {renderStamp(selectedStamp, 'medium')}
                </div>
                
                {/* Rotation */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Rotation: {rotation}°
                  </label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                {/* Scale */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Scale: {scale}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Custom Stamp Creator */}
            {isCreatingCustom && (
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700">Create Custom Stamp</h3>
                
                <input
                  type="text"
                  value={customStampData.text}
                  onChange={(e) => setCustomStampData(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Stamp text"
                  className="input input-sm w-full"
                />
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Text Color</label>
                    <input
                      type="color"
                      value={customStampData.color}
                      onChange={(e) => setCustomStampData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full h-8 rounded border"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Background</label>
                    <input
                      type="color"
                      value={customStampData.backgroundColor}
                      onChange={(e) => setCustomStampData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-full h-8 rounded border"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Border</label>
                    <input
                      type="color"
                      value={customStampData.borderColor}
                      onChange={(e) => setCustomStampData(prev => ({ ...prev, borderColor: e.target.value }))}
                      className="w-full h-8 rounded border"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleCreateCustomStamp}
                    disabled={!customStampData.text.trim()}
                    className="btn btn-primary btn-sm flex-1 disabled:opacity-50"
                  >
                    <CheckIcon className="w-4 h-4 mr-1" />
                    Create
                  </button>
                  <button
                    onClick={() => setIsCreatingCustom(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Area */}
          <div className="flex-1 p-4 bg-gray-50">
            <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 relative overflow-hidden">
              <div
                className="absolute inset-0 w-full h-full cursor-crosshair"
                onClick={handleCanvasClick}
              >
                {/* Existing stamps on page */}
                {pageStamps.map((stampElement) => {
                  const stamp = allStamps.find(s => s.id === stampElement.stampId)
                  if (!stamp) return null
                  
                  return (
                    <div
                      key={stampElement.id}
                      className="absolute pointer-events-none"
                      style={{
                        left: stampElement.position.x,
                        top: stampElement.position.y,
                        transform: `rotate(${stampElement.rotation}deg) scale(${stampElement.scale})`
                      }}
                    >
                      {renderStamp(stamp, 'medium')}
                    </div>
                  )
                })}
              </div>
              
              {/* Instructions */}
              <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 text-sm text-gray-600">
                <div className="font-medium mb-1">Stamp Instructions:</div>
                <div>• Select a stamp from the left panel</div>
                <div>• Click anywhere to place the stamp</div>
                <div>• Adjust rotation and scale as needed</div>
                {selectedStamp && (
                  <div className="mt-2 text-blue-600 font-medium">
                    Selected: {selectedStamp.text}
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