"use client";

import React, { useState, useEffect } from "react";
import { Card, Badge } from "@/components/ui";
import {
  DocumentDuplicateIcon,
  EyeIcon,
  ArrowsRightLeftIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  PhotoIcon,
  TableCellsIcon,
  ListBulletIcon,
  HashtagIcon,
  PlusIcon,
  MinusIcon,
  PencilIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  LightBulbIcon,
  SparklesIcon,
  BookOpenIcon,
  TagIcon,
  FolderIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  EllipsisHorizontalIcon,
  Square2StackIcon,
  RectangleStackIcon,
  WindowIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
  EyeSlashIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  BellIcon,
  BellSlashIcon,
  CpuChipIcon,
  CloudIcon,
  ServerIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  KeyIcon,
  FingerPrintIcon,
  BugAntIcon,
  WrenchScrewdriverIcon,
  CommandLineIcon,
  CodeBracketIcon,
  CubeIcon,
  PuzzlePieceIcon,
  BeakerIcon,
  RocketLaunchIcon,
  FireIcon,
  BoltIcon,
  StarIcon,
  HeartIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  HomeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CreditCardIcon,
  BanknotesIcon,
  ShoppingCartIcon,
  TruckIcon,
  GiftIcon,
  TicketIcon,
  FilmIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  CameraIcon,
  PaintBrushIcon,
  SwatchIcon,
  SunIcon,
  MoonIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  WifiIcon,
  SignalIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  TvIcon,
  RadioIcon,
  MegaphoneIcon,
  NewspaperIcon,
  BookmarkIcon,
  ArchiveBoxIcon,
  InboxIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  ClipboardIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  DocumentIcon,
  DocumentPlusIcon,
  DocumentMinusIcon,
  DocumentCheckIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  DocumentMagnifyingGlassIcon,
  FolderPlusIcon,
  FolderMinusIcon,
  FolderOpenIcon,
  FolderArrowDownIcon,
  IdentificationIcon,
  QrCodeIcon,
  LinkIcon,
  AtSymbolIcon,
  NumberedListIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
  Bars3Icon,
  Bars4Icon,
  QueueListIcon,
  RectangleGroupIcon,
  CircleStackIcon,
  Square3Stack3DIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface DocumentVersion {
  id: string;
  name: string;
  version: string;
  createdAt: Date;
  author: string;
  size: number;
  pageCount: number;
  checksum: string;
  metadata: {
    title?: string;
    subject?: string;
    keywords?: string[];
    creator?: string;
    producer?: string;
    creationDate?: Date;
    modificationDate?: Date;
  };
  thumbnail?: string;
  path: string;
}

interface ComparisonResult {
  id: string;
  documentA: DocumentVersion;
  documentB: DocumentVersion;
  createdAt: Date;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  changes: DocumentChange[];
  statistics: ComparisonStatistics;
  settings: ComparisonSettings;
  duration?: number;
  error?: string;
}

interface DocumentChange {
  id: string;
  type: "added" | "removed" | "modified" | "moved" | "formatted";
  category: "text" | "image" | "table" | "list" | "heading" | "paragraph" | "metadata" | "structure";
  page: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  content: {
    before?: string;
    after?: string;
    preview?: string;
  };
  confidence: number;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  context: string;
  suggestions?: string[];
  metadata?: Record<string, any>;
}

interface ComparisonStatistics {
  totalChanges: number;
  changesByType: Record<string, number>;
  changesByCategory: Record<string, number>;
  changesBySeverity: Record<string, number>;
  pagesAffected: number;
  similarityScore: number;
  processingTime: number;
  confidence: number;
}

interface ComparisonSettings {
  sensitivity: "low" | "medium" | "high";
  ignoreFormatting: boolean;
  ignoreWhitespace: boolean;
  ignoreCase: boolean;
  ignoreImages: boolean;
  ignoreTables: boolean;
  ignoreMetadata: boolean;
  compareStructure: boolean;
  compareContent: boolean;
  compareVisual: boolean;
  highlightChanges: boolean;
  showLineNumbers: boolean;
  contextLines: number;
}

interface ComparisonFilter {
  types: string[];
  categories: string[];
  severities: string[];
  pages: number[];
  authors: string[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  searchQuery: string;
}

interface DocumentComparisonProps {
  documents: DocumentVersion[];
  comparisons: ComparisonResult[];
  onCompare: (docA: string, docB: string, settings: ComparisonSettings) => void;
  onDeleteComparison: (comparisonId: string) => void;
  onExportComparison: (comparisonId: string, format: "pdf" | "html" | "json" | "csv") => void;
  onShareComparison: (comparisonId: string) => void;
  isActive: boolean;
  onClose: () => void;
}

const CHANGE_TYPES = [
  { id: "added", name: "Added", color: "text-green-600 bg-green-100", icon: PlusIcon },
  { id: "removed", name: "Removed", color: "text-red-600 bg-red-100", icon: MinusIcon },
  { id: "modified", name: "Modified", color: "text-blue-600 bg-blue-100", icon: PencilIcon },
  { id: "moved", name: "Moved", color: "text-purple-600 bg-purple-100", icon: ArrowsRightLeftIcon },
  { id: "formatted", name: "Formatted", color: "text-orange-600 bg-orange-100", icon: PaintBrushIcon },
];

const CHANGE_CATEGORIES = [
  { id: "text", name: "Text", icon: DocumentTextIcon },
  { id: "image", name: "Images", icon: PhotoIcon },
  { id: "table", name: "Tables", icon: TableCellsIcon },
  { id: "list", name: "Lists", icon: ListBulletIcon },
  { id: "heading", name: "Headings", icon: HashtagIcon },
  { id: "paragraph", name: "Paragraphs", icon: DocumentIcon },
  { id: "metadata", name: "Metadata", icon: TagIcon },
  { id: "structure", name: "Structure", icon: RectangleStackIcon },
];

const SEVERITY_LEVELS = [
  { id: "low", name: "Low", color: "text-gray-600 bg-gray-100", icon: InformationCircleIcon },
  { id: "medium", name: "Medium", color: "text-yellow-600 bg-yellow-100", icon: ExclamationTriangleIcon },
  { id: "high", name: "High", color: "text-orange-600 bg-orange-100", icon: ExclamationCircleIcon },
  { id: "critical", name: "Critical", color: "text-red-600 bg-red-100", icon: XCircleIcon },
];

const DEFAULT_SETTINGS: ComparisonSettings = {
  sensitivity: "medium",
  ignoreFormatting: false,
  ignoreWhitespace: true,
  ignoreCase: false,
  ignoreImages: false,
  ignoreTables: false,
  ignoreMetadata: false,
  compareStructure: true,
  compareContent: true,
  compareVisual: true,
  highlightChanges: true,
  showLineNumbers: true,
  contextLines: 3,
};

export default function DocumentComparison({
  documents,
  comparisons,
  onCompare,
  onDeleteComparison,
  onExportComparison,
  onShareComparison,
  isActive,
  onClose,
}: DocumentComparisonProps) {
  const [activeTab, setActiveTab] = useState<"compare" | "results" | "history" | "settings">("compare");
  const [selectedDocA, setSelectedDocA] = useState<string>("");
  const [selectedDocB, setSelectedDocB] = useState<string>("");
  const [comparisonSettings, setComparisonSettings] = useState<ComparisonSettings>(DEFAULT_SETTINGS);
  const [selectedComparison, setSelectedComparison] = useState<ComparisonResult | null>(null);
  const [viewMode, setViewMode] = useState<"side-by-side" | "unified" | "changes-only">("side-by-side");
  const [filter, setFilter] = useState<ComparisonFilter>({
    types: [],
    categories: [],
    severities: [],
    pages: [],
    authors: [],
    dateRange: {},
    searchQuery: "",
  });
  const [expandedChanges, setExpandedChanges] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);
  const [sortBy, setSortBy] = useState<"page" | "type" | "severity" | "time">("page");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const getChangeTypeConfig = (type: string) => {
    return CHANGE_TYPES.find((t) => t.id === type) || CHANGE_TYPES[0];
  };

  const getSeverityConfig = (severity: string) => {
    return SEVERITY_LEVELS.find((s) => s.id === severity) || SEVERITY_LEVELS[0];
  };

  const filteredChanges =
    selectedComparison?.changes.filter((change) => {
      if (filter.types.length > 0 && !filter.types.includes(change.type)) return false;
      if (filter.categories.length > 0 && !filter.categories.includes(change.category)) return false;
      if (filter.severities.length > 0 && !filter.severities.includes(change.severity)) return false;
      if (filter.pages.length > 0 && !filter.pages.includes(change.page)) return false;
      if (
        filter.searchQuery &&
        !change.description.toLowerCase().includes(filter.searchQuery.toLowerCase()) &&
        !change.content.before?.toLowerCase().includes(filter.searchQuery.toLowerCase()) &&
        !change.content.after?.toLowerCase().includes(filter.searchQuery.toLowerCase())
      )
        return false;
      return true;
    }) || [];

  const sortedChanges = [...filteredChanges].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "page":
        comparison = a.page - b.page;
        break;
      case "type":
        comparison = a.type.localeCompare(b.type);
        break;
      case "severity":
        const severityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
        comparison = severityOrder[a.severity] - severityOrder[b.severity];
        break;
      case "time":
        comparison = a.position.y - b.position.y;
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const toggleChangeExpansion = (changeId: string) => {
    const newExpanded = new Set(expandedChanges);
    if (newExpanded.has(changeId)) {
      newExpanded.delete(changeId);
    } else {
      newExpanded.add(changeId);
    }
    setExpandedChanges(newExpanded);
  };

  const handleCompare = () => {
    if (selectedDocA && selectedDocB && selectedDocA !== selectedDocB) {
      onCompare(selectedDocA, selectedDocB, comparisonSettings);
    }
  };

  const renderCompareTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document A Selection */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Document A (Original)</h3>

          <div className="space-y-4">
            <select
              value={selectedDocA}
              onChange={(e) => setSelectedDocA(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select document...</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} (v{doc.version})
                </option>
              ))}
            </select>

            {selectedDocA &&
              (() => {
                const doc = documents.find((d) => d.id === selectedDocA);
                return doc ? (
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Version:</span>
                      <span className="text-sm font-medium text-gray-900">{doc.version}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Author:</span>
                      <span className="text-sm text-gray-900">{doc.author}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Size:</span>
                      <span className="text-sm text-gray-900">{formatFileSize(doc.size)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pages:</span>
                      <span className="text-sm text-gray-900">{doc.pageCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm text-gray-900">{doc.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                ) : null;
              })()}
          </div>
        </Card>

        {/* Document B Selection */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Document B (Comparison)</h3>

          <div className="space-y-4">
            <select
              value={selectedDocB}
              onChange={(e) => setSelectedDocB(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select document...</option>
              {documents
                .filter((doc) => doc.id !== selectedDocA)
                .map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} (v{doc.version})
                  </option>
                ))}
            </select>

            {selectedDocB &&
              (() => {
                const doc = documents.find((d) => d.id === selectedDocB);
                return doc ? (
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Version:</span>
                      <span className="text-sm font-medium text-gray-900">{doc.version}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Author:</span>
                      <span className="text-sm text-gray-900">{doc.author}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Size:</span>
                      <span className="text-sm text-gray-900">{formatFileSize(doc.size)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Pages:</span>
                      <span className="text-sm text-gray-900">{doc.pageCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm text-gray-900">{doc.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                ) : null;
              })()}
          </div>
        </Card>
      </div>

      {/* Comparison Settings */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Comparison Settings</h3>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            {showSettings ? "Hide" : "Show"} Advanced
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sensitivity</label>
            <select
              value={comparisonSettings.sensitivity}
              onChange={(e) =>
                setComparisonSettings({
                  ...comparisonSettings,
                  sensitivity: e.target.value as "low" | "medium" | "high",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low - Major changes only</option>
              <option value="medium">Medium - Balanced detection</option>
              <option value="high">High - Detect all changes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Context Lines</label>
            <input
              type="number"
              min="0"
              max="10"
              value={comparisonSettings.contextLines}
              onChange={(e) =>
                setComparisonSettings({
                  ...comparisonSettings,
                  contextLines: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={comparisonSettings.highlightChanges}
                onChange={(e) =>
                  setComparisonSettings({
                    ...comparisonSettings,
                    highlightChanges: e.target.checked,
                  })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Highlight Changes</span>
            </label>
          </div>
        </div>

        {showSettings && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={comparisonSettings.ignoreFormatting}
                  onChange={(e) =>
                    setComparisonSettings({
                      ...comparisonSettings,
                      ignoreFormatting: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Ignore Formatting</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={comparisonSettings.ignoreWhitespace}
                  onChange={(e) =>
                    setComparisonSettings({
                      ...comparisonSettings,
                      ignoreWhitespace: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Ignore Whitespace</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={comparisonSettings.ignoreCase}
                  onChange={(e) =>
                    setComparisonSettings({
                      ...comparisonSettings,
                      ignoreCase: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Ignore Case</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={comparisonSettings.ignoreImages}
                  onChange={(e) =>
                    setComparisonSettings({
                      ...comparisonSettings,
                      ignoreImages: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Ignore Images</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={comparisonSettings.ignoreTables}
                  onChange={(e) =>
                    setComparisonSettings({
                      ...comparisonSettings,
                      ignoreTables: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Ignore Tables</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={comparisonSettings.ignoreMetadata}
                  onChange={(e) =>
                    setComparisonSettings({
                      ...comparisonSettings,
                      ignoreMetadata: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Ignore Metadata</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={comparisonSettings.compareStructure}
                  onChange={(e) =>
                    setComparisonSettings({
                      ...comparisonSettings,
                      compareStructure: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Compare Structure</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={comparisonSettings.compareVisual}
                  onChange={(e) =>
                    setComparisonSettings({
                      ...comparisonSettings,
                      compareVisual: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Compare Visual</span>
              </label>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={handleCompare}
            disabled={!selectedDocA || !selectedDocB || selectedDocA === selectedDocB}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <ArrowsRightLeftIcon className="w-4 h-4" />
            <span>Compare Documents</span>
          </button>
        </div>
      </Card>
    </div>
  );

  const renderResultsTab = () => (
    <div className="space-y-6">
      {selectedComparison ? (
        <div className="space-y-6">
          {/* Comparison Header */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedComparison.documentA.name} vs {selectedComparison.documentB.name}
                </h3>
                <p className="text-sm text-gray-500">Compared on {selectedComparison.createdAt.toLocaleDateString()}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedComparison(null)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Back to List
                </button>

                <button
                  onClick={() => onExportComparison(selectedComparison.id, "pdf")}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Export
                </button>

                <button
                  onClick={() => onShareComparison(selectedComparison.id)}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedComparison.statistics.totalChanges}</p>
                <p className="text-sm text-gray-600">Total Changes</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedComparison.statistics.pagesAffected}</p>
                <p className="text-sm text-gray-600">Pages Affected</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(selectedComparison.statistics.similarityScore * 100)}%
                </p>
                <p className="text-sm text-gray-600">Similarity</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {selectedComparison.duration ? formatDuration(selectedComparison.duration) : "N/A"}
                </p>
                <p className="text-sm text-gray-600">Processing Time</p>
              </div>
            </div>
          </Card>

          {/* View Mode Controls */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">View:</span>
                  <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="side-by-side">Side by Side</option>
                    <option value="unified">Unified</option>
                    <option value="changes-only">Changes Only</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="page">Page</option>
                    <option value="type">Type</option>
                    <option value="severity">Severity</option>
                    <option value="time">Position</option>
                  </select>
                </div>

                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  {sortOrder === "asc" ? (
                    <ArrowUpIcon className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search changes..."
                    value={filter.searchQuery}
                    onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
                    className="pl-10 pr-4 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  <FunnelIcon className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </Card>

          {/* Changes List */}
          <div className="space-y-3">
            {sortedChanges.map((change) => {
              const typeConfig = getChangeTypeConfig(change.type);
              const severityConfig = getSeverityConfig(change.severity);
              const TypeIcon = typeConfig.icon;
              const SeverityIcon = severityConfig.icon;
              const isExpanded = expandedChanges.has(change.id);

              return (
                <Card key={change.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={cn("p-2 rounded-lg", typeConfig.color)}>
                        <TypeIcon className="w-5 h-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{change.description}</h4>

                          <Badge className={cn("text-xs", typeConfig.color)}>{typeConfig.name}</Badge>

                          <Badge className={cn("text-xs", severityConfig.color)}>
                            <SeverityIcon className="w-3 h-3 mr-1" />
                            {severityConfig.name}
                          </Badge>

                          <Badge className="bg-gray-100 text-gray-700 text-xs">Page {change.page}</Badge>

                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            {Math.round(change.confidence * 100)}% confidence
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{change.context}</p>

                        {(change.content.before || change.content.after) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            {change.content.before && (
                              <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-1">Before</h5>
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap">
                                    {change.content.before}
                                  </p>
                                </div>
                              </div>
                            )}

                            {change.content.after && (
                              <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-1">After</h5>
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                  <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap">
                                    {change.content.after}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {change.suggestions && change.suggestions.length > 0 && isExpanded && (
                          <div className="mt-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Suggestions</h5>
                            <ul className="list-disc list-inside space-y-1">
                              {change.suggestions.map((suggestion, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {change.suggestions && change.suggestions.length > 0 && (
                        <button
                          onClick={() => toggleChangeExpansion(change.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUpIcon className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      )}

                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <EllipsisHorizontalIcon className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Comparison Results</h3>

          <div className="grid grid-cols-1 gap-4">
            {comparisons.map((comparison) => (
              <Card
                key={comparison.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedComparison(comparison)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">
                        {comparison.documentA.name} vs {comparison.documentB.name}
                      </h4>

                      <Badge
                        className={cn(
                          "text-xs",
                          comparison.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : comparison.status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : comparison.status === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700",
                        )}
                      >
                        {comparison.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Changes:</span>
                        <p className="text-gray-900 font-medium">{comparison.statistics.totalChanges}</p>
                      </div>

                      <div>
                        <span className="text-gray-600">Similarity:</span>
                        <p className="text-gray-900 font-medium">
                          {Math.round(comparison.statistics.similarityScore * 100)}%
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-600">Pages:</span>
                        <p className="text-gray-900 font-medium">{comparison.statistics.pagesAffected}</p>
                      </div>

                      <div>
                        <span className="text-gray-600">Date:</span>
                        <p className="text-gray-900 font-medium">{comparison.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportComparison(comparison.id, "pdf");
                      }}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Export
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteComparison(comparison.id);
                      }}
                      className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <DocumentDuplicateIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Document Comparison</h2>
            <Badge className="bg-blue-100 text-blue-800">
              {comparisons.filter((c) => c.status === "processing").length} processing
            </Badge>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "compare", name: "Compare", icon: ArrowsRightLeftIcon },
              { id: "results", name: "Results", icon: DocumentTextIcon },
              { id: "history", name: "History", icon: ClockIcon },
              { id: "settings", name: "Settings", icon: Cog6ToothIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {activeTab === "compare" && renderCompareTab()}
          {activeTab === "results" && renderResultsTab()}
          {activeTab === "history" && (
            <div className="text-center py-12">
              <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Comparison History</h3>
              <p className="text-gray-600">View and manage your comparison history</p>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="text-center py-12">
              <Cog6ToothIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Comparison Settings</h3>
              <p className="text-gray-600">Configure default comparison settings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
