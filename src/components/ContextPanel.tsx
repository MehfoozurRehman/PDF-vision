'use client'

import { useUI } from '@/store/ui-store'
import { usePDF } from '@/store/pdf-store'
import {
  SwatchIcon,
  PencilIcon,
  CursorArrowRaysIcon,
  HandRaisedIcon,
  DocumentTextIcon,
  PaintBrushIcon,
  ChatBubbleLeftIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

interface ContextPanelProps {
  className?: string
}

export default function ContextPanel({ className = '' }: ContextPanelProps) {
  const { state: uiState, dispatch: uiDispatch } = useUI()
  const { state: pdfState } = usePDF()

  if (!uiState.activeTool || uiState.activeTool === 'select' || uiState.activeTool === 'hand') {
    return null
  }

  const handleClose = () => {
    uiDispatch({ type: 'SET_ACTIVE_TOOL', payload: 'select' })
  }

  const renderToolPanel = () => {
    switch (uiState.activeTool) {
      case 'highlight':
        return <HighlightPanel />
      case 'text':
        return <TextPanel />
      case 'drawing':
        return <DrawingPanel />
      case 'note':
        return <NotePanel />
      case 'signature':
        return <SignaturePanel />
      default:
        return null
    }
  }

  const getToolIcon = () => {
    switch (uiState.activeTool) {
      case 'highlight':
        return <SwatchIcon className="w-5 h-5" />
      case 'text':
        return <DocumentTextIcon className="w-5 h-5" />
      case 'drawing':
        return <PencilIcon className="w-5 h-5" />
      case 'note':
        return <ChatBubbleLeftIcon className="w-5 h-5" />
      case 'signature':
        return <PaintBrushIcon className="w-5 h-5" />
      default:
        return <AdjustmentsHorizontalIcon className="w-5 h-5" />
    }
  }

  const getToolTitle = () => {
    switch (uiState.activeTool) {
      case 'highlight':
        return 'Highlight Tool'
      case 'text':
        return 'Text Tool'
      case 'drawing':
        return 'Drawing Tool'
      case 'note':
        return 'Note Tool'
      case 'signature':
        return 'Signature Tool'
      default:
        return 'Tool Options'
    }
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            {getToolIcon()}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{getToolTitle()}</h3>
        </div>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close panel"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {renderToolPanel()}
      </div>
    </div>
  )
}

function HighlightPanel() {
  const [selectedColor, setSelectedColor] = useState('#FBBF24')
  const [opacity, setOpacity] = useState(50)

  const colors = [
    { name: 'Yellow', value: '#FBBF24' },
    { name: 'Green', value: '#10B981' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Orange', value: '#F97316' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Highlight Color
        </label>
        <div className="grid grid-cols-3 gap-2">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={`w-full h-10 rounded-lg border-2 transition-all ${
                selectedColor === color.value
                  ? 'border-gray-900 scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opacity: {opacity}%
        </label>
        <input
          type="range"
          min="10"
          max="100"
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="pt-2">
        <div
          className="w-full h-8 rounded-lg border border-gray-200"
          style={{
            backgroundColor: selectedColor,
            opacity: opacity / 100,
          }}
        />
        <p className="text-xs text-gray-500 mt-1 text-center">Preview</p>
      </div>
    </div>
  )
}

function TextPanel() {
  const [fontSize, setFontSize] = useState(12)
  const [fontFamily, setFontFamily] = useState('Arial')
  const [textColor, setTextColor] = useState('#000000')
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)

  const fontFamilies = ['Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana']

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Family
        </label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {fontFamilies.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Size: {fontSize}px
        </label>
        <input
          type="range"
          min="8"
          max="72"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Color
        </label>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setIsBold(!isBold)}
          className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
            isBold
              ? 'bg-blue-100 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="font-bold">B</span>
        </button>
        <button
          onClick={() => setIsItalic(!isItalic)}
          className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
            isItalic
              ? 'bg-blue-100 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="italic">I</span>
        </button>
      </div>

      <div className="pt-2">
        <div
          className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50"
          style={{
            fontFamily,
            fontSize: `${fontSize}px`,
            color: textColor,
            fontWeight: isBold ? 'bold' : 'normal',
            fontStyle: isItalic ? 'italic' : 'normal',
          }}
        >
          Sample Text
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">Preview</p>
      </div>
    </div>
  )
}

function DrawingPanel() {
  const [brushSize, setBrushSize] = useState(3)
  const [brushColor, setBrushColor] = useState('#000000')
  const [brushType, setBrushType] = useState('pen')

  const brushTypes = [
    { id: 'pen', name: 'Pen' },
    { id: 'marker', name: 'Marker' },
    { id: 'pencil', name: 'Pencil' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brush Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {brushTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setBrushType(type.id)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                brushType === type.id
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brush Size: {brushSize}px
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brush Color
        </label>
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
      </div>

      <div className="pt-2">
        <div className="w-full h-16 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
          <div
            className="rounded-full"
            style={{
              width: `${brushSize * 2}px`,
              height: `${brushSize * 2}px`,
              backgroundColor: brushColor,
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">Brush Preview</p>
      </div>
    </div>
  )
}

function NotePanel() {
  const [noteColor, setNoteColor] = useState('#FBBF24')
  const [noteSize, setNoteSize] = useState('medium')

  const colors = [
    { name: 'Yellow', value: '#FBBF24' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Pink', value: '#EC4899' },
  ]

  const sizes = [
    { id: 'small', name: 'Small' },
    { id: 'medium', name: 'Medium' },
    { id: 'large', name: 'Large' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Note Color
        </label>
        <div className="grid grid-cols-2 gap-2">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => setNoteColor(color.value)}
              className={`w-full h-10 rounded-lg border-2 transition-all ${
                noteColor === color.value
                  ? 'border-gray-900 scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Note Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setNoteSize(size.id)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                noteSize === size.id
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {size.name}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <div
          className="mx-auto border border-gray-300 rounded-lg p-2 shadow-sm"
          style={{
            backgroundColor: noteColor,
            width: noteSize === 'small' ? '60px' : noteSize === 'medium' ? '80px' : '100px',
            height: noteSize === 'small' ? '60px' : noteSize === 'medium' ? '80px' : '100px',
          }}
        >
          <div className="text-xs text-gray-700">Note</div>
        </div>
        <p className="text-xs text-gray-500 mt-1 text-center">Preview</p>
      </div>
    </div>
  )
}

function SignaturePanel() {
  const [signatureType, setSignatureType] = useState('draw')
  const [signatureColor, setSignatureColor] = useState('#000000')

  const types = [
    { id: 'draw', name: 'Draw' },
    { id: 'type', name: 'Type' },
    { id: 'upload', name: 'Upload' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Signature Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => setSignatureType(type.id)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                signatureType === type.id
                  ? 'bg-blue-100 border-blue-300 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>

      {signatureType === 'draw' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Signature Color
          </label>
          <input
            type="color"
            value={signatureColor}
            onChange={(e) => setSignatureColor(e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
          />
        </div>
      )}

      {signatureType === 'type' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type Your Signature
          </label>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ fontFamily: 'cursive', fontSize: '18px' }}
          />
        </div>
      )}

      {signatureType === 'upload' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Signature Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
          </div>
        </div>
      )}

      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Apply Signature
      </button>
    </div>
  )
}