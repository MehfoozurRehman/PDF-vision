"use client";

import React, { useState, useEffect } from "react";
import { Card, Badge } from "@/components/ui";
import {
  CogIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowPathIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BoltIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  CommandLineIcon,
  CodeBracketIcon,
  DocumentIcon,
  DocumentTextIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  DocumentDuplicateIcon,
  DocumentPlusIcon,
  DocumentCheckIcon,
  FolderIcon,
  FolderPlusIcon,
  FolderOpenIcon,
  CloudIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  ServerIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  BellIcon,
  ChatBubbleLeftIcon,
  PhoneIcon,
  DevicePhoneMobileIcon,
  AtSymbolIcon,
  LinkIcon,
  ShareIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  Cog6ToothIcon,
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  CalendarDaysIcon,
  UserIcon,
  UserGroupIcon,
  TagIcon,
  StarIcon,
  HeartIcon,
  BookmarkIcon,
  FlagIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  KeyIcon,
  FingerPrintIcon,
  CreditCardIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ShoppingCartIcon,
  GiftIcon,
  TruckIcon,
  MapIcon,
  HomeIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ChartPieIcon,
  PresentationChartBarIcon,
  TableCellsIcon,
  ListBulletIcon,
  QueueListIcon,
  Bars3Icon,
  Bars4Icon,
  Square2StackIcon,
  RectangleStackIcon,
  CircleStackIcon,
  WindowIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  BugAntIcon,
  PrinterIcon,
  CameraIcon,
  VideoCameraIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  RadioIcon,
  TvIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  WifiIcon,
  SignalIcon,
  PowerIcon,
  SunIcon,
  MoonIcon,
  FireIcon,
  SparklesIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: "trigger" | "action" | "condition" | "loop" | "delay" | "parallel" | "merge";
  category: string;
  icon: React.ComponentType<any>;
  config: StepConfig;
  position: StepPosition;
  connections: StepConnection[];
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  executionTime?: number;
  error?: string;
  output?: any;
  retryCount: number;
  maxRetries: number;
  timeout: number;
  enabled: boolean;
}

interface StepConfig {
  [key: string]: any;
}

interface StepPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface StepConnection {
  id: string;
  sourceStepId: string;
  targetStepId: string;
  condition?: string;
  label?: string;
  type: "success" | "error" | "conditional" | "always";
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  version: string;
  status: "draft" | "active" | "paused" | "archived";
  createdAt: Date;
  updatedAt: Date;
  lastRunAt?: Date;
  nextRunAt?: Date;
  author: string;
  isPublic: boolean;
  isFavorite: boolean;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  schedule?: WorkflowSchedule;
  settings: WorkflowSettings;
  statistics: WorkflowStatistics;
  permissions: WorkflowPermissions;
  variables: WorkflowVariable[];
  errorHandling: ErrorHandling;
}

interface WorkflowTrigger {
  id: string;
  type:
    | "manual"
    | "schedule"
    | "webhook"
    | "file_upload"
    | "email"
    | "form_submit"
    | "api_call"
    | "database_change"
    | "file_change";
  name: string;
  description: string;
  config: TriggerConfig;
  enabled: boolean;
  lastTriggered?: Date;
  triggerCount: number;
}

interface TriggerConfig {
  [key: string]: any;
}

interface WorkflowSchedule {
  type: "once" | "recurring";
  startDate: Date;
  endDate?: Date;
  timezone: string;
  cron?: string;
  interval?: {
    value: number;
    unit: "minutes" | "hours" | "days" | "weeks" | "months";
  };
  enabled: boolean;
}

interface WorkflowSettings {
  maxConcurrentRuns: number;
  timeout: number;
  retryPolicy: {
    enabled: boolean;
    maxRetries: number;
    backoffStrategy: "linear" | "exponential" | "fixed";
    initialDelay: number;
    maxDelay: number;
  };
  notifications: {
    onSuccess: boolean;
    onFailure: boolean;
    onStart: boolean;
    recipients: string[];
    channels: ("email" | "sms" | "webhook" | "slack")[];
  };
  logging: {
    level: "debug" | "info" | "warn" | "error";
    retention: number;
    includeInputOutput: boolean;
  };
  security: {
    requireApproval: boolean;
    approvers: string[];
    encryptData: boolean;
    auditLog: boolean;
  };
}

interface WorkflowStatistics {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  averageExecutionTime: number;
  lastExecutionTime: number;
  successRate: number;
  errorRate: number;
  mostCommonErrors: ErrorSummary[];
  performanceMetrics: PerformanceMetric[];
}

interface ErrorSummary {
  error: string;
  count: number;
  lastOccurrence: Date;
}

interface PerformanceMetric {
  stepId: string;
  stepName: string;
  averageExecutionTime: number;
  minExecutionTime: number;
  maxExecutionTime: number;
  executionCount: number;
}

interface WorkflowPermissions {
  owner: string;
  editors: string[];
  viewers: string[];
  runners: string[];
  public: {
    view: boolean;
    run: boolean;
    copy: boolean;
  };
}

interface WorkflowVariable {
  id: string;
  name: string;
  type: "string" | "number" | "boolean" | "date" | "object" | "array";
  value: any;
  description: string;
  required: boolean;
  sensitive: boolean;
  scope: "global" | "workflow" | "step";
}

interface ErrorHandling {
  strategy: "stop" | "continue" | "retry" | "rollback";
  rollbackSteps: string[];
  notificationSettings: {
    immediate: boolean;
    summary: boolean;
    recipients: string[];
  };
  customHandlers: CustomErrorHandler[];
}

interface CustomErrorHandler {
  id: string;
  name: string;
  condition: string;
  action: "retry" | "skip" | "redirect" | "custom";
  config: any;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: "running" | "completed" | "failed" | "cancelled";
  startedAt: Date;
  completedAt?: Date;
  triggeredBy: string;
  triggerType: string;
  input: any;
  output?: any;
  error?: string;
  steps: StepExecution[];
  duration: number;
  logs: ExecutionLog[];
}

interface StepExecution {
  stepId: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  startedAt?: Date;
  completedAt?: Date;
  input: any;
  output?: any;
  error?: string;
  duration: number;
  retryCount: number;
}

interface ExecutionLog {
  id: string;
  timestamp: Date;
  level: "debug" | "info" | "warn" | "error";
  message: string;
  stepId?: string;
  data?: any;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  workflow: Partial<Workflow>;
  usageCount: number;
  rating: number;
  reviews: number;
  author: string;
  isPublic: boolean;
}

interface WorkflowAutomationProps {
  workflows: Workflow[];
  templates: WorkflowTemplate[];
  executions: WorkflowExecution[];
  onCreateWorkflow: (workflow: Partial<Workflow>) => void;
  onUpdateWorkflow: (workflowId: string, updates: Partial<Workflow>) => void;
  onDeleteWorkflow: (workflowId: string) => void;
  onDuplicateWorkflow: (workflowId: string) => void;
  onRunWorkflow: (workflowId: string, input?: any) => void;
  onStopWorkflow: (executionId: string) => void;
  onPauseWorkflow: (workflowId: string) => void;
  onResumeWorkflow: (workflowId: string) => void;
  onExportWorkflow: (workflowId: string, format: "json" | "yaml" | "xml") => void;
  onImportWorkflow: (file: File) => void;
  onToggleFavorite: (workflowId: string) => void;
  isActive: boolean;
  onClose: () => void;
}

const WORKFLOW_CATEGORIES = [
  {
    id: "document",
    name: "Document Processing",
    description: "Automate document workflows",
    icon: DocumentIcon,
    color: "text-blue-600 bg-blue-100",
  },
  {
    id: "data",
    name: "Data Processing",
    description: "Process and transform data",
    icon: ChartBarIcon,
    color: "text-green-600 bg-green-100",
  },
  {
    id: "communication",
    name: "Communication",
    description: "Send notifications and messages",
    icon: EnvelopeIcon,
    color: "text-purple-600 bg-purple-100",
  },
  {
    id: "integration",
    name: "Integration",
    description: "Connect with external services",
    icon: LinkIcon,
    color: "text-orange-600 bg-orange-100",
  },
  {
    id: "approval",
    name: "Approval Process",
    description: "Manage approval workflows",
    icon: CheckCircleIcon,
    color: "text-indigo-600 bg-indigo-100",
  },
  {
    id: "monitoring",
    name: "Monitoring",
    description: "Monitor and alert on conditions",
    icon: BellIcon,
    color: "text-red-600 bg-red-100",
  },
];

const STEP_TYPES = [
  {
    id: "trigger",
    name: "Trigger",
    description: "Start the workflow",
    icon: PlayIcon,
    color: "text-green-600 bg-green-100",
  },
  {
    id: "action",
    name: "Action",
    description: "Perform an operation",
    icon: CogIcon,
    color: "text-blue-600 bg-blue-100",
  },
  {
    id: "condition",
    name: "Condition",
    description: "Make a decision",
    icon: FunnelIcon,
    color: "text-yellow-600 bg-yellow-100",
  },
  {
    id: "loop",
    name: "Loop",
    description: "Repeat actions",
    icon: ArrowPathIcon,
    color: "text-purple-600 bg-purple-100",
  },
  {
    id: "delay",
    name: "Delay",
    description: "Wait for a period",
    icon: ClockIcon,
    color: "text-gray-600 bg-gray-100",
  },
  {
    id: "parallel",
    name: "Parallel",
    description: "Run steps in parallel",
    icon: Square2StackIcon,
    color: "text-teal-600 bg-teal-100",
  },
];

export default function WorkflowAutomation({
  workflows,
  templates,
  executions,
  onCreateWorkflow,
  onUpdateWorkflow,
  onDeleteWorkflow,
  onDuplicateWorkflow,
  onRunWorkflow,
  onStopWorkflow,
  onPauseWorkflow,
  onResumeWorkflow,
  onExportWorkflow,
  onImportWorkflow,
  onToggleFavorite,
  isActive,
  onClose,
}: WorkflowAutomationProps) {
  const [activeTab, setActiveTab] = useState<"workflows" | "executions" | "templates" | "builder">("workflows");
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "created" | "updated" | "runs">("updated");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const formatDuration = (milliseconds: number): string => {
    if (milliseconds < 1000) return `${milliseconds}ms`;
    if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}s`;
    if (milliseconds < 3600000) return `${(milliseconds / 60000).toFixed(1)}m`;
    return `${(milliseconds / 3600000).toFixed(1)}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "running":
      case "completed":
        return "text-green-600 bg-green-100";
      case "paused":
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
      case "archived":
        return "text-red-600 bg-red-100";
      case "draft":
      case "cancelled":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "running":
        return PlayIcon;
      case "completed":
        return CheckCircleIcon;
      case "paused":
        return PauseIcon;
      case "failed":
        return XCircleIcon;
      case "cancelled":
        return StopIcon;
      default:
        return ClockIcon;
    }
  };

  const filteredWorkflows = workflows.filter((workflow) => {
    if (
      searchQuery &&
      !workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !workflow.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }
    if (selectedCategory && workflow.category !== selectedCategory) return false;
    if (statusFilter && workflow.status !== statusFilter) return false;
    return true;
  });

  const sortedWorkflows = [...filteredWorkflows].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "created":
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case "updated":
        comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
        break;
      case "runs":
        comparison = a.statistics.totalRuns - b.statistics.totalRuns;
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const renderWorkflowsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {WORKFLOW_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="updated">Recently Updated</option>
            <option value="created">Recently Created</option>
            <option value="name">Name</option>
            <option value="runs">Most Runs</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
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
            onClick={() => setShowBuilderModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Workflow</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CogIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Workflows</p>
              <p className="text-2xl font-semibold text-gray-900">{workflows.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <PlayIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-gray-900">
                {workflows.filter((w) => w.status === "active").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <RocketLaunchIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Runs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {workflows.reduce((sum, w) => sum + w.statistics.totalRuns, 0)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ChartBarIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {workflows.length > 0
                  ? Math.round(workflows.reduce((sum, w) => sum + w.statistics.successRate, 0) / workflows.length)
                  : 0}
                %
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Workflows Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedWorkflows.map((workflow) => {
            const StatusIcon = getStatusIcon(workflow.status);
            const categoryConfig = WORKFLOW_CATEGORIES.find((c) => c.id === workflow.category);
            const CategoryIcon = categoryConfig?.icon || CogIcon;

            return (
              <Card
                key={workflow.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedWorkflow(workflow);
                  setShowWorkflowModal(true);
                }}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={cn("p-2 rounded-lg", categoryConfig?.color || "text-gray-600 bg-gray-100")}>
                        <CategoryIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{workflow.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{workflow.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(workflow.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <HeartIcon
                        className={cn("w-4 h-4", workflow.isFavorite ? "text-red-500 fill-current" : "text-gray-400")}
                      />
                    </button>
                  </div>

                  {/* Status and Metrics */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge className={cn("text-xs", getStatusColor(workflow.status))}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                      </Badge>

                      <div className="text-xs text-gray-500">v{workflow.version}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Runs</p>
                        <p className="font-medium text-gray-900">{workflow.statistics.totalRuns}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Success Rate</p>
                        <p className="font-medium text-gray-900">{workflow.statistics.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Avg Duration</p>
                        <p className="font-medium text-gray-900">
                          {formatDuration(workflow.statistics.averageExecutionTime)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Steps</p>
                        <p className="font-medium text-gray-900">{workflow.steps.length}</p>
                      </div>
                    </div>

                    {workflow.lastRunAt && (
                      <div className="text-xs text-gray-500">Last run: {workflow.lastRunAt.toLocaleDateString()}</div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {workflow.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} className="bg-gray-100 text-gray-700 text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {workflow.tags.length > 3 && (
                      <Badge className="bg-gray-100 text-gray-600 text-xs">+{workflow.tags.length - 3}</Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRunWorkflow(workflow.id);
                      }}
                      disabled={workflow.status !== "active"}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Run Now
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWorkflow(workflow);
                        setShowWorkflowModal(true);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateWorkflow(workflow.id);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      <DocumentDuplicateIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedWorkflows.map((workflow) => {
            const StatusIcon = getStatusIcon(workflow.status);
            const categoryConfig = WORKFLOW_CATEGORIES.find((c) => c.id === workflow.category);
            const CategoryIcon = categoryConfig?.icon || CogIcon;

            return (
              <Card
                key={workflow.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedWorkflow(workflow);
                  setShowWorkflowModal(true);
                }}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={cn("p-2 rounded-lg flex-shrink-0", categoryConfig?.color || "text-gray-600 bg-gray-100")}
                  >
                    <CategoryIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 truncate">{workflow.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={cn("text-xs", getStatusColor(workflow.status))}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                        </Badge>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(workflow.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <HeartIcon
                            className={cn(
                              "w-4 h-4",
                              workflow.isFavorite ? "text-red-500 fill-current" : "text-gray-400",
                            )}
                          />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 truncate">{workflow.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>{workflow.statistics.totalRuns} runs</span>
                        <span>{workflow.statistics.successRate}% success</span>
                        <span>{workflow.steps.length} steps</span>
                        <span>v{workflow.version}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRunWorkflow(workflow.id);
                          }}
                          disabled={workflow.status !== "active"}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                          Run
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicateWorkflow(workflow.id);
                          }}
                          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                        >
                          <DocumentDuplicateIcon className="w-4 h-4" />
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
  );

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <BoltIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Workflow Automation</h2>
            <Badge className="bg-blue-100 text-blue-800">{workflows.length} workflows</Badge>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "workflows", name: "Workflows", icon: CogIcon },
              { id: "executions", name: "Executions", icon: PlayIcon },
              { id: "templates", name: "Templates", icon: DocumentIcon },
              { id: "builder", name: "Builder", icon: PlusIcon },
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
          {activeTab === "workflows" && renderWorkflowsTab()}
          {activeTab === "executions" && (
            <div className="text-center py-12">
              <PlayIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Workflow Executions</h3>
              <p className="text-gray-600">View and monitor workflow execution history</p>
            </div>
          )}
          {activeTab === "templates" && (
            <div className="text-center py-12">
              <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Workflow Templates</h3>
              <p className="text-gray-600">Browse and use pre-built workflow templates</p>
            </div>
          )}
          {activeTab === "builder" && (
            <div className="text-center py-12">
              <PlusIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Workflow Builder</h3>
              <p className="text-gray-600 mb-6">Create custom workflows with drag-and-drop interface</p>
              <button
                onClick={() => setShowBuilderModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Builder
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
