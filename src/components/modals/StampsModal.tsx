import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useUI } from '../../store/ui-store'
import Stamps from '../collaboration/Stamps'

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

const StampsModal: React.FC = () => {
  const { state, dispatch } = useUI()
  const [stamps, setStamps] = useState<StampElement[]>([])
  const [currentPage] = useState(1)

  if (!state.modals.stamps) return null

  const handleClose = () => {
    dispatch({ type: 'CLOSE_MODAL', payload: 'stamps' })
  }

  const handleAddStamp = (stamp: Omit<StampElement, 'id' | 'createdAt'>) => {
    const newStamp: StampElement = {
      ...stamp,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    setStamps(prev => [...prev, newStamp])
  }

  const handleDeleteStamp = (id: string) => {
    setStamps(prev => prev.filter(stamp => stamp.id !== id))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Stamps
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <Stamps
            pageNumber={currentPage}
            onAddStamp={handleAddStamp}
            onDeleteStamp={handleDeleteStamp}
            stamps={stamps}
            isActive={true}
            onClose={handleClose}
          />
        </div>
      </div>
    </div>
  )
}

export default StampsModal