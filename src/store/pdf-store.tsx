'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'

// Types
export interface PDFDocument {
  id: string
  name: string
  path?: string
  data?: ArrayBuffer // Store actual PDF file data for uploaded files
  pages: PDFPage[]
  currentPage: number
  zoom: number
  annotations: Annotation[]
  isModified: boolean
  createdAt: Date
  modifiedAt: Date
}

export interface PDFPage {
  id: string
  pageNumber: number
  width: number
  height: number
  rotation: number
  annotations: Annotation[]
}

export interface Annotation {
  id: string
  type: 'highlight' | 'note' | 'drawing' | 'text' | 'signature'
  pageNumber: number
  x: number
  y: number
  width: number
  height: number
  content?: string
  color?: string
  author: string
  createdAt: Date
}

export interface PDFState {
  documents: PDFDocument[]
  activeDocument: PDFDocument | null
  recentFiles: string[]
  isLoading: boolean
  error: string | null
}

// Actions
type PDFAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_DOCUMENT'; payload: PDFDocument }
  | { type: 'REMOVE_DOCUMENT'; payload: string }
  | { type: 'SET_ACTIVE_DOCUMENT'; payload: PDFDocument | null }
  | { type: 'UPDATE_DOCUMENT'; payload: Partial<PDFDocument> & { id: string } }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'ADD_ANNOTATION'; payload: Annotation }
  | { type: 'REMOVE_ANNOTATION'; payload: string }
  | { type: 'UPDATE_ANNOTATION'; payload: Partial<Annotation> & { id: string } }
  | { type: 'ADD_RECENT_FILE'; payload: string }
  | { type: 'CLEAR_RECENT_FILES' }

// Initial state
const initialState: PDFState = {
  documents: [],
  activeDocument: null,
  recentFiles: [],
  isLoading: false,
  error: null,
}

// Reducer
function pdfReducer(state: PDFState, action: PDFAction): PDFState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    
    case 'ADD_DOCUMENT':
      return {
        ...state,
        documents: [...state.documents, action.payload],
        activeDocument: action.payload,
        isLoading: false,
        error: null,
      }
    
    case 'REMOVE_DOCUMENT':
      const filteredDocs = state.documents.filter(doc => doc.id !== action.payload)
      return {
        ...state,
        documents: filteredDocs,
        activeDocument: state.activeDocument?.id === action.payload 
          ? filteredDocs[0] || null 
          : state.activeDocument,
      }
    
    case 'SET_ACTIVE_DOCUMENT':
      return { ...state, activeDocument: action.payload }
    
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id
            ? { ...doc, ...action.payload, modifiedAt: new Date(), isModified: true }
            : doc
        ),
        activeDocument: state.activeDocument?.id === action.payload.id
          ? { ...state.activeDocument, ...action.payload, modifiedAt: new Date(), isModified: true }
          : state.activeDocument,
      }
    
    case 'SET_CURRENT_PAGE':
      if (!state.activeDocument) return state
      return {
        ...state,
        activeDocument: {
          ...state.activeDocument,
          currentPage: action.payload,
        },
      }
    
    case 'SET_ZOOM':
      if (!state.activeDocument) return state
      return {
        ...state,
        activeDocument: {
          ...state.activeDocument,
          zoom: action.payload,
        },
      }
    
    case 'ADD_ANNOTATION':
      if (!state.activeDocument) return state
      return {
        ...state,
        activeDocument: {
          ...state.activeDocument,
          annotations: [...state.activeDocument.annotations, action.payload],
          isModified: true,
          modifiedAt: new Date(),
        },
      }
    
    case 'REMOVE_ANNOTATION':
      if (!state.activeDocument) return state
      return {
        ...state,
        activeDocument: {
          ...state.activeDocument,
          annotations: state.activeDocument.annotations.filter(ann => ann.id !== action.payload),
          isModified: true,
          modifiedAt: new Date(),
        },
      }
    
    case 'UPDATE_ANNOTATION':
      if (!state.activeDocument) return state
      return {
        ...state,
        activeDocument: {
          ...state.activeDocument,
          annotations: state.activeDocument.annotations.map(ann =>
            ann.id === action.payload.id ? { ...ann, ...action.payload } : ann
          ),
          isModified: true,
          modifiedAt: new Date(),
        },
      }
    
    case 'ADD_RECENT_FILE':
      const newRecentFiles = [action.payload, ...state.recentFiles.filter(f => f !== action.payload)].slice(0, 10)
      return { ...state, recentFiles: newRecentFiles }
    
    case 'CLEAR_RECENT_FILES':
      return { ...state, recentFiles: [] }
    
    default:
      return state
  }
}

// Context
const PDFContext = createContext<{
  state: PDFState
  dispatch: React.Dispatch<PDFAction>
} | null>(null)

// Provider
export function PDFProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(pdfReducer, initialState)

  return (
    <PDFContext.Provider value={{ state, dispatch }}>
      {children}
    </PDFContext.Provider>
  )
}

// Hook
export function usePDF() {
  const context = useContext(PDFContext)
  if (!context) {
    throw new Error('usePDF must be used within a PDFProvider')
  }
  return context
}