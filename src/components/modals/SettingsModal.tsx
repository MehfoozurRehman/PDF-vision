'use client'

import { useState } from 'react'
import { useUI } from '@/store/ui-store'
import { useTranslation } from '@/lib/useTranslation'
import { XMarkIcon, MoonIcon, SunIcon, ComputerDesktopIcon, LanguageIcon } from '@heroicons/react/24/outline'

export default function SettingsModal() {
  const { state: uiState, dispatch: uiDispatch } = useUI()
  const { t, isRTL } = useTranslation()
  const [activeTab, setActiveTab] = useState('general')

  if (!uiState.modals.settings) return null

  const closeModal = () => {
    uiDispatch({ type: 'CLOSE_MODAL', payload: 'settings' })
  }

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    uiDispatch({ type: 'SET_THEME', payload: theme })
  }

  const handleLanguageChange = (language: string) => {
    uiDispatch({ type: 'SET_LANGUAGE', payload: language })
  }

  const handlePreferenceChange = (key: keyof typeof uiState.preferences, value: any) => {
    uiDispatch({ type: 'UPDATE_PREFERENCES', payload: { [key]: value } })
  }

  const tabs = [
    { id: 'general', label: t('general') },
    { id: 'display', label: t('display') },
    { id: 'editing', label: t('editing') },
    { id: 'workspace', label: 'Workspace' },
    { id: 'components', label: 'Components' },
    { id: 'shortcuts', label: 'Shortcuts' },
    { id: 'security', label: t('security') },
    { id: 'advanced', label: t('advanced') },
  ]

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">{t('language')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">{t('selectLanguage')}</label>
              <p className="text-xs text-gray-500">{t('chooseLanguage')}</p>
            </div>
            <select 
              value={uiState.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">{t('application')}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">{t('autoSave')}</label>
              <p className="text-xs text-gray-500">{t('autoSaveDescription')}</p>
            </div>
            <input 
              type="checkbox" 
              checked={uiState.preferences.autoSave}
              onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
              className="toggle" 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">{t('autoBackup')}</label>
              <p className="text-xs text-gray-500">{t('autoBackupDescription')}</p>
            </div>
            <input 
              type="checkbox" 
              checked={uiState.preferences.autoBackup}
              onChange={(e) => handlePreferenceChange('autoBackup', e.target.checked)}
              className="toggle" 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">{t('checkUpdates')}</label>
              <p className="text-xs text-gray-500">{t('checkUpdatesDescription')}</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Default Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Default zoom level</label>
            <select 
              className="input w-full"
              value={uiState.preferences.defaultZoom}
              onChange={(e) => handlePreferenceChange('defaultZoom', parseInt(e.target.value))}
            >
              <option value="50">50%</option>
              <option value="75">75%</option>
              <option value="100">100%</option>
              <option value="125">125%</option>
              <option value="150">150%</option>
              <option value="200">200%</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">Default page layout</label>
            <select 
              className="input w-full"
              value={uiState.preferences.pageLayout}
              onChange={(e) => handlePreferenceChange('pageLayout', e.target.value as 'single' | 'continuous' | 'facing')}
            >
              <option value="single">Single page</option>
              <option value="continuous">Continuous</option>
              <option value="facing">Two pages</option>
              <option value="continuous-facing">Continuous facing</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDisplaySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
              uiState.theme === 'light'
                ? 'border-adobe-blue bg-adobe-blue/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <SunIcon className="w-6 h-6 text-gray-600" />
            <span className="text-sm">Light</span>
          </button>
          
          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
              uiState.theme === 'dark'
                ? 'border-adobe-blue bg-adobe-blue/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <MoonIcon className="w-6 h-6 text-gray-600" />
            <span className="text-sm">Dark</span>
          </button>
          
          <button
            onClick={() => handleThemeChange('auto')}
            className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
              uiState.theme === 'auto'
                ? 'border-adobe-blue bg-adobe-blue/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <ComputerDesktopIcon className="w-6 h-6 text-gray-600" />
            <span className="text-sm">Auto</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Interface</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Show toolbar labels</label>
              <p className="text-xs text-gray-500">Display text labels on toolbar buttons</p>
            </div>
            <input 
              type="checkbox" 
              checked={uiState.preferences.showToolbarLabels}
              onChange={(e) => handlePreferenceChange('showToolbarLabels', e.target.checked)}
              className="toggle" 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Compact sidebar</label>
              <p className="text-xs text-gray-500">Use smaller sidebar panels</p>
            </div>
            <input 
              type="checkbox" 
              checked={uiState.preferences.compactSidebar}
              onChange={(e) => handlePreferenceChange('compactSidebar', e.target.checked)}
              className="toggle" 
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">UI scale</label>
            <select 
              className="input w-full"
              value={uiState.preferences.uiScale}
              onChange={(e) => handlePreferenceChange('uiScale', parseInt(e.target.value))}
            >
              <option value="90">90%</option>
              <option value="100">100%</option>
              <option value="110">110%</option>
              <option value="125">125%</option>
              <option value="150">150%</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">View Mode</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Toolbar display mode</label>
            <p className="text-xs text-gray-500 mb-3">Choose how toolbar buttons are displayed</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => uiDispatch({ type: 'SET_VIEW_MODE', payload: 'minimal' })}
                className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  uiState.viewMode === 'minimal'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-6 h-6 border border-gray-400 rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                </div>
                <span className="text-sm font-medium">Minimal</span>
                <span className="text-xs text-gray-500 text-center">Icons only</span>
              </button>
              
              <button
                onClick={() => uiDispatch({ type: 'SET_VIEW_MODE', payload: 'hover' })}
                className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  uiState.viewMode === 'hover'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="relative">
                  <div className="w-6 h-6 border border-gray-400 rounded flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-2 bg-gray-600 rounded-sm text-xs"></div>
                </div>
                <span className="text-sm font-medium">Hover</span>
                <span className="text-xs text-gray-500 text-center">Tooltips on hover</span>
              </button>
              
              <button
                onClick={() => uiDispatch({ type: 'SET_VIEW_MODE', payload: 'expanded' })}
                className={`p-3 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                  uiState.viewMode === 'expanded'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-7 h-7 border border-gray-400 rounded flex items-center justify-center">
                    <div className="w-4 h-4 bg-gray-400 rounded-sm"></div>
                  </div>
                  <div className="w-8 h-1 bg-gray-300 rounded"></div>
                </div>
                <span className="text-sm font-medium">Expanded</span>
                <span className="text-xs text-gray-500 text-center">Icons with labels</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderEditingSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Annotations</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Default highlight color</label>
            <div className="flex space-x-2">
              {['#fbbf24', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'].map(color => (
                <button
                  key={color}
                  onClick={() => handlePreferenceChange('defaultHighlightColor', color)}
                  className={`w-8 h-8 rounded border-2 transition-colors ${
                    uiState.preferences.defaultHighlightColor === color
                      ? 'border-adobe-blue border-4'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">Default author name</label>
            <input 
              type="text" 
              defaultValue="Mohammad Fahad Alghammas"
              className="input w-full" 
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Auto-select annotation tool</label>
              <p className="text-xs text-gray-500">Keep annotation tool selected after use</p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Text Editing</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Default font</label>
            <select className="input w-full">
              <option value="helvetica">Helvetica</option>
              <option value="times">Times New Roman</option>
              <option value="courier">Courier</option>
              <option value="arial">Arial</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">Default font size</label>
            <select className="input w-full">
              <option value="10">10pt</option>
              <option value="12">12pt</option>
              <option value="14">14pt</option>
              <option value="16">16pt</option>
              <option value="18">18pt</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Digital Signatures</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Require password for signing</label>
              <p className="text-xs text-gray-500">Always prompt for password when signing documents</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Verify signatures on open</label>
              <p className="text-xs text-gray-500">Automatically verify digital signatures when opening PDFs</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">Default signature appearance</label>
            <select className="input w-full">
              <option value="name-only">Name only</option>
              <option value="name-date">Name and date</option>
              <option value="name-date-reason">Name, date, and reason</option>
              <option value="custom">Custom appearance</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Clear recent files on exit</label>
              <p className="text-xs text-gray-500">Remove recent files list when closing application</p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Disable telemetry</label>
              <p className="text-xs text-gray-500">Don't send usage data to improve the application</p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      </div>
    </div>
  )

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Performance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Memory usage limit (MB)</label>
            <input 
              type="number" 
              defaultValue="512"
              min="256"
              max="2048"
              className="input w-full" 
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">Page cache size</label>
            <select className="input w-full">
              <option value="5">5 pages</option>
              <option value="10">10 pages</option>
              <option value="20">20 pages</option>
              <option value="50">50 pages</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Hardware acceleration</label>
              <p className="text-xs text-gray-500">Use GPU for rendering when available</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Developer</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Enable debug mode</label>
              <p className="text-xs text-gray-500">Show additional debugging information</p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Show developer tools</label>
              <p className="text-xs text-gray-500">Enable access to browser developer tools</p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      </div>
    </div>
  )

  const renderWorkspaceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Toolbar Customization</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Show quick access toolbar</label>
              <p className="text-xs text-gray-500">Display frequently used tools in a separate toolbar</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Floating toolbar</label>
              <p className="text-xs text-gray-500">Allow toolbar to float and be repositioned</p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">Toolbar position</label>
            <select className="input w-full">
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">Toolbar size</label>
            <select className="input w-full">
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Workspace Layout</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Default layout</label>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 border rounded-lg text-center hover:bg-gray-50">
                <div className="w-full h-12 bg-gray-200 rounded mb-2"></div>
                <span className="text-xs">Standard</span>
              </button>
              <button className="p-3 border rounded-lg text-center hover:bg-gray-50">
                <div className="flex h-12 gap-1">
                  <div className="w-1/3 bg-gray-200 rounded"></div>
                  <div className="w-2/3 bg-gray-200 rounded"></div>
                </div>
                <span className="text-xs mt-2 block">With Sidebar</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Remember window size</label>
              <p className="text-xs text-gray-500">Restore window dimensions on startup</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Auto-hide panels</label>
              <p className="text-xs text-gray-500">Automatically hide inactive panels to save space</p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      </div>

      <div>
         <h3 className="text-sm font-medium text-gray-900 mb-3">Color Schemes</h3>
         <div className="space-y-4">
           <div className="grid grid-cols-3 gap-3">
             <button className="p-3 border rounded-lg text-center hover:bg-gray-50">
               <div className="w-full h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-2"></div>
               <span className="text-xs">Professional</span>
             </button>
             <button className="p-3 border rounded-lg text-center hover:bg-gray-50">
               <div className="w-full h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded mb-2"></div>
               <span className="text-xs">Nature</span>
             </button>
             <button className="p-3 border rounded-lg text-center hover:bg-gray-50">
               <div className="w-full h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded mb-2"></div>
               <span className="text-xs">Warm</span>
             </button>
           </div>
           
           <div>
             <label className="block text-sm text-gray-700 mb-1">Custom accent color</label>
             <input type="color" defaultValue="#0066cc" className="w-full h-10 rounded border" />
           </div>
         </div>
       </div>

       <div>
         <h3 className="text-sm font-medium text-gray-900 mb-3">PDF Styling</h3>
         <div className="space-y-4">
           <div>
             <label className="block text-sm text-gray-700 mb-1">Page background color</label>
             <input type="color" defaultValue="#ffffff" className="w-full h-10 rounded border" />
           </div>
           
           <div>
             <label className="block text-sm text-gray-700 mb-1">Page border color</label>
             <input type="color" defaultValue="#e2e8f0" className="w-full h-10 rounded border" />
           </div>
           
           <div>
             <label className="block text-sm text-gray-700 mb-1">Page shadow intensity</label>
             <input type="range" min="0" max="100" defaultValue="20" className="w-full" />
           </div>
           
           <div>
             <label className="block text-sm text-gray-700 mb-1">Page spacing</label>
             <select className="input w-full">
               <option value="compact">Compact</option>
               <option value="normal">Normal</option>
               <option value="comfortable">Comfortable</option>
               <option value="spacious">Spacious</option>
             </select>
           </div>
         </div>
       </div>

       <div>
         <h3 className="text-sm font-medium text-gray-900 mb-3">Component Styling</h3>
         <div className="space-y-4">
           <div>
             <label className="block text-sm text-gray-700 mb-1">Toolbar style</label>
             <div className="grid grid-cols-2 gap-3">
               <button className="p-3 border rounded-lg text-center hover:bg-gray-50">
                 <div className="w-full h-6 bg-white border rounded mb-2"></div>
                 <span className="text-xs">Minimal</span>
               </button>
               <button className="p-3 border rounded-lg text-center hover:bg-gray-50">
                 <div className="w-full h-6 bg-gray-100 rounded mb-2"></div>
                 <span className="text-xs">Classic</span>
               </button>
             </div>
           </div>
           
           <div>
             <label className="block text-sm text-gray-700 mb-1">Button style</label>
             <select className="input w-full">
               <option value="rounded">Rounded</option>
               <option value="square">Square</option>
               <option value="pill">Pill</option>
               <option value="minimal">Minimal</option>
             </select>
           </div>
           
           <div>
             <label className="block text-sm text-gray-700 mb-1">Icon style</label>
             <select className="input w-full">
               <option value="outline">Outline</option>
               <option value="solid">Solid</option>
               <option value="duotone">Duotone</option>
             </select>
           </div>
         </div>
       </div>
    </div>
  )

  const renderComponentsSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">PDF Viewer Components</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Show page thumbnails</label>
              <p className="text-xs text-gray-500">Display thumbnail navigation panel</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Show bookmarks panel</label>
              <p className="text-xs text-gray-500">Display document bookmarks in sidebar</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Show annotations panel</label>
              <p className="text-xs text-gray-500">Display annotations list and management</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Show search panel</label>
              <p className="text-xs text-gray-500">Display advanced search functionality</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Toolbar Components</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Zoom controls</label>
              <p className="text-xs text-gray-500">Show zoom in/out buttons and percentage</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Page navigation</label>
              <p className="text-xs text-gray-500">Show page number input and navigation arrows</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">View mode selector</label>
              <p className="text-xs text-gray-500">Show single/continuous page view options</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Annotation tools</label>
              <p className="text-xs text-gray-500">Show highlight, note, and drawing tools</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Status Bar Components</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Document info</label>
              <p className="text-xs text-gray-500">Show file name, size, and page count</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Zoom level indicator</label>
              <p className="text-xs text-gray-500">Display current zoom percentage</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Selection info</label>
              <p className="text-xs text-gray-500">Show selected text or object details</p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Context Menu Components</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Text selection menu</label>
              <p className="text-xs text-gray-500">Show copy, highlight, and note options</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Image context menu</label>
              <p className="text-xs text-gray-500">Show save, copy, and annotation options</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Link context menu</label>
              <p className="text-xs text-gray-500">Show open, copy, and edit link options</p>
            </div>
            <input type="checkbox" defaultChecked className="toggle" />
          </div>
        </div>
      </div>
    </div>
  )

  const renderShortcutsSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Navigation Shortcuts</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Next page</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">→ or Page Down</kbd>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Previous page</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">← or Page Up</kbd>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">First page</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Home</kbd>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Last page</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">End</kbd>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Tool Shortcuts</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Select tool</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">V</kbd>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Hand tool</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">H</kbd>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Text tool</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">T</kbd>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Highlight tool</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">U</kbd>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">View Shortcuts</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Zoom in</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + +</kbd>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Zoom out</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + -</kbd>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Fit to width</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + 1</kbd>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-700">Actual size</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + 0</kbd>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Custom Shortcuts</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-gray-700">Enable custom shortcuts</label>
              <p className="text-xs text-gray-500">Allow customization of keyboard shortcuts</p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
          
          <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            Customize Shortcuts...
          </button>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'display':
        return renderDisplaySettings()
      case 'editing':
        return renderEditingSettings()
      case 'workspace':
        return renderWorkspaceSettings()
      case 'components':
        return renderComponentsSettings()
      case 'shortcuts':
        return renderShortcutsSettings()
      case 'security':
        return renderSecuritySettings()
      case 'advanced':
        return renderAdvancedSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{t('settings')}</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-200 bg-gray-50">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-adobe-blue text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // TODO: Save settings
              closeModal()
            }}
            className="px-4 py-2 bg-adobe-blue text-white rounded-lg hover:bg-adobe-blue-dark transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}