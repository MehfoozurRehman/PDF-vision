'use client';

import React, { useState } from 'react';
import {
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon,
  DocumentDuplicateIcon,
  ChatBubbleLeftIcon,
  PencilIcon,
  ShieldCheckIcon,
  CogIcon,
  CloudIcon,
  SparklesIcon,
  FolderIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  ScissorsIcon,
  MagnifyingGlassIcon,
  PaintBrushIcon,
  BookmarkIcon,
  UserGroupIcon,
  LockClosedIcon,
  DocumentCheckIcon,
  CameraIcon,
  GlobeAltIcon,
  CalculatorIcon,
  CubeIcon,
  PlayIcon,
  ScaleIcon,
  CodeBracketIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useUI } from '../store/ui-store';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  action: () => void;
}

interface ToolCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  tools: Tool[];
}

const AllToolsMenu: React.FC = () => {
  const { state: uiState, dispatch: uiDispatch } = useUI();
  const [activeCategory, setActiveCategory] = useState<string>('editing');

  const toolCategories: ToolCategory[] = [
    {
      id: 'editing',
      name: 'PDF Editing',
      icon: PencilIcon,
      tools: [
        {
          id: 'edit-text',
          name: 'Edit Text',
          description: 'Modify text directly with formatting controls',
          icon: DocumentTextIcon,
          action: () => console.log('Edit Text')
        },
        {
          id: 'edit-images',
          name: 'Edit Images & Objects',
          description: 'Insert, replace, move, resize, crop images',
          icon: PhotoIcon,
          action: () => console.log('Edit Images')
        },
        {
          id: 'links-attachments',
          name: 'Links & Attachments',
          description: 'Add clickable links and attach files',
          icon: LinkIcon,
          action: () => console.log('Links & Attachments')
        },
        {
          id: 'headers-footers',
          name: 'Headers & Footers',
          description: 'Add headers, footers, backgrounds, watermarks',
          icon: DocumentTextIcon,
          action: () => console.log('Headers & Footers')
        },
        {
          id: 'page-rotation',
          name: 'Page Rotation & Cropping',
          description: 'Adjust orientation and trim margins',
          icon: DocumentTextIcon,
          action: () => console.log('Page Rotation')
        }
      ]
    },
    {
      id: 'organizing',
      name: 'Page Organization',
      icon: FolderIcon,
      tools: [
        {
          id: 'reorder-pages',
          name: 'Reorder Pages',
          description: 'Drag-and-drop thumbnails to change order',
          icon: DocumentDuplicateIcon,
          action: () => console.log('Reorder Pages')
        },
        {
          id: 'insert-delete-pages',
          name: 'Insert/Delete Pages',
          description: 'Manage page content with simple actions',
          icon: DocumentArrowUpIcon,
          action: () => console.log('Insert/Delete Pages')
        },
        {
          id: 'combine-files',
          name: 'Combine Files',
          description: 'Merge multiple documents into single PDF',
          icon: DocumentDuplicateIcon,
          action: () => console.log('Combine Files')
        },
        {
          id: 'split-document',
          name: 'Split Document',
          description: 'Break large PDFs into smaller files',
          icon: ScissorsIcon,
          action: () => console.log('Split Document')
        },
        {
          id: 'bates-numbering',
          name: 'Bates Numbering',
          description: 'Add sequential identifiers for workflows',
          icon: CalculatorIcon,
          action: () => uiDispatch({ type: 'OPEN_MODAL', payload: 'bates' })
        }
      ]
    },
    {
      id: 'creation',
      name: 'Creation & Conversion',
      icon: DocumentArrowUpIcon,
      tools: [
        {
          id: 'create-from-files',
          name: 'Create from Files',
          description: 'Generate PDFs from Word, Excel, PowerPoint, images',
          icon: DocumentArrowUpIcon,
          action: () => uiDispatch({ type: 'OPEN_MODAL', payload: 'create' })
        },
        {
          id: 'scan-to-pdf',
          name: 'Scan to PDF',
          description: 'Connect scanner, digitize documents with OCR',
          icon: CameraIcon,
          action: () => uiDispatch({ type: 'OPEN_MODAL', payload: 'create' })
        },
        {
          id: 'web-to-pdf',
          name: 'Web to PDF',
          description: 'Capture webpages as PDF documents',
          icon: GlobeAltIcon,
          action: () => uiDispatch({ type: 'OPEN_MODAL', payload: 'create' })
        },
        {
          id: 'export-options',
          name: 'Export Options',
          description: 'Export to Word, Excel, PowerPoint, images',
          icon: DocumentArrowDownIcon,
          action: () => uiDispatch({ type: 'OPEN_MODAL', payload: 'export' })
        },
        {
          id: 'batch-conversion',
          name: 'Batch Conversion',
          description: 'Process multiple files at once',
          icon: DocumentDuplicateIcon,
          action: () => console.log('Batch Conversion')
        }
      ]
    },
    {
      id: 'commenting',
      name: 'Commenting & Review',
      icon: ChatBubbleLeftIcon,
      tools: [
        {
          id: 'sticky-notes',
          name: 'Sticky Notes',
          description: 'Place comments anywhere on document',
          icon: ChatBubbleLeftIcon,
          action: () => uiDispatch({ type: 'OPEN_MODAL', payload: 'stickyNotes' })
        },
        {
          id: 'text-markup',
          name: 'Text Markup',
          description: 'Highlight, underline, strike through text',
          icon: PaintBrushIcon,
          action: () => uiDispatch({ type: 'OPEN_MODAL', payload: 'textMarkup' })
        },
        {
          id: 'drawing-tools',
          name: 'Drawing Tools',
          description: 'Shapes, arrows, freehand pen for feedback',
          icon: PencilIcon,
          action: () => uiDispatch({ type: 'OPEN_MODAL', payload: 'drawingTools' })
        },
        {
          id: 'stamps',
          name: 'Stamps',
          description: 'Predefined or custom stamps like "Approved"',
          icon: BookmarkIcon,
          action: () => uiDispatch({ type: 'OPEN_MODAL', payload: 'stamps' })
        },
        {
          id: 'shared-review',
          name: 'Shared Review',
          description: 'Send document link for real-time collaboration',
          icon: UserGroupIcon,
          action: () => uiDispatch({ type: 'OPEN_MODAL', payload: 'sharedReview' })
        }
      ]
    },
    {
      id: 'forms',
      name: 'Forms & Data',
      icon: DocumentCheckIcon,
      tools: [
        {
          id: 'auto-detect-fields',
          name: 'Auto-Detect Fields',
          description: 'Automatically convert form areas to interactive fields',
          icon: MagnifyingGlassIcon,
          action: () => console.log('Auto-Detect Fields')
        },
        {
          id: 'field-types',
          name: 'Field Types',
          description: 'Text boxes, checkboxes, dropdowns, signatures',
          icon: DocumentCheckIcon,
          action: () => console.log('Field Types')
        },
        {
          id: 'form-logic',
          name: 'Form Logic',
          description: 'Add calculations, validation, conditional visibility',
          icon: CalculatorIcon,
          action: () => console.log('Form Logic')
        },
        {
          id: 'data-collection',
          name: 'Data Collection',
          description: 'Aggregate responses into spreadsheet or database',
          icon: DocumentDuplicateIcon,
          action: () => console.log('Data Collection')
        }
      ]
    },
    {
      id: 'signatures',
      name: 'Signatures & Approvals',
      icon: PencilIcon,
      tools: [
        {
          id: 'fill-sign',
          name: 'Fill & Sign',
          description: 'Add text and signatures quickly',
          icon: PencilIcon,
          action: () => console.log('Fill & Sign')
        },
        {
          id: 'request-signatures',
          name: 'Request Signatures',
          description: 'Send documents for signing with tracking',
          icon: UserGroupIcon,
          action: () => console.log('Request Signatures')
        },
        {
          id: 'digital-certificates',
          name: 'Digital Certificates',
          description: 'Apply secure cryptographic signatures',
          icon: ShieldCheckIcon,
          action: () => console.log('Digital Certificates')
        },
        {
          id: 'certify-documents',
          name: 'Certify Documents',
          description: 'Lock documents while allowing specific actions',
          icon: LockClosedIcon,
          action: () => console.log('Certify Documents')
        }
      ]
    },
    {
      id: 'security',
      name: 'Security & Compliance',
      icon: ShieldCheckIcon,
      tools: [
        {
          id: 'password-protection',
          name: 'Password Protection',
          description: 'Require password to open or perform actions',
          icon: LockClosedIcon,
          action: () => console.log('Password Protection')
        },
        {
          id: 'certificate-encryption',
          name: 'Certificate Encryption',
          description: 'Restrict access using digital IDs',
          icon: ShieldCheckIcon,
          action: () => console.log('Certificate Encryption')
        },
        {
          id: 'permissions',
          name: 'Permissions',
          description: 'Control printing, copying, editing rights',
          icon: CogIcon,
          action: () => console.log('Permissions')
        },
        {
          id: 'redaction',
          name: 'Redaction',
          description: 'Permanently remove sensitive content',
          icon: XMarkIcon,
          action: () => console.log('Redaction')
        }
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced Features',
      icon: CogIcon,
      tools: [
        {
          id: 'ocr',
          name: 'OCR',
          description: 'Convert scanned PDFs to searchable text',
          icon: MagnifyingGlassIcon,
          action: () => console.log('OCR')
        },
        {
          id: 'optimize-pdf',
          name: 'Optimize PDF',
          description: 'Reduce file size with compression',
          icon: CogIcon,
          action: () => console.log('Optimize PDF')
        },
        {
          id: 'compare-pdfs',
          name: 'Compare PDFs',
          description: 'Highlight differences between versions',
          icon: DocumentDuplicateIcon,
          action: () => console.log('Compare PDFs')
        },
        {
          id: 'multimedia-3d',
          name: 'Multimedia & 3D',
          description: 'Embed video, audio, 3D models',
          icon: CubeIcon,
          action: () => console.log('Multimedia & 3D')
        },
        {
          id: 'measurement-tools',
          name: 'Measurement Tools',
          description: 'Measure distances, perimeters, areas',
          icon: ScaleIcon,
          action: () => console.log('Measurement Tools')
        },
        {
          id: 'javascript-support',
          name: 'JavaScript Support',
          description: 'Add scripts for advanced behaviors',
          icon: CodeBracketIcon,
          action: () => console.log('JavaScript Support')
        }
      ]
    },
    {
      id: 'integration',
      name: 'Integration & Collaboration',
      icon: CloudIcon,
      tools: [
        {
          id: 'cloud-storage',
          name: 'Cloud Storage',
          description: 'Connect to OneDrive, Google Drive, Dropbox',
          icon: CloudIcon,
          action: () => console.log('Cloud Storage')
        },
        {
          id: 'office-integration',
          name: 'Office Integration',
          description: 'One-click PDF creation from Office apps',
          icon: DocumentArrowUpIcon,
          action: () => console.log('Office Integration')
        },
        {
          id: 'collaboration-spaces',
          name: 'Collaboration Spaces',
          description: 'Group files into shared team spaces',
          icon: UserGroupIcon,
          action: () => console.log('Collaboration Spaces')
        }
      ]
    },
    {
      id: 'ai',
      name: 'AI & Smart Features',
      icon: SparklesIcon,
      tools: [
        {
          id: 'ai-assist',
          name: 'AI Assist',
          description: 'Intelligent document analysis and suggestions',
          icon: SparklesIcon,
          action: () => console.log('AI Assist')
        },
        {
          id: 'smart-extraction',
          name: 'Smart Extraction',
          description: 'Automatically extract data and insights',
          icon: MagnifyingGlassIcon,
          action: () => console.log('Smart Extraction')
        },
        {
          id: 'auto-tagging',
          name: 'Auto Tagging',
          description: 'Automatically tag and categorize content',
          icon: BookmarkIcon,
          action: () => console.log('Auto Tagging')
        }
      ]
    }
  ];

  if (!uiState.showAllToolsMenu) return null;

  const activeTools = toolCategories.find(cat => cat.id === activeCategory)?.tools || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl w-11/12 h-5/6 max-w-6xl flex">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">All Tools</h2>
          <button
            onClick={() => uiDispatch({ type: 'SET_ALL_TOOLS_MENU', payload: false })}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Categories Sidebar */}
        <div className="w-1/3 bg-gray-50 border-r border-gray-200 pt-16 pb-4">
          <div className="px-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Categories</h3>
            <div className="space-y-1">
              {toolCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="flex-1 pt-16 pb-4 px-6 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {toolCategories.find(cat => cat.id === activeCategory)?.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {activeTools.length} tools available
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={tool.action}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                        {tool.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllToolsMenu;