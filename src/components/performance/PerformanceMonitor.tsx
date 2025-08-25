"use client";

import React, { useState, useEffect } from "react";
import { Card, Badge } from "@/components/ui";
import {
  CpuChipIcon,
  ServerIcon,
  ClockIcon,
  ChartBarIcon,
  ChartPieIcon,
  PresentationChartBarIcon,
  BoltIcon,
  RocketLaunchIcon,
  FireIcon,
  SparklesIcon,
  LightBulbIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  EyeSlashIcon,
  Cog6ToothIcon,
  AdjustmentsHorizontalIcon,
  WrenchScrewdriverIcon,
  BugAntIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  ViewColumnsIcon,
  CalendarIcon,
  CalendarDaysIcon,
  DocumentIcon,
  DocumentTextIcon,
  DocumentChartBarIcon,
  FolderIcon,
  CloudIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  WifiIcon,
  SignalIcon,
  PowerIcon,
  SunIcon,
  MoonIcon,
  BeakerIcon,
  ScaleIcon,
  UserIcon,
  UsersIcon,
  BuildingOfficeIcon,
  HomeIcon,
  MapIcon,
  MapPinIcon,
  TagIcon,
  BookmarkIcon,
  StarIcon,
  HeartIcon,
  FlagIcon,
  BellIcon,
  BellAlertIcon,
  SpeakerWaveIcon,
  MegaphoneIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon,
  AtSymbolIcon,
  PhoneIcon,
  LinkIcon,
  ShareIcon,
  ArrowTopRightOnSquareIcon,
  ClipboardIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  InboxIcon,
  PaperAirplaneIcon,
  TruckIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  CurrencyDollarIcon,
  GiftIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  IdentificationIcon,
  LockClosedIcon,
  LockOpenIcon,
  KeyIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  FingerPrintIcon,
  EyeDropperIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ForwardIcon,
  BackwardIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface PerformanceMetric {
  id: string;
  name: string;
  description: string;
  category: "cpu" | "memory" | "network" | "storage" | "rendering" | "javascript" | "user_experience";
  value: number;
  unit: string;
  threshold: {
    good: number;
    warning: number;
    critical: number;
  };
  trend: "up" | "down" | "stable";
  trendPercentage: number;
  history: PerformanceDataPoint[];
  lastUpdated: Date;
  isActive: boolean;
  priority: "low" | "medium" | "high" | "critical";
}

interface PerformanceDataPoint {
  timestamp: Date;
  value: number;
  metadata?: Record<string, any>;
}

interface PerformanceAlert {
  id: string;
  metricId: string;
  metricName: string;
  type: "threshold" | "anomaly" | "trend" | "custom";
  severity: "info" | "warning" | "error" | "critical";
  message: string;
  description: string;
  value: number;
  threshold: number;
  timestamp: Date;
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  actions: AlertAction[];
  tags: string[];
}

interface AlertAction {
  id: string;
  name: string;
  description: string;
  type: "automatic" | "manual" | "notification";
  status: "pending" | "executing" | "completed" | "failed";
  result?: string;
  executedAt?: Date;
}

interface PerformanceReport {
  id: string;
  name: string;
  description: string;
  type: "daily" | "weekly" | "monthly" | "custom";
  period: {
    start: Date;
    end: Date;
  };
  metrics: string[];
  summary: {
    overallScore: number;
    improvements: number;
    regressions: number;
    criticalIssues: number;
  };
  insights: PerformanceInsight[];
  recommendations: PerformanceRecommendation[];
  generatedAt: Date;
  generatedBy: string;
  isPublic: boolean;
  tags: string[];
}

interface PerformanceInsight {
  id: string;
  type: "trend" | "correlation" | "anomaly" | "pattern";
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  confidence: number;
  metrics: string[];
  timeframe: {
    start: Date;
    end: Date;
  };
  data: any;
}

interface PerformanceRecommendation {
  id: string;
  type: "optimization" | "configuration" | "infrastructure" | "code" | "monitoring";
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  effort: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  category: string;
  steps: RecommendationStep[];
  estimatedImprovement: {
    metric: string;
    value: number;
    unit: string;
  };
  resources: {
    documentation: string[];
    tools: string[];
    examples: string[];
  };
  tags: string[];
}

interface RecommendationStep {
  id: string;
  title: string;
  description: string;
  type: "action" | "verification" | "monitoring";
  isCompleted: boolean;
  completedAt?: Date;
  notes?: string;
}

interface PerformanceProfile {
  id: string;
  name: string;
  description: string;
  environment: "development" | "staging" | "production";
  device: {
    type: "desktop" | "tablet" | "mobile";
    os: string;
    browser: string;
    screen: {
      width: number;
      height: number;
      density: number;
    };
  };
  network: {
    type: "wifi" | "4g" | "3g" | "slow-3g" | "offline";
    speed: {
      download: number;
      upload: number;
      latency: number;
    };
  };
  settings: {
    sampleRate: number;
    bufferSize: number;
    enabledMetrics: string[];
    thresholds: Record<string, any>;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface PerformanceMonitorProps {
  metrics: PerformanceMetric[];
  alerts: PerformanceAlert[];
  reports: PerformanceReport[];
  profiles: PerformanceProfile[];
  onUpdateMetric: (metricId: string, updates: Partial<PerformanceMetric>) => void;
  onCreateAlert: (alert: Partial<PerformanceAlert>) => void;
  onResolveAlert: (alertId: string, resolution: string) => void;
  onGenerateReport: (config: Partial<PerformanceReport>) => void;
  onCreateProfile: (profile: Partial<PerformanceProfile>) => void;
  onUpdateProfile: (profileId: string, updates: Partial<PerformanceProfile>) => void;
  onDeleteProfile: (profileId: string) => void;
  onOptimize: (recommendations: string[]) => void;
  onExportData: (format: "json" | "csv" | "pdf") => void;
  isActive: boolean;
  onClose: () => void;
}

const METRIC_CATEGORIES = [
  {
    id: "cpu",
    name: "CPU Performance",
    description: "Processor usage and execution time",
    icon: CpuChipIcon,
    color: "text-blue-600 bg-blue-100",
  },
  {
    id: "memory",
    name: "Memory Usage",
    description: "RAM consumption and garbage collection",
    icon: ServerIcon,
    color: "text-green-600 bg-green-100",
  },
  {
    id: "network",
    name: "Network Performance",
    description: "Request latency and bandwidth usage",
    icon: WifiIcon,
    color: "text-purple-600 bg-purple-100",
  },
  {
    id: "storage",
    name: "Storage I/O",
    description: "Disk read/write operations",
    icon: ArchiveBoxIcon,
    color: "text-yellow-600 bg-yellow-100",
  },
  {
    id: "rendering",
    name: "Rendering Performance",
    description: "Frame rate and paint operations",
    icon: ComputerDesktopIcon,
    color: "text-indigo-600 bg-indigo-100",
  },
  {
    id: "javascript",
    name: "JavaScript Execution",
    description: "Script execution time and blocking",
    icon: BoltIcon,
    color: "text-orange-600 bg-orange-100",
  },
  {
    id: "user_experience",
    name: "User Experience",
    description: "Core Web Vitals and user interactions",
    icon: UserIcon,
    color: "text-pink-600 bg-pink-100",
  },
];

const SEVERITY_COLORS = {
  info: "text-blue-600 bg-blue-100",
  warning: "text-yellow-600 bg-yellow-100",
  error: "text-red-600 bg-red-100",
  critical: "text-red-800 bg-red-200",
};

const TREND_ICONS = {
  up: ArrowTrendingUpIcon,
  down: ArrowTrendingDownIcon,
  stable: MinusIcon,
};

const TREND_COLORS = {
  up: "text-green-600",
  down: "text-red-600",
  stable: "text-gray-600",
};

export default function PerformanceMonitor({
  metrics,
  alerts,
  reports,
  profiles,
  onUpdateMetric,
  onCreateAlert,
  onResolveAlert,
  onGenerateReport,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile,
  onOptimize,
  onExportData,
  isActive,
  onClose,
}: PerformanceMonitorProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "alerts" | "reports" | "profiles">("overview");
  const [selectedMetric, setSelectedMetric] = useState<PerformanceMetric | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<PerformanceAlert | null>(null);
  const [selectedReport, setSelectedReport] = useState<PerformanceReport | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<PerformanceProfile | null>(null);
  const [showMetricModal, setShowMetricModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("");
  const [timeRange, setTimeRange] = useState<"1h" | "6h" | "24h" | "7d" | "30d">("24h");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  const formatValue = (value: number, unit: string): string => {
    if (unit === "ms") {
      if (value < 1000) return `${value.toFixed(1)}ms`;
      return `${(value / 1000).toFixed(2)}s`;
    }
    if (unit === "bytes") {
      const sizes = ["B", "KB", "MB", "GB", "TB"];
      if (value === 0) return "0 B";
      const i = Math.floor(Math.log(value) / Math.log(1024));
      return `${(value / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    }
    if (unit === "%") {
      return `${value.toFixed(1)}%`;
    }
    return `${value.toFixed(2)} ${unit}`;
  };

  const getMetricStatus = (metric: PerformanceMetric): "good" | "warning" | "critical" => {
    if (metric.value <= metric.threshold.good) return "good";
    if (metric.value <= metric.threshold.warning) return "warning";
    return "critical";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return CheckCircleIcon;
      case "warning":
        return ExclamationTriangleIcon;
      case "critical":
        return ExclamationCircleIcon;
      default:
        return InformationCircleIcon;
    }
  };

  const filteredMetrics = metrics.filter((metric) => {
    if (
      searchQuery &&
      !metric.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !metric.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (categoryFilter && metric.category !== categoryFilter) return false;
    return true;
  });

  const filteredAlerts = alerts.filter((alert) => {
    if (
      searchQuery &&
      !alert.metricName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !alert.message.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (severityFilter && alert.severity !== severityFilter) return false;
    return true;
  });

  const renderOverviewTab = () => {
    const criticalMetrics = metrics.filter((m) => getMetricStatus(m) === "critical");
    const warningMetrics = metrics.filter((m) => getMetricStatus(m) === "warning");
    const goodMetrics = metrics.filter((m) => getMetricStatus(m) === "good");
    const unresolvedAlerts = alerts.filter((a) => !a.isResolved);
    const criticalAlerts = unresolvedAlerts.filter((a) => a.severity === "critical");

    return (
      <div className="space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Healthy Metrics</p>
                <p className="text-2xl font-semibold text-gray-900">{goodMetrics.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Warning Metrics</p>
                <p className="text-2xl font-semibold text-gray-900">{warningMetrics.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationCircleIcon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical Metrics</p>
                <p className="text-2xl font-semibold text-gray-900">{criticalMetrics.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BellAlertIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-semibold text-gray-900">{unresolvedAlerts.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Critical Issues */}
        {(criticalMetrics.length > 0 || criticalAlerts.length > 0) && (
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ExclamationCircleIcon className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Critical Issues</h3>
            </div>

            <div className="space-y-3">
              {criticalMetrics.slice(0, 5).map((metric) => {
                const categoryConfig = METRIC_CATEGORIES.find((c) => c.id === metric.category);
                const CategoryIcon = categoryConfig?.icon || CpuChipIcon;

                return (
                  <div key={metric.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CategoryIcon className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-900">{metric.name}</p>
                        <p className="text-sm text-gray-600">{metric.description}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-red-600">{formatValue(metric.value, metric.unit)}</p>
                      <p className="text-xs text-gray-500">
                        Threshold: {formatValue(metric.threshold.critical, metric.unit)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {criticalAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <BellAlertIcon className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge className="bg-red-100 text-red-800 text-xs">{alert.severity.toUpperCase()}</Badge>
                    <p className="text-xs text-gray-500 mt-1">{alert.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Performance Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {METRIC_CATEGORIES.map((category) => {
            const categoryMetrics = metrics.filter((m) => m.category === category.id);
            const avgValue =
              categoryMetrics.length > 0
                ? categoryMetrics.reduce((sum, m) => sum + m.value, 0) / categoryMetrics.length
                : 0;
            const criticalCount = categoryMetrics.filter((m) => getMetricStatus(m) === "critical").length;
            const warningCount = categoryMetrics.filter((m) => getMetricStatus(m) === "warning").length;

            return (
              <Card
                key={category.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setCategoryFilter(category.id);
                  setActiveTab("metrics");
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={cn("p-2 rounded-lg", category.color)}>
                      <category.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Metrics</p>
                      <p className="font-semibold text-gray-900">{categoryMetrics.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Warnings</p>
                      <p className="font-semibold text-yellow-600">{warningCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Critical</p>
                      <p className="font-semibold text-red-600">{criticalCount}</p>
                    </div>
                  </div>

                  {categoryMetrics.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Overall Health</span>
                        <span className="font-medium">
                          {Math.round(
                            ((categoryMetrics.length - criticalCount - warningCount) / categoryMetrics.length) * 100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${((categoryMetrics.length - criticalCount - warningCount) / categoryMetrics.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Reports */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
            <button
              onClick={() => setActiveTab("reports")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {reports.slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DocumentChartBarIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-900">Score: {report.summary.overallScore}/100</p>
                  <p className="text-xs text-gray-500">{report.generatedAt.toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderMetricsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {METRIC_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoRefresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="autoRefresh" className="text-sm text-gray-700">
              Auto-refresh
            </label>
          </div>

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
        </div>
      </div>

      {/* Metrics Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMetrics.map((metric) => {
            const status = getMetricStatus(metric);
            const StatusIcon = getStatusIcon(status);
            const TrendIcon = TREND_ICONS[metric.trend];
            const categoryConfig = METRIC_CATEGORIES.find((c) => c.id === metric.category);
            const CategoryIcon = categoryConfig?.icon || CpuChipIcon;

            return (
              <Card
                key={metric.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedMetric(metric);
                  setShowMetricModal(true);
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
                        <h4 className="font-medium text-gray-900 truncate">{metric.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{metric.description}</p>
                      </div>
                    </div>

                    <Badge className={cn("text-xs", getStatusColor(status))}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                  </div>

                  {/* Value */}
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{formatValue(metric.value, metric.unit)}</p>

                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <TrendIcon className={cn("w-4 h-4", TREND_COLORS[metric.trend])} />
                      <span className={cn("text-sm font-medium", TREND_COLORS[metric.trend])}>
                        {metric.trendPercentage > 0 ? "+" : ""}
                        {metric.trendPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Thresholds */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Good</span>
                      <span className="text-green-600">≤ {formatValue(metric.threshold.good, metric.unit)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Warning</span>
                      <span className="text-yellow-600">≤ {formatValue(metric.threshold.warning, metric.unit)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Critical</span>
                      <span className="text-red-600">{`> ${formatValue(metric.threshold.critical, metric.unit)}`}</span>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="text-xs text-gray-500 text-center">
                    Updated {metric.lastUpdated.toLocaleTimeString()}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMetrics.map((metric) => {
            const status = getMetricStatus(metric);
            const StatusIcon = getStatusIcon(status);
            const TrendIcon = TREND_ICONS[metric.trend];
            const categoryConfig = METRIC_CATEGORIES.find((c) => c.id === metric.category);
            const CategoryIcon = categoryConfig?.icon || CpuChipIcon;

            return (
              <Card
                key={metric.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedMetric(metric);
                  setShowMetricModal(true);
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
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{metric.name}</h4>
                        <Badge className={cn("text-xs", getStatusColor(status))}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatValue(metric.value, metric.unit)}</p>
                          <div className="flex items-center space-x-1">
                            <TrendIcon className={cn("w-3 h-3", TREND_COLORS[metric.trend])} />
                            <span className={cn("text-xs", TREND_COLORS[metric.trend])}>
                              {metric.trendPercentage > 0 ? "+" : ""}
                              {metric.trendPercentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{metric.description}</p>

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Good: ≤ {formatValue(metric.threshold.good, metric.unit)}</span>
                        <span>Warning: ≤ {formatValue(metric.threshold.warning, metric.unit)}</span>
                        <span>Critical: {`> ${formatValue(metric.threshold.critical, metric.unit)}`}</span>
                        <span>Updated: {metric.lastUpdated.toLocaleTimeString()}</span>
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
            <ChartBarIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Performance Monitor</h2>
            <Badge className="bg-blue-100 text-blue-800">{metrics.length} metrics</Badge>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onExportData("json")}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Export Data
            </button>

            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", name: "Overview", icon: ChartPieIcon },
              { id: "metrics", name: "Metrics", icon: ChartBarIcon },
              { id: "alerts", name: "Alerts", icon: BellAlertIcon },
              { id: "reports", name: "Reports", icon: DocumentChartBarIcon },
              { id: "profiles", name: "Profiles", icon: Cog6ToothIcon },
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
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "metrics" && renderMetricsTab()}
          {activeTab === "alerts" && (
            <div className="text-center py-12">
              <BellAlertIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Alerts</h3>
              <p className="text-gray-600">Monitor and manage performance alerts</p>
            </div>
          )}
          {activeTab === "reports" && (
            <div className="text-center py-12">
              <DocumentChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Reports</h3>
              <p className="text-gray-600">Generate and view performance reports</p>
            </div>
          )}
          {activeTab === "profiles" && (
            <div className="text-center py-12">
              <Cog6ToothIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Profiles</h3>
              <p className="text-gray-600">Manage monitoring profiles and configurations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
