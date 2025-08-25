"use client";

import React, { useState, useEffect } from "react";
import { Card, Badge } from "@/components/ui";
import {
  PuzzlePieceIcon,
  CloudIcon,
  LinkIcon,
  BoltIcon,
  CogIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  DocumentIcon,
  UserIcon,
  BellIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  CalendarIcon,
  FolderIcon,
  ServerIcon,
  ShieldCheckIcon,
  KeyIcon,
  GlobeAltIcon,
  CommandLineIcon,
  CodeBracketIcon,
  CubeIcon,
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  CheckIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  CpuChipIcon,
  WifiIcon,
  SignalIcon,
  BeakerIcon,
  LightBulbIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: "storage" | "communication" | "productivity" | "analytics" | "security" | "development" | "ai" | "workflow";
  provider: string;
  version: string;
  status: "active" | "inactive" | "error" | "pending" | "deprecated";
  icon: string;
  color: string;
  features: string[];
  endpoints: IntegrationEndpoint[];
  webhooks: Webhook[];
  authentication: AuthConfig;
  settings: Record<string, any>;
  usage: UsageStats;
  lastSync: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface IntegrationEndpoint {
  id: string;
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  description: string;
  parameters: EndpointParameter[];
  headers: Record<string, string>;
  rateLimit: {
    requests: number;
    window: number; // seconds
  };
  lastUsed: Date;
  usage: number;
}

interface EndpointParameter {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  required: boolean;
  description: string;
  defaultValue?: any;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  lastTriggered?: Date;
  deliveries: WebhookDelivery[];
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
    maxBackoffSeconds: number;
  };
}

interface WebhookDelivery {
  id: string;
  timestamp: Date;
  event: string;
  status: "success" | "failed" | "pending";
  responseCode?: number;
  responseTime?: number;
  payload: any;
  error?: string;
}

interface AuthConfig {
  type: "api_key" | "oauth2" | "basic" | "bearer" | "custom";
  credentials: Record<string, string>;
  scopes?: string[];
  tokenUrl?: string;
  refreshToken?: string;
  expiresAt?: Date;
}

interface UsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  dataTransferred: number; // bytes
  lastHour: number;
  lastDay: number;
  lastWeek: number;
  lastMonth: number;
}

interface IntegrationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  provider: string;
  icon: string;
  color: string;
  features: string[];
  setupSteps: SetupStep[];
  requiredCredentials: string[];
  documentation: string;
  popular: boolean;
}

interface SetupStep {
  id: string;
  title: string;
  description: string;
  type: "input" | "select" | "checkbox" | "oauth" | "test";
  required: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

interface WorkflowAutomation {
  id: string;
  name: string;
  description: string;
  trigger: {
    type: "webhook" | "schedule" | "event" | "manual";
    config: any;
  };
  actions: WorkflowAction[];
  conditions: WorkflowCondition[];
  active: boolean;
  lastRun?: Date;
  nextRun?: Date;
  runs: WorkflowRun[];
}

interface WorkflowAction {
  id: string;
  type: "api_call" | "webhook" | "email" | "notification" | "transform" | "condition";
  integrationId?: string;
  config: any;
  order: number;
}

interface WorkflowCondition {
  field: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "exists";
  value: any;
}

interface WorkflowRun {
  id: string;
  startTime: Date;
  endTime?: Date;
  status: "running" | "completed" | "failed" | "cancelled";
  logs: WorkflowLog[];
  result?: any;
  error?: string;
}

interface WorkflowLog {
  timestamp: Date;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  data?: any;
}

interface IntegrationHubProps {
  integrations: Integration[];
  templates: IntegrationTemplate[];
  workflows: WorkflowAutomation[];
  onIntegrationCreate: (integration: Partial<Integration>) => void;
  onIntegrationUpdate: (id: string, updates: Partial<Integration>) => void;
  onIntegrationDelete: (id: string) => void;
  onIntegrationTest: (id: string) => Promise<boolean>;
  onWebhookCreate: (integrationId: string, webhook: Partial<Webhook>) => void;
  onWebhookUpdate: (integrationId: string, webhookId: string, updates: Partial<Webhook>) => void;
  onWebhookDelete: (integrationId: string, webhookId: string) => void;
  onWorkflowCreate: (workflow: Partial<WorkflowAutomation>) => void;
  onWorkflowUpdate: (id: string, updates: Partial<WorkflowAutomation>) => void;
  onWorkflowDelete: (id: string) => void;
  onWorkflowRun: (id: string) => void;
  isActive: boolean;
  onClose: () => void;
}

const INTEGRATION_TEMPLATES: IntegrationTemplate[] = [
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Store and sync documents with Google Drive",
    category: "storage",
    provider: "Google",
    icon: "google-drive",
    color: "blue",
    features: ["File Upload", "Sync", "Sharing", "Version Control"],
    setupSteps: [],
    requiredCredentials: ["client_id", "client_secret"],
    documentation: "https://developers.google.com/drive",
    popular: true,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Send notifications and updates to Slack channels",
    category: "communication",
    provider: "Slack",
    icon: "slack",
    color: "purple",
    features: ["Notifications", "File Sharing", "Bot Integration"],
    setupSteps: [],
    requiredCredentials: ["bot_token", "webhook_url"],
    documentation: "https://api.slack.com",
    popular: true,
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect with 5000+ apps through Zapier",
    category: "workflow",
    provider: "Zapier",
    icon: "zapier",
    color: "orange",
    features: ["Automation", "Triggers", "Actions", "Multi-step Workflows"],
    setupSteps: [],
    requiredCredentials: ["api_key"],
    documentation: "https://zapier.com/developer",
    popular: true,
  },
  {
    id: "microsoft-365",
    name: "Microsoft 365",
    description: "Integrate with Office 365 and OneDrive",
    category: "productivity",
    provider: "Microsoft",
    icon: "microsoft",
    color: "blue",
    features: ["OneDrive", "SharePoint", "Teams", "Outlook"],
    setupSteps: [],
    requiredCredentials: ["tenant_id", "client_id", "client_secret"],
    documentation: "https://docs.microsoft.com/graph",
    popular: true,
  },
  {
    id: "aws-s3",
    name: "Amazon S3",
    description: "Store documents in Amazon S3 buckets",
    category: "storage",
    provider: "Amazon",
    icon: "aws",
    color: "orange",
    features: ["Object Storage", "Backup", "CDN", "Encryption"],
    setupSteps: [],
    requiredCredentials: ["access_key", "secret_key", "region"],
    documentation: "https://docs.aws.amazon.com/s3",
    popular: false,
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "AI-powered document analysis and generation",
    category: "ai",
    provider: "OpenAI",
    icon: "openai",
    color: "green",
    features: ["Text Analysis", "Summarization", "Translation", "OCR Enhancement"],
    setupSteps: [],
    requiredCredentials: ["api_key"],
    documentation: "https://platform.openai.com/docs",
    popular: true,
  },
];

const CATEGORY_CONFIG = {
  storage: { icon: FolderIcon, color: "text-blue-600 bg-blue-100" },
  communication: { icon: ChatBubbleLeftRightIcon, color: "text-purple-600 bg-purple-100" },
  productivity: { icon: RocketLaunchIcon, color: "text-green-600 bg-green-100" },
  analytics: { icon: ChartBarIcon, color: "text-yellow-600 bg-yellow-100" },
  security: { icon: ShieldCheckIcon, color: "text-red-600 bg-red-100" },
  development: { icon: CodeBracketIcon, color: "text-gray-600 bg-gray-100" },
  ai: { icon: CpuChipIcon, color: "text-indigo-600 bg-indigo-100" },
  workflow: { icon: BoltIcon, color: "text-orange-600 bg-orange-100" },
};

const STATUS_CONFIG = {
  active: { color: "text-green-600 bg-green-100", icon: CheckCircleIcon },
  inactive: { color: "text-gray-600 bg-gray-100", icon: PauseIcon },
  error: { color: "text-red-600 bg-red-100", icon: XCircleIcon },
  pending: { color: "text-yellow-600 bg-yellow-100", icon: ClockIcon },
  deprecated: { color: "text-orange-600 bg-orange-100", icon: ExclamationTriangleIcon },
};

export default function IntegrationHub({
  integrations,
  templates,
  workflows,
  onIntegrationCreate,
  onIntegrationUpdate,
  onIntegrationDelete,
  onIntegrationTest,
  onWebhookCreate,
  onWebhookUpdate,
  onWebhookDelete,
  onWorkflowCreate,
  onWorkflowUpdate,
  onWorkflowDelete,
  onWorkflowRun,
  isActive,
  onClose,
}: IntegrationHubProps) {
  const [activeTab, setActiveTab] = useState<"integrations" | "templates" | "workflows" | "webhooks">("integrations");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<IntegrationTemplate | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  const handleTestIntegration = async (integrationId: string) => {
    setTestingIntegration(integrationId);
    try {
      const success = await onIntegrationTest(integrationId);
      // Handle test result
    } catch (error) {
      console.error("Integration test failed:", error);
    } finally {
      setTestingIntegration(null);
    }
  };

  const filteredIntegrations = integrations.filter((integration) => {
    if (filterCategory !== "all" && integration.category !== filterCategory) return false;
    if (filterStatus !== "all" && integration.status !== filterStatus) return false;
    if (
      searchQuery &&
      !integration.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const filteredTemplates = templates.filter((template) => {
    if (filterCategory !== "all" && template.category !== filterCategory) return false;
    if (
      searchQuery &&
      !template.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !template.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const renderIntegrationsList = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {Object.keys(CATEGORY_CONFIG).map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="error">Error</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <button
          onClick={() => setActiveTab("templates")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add Integration</span>
        </button>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => {
          const categoryConfig = CATEGORY_CONFIG[integration.category];
          const statusConfig = STATUS_CONFIG[integration.status];
          const CategoryIcon = categoryConfig.icon;
          const StatusIcon = statusConfig.icon;

          return (
            <Card key={integration.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={cn("p-2 rounded-lg", categoryConfig.color)}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-500">{integration.provider}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge className={cn("text-xs", statusConfig.color)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {integration.status}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{integration.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Requests (24h):</span>
                  <span className="text-gray-900">{integration.usage.lastDay.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="text-gray-900">
                    {integration.usage.totalRequests > 0
                      ? Math.round((integration.usage.successfulRequests / integration.usage.totalRequests) * 100)
                      : 0}
                    %
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Data Transfer:</span>
                  <span className="text-gray-900">{formatBytes(integration.usage.dataTransferred)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Sync:</span>
                  <span className="text-gray-900">{formatTimeAgo(integration.lastSync)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {integration.features.slice(0, 3).map((feature) => (
                  <Badge key={feature} className="bg-gray-100 text-gray-700 text-xs">
                    {feature}
                  </Badge>
                ))}
                {integration.features.length > 3 && (
                  <Badge className="bg-gray-100 text-gray-600 text-xs">+{integration.features.length - 3}</Badge>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleTestIntegration(integration.id)}
                  disabled={testingIntegration === integration.id}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50"
                >
                  {testingIntegration === integration.id ? <ArrowPathIcon className="w-3 h-3 animate-spin" /> : "Test"}
                </button>

                <button
                  onClick={() => setSelectedIntegration(integration)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Configure
                </button>

                <button
                  onClick={() => {
                    if (integration.status === "active") {
                      onIntegrationUpdate(integration.id, { status: "inactive" });
                    } else {
                      onIntegrationUpdate(integration.id, { status: "active" });
                    }
                  }}
                  className={cn(
                    "px-3 py-1 text-xs rounded transition-colors",
                    integration.status === "active"
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200",
                  )}
                >
                  {integration.status === "active" ? "Disable" : "Enable"}
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderTemplatesList = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {Object.keys(CATEGORY_CONFIG).map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
          <CodeBracketIcon className="w-4 h-4" />
          <span>Custom Integration</span>
        </button>
      </div>

      {/* Popular Templates */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTEGRATION_TEMPLATES.filter((t) => t.popular).map((template) => {
            const categoryConfig = CATEGORY_CONFIG[template.category as keyof typeof CATEGORY_CONFIG];
            const CategoryIcon = categoryConfig.icon;

            return (
              <Card key={template.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={cn("p-2 rounded-lg", categoryConfig.color)}>
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-500">{template.provider}</p>
                    </div>
                  </div>

                  <Badge className="bg-yellow-100 text-yellow-800 text-xs">Popular</Badge>
                </div>

                <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {template.features.slice(0, 3).map((feature) => (
                    <Badge key={feature} className="bg-gray-100 text-gray-700 text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {template.features.length > 3 && (
                    <Badge className="bg-gray-100 text-gray-600 text-xs">+{template.features.length - 3}</Badge>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowSetupModal(true);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Setup
                  </button>

                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <InformationCircleIcon className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* All Templates */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">All Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const categoryConfig = CATEGORY_CONFIG[template.category as keyof typeof CATEGORY_CONFIG];
            const CategoryIcon = categoryConfig.icon;

            return (
              <Card key={template.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={cn("p-2 rounded-lg", categoryConfig.color)}>
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-500">{template.provider}</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{template.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {template.features.slice(0, 3).map((feature) => (
                    <Badge key={feature} className="bg-gray-100 text-gray-700 text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {template.features.length > 3 && (
                    <Badge className="bg-gray-100 text-gray-600 text-xs">+{template.features.length - 3}</Badge>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowSetupModal(true);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Setup
                  </button>

                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <InformationCircleIcon className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderWorkflowsList = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Workflow Automations</h3>
        <button
          onClick={() => setShowWorkflowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Create Workflow</span>
        </button>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{workflow.name}</h4>
                <p className="text-sm text-gray-500">{workflow.description}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Badge
                  className={cn(
                    "text-xs",
                    workflow.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700",
                  )}
                >
                  {workflow.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Trigger:</span>
                <span className="text-gray-900 capitalize">{workflow.trigger.type}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Actions:</span>
                <span className="text-gray-900">{workflow.actions.length}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Run:</span>
                <span className="text-gray-900">{workflow.lastRun ? formatTimeAgo(workflow.lastRun) : "Never"}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Success Rate:</span>
                <span className="text-gray-900">
                  {workflow.runs.length > 0
                    ? Math.round(
                        (workflow.runs.filter((r) => r.status === "completed").length / workflow.runs.length) * 100,
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onWorkflowRun(workflow.id)}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                Run Now
              </button>

              <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                Edit
              </button>

              <button
                onClick={() => {
                  onWorkflowUpdate(workflow.id, { active: !workflow.active });
                }}
                className={cn(
                  "px-3 py-1 text-xs rounded transition-colors",
                  workflow.active
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200",
                )}
              >
                {workflow.active ? "Disable" : "Enable"}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderWebhooksList = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Webhooks</h3>
        <button
          onClick={() => setShowWebhookModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Create Webhook</span>
        </button>
      </div>

      {/* Webhooks List */}
      <div className="space-y-3">
        {integrations.flatMap((integration) =>
          integration.webhooks.map((webhook) => (
            <Card key={webhook.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">{webhook.name}</h4>
                    <Badge
                      className={cn(
                        "text-xs",
                        webhook.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700",
                      )}
                    >
                      {webhook.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">URL:</span>
                      <p className="text-gray-900 font-mono text-xs break-all">{webhook.url}</p>
                    </div>

                    <div>
                      <span className="text-gray-600">Events:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {webhook.events.slice(0, 2).map((event) => (
                          <Badge key={event} className="bg-blue-100 text-blue-700 text-xs">
                            {event}
                          </Badge>
                        ))}
                        {webhook.events.length > 2 && (
                          <Badge className="bg-gray-100 text-gray-600 text-xs">+{webhook.events.length - 2}</Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-600">Last Triggered:</span>
                      <p className="text-gray-900">
                        {webhook.lastTriggered ? formatTimeAgo(webhook.lastTriggered) : "Never"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                    <span>Integration: {integration.name}</span>
                    <span>Deliveries: {webhook.deliveries.length}</span>
                    <span>
                      Success Rate:{" "}
                      {webhook.deliveries.length > 0
                        ? Math.round(
                            (webhook.deliveries.filter((d) => d.status === "success").length /
                              webhook.deliveries.length) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                    Test
                  </button>

                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                    Edit
                  </button>

                  <button
                    onClick={() => onWebhookUpdate(integration.id, webhook.id, { active: !webhook.active })}
                    className={cn(
                      "px-3 py-1 text-xs rounded transition-colors",
                      webhook.active
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200",
                    )}
                  >
                    {webhook.active ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            </Card>
          )),
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
            <PuzzlePieceIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Integration Hub</h2>
            <Badge className="bg-blue-100 text-blue-800">
              {integrations.filter((i) => i.status === "active").length} active
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowPathIcon className="w-5 h-5" />
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
              { id: "integrations", name: "Integrations", icon: LinkIcon },
              { id: "templates", name: "Templates", icon: CubeIcon },
              { id: "workflows", name: "Workflows", icon: BoltIcon },
              { id: "webhooks", name: "Webhooks", icon: ServerIcon },
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
          {activeTab === "integrations" && renderIntegrationsList()}
          {activeTab === "templates" && renderTemplatesList()}
          {activeTab === "workflows" && renderWorkflowsList()}
          {activeTab === "webhooks" && renderWebhooksList()}
        </div>
      </div>
    </div>
  );
}
