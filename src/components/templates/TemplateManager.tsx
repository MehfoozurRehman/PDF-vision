"use client";

import React, { useState, useEffect } from "react";
import { Card, Badge } from "@/components/ui";
import {
  DocumentIcon,
  DocumentPlusIcon,
  DocumentDuplicateIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  FolderIcon,
  TagIcon,
  UserIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  BookmarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  CheckIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  LightBulbIcon,
  SparklesIcon,
  RocketLaunchIcon,
  FireIcon,
  BoltIcon,
  CommandLineIcon,
  CodeBracketIcon,
  CubeIcon,
  PuzzlePieceIcon,
  WrenchScrewdriverIcon,
  BugAntIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  KeyIcon,
  FingerPrintIcon,
  GlobeAltIcon,
  PrinterIcon,
  CameraIcon,
  VideoCameraIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  TruckIcon,
  MapIcon,
  GiftIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  CalculatorIcon,
  ChartBarIcon,
  ChartPieIcon,
  PresentationChartBarIcon,
  TableCellsIcon,
  ListBulletIcon,
  QueueListIcon,
  Bars3Icon,
  Bars4Icon,
  RectangleGroupIcon,
  Square2StackIcon,
  RectangleStackIcon,
  CircleStackIcon,
  WindowIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
  ViewfinderCircleIcon,
  EyeSlashIcon,
  EyeDropperIcon,
  PaintBrushIcon,
  SwatchIcon,
  BeakerIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowTopRightOnSquareIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  HandRaisedIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  ChatBubbleLeftIcon,
  ChatBubbleLeftRightIcon,
  ChatBubbleBottomCenterIcon,
  ChatBubbleBottomCenterTextIcon,
  QuestionMarkCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  NoSymbolIcon,
  StopIcon,
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  MegaphoneIcon,
  BellIcon,
  BellAlertIcon,
  BellSlashIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  InboxIcon,
  InboxArrowDownIcon,
  InboxStackIcon,
  ArchiveBoxIcon,
  ArchiveBoxArrowDownIcon,
  ArchiveBoxXMarkIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  LinkIcon,
  AtSymbolIcon,
  HashtagIcon,
  NumberedListIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon,
  FolderPlusIcon,
  FolderMinusIcon,
  FolderOpenIcon,
  FolderArrowDownIcon,
  DocumentTextIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  DocumentCheckIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  BookOpenIcon,
  BookmarkSlashIcon,
  BookmarkSquareIcon,
  NewspaperIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  BuildingLibraryIcon,
  BuildingStorefrontIcon,
  HomeIcon,
  HomeModernIcon,
  MapPinIcon,
  GlobeAmericasIcon,
  GlobeAsiaAustraliaIcon,
  GlobeEuropeAfricaIcon,
  IdentificationIcon,
  QrCodeIcon,
  TicketIcon,
  CurrencyDollarIcon,
  CurrencyEuroIcon,
  CurrencyPoundIcon,
  CurrencyYenIcon,
  CurrencyBangladeshiIcon,
  CurrencyRupeeIcon,
  ScaleIcon,
  CalendarDaysIcon,
  SunIcon,
  MoonIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  WifiIcon,
  SignalIcon,
  SignalSlashIcon,
  Battery0Icon,
  Battery50Icon,
  Battery100Icon,
  PowerIcon,
  ServerIcon,
  ServerStackIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  TvIcon,
  RadioIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  version: string;
  isPublic: boolean;
  isFavorite: boolean;
  usageCount: number;
  rating: number;
  reviews: number;
  size: number;
  pageCount: number;
  fields: TemplateField[];
  layout: TemplateLayout;
  styling: TemplateStyling;
  automation: TemplateAutomation;
  permissions: TemplatePermissions;
  metadata: TemplateMetadata;
}

interface TemplateField {
  id: string;
  name: string;
  label: string;
  type:
    | "text"
    | "number"
    | "date"
    | "email"
    | "phone"
    | "url"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | "file"
    | "image"
    | "signature"
    | "table"
    | "list"
    | "formula"
    | "barcode"
    | "qrcode";
  required: boolean;
  placeholder?: string;
  defaultValue?: any;
  validation?: FieldValidation;
  options?: FieldOption[];
  position: FieldPosition;
  styling: FieldStyling;
  behavior: FieldBehavior;
  dependencies?: FieldDependency[];
}

interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customRules?: ValidationRule[];
}

interface ValidationRule {
  id: string;
  name: string;
  condition: string;
  message: string;
  severity: "error" | "warning" | "info";
}

interface FieldOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
}

interface FieldPosition {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  anchor:
    | "top-left"
    | "top-center"
    | "top-right"
    | "center-left"
    | "center"
    | "center-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
}

interface FieldStyling {
  fontSize: number;
  fontFamily: string;
  fontWeight: "normal" | "bold" | "lighter" | "bolder";
  fontStyle: "normal" | "italic" | "oblique";
  color: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderStyle: "solid" | "dashed" | "dotted" | "none";
  borderRadius: number;
  padding: number;
  margin: number;
  textAlign: "left" | "center" | "right" | "justify";
  verticalAlign: "top" | "middle" | "bottom";
}

interface FieldBehavior {
  readonly: boolean;
  hidden: boolean;
  disabled: boolean;
  autoFocus: boolean;
  autoComplete: boolean;
  spellCheck: boolean;
  tabIndex: number;
  tooltip?: string;
  helpText?: string;
  mask?: string;
  format?: string;
}

interface FieldDependency {
  fieldId: string;
  condition:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "greater_than"
    | "less_than"
    | "is_empty"
    | "is_not_empty";
  value: any;
  action: "show" | "hide" | "enable" | "disable" | "require" | "optional" | "set_value" | "clear_value";
  targetValue?: any;
}

interface TemplateLayout {
  pageSize: "A4" | "A3" | "A5" | "Letter" | "Legal" | "Tabloid" | "Custom";
  orientation: "portrait" | "landscape";
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  columns: number;
  columnGap: number;
  rowGap: number;
  grid: {
    enabled: boolean;
    size: number;
    color: string;
    opacity: number;
  };
  guides: {
    enabled: boolean;
    color: string;
    opacity: number;
  };
  background: {
    color: string;
    image?: string;
    opacity: number;
    repeat: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
    position: string;
    size: "auto" | "cover" | "contain" | "custom";
  };
}

interface TemplateStyling {
  theme: "light" | "dark" | "auto" | "custom";
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    monoFont: string;
    baseSize: number;
    lineHeight: number;
    letterSpacing: number;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

interface TemplateAutomation {
  calculations: CalculationRule[];
  workflows: WorkflowRule[];
  integrations: IntegrationRule[];
  notifications: NotificationRule[];
  validations: ValidationRule[];
}

interface CalculationRule {
  id: string;
  name: string;
  formula: string;
  targetField: string;
  dependencies: string[];
  trigger: "change" | "blur" | "submit" | "load";
  format?: string;
}

interface WorkflowRule {
  id: string;
  name: string;
  trigger: "submit" | "save" | "field_change" | "time" | "condition";
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  enabled: boolean;
}

interface WorkflowCondition {
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_contains"
    | "greater_than"
    | "less_than"
    | "is_empty"
    | "is_not_empty";
  value: any;
  logic: "and" | "or";
}

interface WorkflowAction {
  type:
    | "email"
    | "webhook"
    | "api_call"
    | "file_generation"
    | "data_export"
    | "field_update"
    | "redirect"
    | "notification";
  config: Record<string, any>;
  delay?: number;
  retries?: number;
}

interface IntegrationRule {
  id: string;
  name: string;
  service: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers: Record<string, string>;
  mapping: FieldMapping[];
  trigger: "submit" | "save" | "field_change";
  authentication: {
    type: "none" | "api_key" | "bearer" | "basic" | "oauth";
    config: Record<string, any>;
  };
}

interface FieldMapping {
  sourceField: string;
  targetField: string;
  transform?: string;
  defaultValue?: any;
}

interface NotificationRule {
  id: string;
  name: string;
  trigger: "submit" | "save" | "field_change" | "validation_error" | "workflow_complete";
  recipients: string[];
  subject: string;
  message: string;
  template?: string;
  channels: ("email" | "sms" | "push" | "webhook")[];
}

interface TemplatePermissions {
  owner: string;
  editors: string[];
  viewers: string[];
  public: {
    view: boolean;
    use: boolean;
    copy: boolean;
    comment: boolean;
  };
  sharing: {
    enabled: boolean;
    password?: string;
    expiry?: Date;
    downloadLimit?: number;
    watermark?: boolean;
  };
}

interface TemplateMetadata {
  industry: string;
  useCase: string;
  complexity: "simple" | "medium" | "complex" | "advanced";
  estimatedTime: number;
  language: string;
  compliance: string[];
  keywords: string[];
  relatedTemplates: string[];
  changelog: ChangelogEntry[];
}

interface ChangelogEntry {
  version: string;
  date: Date;
  author: string;
  changes: string[];
  type: "major" | "minor" | "patch";
}

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  count: number;
}

interface TemplateFilter {
  categories: string[];
  tags: string[];
  authors: string[];
  complexity: string[];
  industry: string[];
  useCase: string[];
  rating: number;
  dateRange: {
    start?: Date;
    end?: Date;
  };
  searchQuery: string;
  sortBy: "name" | "created" | "updated" | "usage" | "rating";
  sortOrder: "asc" | "desc";
  showFavorites: boolean;
  showPublic: boolean;
}

interface TemplateManagerProps {
  templates: Template[];
  categories: TemplateCategory[];
  onCreateTemplate: (template: Partial<Template>) => void;
  onUpdateTemplate: (templateId: string, updates: Partial<Template>) => void;
  onDeleteTemplate: (templateId: string) => void;
  onDuplicateTemplate: (templateId: string) => void;
  onUseTemplate: (templateId: string) => void;
  onShareTemplate: (templateId: string) => void;
  onExportTemplate: (templateId: string, format: "json" | "pdf" | "docx") => void;
  onImportTemplate: (file: File) => void;
  onToggleFavorite: (templateId: string) => void;
  onRateTemplate: (templateId: string, rating: number) => void;
  isActive: boolean;
  onClose: () => void;
}

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: "business",
    name: "Business",
    description: "Business forms, contracts, and documents",
    icon: BriefcaseIcon,
    color: "text-blue-600 bg-blue-100",
    count: 0,
  },
  {
    id: "legal",
    name: "Legal",
    description: "Legal documents, contracts, and agreements",
    icon: ScaleIcon,
    color: "text-purple-600 bg-purple-100",
    count: 0,
  },
  {
    id: "finance",
    name: "Finance",
    description: "Financial forms, invoices, and reports",
    icon: CurrencyDollarIcon,
    color: "text-green-600 bg-green-100",
    count: 0,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Medical forms, patient records, and reports",
    icon: HeartIcon,
    color: "text-red-600 bg-red-100",
    count: 0,
  },
  {
    id: "education",
    name: "Education",
    description: "Educational forms, assessments, and certificates",
    icon: AcademicCapIcon,
    color: "text-indigo-600 bg-indigo-100",
    count: 0,
  },
  {
    id: "hr",
    name: "Human Resources",
    description: "HR forms, applications, and evaluations",
    icon: UserIcon,
    color: "text-orange-600 bg-orange-100",
    count: 0,
  },
  {
    id: "marketing",
    name: "Marketing",
    description: "Marketing materials, surveys, and campaigns",
    icon: MegaphoneIcon,
    color: "text-pink-600 bg-pink-100",
    count: 0,
  },
  {
    id: "real_estate",
    name: "Real Estate",
    description: "Property forms, leases, and agreements",
    icon: HomeIcon,
    color: "text-teal-600 bg-teal-100",
    count: 0,
  },
  {
    id: "government",
    name: "Government",
    description: "Government forms, applications, and permits",
    icon: BuildingLibraryIcon,
    color: "text-gray-600 bg-gray-100",
    count: 0,
  },
  {
    id: "personal",
    name: "Personal",
    description: "Personal documents, planners, and organizers",
    icon: UserIcon,
    color: "text-cyan-600 bg-cyan-100",
    count: 0,
  },
];

const COMPLEXITY_LEVELS = [
  { id: "simple", name: "Simple", color: "text-green-600 bg-green-100", icon: CheckCircleIcon },
  { id: "medium", name: "Medium", color: "text-yellow-600 bg-yellow-100", icon: ExclamationTriangleIcon },
  { id: "complex", name: "Complex", color: "text-orange-600 bg-orange-100", icon: CpuChipIcon },
  { id: "advanced", name: "Advanced", color: "text-red-600 bg-red-100", icon: RocketLaunchIcon },
];

export default function TemplateManager({
  templates,
  categories,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onUseTemplate,
  onShareTemplate,
  onExportTemplate,
  onImportTemplate,
  onToggleFavorite,
  onRateTemplate,
  isActive,
  onClose,
}: TemplateManagerProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "create" | "manage" | "settings">("browse");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<TemplateFilter>({
    categories: [],
    tags: [],
    authors: [],
    complexity: [],
    industry: [],
    useCase: [],
    rating: 0,
    dateRange: {},
    searchQuery: "",
    sortBy: "updated",
    sortOrder: "desc",
    showFavorites: false,
    showPublic: true,
  });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatEstimatedTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getComplexityConfig = (complexity: string) => {
    return COMPLEXITY_LEVELS.find((c) => c.id === complexity) || COMPLEXITY_LEVELS[0];
  };

  const filteredTemplates = templates.filter((template) => {
    if (filter.categories.length > 0 && !filter.categories.includes(template.category)) return false;
    if (filter.tags.length > 0 && !filter.tags.some((tag) => template.tags.includes(tag))) return false;
    if (filter.authors.length > 0 && !filter.authors.includes(template.author)) return false;
    if (filter.complexity.length > 0 && !filter.complexity.includes(template.metadata.complexity)) return false;
    if (filter.industry.length > 0 && !filter.industry.includes(template.metadata.industry)) return false;
    if (filter.rating > 0 && template.rating < filter.rating) return false;
    if (filter.showFavorites && !template.isFavorite) return false;
    if (!filter.showPublic && template.isPublic) return false;
    if (
      filter.searchQuery &&
      !template.name.toLowerCase().includes(filter.searchQuery.toLowerCase()) &&
      !template.description.toLowerCase().includes(filter.searchQuery.toLowerCase()) &&
      !template.tags.some((tag) => tag.toLowerCase().includes(filter.searchQuery.toLowerCase()))
    )
      return false;
    return true;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    let comparison = 0;

    switch (filter.sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "created":
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case "updated":
        comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
        break;
      case "usage":
        comparison = a.usageCount - b.usageCount;
        break;
      case "rating":
        comparison = a.rating - b.rating;
        break;
    }

    return filter.sortOrder === "asc" ? comparison : -comparison;
  });

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderStarRating = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            disabled={!interactive}
            className={cn(
              "w-4 h-4",
              interactive ? "hover:text-yellow-400 cursor-pointer" : "cursor-default",
              star <= rating ? "text-yellow-400" : "text-gray-300",
            )}
          >
            <StarIcon className="w-full h-full fill-current" />
          </button>
        ))}
      </div>
    );
  };

  const renderBrowseTab = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={filter.searchQuery}
              onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filter.sortBy}
            onChange={(e) => setFilter({ ...filter, sortBy: e.target.value as any })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="updated">Recently Updated</option>
            <option value="created">Recently Created</option>
            <option value="name">Name</option>
            <option value="usage">Most Used</option>
            <option value="rating">Highest Rated</option>
          </select>

          <button
            onClick={() => setFilter({ ...filter, sortOrder: filter.sortOrder === "asc" ? "desc" : "asc" })}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {filter.sortOrder === "asc" ? (
              <ArrowUpIcon className="w-4 h-4 text-gray-500" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter({ ...filter, showFavorites: !filter.showFavorites })}
            className={cn(
              "px-3 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2",
              filter.showFavorites ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            )}
          >
            <HeartIcon className="w-4 h-4" />
            <span>Favorites</span>
          </button>

          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100",
              )}
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100",
              )}
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Template</span>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {TEMPLATE_CATEGORIES.map((category) => {
          const CategoryIcon = category.icon;
          const count = templates.filter((t) => t.category === category.id).length;
          const isSelected = filter.categories.includes(category.id);

          return (
            <button
              key={category.id}
              onClick={() => {
                const newCategories = isSelected
                  ? filter.categories.filter((c) => c !== category.id)
                  : [...filter.categories, category.id];
                setFilter({ ...filter, categories: newCategories });
              }}
              className={cn(
                "p-4 rounded-lg border-2 transition-all text-left",
                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50",
              )}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className={cn("p-2 rounded-lg", category.color)}>
                  <CategoryIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">{count} templates</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">{category.description}</p>
            </button>
          );
        })}
      </div>

      {/* Templates Grid/List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {sortedTemplates.length} Templates
            {filter.categories.length > 0 && (
              <span className="text-sm text-gray-500 ml-2">
                in {filter.categories.map((c) => TEMPLATE_CATEGORIES.find((cat) => cat.id === c)?.name).join(", ")}
              </span>
            )}
          </h3>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedTemplates.map((template) => {
              const complexityConfig = getComplexityConfig(template.metadata.complexity);
              const ComplexityIcon = complexityConfig.icon;

              return (
                <Card
                  key={template.id}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowTemplateModal(true);
                  }}
                >
                  <div className="space-y-4">
                    {/* Thumbnail */}
                    <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                      {template.thumbnail ? (
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <DocumentIcon className="w-12 h-12 text-gray-400" />
                      )}
                    </div>

                    {/* Header */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-gray-900 line-clamp-2">{template.name}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(template.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <HeartIcon
                            className={cn(
                              "w-4 h-4",
                              template.isFavorite ? "text-red-500 fill-current" : "text-gray-400",
                            )}
                          />
                        </button>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>by {template.author}</span>
                        <span>{template.updatedAt.toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {renderStarRating(template.rating)}
                        <span className="text-xs text-gray-500">({template.reviews})</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className={cn("text-xs", complexityConfig.color)}>
                          <ComplexityIcon className="w-3 h-3 mr-1" />
                          {complexityConfig.name}
                        </Badge>

                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <ClockIcon className="w-3 h-3" />
                          <span>{formatEstimatedTime(template.metadata.estimatedTime)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} className="bg-gray-100 text-gray-700 text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge className="bg-gray-100 text-gray-600 text-xs">+{template.tags.length - 3}</Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUseTemplate(template.id);
                        }}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Use Template
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(template);
                          setShowTemplateModal(true);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onShareTemplate(template.id);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                      >
                        <ShareIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTemplates.map((template) => {
              const complexityConfig = getComplexityConfig(template.metadata.complexity);
              const ComplexityIcon = complexityConfig.icon;

              return (
                <Card
                  key={template.id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowTemplateModal(true);
                  }}
                >
                  <div className="flex items-center space-x-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      {template.thumbnail ? (
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <DocumentIcon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{template.name}</h4>
                          <p className="text-sm text-gray-600 truncate">{template.description}</p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(template.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors ml-2"
                        >
                          <HeartIcon
                            className={cn(
                              "w-4 h-4",
                              template.isFavorite ? "text-red-500 fill-current" : "text-gray-400",
                            )}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>by {template.author}</span>

                          <div className="flex items-center space-x-1">
                            {renderStarRating(template.rating)}
                            <span>({template.reviews})</span>
                          </div>

                          <Badge className={cn("text-xs", complexityConfig.color)}>
                            <ComplexityIcon className="w-3 h-3 mr-1" />
                            {complexityConfig.name}
                          </Badge>

                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-3 h-3" />
                            <span>{formatEstimatedTime(template.metadata.estimatedTime)}</span>
                          </div>

                          <span>{template.updatedAt.toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUseTemplate(template.id);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Use
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onShareTemplate(template.id);
                            }}
                            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                          >
                            <ShareIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <DocumentIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Template Manager</h2>
            <Badge className="bg-blue-100 text-blue-800">{templates.length} templates</Badge>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "browse", name: "Browse", icon: MagnifyingGlassIcon },
              { id: "create", name: "Create", icon: PlusIcon },
              { id: "manage", name: "Manage", icon: Cog6ToothIcon },
              { id: "settings", name: "Settings", icon: AdjustmentsHorizontalIcon },
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
          {activeTab === "browse" && renderBrowseTab()}
          {activeTab === "create" && (
            <div className="text-center py-12">
              <PlusIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Template</h3>
              <p className="text-gray-600 mb-6">Design custom templates with advanced fields and automation</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Creating
              </button>
            </div>
          )}
          {activeTab === "manage" && (
            <div className="text-center py-12">
              <Cog6ToothIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Manage Templates</h3>
              <p className="text-gray-600">Edit, organize, and maintain your template library</p>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="text-center py-12">
              <AdjustmentsHorizontalIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Template Settings</h3>
              <p className="text-gray-600">Configure default settings and preferences</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
