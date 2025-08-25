"use client";

import React, { useState, useEffect } from "react";
import { Card, Badge } from "@/components/ui";
import {
  GlobeAltIcon,
  ServerIcon,
  CloudIcon,
  LinkIcon,
  KeyIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  FingerPrintIcon,
  CpuChipIcon,
  CommandLineIcon,
  CodeBracketIcon,
  DocumentIcon,
  DocumentTextIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  BoltIcon,
  RocketLaunchIcon,
  FireIcon,
  SparklesIcon,
  LightBulbIcon,
  CogIcon,
  Cog6ToothIcon,
  AdjustmentsHorizontalIcon,
  WrenchScrewdriverIcon,
  BugAntIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
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
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ShareIcon,
  ArrowTopRightOnSquareIcon,
  ClipboardIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  FolderPlusIcon,
  FolderOpenIcon,
  ArchiveBoxIcon,
  InboxIcon,
  PaperAirplaneIcon,
  EnvelopeIcon,
  AtSymbolIcon,
  PhoneIcon,
  DevicePhoneMobileIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  BellAlertIcon,
  SpeakerWaveIcon,
  MegaphoneIcon,
  UserIcon,
  UserGroupIcon,
  UsersIcon,
  IdentificationIcon,
  TagIcon,
  BookmarkIcon,
  StarIcon,
  HeartIcon,
  FlagIcon,
  MapIcon,
  MapPinIcon,
  GlobeAmericasIcon,
  BuildingOfficeIcon,
  HomeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  CurrencyDollarIcon,
  GiftIcon,
  TruckIcon,
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
  ViewfinderCircleIcon,
  MagnifyingGlassIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  FunnelIcon,
  AdjustmentsVerticalIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ScaleIcon,
  BeakerIcon,
  PrinterIcon,
  CameraIcon,
  VideoCameraIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  RadioIcon,
  TvIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  WifiIcon,
  SignalIcon,
  SignalSlashIcon,
  PowerIcon,
  SunIcon,
  MoonIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface APIEndpoint {
  id: string;
  name: string;
  description: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  category: string;
  version: string;
  status: "active" | "deprecated" | "beta" | "maintenance";
  authentication: AuthenticationConfig;
  headers: Record<string, string>;
  parameters: APIParameter[];
  requestBody?: RequestBodySchema;
  responses: ResponseSchema[];
  rateLimit: RateLimit;
  documentation: string;
  examples: APIExample[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  lastUsed?: Date;
  usageCount: number;
  errorRate: number;
  averageResponseTime: number;
  uptime: number;
  isPublic: boolean;
  isFavorite: boolean;
}

interface AuthenticationConfig {
  type: "none" | "api_key" | "bearer" | "basic" | "oauth2" | "jwt" | "custom";
  location?: "header" | "query" | "body";
  name?: string;
  scheme?: string;
  flows?: OAuth2Flows;
  customConfig?: Record<string, any>;
}

interface OAuth2Flows {
  authorizationCode?: OAuth2Flow;
  implicit?: OAuth2Flow;
  password?: OAuth2Flow;
  clientCredentials?: OAuth2Flow;
}

interface OAuth2Flow {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: Record<string, string>;
}

interface APIParameter {
  name: string;
  in: "query" | "header" | "path" | "cookie";
  description: string;
  required: boolean;
  type: "string" | "number" | "integer" | "boolean" | "array" | "object";
  format?: string;
  enum?: string[];
  default?: any;
  example?: any;
  schema?: any;
}

interface RequestBodySchema {
  description: string;
  required: boolean;
  contentType: string;
  schema: any;
  examples: Record<string, any>;
}

interface ResponseSchema {
  statusCode: number;
  description: string;
  contentType: string;
  schema: any;
  examples: Record<string, any>;
  headers?: Record<string, any>;
}

interface RateLimit {
  requests: number;
  period: "second" | "minute" | "hour" | "day" | "month";
  burst?: number;
  concurrent?: number;
}

interface APIExample {
  id: string;
  name: string;
  description: string;
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    parameters: Record<string, any>;
    body?: any;
  };
  response: {
    statusCode: number;
    headers: Record<string, string>;
    body: any;
  };
  language: string;
  code: string;
}

interface APIKey {
  id: string;
  name: string;
  description: string;
  key: string;
  secret?: string;
  permissions: string[];
  endpoints: string[];
  rateLimit: RateLimit;
  ipWhitelist: string[];
  expiresAt?: Date;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
  isActive: boolean;
  environment: "development" | "staging" | "production";
}

interface Webhook {
  id: string;
  name: string;
  description: string;
  url: string;
  events: string[];
  headers: Record<string, string>;
  secret?: string;
  retryPolicy: {
    maxRetries: number;
    backoffStrategy: "linear" | "exponential" | "fixed";
    initialDelay: number;
    maxDelay: number;
  };
  filters: WebhookFilter[];
  isActive: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  successCount: number;
  failureCount: number;
  averageResponseTime: number;
}

interface WebhookFilter {
  field: string;
  operator: "equals" | "not_equals" | "contains" | "not_contains" | "starts_with" | "ends_with" | "regex";
  value: any;
}

interface APIUsageMetrics {
  endpoint: string;
  period: "hour" | "day" | "week" | "month";
  requests: number;
  errors: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  dataTransferred: number;
  uniqueUsers: number;
  topUserAgents: Record<string, number>;
  topCountries: Record<string, number>;
  errorBreakdown: Record<string, number>;
}

interface APILog {
  id: string;
  timestamp: Date;
  endpoint: string;
  method: string;
  url: string;
  statusCode: number;
  responseTime: number;
  requestSize: number;
  responseSize: number;
  userAgent: string;
  ipAddress: string;
  apiKey?: string;
  error?: string;
  requestHeaders: Record<string, string>;
  responseHeaders: Record<string, string>;
  requestBody?: any;
  responseBody?: any;
}

interface APIManagerProps {
  endpoints: APIEndpoint[];
  apiKeys: APIKey[];
  webhooks: Webhook[];
  metrics: APIUsageMetrics[];
  logs: APILog[];
  onCreateEndpoint: (endpoint: Partial<APIEndpoint>) => void;
  onUpdateEndpoint: (endpointId: string, updates: Partial<APIEndpoint>) => void;
  onDeleteEndpoint: (endpointId: string) => void;
  onTestEndpoint: (endpointId: string, testData?: any) => void;
  onCreateAPIKey: (apiKey: Partial<APIKey>) => void;
  onUpdateAPIKey: (keyId: string, updates: Partial<APIKey>) => void;
  onDeleteAPIKey: (keyId: string) => void;
  onCreateWebhook: (webhook: Partial<Webhook>) => void;
  onUpdateWebhook: (webhookId: string, updates: Partial<Webhook>) => void;
  onDeleteWebhook: (webhookId: string) => void;
  onTestWebhook: (webhookId: string) => void;
  onToggleFavorite: (endpointId: string) => void;
  isActive: boolean;
  onClose: () => void;
}

const API_CATEGORIES = [
  {
    id: "authentication",
    name: "Authentication",
    description: "User authentication and authorization",
    icon: LockClosedIcon,
    color: "text-red-600 bg-red-100",
  },
  {
    id: "documents",
    name: "Documents",
    description: "Document management and processing",
    icon: DocumentIcon,
    color: "text-blue-600 bg-blue-100",
  },
  {
    id: "users",
    name: "Users",
    description: "User management and profiles",
    icon: UserIcon,
    color: "text-green-600 bg-green-100",
  },
  {
    id: "notifications",
    name: "Notifications",
    description: "Notification and messaging services",
    icon: BellIcon,
    color: "text-yellow-600 bg-yellow-100",
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Analytics and reporting",
    icon: ChartBarIcon,
    color: "text-purple-600 bg-purple-100",
  },
  {
    id: "integrations",
    name: "Integrations",
    description: "Third-party integrations",
    icon: LinkIcon,
    color: "text-indigo-600 bg-indigo-100",
  },
  {
    id: "storage",
    name: "Storage",
    description: "File and data storage",
    icon: CloudIcon,
    color: "text-teal-600 bg-teal-100",
  },
  {
    id: "webhooks",
    name: "Webhooks",
    description: "Event-driven webhooks",
    icon: BoltIcon,
    color: "text-orange-600 bg-orange-100",
  },
];

const HTTP_METHODS = [
  { method: "GET", color: "text-green-600 bg-green-100" },
  { method: "POST", color: "text-blue-600 bg-blue-100" },
  { method: "PUT", color: "text-orange-600 bg-orange-100" },
  { method: "DELETE", color: "text-red-600 bg-red-100" },
  { method: "PATCH", color: "text-purple-600 bg-purple-100" },
  { method: "HEAD", color: "text-gray-600 bg-gray-100" },
  { method: "OPTIONS", color: "text-yellow-600 bg-yellow-100" },
];

const STATUS_COLORS = {
  active: "text-green-600 bg-green-100",
  deprecated: "text-red-600 bg-red-100",
  beta: "text-blue-600 bg-blue-100",
  maintenance: "text-yellow-600 bg-yellow-100",
};

export default function APIManager({
  endpoints,
  apiKeys,
  webhooks,
  metrics,
  logs,
  onCreateEndpoint,
  onUpdateEndpoint,
  onDeleteEndpoint,
  onTestEndpoint,
  onCreateAPIKey,
  onUpdateAPIKey,
  onDeleteAPIKey,
  onCreateWebhook,
  onUpdateWebhook,
  onDeleteWebhook,
  onTestWebhook,
  onToggleFavorite,
  isActive,
  onClose,
}: APIManagerProps) {
  const [activeTab, setActiveTab] = useState<"endpoints" | "keys" | "webhooks" | "metrics" | "logs">("endpoints");
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [selectedAPIKey, setSelectedAPIKey] = useState<APIKey | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [showEndpointModal, setShowEndpointModal] = useState(false);
  const [showAPIKeyModal, setShowAPIKeyModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "created" | "updated" | "usage">("updated");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (milliseconds: number): string => {
    if (milliseconds < 1000) return `${milliseconds}ms`;
    if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}s`;
    return `${(milliseconds / 60000).toFixed(1)}m`;
  };

  const getMethodColor = (method: string) => {
    const methodConfig = HTTP_METHODS.find((m) => m.method === method);
    return methodConfig?.color || "text-gray-600 bg-gray-100";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return CheckCircleIcon;
      case "deprecated":
        return XCircleIcon;
      case "beta":
        return ExclamationTriangleIcon;
      case "maintenance":
        return ClockIcon;
      default:
        return InformationCircleIcon;
    }
  };

  const filteredEndpoints = endpoints.filter((endpoint) => {
    if (
      searchQuery &&
      !endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !endpoint.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !endpoint.url.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !endpoint.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }
    if (selectedCategory && endpoint.category !== selectedCategory) return false;
    if (selectedMethod && endpoint.method !== selectedMethod) return false;
    if (statusFilter && endpoint.status !== statusFilter) return false;
    return true;
  });

  const sortedEndpoints = [...filteredEndpoints].sort((a, b) => {
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
      case "usage":
        comparison = a.usageCount - b.usageCount;
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const renderEndpointsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search endpoints..."
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
            {API_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Methods</option>
            {HTTP_METHODS.map((method) => (
              <option key={method.method} value={method.method}>
                {method.method}
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
            <option value="deprecated">Deprecated</option>
            <option value="beta">Beta</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="updated">Recently Updated</option>
            <option value="created">Recently Created</option>
            <option value="name">Name</option>
            <option value="usage">Most Used</option>
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
            onClick={() => setShowEndpointModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Endpoint</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GlobeAltIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Endpoints</p>
              <p className="text-2xl font-semibold text-gray-900">{endpoints.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-gray-900">
                {endpoints.filter((e) => e.status === "active").length}
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
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-semibold text-gray-900">
                {endpoints.reduce((sum, e) => sum + e.usageCount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-semibold text-gray-900">
                {endpoints.length > 0
                  ? Math.round(endpoints.reduce((sum, e) => sum + e.averageResponseTime, 0) / endpoints.length)
                  : 0}
                ms
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Endpoints Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEndpoints.map((endpoint) => {
            const StatusIcon = getStatusIcon(endpoint.status);
            const categoryConfig = API_CATEGORIES.find((c) => c.id === endpoint.category);
            const CategoryIcon = categoryConfig?.icon || GlobeAltIcon;

            return (
              <Card
                key={endpoint.id}
                className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedEndpoint(endpoint);
                  setShowEndpointModal(true);
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
                        <h4 className="font-medium text-gray-900 truncate">{endpoint.name}</h4>
                        <p className="text-sm text-gray-600 truncate">{endpoint.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(endpoint.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <HeartIcon
                        className={cn("w-4 h-4", endpoint.isFavorite ? "text-red-500 fill-current" : "text-gray-400")}
                      />
                    </button>
                  </div>

                  {/* Method and URL */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={cn("text-xs font-mono", getMethodColor(endpoint.method))}>
                        {endpoint.method}
                      </Badge>
                      <Badge className={cn("text-xs", STATUS_COLORS[endpoint.status])}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {endpoint.status.charAt(0).toUpperCase() + endpoint.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="bg-gray-50 rounded p-2">
                      <code className="text-xs text-gray-700 break-all">{endpoint.url}</code>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Requests</p>
                      <p className="font-medium text-gray-900">{endpoint.usageCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Response</p>
                      <p className="font-medium text-gray-900">{endpoint.averageResponseTime}ms</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Error Rate</p>
                      <p className="font-medium text-gray-900">{endpoint.errorRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Uptime</p>
                      <p className="font-medium text-gray-900">{endpoint.uptime.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {endpoint.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} className="bg-gray-100 text-gray-700 text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {endpoint.tags.length > 3 && (
                      <Badge className="bg-gray-100 text-gray-600 text-xs">+{endpoint.tags.length - 3}</Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTestEndpoint(endpoint.id);
                      }}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Test
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEndpoint(endpoint);
                        setShowEndpointModal(true);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(endpoint.url);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                    >
                      <ClipboardIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedEndpoints.map((endpoint) => {
            const StatusIcon = getStatusIcon(endpoint.status);
            const categoryConfig = API_CATEGORIES.find((c) => c.id === endpoint.category);
            const CategoryIcon = categoryConfig?.icon || GlobeAltIcon;

            return (
              <Card
                key={endpoint.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedEndpoint(endpoint);
                  setShowEndpointModal(true);
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
                        <h4 className="font-medium text-gray-900">{endpoint.name}</h4>
                        <Badge className={cn("text-xs font-mono", getMethodColor(endpoint.method))}>
                          {endpoint.method}
                        </Badge>
                        <Badge className={cn("text-xs", STATUS_COLORS[endpoint.status])}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {endpoint.status.charAt(0).toUpperCase() + endpoint.status.slice(1)}
                        </Badge>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(endpoint.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <HeartIcon
                          className={cn("w-4 h-4", endpoint.isFavorite ? "text-red-500 fill-current" : "text-gray-400")}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <div className="bg-gray-50 rounded px-2 py-1 flex-1 mr-4">
                        <code className="text-xs text-gray-700">{endpoint.url}</code>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{endpoint.usageCount.toLocaleString()} requests</span>
                        <span>{endpoint.averageResponseTime}ms avg</span>
                        <span>{endpoint.errorRate.toFixed(1)}% errors</span>
                        <span>{endpoint.uptime.toFixed(1)}% uptime</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{endpoint.description}</p>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTestEndpoint(endpoint.id);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Test
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(endpoint.url);
                          }}
                          className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                        >
                          <ClipboardIcon className="w-4 h-4" />
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
            <GlobeAltIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">API Manager</h2>
            <Badge className="bg-blue-100 text-blue-800">{endpoints.length} endpoints</Badge>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "endpoints", name: "Endpoints", icon: GlobeAltIcon },
              { id: "keys", name: "API Keys", icon: KeyIcon },
              { id: "webhooks", name: "Webhooks", icon: BoltIcon },
              { id: "metrics", name: "Metrics", icon: ChartBarIcon },
              { id: "logs", name: "Logs", icon: DocumentTextIcon },
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
          {activeTab === "endpoints" && renderEndpointsTab()}
          {activeTab === "keys" && (
            <div className="text-center py-12">
              <KeyIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">API Keys</h3>
              <p className="text-gray-600">Manage API keys and access tokens</p>
            </div>
          )}
          {activeTab === "webhooks" && (
            <div className="text-center py-12">
              <BoltIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Webhooks</h3>
              <p className="text-gray-600">Configure event-driven webhooks</p>
            </div>
          )}
          {activeTab === "metrics" && (
            <div className="text-center py-12">
              <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">API Metrics</h3>
              <p className="text-gray-600">Monitor API usage and performance</p>
            </div>
          )}
          {activeTab === "logs" && (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">API Logs</h3>
              <p className="text-gray-600">View detailed API request logs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
