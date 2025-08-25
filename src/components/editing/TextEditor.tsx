'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  PaintBrushIcon,
  SwatchIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/solid'
import { Card } from '@/components/ui'

interface TextElement {
  id: string
  x: number
  y: number
  width: number
  height: number
  content: string
  fontSize: number
  fontFamily: string
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
  fontStyle: 'normal' | 'italic' | 'oblique'
  textDecoration: 'none' | 'underline' | 'line-through' | 'overline'
  textAlign: 'left' | 'center' | 'right' | 'justify'
  color: string
  backgroundColor: string
  borderColor: string
  borderWidth: number
  borderStyle: 'none' | 'solid' | 'dashed' | 'dotted'
  lineHeight: number
  letterSpacing: number
  textShadow: string
  opacity: number
  rotation: number
  isEditing: boolean
}

interface TextEditorProps {
  isVisible: boolean
  onClose: () => void
  onAddText: (element: Omit<TextElement, 'id'>) => void
  onUpdateText: (id: string, updates: Partial<TextElement>) => void
  onDeleteText: (id: string) => void
  textElements: TextElement[]
  canvasWidth: number
  canvasHeight: number
}

const FONT_FAMILIES = [
  'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia',
  'Calibri', 'Cambria', 'Garamond', 'Palatino', 'Book Antiqua', 'Trebuchet MS',
  'Arial Black', 'Impact', 'Lucida Console', 'Monaco', 'Consolas'
]

const FONT_SIZES = [6, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 44, 48, 54, 60, 66, 72]

const FONT_WEIGHTS = [
  { value: '100', label: 'Thin' },
  { value: '200', label: 'Extra Light' },
  { value: '300', label: 'Light' },
  { value: 'normal', label: 'Normal' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: 'bold', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
  { value: '900', label: 'Black' }
]

const COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FFA500', '#800080', '#008000', '#800000', '#808000', '#000080', '#808080', '#C0C0C0',
  '#FF69B4', '#FFD700', '#32CD32', '#87CEEB', '#DDA0DD', '#F0E68C', '#FA8072', '#20B2AA'
]

const TEXT_DECORATIONS = [
  { value: 'none', label: 'None' },
  { value: 'underline', label: 'Underline' },
  { value: 'line-through', label: 'Strikethrough' },
  { value: 'overline', label: 'Overline' }
]

const BORDER_STYLES = [
  { value: 'none', label: 'None' },
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' }
]

export const TextEditor: React.FC<TextEditorProps> = ({
  isVisible,
  onClose,
  onAddText,
  onUpdateText,
  onDeleteText,
  textElements,
  canvasWidth,
  canvasHeight
}) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isAddingText, setIsAddingText] = useState(false)
  const [newTextPosition, setNewTextPosition] = useState<{ x: number; y: number } | null>(null)
  const [currentFont, setCurrentFont] = useState({
    family: 'Arial',
    size: 14,
    weight: 'normal' as any,
    style: 'normal' as any,
    decoration: 'none' as any,
    align: 'left' as any,
    color: '#000000',
    backgroundColor: 'transparent',
    borderColor: '#000000',
    borderWidth: 0,
    borderStyle: 'none' as any,
    lineHeight: 1.2,
    letterSpacing: 0,
    textShadow: 'none',
    opacity: 1,
    rotation: 0
  })

  const textInputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isAddingText && textInputRef.current) {
      textInputRef.current.focus()
    }
  }, [isAddingText])

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingText) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setNewTextPosition({ x, y })
  }

  const handleAddText = () => {
    if (!newTextPosition) return

    const newElement: Omit<TextElement, 'id'> = {
      x: newTextPosition.x,
      y: newTextPosition.y,
      width: 200,
      height: 30,
      content: 'New Text',
      fontSize: currentFont.size,
      fontFamily: currentFont.family,
      fontWeight: currentFont.weight,
      fontStyle: currentFont.style,
      textDecoration: currentFont.decoration,
      textAlign: currentFont.align,
      color: currentFont.color,
      backgroundColor: currentFont.backgroundColor,
      borderColor: currentFont.borderColor,
      borderWidth: currentFont.borderWidth,
      borderStyle: currentFont.borderStyle,
      lineHeight: currentFont.lineHeight,
      letterSpacing: currentFont.letterSpacing,
      textShadow: currentFont.textShadow,
      opacity: currentFont.opacity,
      rotation: currentFont.rotation,
      isEditing: true
    }

    onAddText(newElement)
    setIsAddingText(false)
    setNewTextPosition(null)
  }

  const handleUpdateElement = (id: string, field: keyof TextElement, value: any) => {
    onUpdateText(id, { [field]: value })
  }

  const getSelectedElement = () => {
    return textElements.find(el => el.id === selectedElement)
  }

  const selectedEl = getSelectedElement()

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Text Editor</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm text-neutral-500 hover:text-neutral-700"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Toolbar */}
          <div className="w-80 border-r border-neutral-200 p-4 overflow-y-auto">
            <div className="space-y-6">
              {/* Add Text Button */}
              <button
                onClick={() => setIsAddingText(!isAddingText)}
                className={`btn w-full ${isAddingText ? 'btn-primary' : 'btn-secondary'}`}
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                {isAddingText ? 'Click to Place Text' : 'Add Text'}
              </button>

              {/* Font Controls */}
              <div className="space-y-4">
                <h3 className="font-medium text-neutral-900">Font Settings</h3>
                
                {/* Font Family */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Font Family
                  </label>
                  <select
                    value={selectedEl?.fontFamily || currentFont.family}
                    onChange={(e) => {
                      const value = e.target.value
                      setCurrentFont(prev => ({ ...prev, family: value }))
                      if (selectedEl) {
                        handleUpdateElement(selectedEl.id, 'fontFamily', value)
                      }
                    }}
                    className="input w-full"
                  >
                    {FONT_FAMILIES.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Font Size
                  </label>
                  <select
                    value={selectedEl?.fontSize || currentFont.size}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      setCurrentFont(prev => ({ ...prev, size: value }))
                      if (selectedEl) {
                        handleUpdateElement(selectedEl.id, 'fontSize', value)
                      }
                    }}
                    className="input w-full"
                  >
                    {FONT_SIZES.map(size => (
                      <option key={size} value={size}>{size}px</option>
                    ))}
                  </select>
                </div>

                {/* Font Weight */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Font Weight
                  </label>
                  <select
                    value={selectedEl?.fontWeight || currentFont.weight}
                    onChange={(e) => {
                      const value = e.target.value
                      setCurrentFont(prev => ({ ...prev, weight: value }))
                      if (selectedEl) {
                        handleUpdateElement(selectedEl.id, 'fontWeight', value)
                      }
                    }}
                    className="input w-full"
                  >
                    {FONT_WEIGHTS.map(weight => (
                      <option key={weight.value} value={weight.value}>{weight.label}</option>
                    ))}
                  </select>
                </div>

                {/* Font Style Controls */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Font Style
                  </label>
                  <div className="flex space-x-1">
                    <button
                      className={`btn btn-sm ${
                        (selectedEl?.fontStyle || currentFont.style) === 'italic' ? 'btn-primary' : 'btn-secondary'
                      }`}
                      onClick={() => {
                        const value = (selectedEl?.fontStyle || currentFont.style) === 'italic' ? 'normal' : 'italic'
                        setCurrentFont(prev => ({ ...prev, style: value }))
                        if (selectedEl) {
                          handleUpdateElement(selectedEl.id, 'fontStyle', value)
                        }
                      }}
                    >
                      <ItalicIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Text Decoration */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Text Decoration
                  </label>
                  <select
                    value={selectedEl?.textDecoration || currentFont.decoration}
                    onChange={(e) => {
                      const value = e.target.value
                      setCurrentFont(prev => ({ ...prev, decoration: value }))
                      if (selectedEl) {
                        handleUpdateElement(selectedEl.id, 'textDecoration', value)
                      }
                    }}
                    className="input w-full"
                  >
                    {TEXT_DECORATIONS.map(decoration => (
                      <option key={decoration.value} value={decoration.value}>{decoration.label}</option>
                    ))}
                  </select>
                </div>

                {/* Text Alignment */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Text Alignment
                  </label>
                  <div className="flex space-x-1">
                    {[
                      { value: 'left', label: 'Left' },
                      { value: 'center', label: 'Center' },
                      { value: 'right', label: 'Right' },
                      { value: 'justify', label: 'Justify' }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        className={`btn btn-sm ${
                          (selectedEl?.textAlign || currentFont.align) === value ? 'btn-primary' : 'btn-secondary'
                        }`}
                        onClick={() => {
                          setCurrentFont(prev => ({ ...prev, align: value as any }))
                          if (selectedEl) {
                            handleUpdateElement(selectedEl.id, 'textAlign', value)
                          }
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography Controls */}
                <div className="space-y-4">
                  <h3 className="font-medium text-neutral-900 flex items-center">
                    <AdjustmentsHorizontalIcon className="w-4 h-4 mr-2" />
                    Typography
                  </h3>
                  
                  {/* Line Height */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Line Height: {selectedEl?.lineHeight || currentFont.lineHeight}
                    </label>
                    <input
                      type="range"
                      min="0.8"
                      max="3"
                      step="0.1"
                      value={selectedEl?.lineHeight || currentFont.lineHeight}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value)
                        setCurrentFont(prev => ({ ...prev, lineHeight: value }))
                        if (selectedEl) {
                          handleUpdateElement(selectedEl.id, 'lineHeight', value)
                        }
                      }}
                      className="w-full"
                    />
                  </div>

                  {/* Letter Spacing */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Letter Spacing: {selectedEl?.letterSpacing || currentFont.letterSpacing}px
                    </label>
                    <input
                      type="range"
                      min="-5"
                      max="10"
                      step="0.5"
                      value={selectedEl?.letterSpacing || currentFont.letterSpacing}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value)
                        setCurrentFont(prev => ({ ...prev, letterSpacing: value }))
                        if (selectedEl) {
                          handleUpdateElement(selectedEl.id, 'letterSpacing', value)
                        }
                      }}
                      className="w-full"
                    />
                  </div>

                  {/* Opacity */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Opacity: {Math.round((selectedEl?.opacity || currentFont.opacity) * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={selectedEl?.opacity || currentFont.opacity}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value)
                        setCurrentFont(prev => ({ ...prev, opacity: value }))
                        if (selectedEl) {
                          handleUpdateElement(selectedEl.id, 'opacity', value)
                        }
                      }}
                      className="w-full"
                    />
                  </div>

                  {/* Rotation */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Rotation: {selectedEl?.rotation || currentFont.rotation}°
                    </label>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="5"
                      value={selectedEl?.rotation || currentFont.rotation}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        setCurrentFont(prev => ({ ...prev, rotation: value }))
                        if (selectedEl) {
                          handleUpdateElement(selectedEl.id, 'rotation', value)
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-4">
                  <h3 className="font-medium text-neutral-900 flex items-center">
                    <SwatchIcon className="w-4 h-4 mr-2" />
                    Colors
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Text Color
                    </label>
                    <div className="grid grid-cols-6 gap-1">
                      {COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            setCurrentFont(prev => ({ ...prev, color }))
                            if (selectedEl) {
                              handleUpdateElement(selectedEl.id, 'color', color)
                            }
                          }}
                          className="w-6 h-6 rounded border-2 border-neutral-300 hover:border-primary-500"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Background Color
                    </label>
                    <div className="grid grid-cols-6 gap-1">
                      <button
                        onClick={() => {
                          setCurrentFont(prev => ({ ...prev, backgroundColor: 'transparent' }))
                          if (selectedEl) {
                            handleUpdateElement(selectedEl.id, 'backgroundColor', 'transparent')
                          }
                        }}
                        className="w-6 h-6 rounded border-2 border-neutral-300 hover:border-primary-500 bg-white relative"
                      >
                        <div className="absolute inset-0 bg-red-500 transform rotate-45 w-0.5 h-full left-1/2 -translate-x-0.5"></div>
                      </button>
                      {COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            setCurrentFont(prev => ({ ...prev, backgroundColor: color }))
                            if (selectedEl) {
                              handleUpdateElement(selectedEl.id, 'backgroundColor', color)
                            }
                          }}
                          className="w-6 h-6 rounded border-2 border-neutral-300 hover:border-primary-500"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Borders */}
                <div className="space-y-4">
                  <h3 className="font-medium text-neutral-900 flex items-center">
                    <PaintBrushIcon className="w-4 h-4 mr-2" />
                    Borders
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Border Style
                    </label>
                    <select
                      value={selectedEl?.borderStyle || currentFont.borderStyle}
                      onChange={(e) => {
                        const value = e.target.value
                        setCurrentFont(prev => ({ ...prev, borderStyle: value }))
                        if (selectedEl) {
                          handleUpdateElement(selectedEl.id, 'borderStyle', value)
                        }
                      }}
                      className="input w-full"
                    >
                      {BORDER_STYLES.map(style => (
                        <option key={style.value} value={style.value}>{style.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Border Width: {selectedEl?.borderWidth || currentFont.borderWidth}px
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={selectedEl?.borderWidth || currentFont.borderWidth}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        setCurrentFont(prev => ({ ...prev, borderWidth: value }))
                        if (selectedEl) {
                          handleUpdateElement(selectedEl.id, 'borderWidth', value)
                        }
                      }}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Border Color
                    </label>
                    <div className="grid grid-cols-6 gap-1">
                      {COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            setCurrentFont(prev => ({ ...prev, borderColor: color }))
                            if (selectedEl) {
                              handleUpdateElement(selectedEl.id, 'borderColor', color)
                            }
                          }}
                          className="w-6 h-6 rounded border-2 border-neutral-300 hover:border-primary-500"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Element Controls */}
              {selectedEl && (
                <div className="space-y-4 pt-4 border-t border-neutral-200">
                  <h3 className="font-medium text-neutral-900">Selected Text</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={selectedEl.content}
                      onChange={(e) => handleUpdateElement(selectedEl.id, 'content', e.target.value)}
                      className="input w-full h-20 resize-none"
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={() => {
                      onDeleteText(selectedEl.id)
                      setSelectedElement(null)
                    }}
                    className="btn btn-danger btn-sm w-full"
                  >
                    Delete Text
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 p-4">
            <div
              className="relative w-full h-full border border-neutral-300 bg-white overflow-auto cursor-crosshair"
              onClick={handleCanvasClick}
              style={{ minHeight: canvasHeight, minWidth: canvasWidth }}
            >
              {/* Text Elements */}
              {textElements.map(element => (
                <div
                  key={element.id}
                  className={`absolute border-2 cursor-move ${
                    selectedElement === element.id
                      ? 'border-primary-500 bg-primary-50/20'
                      : 'border-transparent hover:border-neutral-300'
                  }`}
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedElement(element.id)
                    setIsAddingText(false)
                  }}
                >
                  {element.isEditing ? (
                    <textarea
                      ref={textInputRef}
                      value={element.content}
                      onChange={(e) => handleUpdateElement(element.id, 'content', e.target.value)}
                      onBlur={() => handleUpdateElement(element.id, 'isEditing', false)}
                      className="w-full h-full resize-none border-none outline-none"
                      style={{
                        fontSize: element.fontSize,
                        fontFamily: element.fontFamily,
                        fontWeight: element.fontWeight,
                        fontStyle: element.fontStyle,
                        textDecoration: element.textDecoration,
                        textAlign: element.textAlign,
                        color: element.color,
                        backgroundColor: element.backgroundColor,
                        borderColor: element.borderColor,
                        borderWidth: element.borderWidth,
                        borderStyle: element.borderStyle,
                        lineHeight: element.lineHeight,
                        letterSpacing: `${element.letterSpacing}px`,
                        textShadow: element.textShadow,
                        opacity: element.opacity,
                        transform: `rotate(${element.rotation}deg)`
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full p-1 cursor-text"
                      style={{
                        fontSize: element.fontSize,
                        fontFamily: element.fontFamily,
                        fontWeight: element.fontWeight,
                        fontStyle: element.fontStyle,
                        textDecoration: element.textDecoration,
                        textAlign: element.textAlign,
                        color: element.color,
                        backgroundColor: element.backgroundColor,
                        borderColor: element.borderColor,
                        borderWidth: element.borderWidth,
                        borderStyle: element.borderStyle,
                        lineHeight: element.lineHeight,
                        letterSpacing: `${element.letterSpacing}px`,
                        textShadow: element.textShadow,
                        opacity: element.opacity,
                        transform: `rotate(${element.rotation}deg)`,
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word'
                      }}
                      onDoubleClick={() => handleUpdateElement(element.id, 'isEditing', true)}
                    >
                      {element.content}
                    </div>
                  )}
                </div>
              ))}

              {/* New Text Placement Indicator */}
              {isAddingText && newTextPosition && (
                <div
                  className="absolute border-2 border-dashed border-primary-500 bg-primary-50/20"
                  style={{
                    left: newTextPosition.x,
                    top: newTextPosition.y,
                    width: 200,
                    height: 30
                  }}
                >
                  <div className="flex items-center justify-center h-full text-primary-600 text-sm">
                    Click to add text here
                  </div>
                </div>
              )}
            </div>

            {/* Add Text Confirmation */}
            {newTextPosition && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                  onClick={() => {
                    setNewTextPosition(null)
                    setIsAddingText(false)
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddText}
                  className="btn btn-primary btn-sm"
                >
                  Add Text
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TextEditor