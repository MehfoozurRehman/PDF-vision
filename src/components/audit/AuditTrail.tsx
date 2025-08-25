"use client";

import React, { useState, useEffect } from "react";
import { Card, Badge } from "@/components/ui";
import {
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ClockIcon,
  CalendarIcon,
  CalendarDaysIcon,
  UserIcon,
  UsersIcon,
  DocumentIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  PrinterIcon,
  PencilSquareIcon,
  ChatBubbleLeftIcon,
  TagIcon,
  FolderIcon,
  ArchiveBoxIcon,
  LockClosedIcon,
  LockOpenIcon,
  KeyIcon,
  FingerPrintIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
  GlobeAltIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  HomeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  IdentificationIcon,
  CreditCardIcon,
  BanknotesIcon,
  ScaleIcon,
  DocumentMagnifyingGlassIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  LinkIcon,
  ClipboardIcon,
  DocumentDuplicateIcon,
  PaperAirplaneIcon,
  EnvelopeIcon,
  PhoneIcon,
  AtSymbolIcon,
  BellIcon,
  BellAlertIcon,
  MegaphoneIcon,
  ExclamationCircleIcon,
  HandRaisedIcon,
  StopIcon,
  NoSymbolIcon,
  ShieldExclamationIcon,
  FireIcon,
  BoltIcon,
  SparklesIcon,
  LightBulbIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  Cog6ToothIcon,
  CogIcon,
  CommandLineIcon,
  CodeBracketIcon,
  CpuChipIcon,
  ServerIcon,
  CloudIcon,
  WifiIcon,
  SignalIcon,
  PowerIcon,
  Battery100Icon,
  SunIcon,
  MoonIcon,
  SwatchIcon,
  PaintBrushIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  TrashIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  ViewColumnsIcon,
  AdjustmentsVerticalIcon,
  Bars3Icon,
  Bars4Icon,
  QueueListIcon,
  RectangleStackIcon,
  Square2StackIcon,
  CubeIcon,
  PuzzlePieceIcon,
  FlagIcon,
  BookmarkIcon,
  StarIcon,
  HeartIcon,
  HandThumbUpIcon as ThumbUpIcon,
  HandThumbDownIcon as ThumbDownIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  TrophyIcon,
  GiftIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ChartPieIcon,
  PresentationChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType:
    | "access"
    | "modification"
    | "deletion"
    | "creation"
    | "permission_change"
    | "security"
    | "system"
    | "compliance";
  action: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "success" | "failure" | "warning" | "pending";
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
  };
  resource: {
    type: "document" | "user" | "system" | "configuration" | "integration";
    id: string;
    name: string;
    path?: string;
    version?: string;
  };
  context: {
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    location?: {
      country: string;
      city: string;
      coordinates?: [number, number];
    };
    device: {
      type: "desktop" | "tablet" | "mobile";
      os: string;
      browser: string;
    };
  };
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata: {
    correlationId?: string;
    parentEventId?: string;
    tags?: string[];
    customFields?: Record<string, any>;
  };
  compliance: {
    regulations: string[];
    retentionPeriod: number;
    classification: "public" | "internal" | "confidential" | "restricted";
    dataSubjects?: string[];
  };
  risk: {
    score: number;
    factors: string[];
    mitigation?: string[];
  };
}

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  regulation: "GDPR" | "HIPAA" | "SOX" | "PCI_DSS" | "ISO_27001" | "CCPA" | "FERPA" | "Custom";
  category: "data_protection" | "access_control" | "audit_logging" | "retention" | "encryption" | "privacy";
  requirements: {
    id: string;
    description: string;
    mandatory: boolean;
    implementation: string;
    evidence: string[];
  }[];
  status: "compliant" | "non_compliant" | "partial" | "not_applicable";
  lastAssessment: Date;
  nextAssessment: Date;
  responsible: string;
  evidence: {
    type: "document" | "screenshot" | "log" | "certificate" | "report";
    name: string;
    path: string;
    uploadedAt: Date;
    uploadedBy: string;
  }[];
  exceptions: {
    id: string;
    reason: string;
    approvedBy: string;
    approvedAt: Date;
    expiresAt: Date;
    compensatingControls: string[];
  }[];
}

interface AuditReport {
  id: string;
  name: string;
  type: "compliance" | "security" | "access" | "activity" | "risk" | "custom";
  period: {
    start: Date;
    end: Date;
  };
  scope: {
    users?: string[];
    documents?: string[];
    systems?: string[];
    regulations?: string[];
  };
  findings: {
    id: string;
    type: "violation" | "risk" | "anomaly" | "recommendation";
    severity: "low" | "medium" | "high" | "critical";
    title: string;
    description: string;
    evidence: string[];
    recommendation: string;
    status: "open" | "in_progress" | "resolved" | "accepted_risk";
    assignedTo?: string;
    dueDate?: Date;
  }[];
  statistics: {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    complianceScore: number;
    riskScore: number;
    trends: {
      period: string;
      events: { date: Date; count: number }[];
      compliance: { date: Date; score: number }[];
      risk: { date: Date; score: number }[];
    };
  };
  generatedAt: Date;
  generatedBy: string;
  status: "draft" | "final" | "approved" | "archived";
  approvals: {
    approver: string;
    approvedAt: Date;
    comments?: string;
  }[];
  distribution: {
    recipient: string;
    sentAt: Date;
    method: "email" | "portal" | "api";
  }[];
}

interface RetentionPolicy {
  id: string;
  name: string;
  description: string;
  scope: {
    eventTypes: string[];
    resourceTypes: string[];
    classifications: string[];
    regulations: string[];
  };
  retention: {
    period: number;
    unit: "days" | "months" | "years";
    triggers: ("creation" | "last_access" | "last_modification" | "user_deletion")[];
  };
  archival: {
    enabled: boolean;
    location: "local" | "cloud" | "tape" | "external";
    encryption: boolean;
    compression: boolean;
  };
  deletion: {
    automatic: boolean;
    method: "soft" | "hard" | "cryptographic";
    verification: boolean;
    certificate: boolean;
  };
  exceptions: {
    legalHold: boolean;
    investigationHold: boolean;
    customHolds: string[];
  };
  compliance: {
    regulations: string[];
    justification: string;
    approvedBy: string;
    approvedAt: Date;
  };
  status: "active" | "inactive" | "draft";
  createdAt: Date;
  lastModified: Date;
  version: number;
}

interface AuditTrailProps {
  events: AuditEvent[];
  rules: ComplianceRule[];
  reports: AuditReport[];
  policies: RetentionPolicy[];
  onCreateEvent: (event: Partial<AuditEvent>) => void;
  onUpdateEvent: (eventId: string, updates: Partial<AuditEvent>) => void;
  onDeleteEvent: (eventId: string) => void;
  onCreateRule: (rule: Partial<ComplianceRule>) => void;
  onUpdateRule: (ruleId: string, updates: Partial<ComplianceRule>) => void;
  onGenerateReport: (config: Partial<AuditReport>) => void;
  onExportEvents: (format: "csv" | "json" | "xml" | "pdf", filters?: any) => void;
  onCreatePolicy: (policy: Partial<RetentionPolicy>) => void;
  onUpdatePolicy: (policyId: string, updates: Partial<RetentionPolicy>) => void;
  isActive: boolean;
  onClose: () => void;
}

const EVENT_TYPES = [
  {
    id: "access",
    name: "Access Events",
    description: "Document views, downloads, and access attempts",
    icon: EyeIcon,
    color: "text-blue-600 bg-blue-100",
  },
  {
    id: "modification",
    name: "Modification Events",
    description: "Document edits, annotations, and changes",
    icon: PencilSquareIcon,
    color: "text-green-600 bg-green-100",
  },
  {
    id: "deletion",
    name: "Deletion Events",
    description: "Document and data deletions",
    icon: TrashIcon,
    color: "text-red-600 bg-red-100",
  },
  {
    id: "creation",
    name: "Creation Events",
    description: "New document and resource creation",
    icon: PlusIcon,
    color: "text-purple-600 bg-purple-100",
  },
  {
    id: "permission_change",
    name: "Permission Changes",
    description: "Access control and permission modifications",
    icon: KeyIcon,
    color: "text-yellow-600 bg-yellow-100",
  },
  {
    id: "security",
    name: "Security Events",
    description: "Authentication, authorization, and security incidents",
    icon: ShieldCheckIcon,
    color: "text-orange-600 bg-orange-100",
  },
  {
    id: "system",
    name: "System Events",
    description: "System operations and administrative actions",
    icon: CogIcon,
    color: "text-gray-600 bg-gray-100",
  },
  {
    id: "compliance",
    name: "Compliance Events",
    description: "Regulatory and compliance-related activities",
    icon: ScaleIcon,
    color: "text-indigo-600 bg-indigo-100",
  },
];

const SEVERITY_LEVELS = [
  {
    id: "low",
    name: "Low",
    icon: InformationCircleIcon,
    color: "text-blue-600 bg-blue-100",
  },
  {
    id: "medium",
    name: "Medium",
    icon: ExclamationCircleIcon,
    color: "text-yellow-600 bg-yellow-100",
  },
  {
    id: "high",
    name: "High",
    icon: ExclamationTriangleIcon,
    color: "text-orange-600 bg-orange-100",
  },
  {
    id: "critical",
    name: "Critical",
    icon: XCircleIcon,
    color: "text-red-600 bg-red-100",
  },
];

const REGULATIONS = [
  { id: "GDPR", name: "GDPR", description: "General Data Protection Regulation" },
  { id: "HIPAA", name: "HIPAA", description: "Health Insurance Portability and Accountability Act" },
  { id: "SOX", name: "SOX", description: "Sarbanes-Oxley Act" },
  { id: "PCI_DSS", name: "PCI DSS", description: "Payment Card Industry Data Security Standard" },
  { id: "ISO_27001", name: "ISO 27001", description: "Information Security Management" },
  { id: "CCPA", name: "CCPA", description: "California Consumer Privacy Act" },
  { id: "FERPA", name: "FERPA", description: "Family Educational Rights and Privacy Act" },
  { id: "Custom", name: "Custom", description: "Custom compliance requirements" },
];

export default function AuditTrail({
  events,
  rules,
  reports,
  policies,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  onCreateRule,
  onUpdateRule,
  onGenerateReport,
  onExportEvents,
  onCreatePolicy,
  onUpdatePolicy,
  isActive,
  onClose,
}: AuditTrailProps) {
  const [activeTab, setActiveTab] = useState<"events" | "compliance" | "reports" | "policies" | "analytics">("events");
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [selectedRule, setSelectedRule] = useState<ComplianceRule | null>(null);
  const [selectedReport, setSelectedReport] = useState<AuditReport | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [filters, setFilters] = useState({
    eventType: "",
    severity: "",
    status: "",
    user: "",
    dateRange: "7d",
    regulation: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "timeline">("list");
  const [sortBy, setSortBy] = useState<"timestamp" | "severity" | "user" | "resource">("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isExporting, setIsExporting] = useState(false);

  const getSeverityIcon = (severity: string) => {
    const config = SEVERITY_LEVELS.find((s) => s.id === severity);
    return config ? config.icon : InformationCircleIcon;
  };

  const getSeverityColor = (severity: string) => {
    const config = SEVERITY_LEVELS.find((s) => s.id === severity);
    return config ? config.color : "text-gray-600 bg-gray-100";
  };

  const getEventTypeIcon = (eventType: string) => {
    const config = EVENT_TYPES.find((t) => t.id === eventType);
    return config ? config.icon : DocumentIcon;
  };

  const getEventTypeColor = (eventType: string) => {
    const config = EVENT_TYPES.find((t) => t.id === eventType);
    return config ? config.color : "text-gray-600 bg-gray-100";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case "failure":
        return <XCircleIcon className="w-4 h-4 text-red-600" />;
      case "warning":
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />;
      case "pending":
        return <ClockIcon className="w-4 h-4 text-blue-600" />;
      default:
        return <InformationCircleIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesEventType = !filters.eventType || event.eventType === filters.eventType;
    const matchesSeverity = !filters.severity || event.severity === filters.severity;
    const matchesStatus = !filters.status || event.status === filters.status;
    const matchesUser = !filters.user || event.user.name.toLowerCase().includes(filters.user.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.resource.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesEventType && matchesSeverity && matchesStatus && matchesUser && matchesSearch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    let aValue, bValue;
    switch (sortBy) {
      case "timestamp":
        aValue = a.timestamp.getTime();
        bValue = b.timestamp.getTime();
        break;
      case "severity":
        const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
        aValue = severityOrder[a.severity as keyof typeof severityOrder];
        bValue = severityOrder[b.severity as keyof typeof severityOrder];
        break;
      case "user":
        aValue = a.user.name;
        bValue = b.user.name;
        break;
      case "resource":
        aValue = a.resource.name;
        bValue = b.resource.name;
        break;
      default:
        return 0;
    }

    if (typeof aValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue as string) : (bValue as string).localeCompare(aValue);
    }

    return sortOrder === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
  });

  const renderEventsTab = () => (
    <div className="space-y-6">
      {/* Events Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">Audit Events</h3>

          <select
            value={filters.eventType}
            onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Event Types</option>
            {EVENT_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          <select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Severities</option>
            {SEVERITY_LEVELS.map((level) => (
              <option key={level.id} value={level.id}>
                {level.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setIsExporting(true);
              setTimeout(() => setIsExporting(false), 2000);
              onExportEvents("csv", filters);
            }}
            disabled={isExporting}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {isExporting ? (
              <div className="flex items-center space-x-2">
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                <span>Exporting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ArrowDownTrayIcon className="w-4 h-4" />
                <span>Export</span>
              </div>
            )}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="timestamp">Sort by Time</option>
            <option value="severity">Sort by Severity</option>
            <option value="user">Sort by User</option>
            <option value="resource">Sort by Resource</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {sortOrder === "asc" ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
          </button>

          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100",
              )}
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
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
              onClick={() => setViewMode("timeline")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "timeline" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100",
              )}
            >
              <ClockIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {sortedEvents.map((event) => {
          const EventTypeIcon = getEventTypeIcon(event.eventType);
          const SeverityIcon = getSeverityIcon(event.severity);

          return (
            <Card
              key={event.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedEvent(event);
                setShowEventModal(true);
              }}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn("p-2 rounded-lg", getEventTypeColor(event.eventType))}>
                      <EventTypeIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">{event.action}</h4>
                      <p className="text-sm text-gray-600 truncate">{event.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge className={cn("text-xs", getSeverityColor(event.severity))}>
                      <SeverityIcon className="w-3 h-3 mr-1" />
                      {event.severity}
                    </Badge>
                    {getStatusIcon(event.status)}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">User:</span>
                    <span className="font-medium">{event.user.name}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <DocumentIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Resource:</span>
                    <span className="font-medium truncate">{event.resource.name}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{event.timestamp.toLocaleString()}</span>
                  </div>
                </div>

                {/* Context */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="w-3 h-3" />
                      <span>{event.context.ipAddress}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DevicePhoneMobileIcon className="w-3 h-3" />
                      <span>{event.context.device.type}</span>
                    </div>
                    {event.context.location && (
                      <div className="flex items-center space-x-1">
                        <GlobeAltIcon className="w-3 h-3" />
                        <span>
                          {event.context.location.city}, {event.context.location.country}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {event.compliance.regulations.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <ScaleIcon className="w-3 h-3" />
                        <span>{event.compliance.regulations.join(", ")}</span>
                      </div>
                    )}
                    <span>Risk: {event.risk.score}/100</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {sortedEvents.length === 0 && (
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria</p>
        </div>
      )}
    </div>
  );

  const renderComplianceTab = () => {
    const complianceStats = {
      compliant: rules.filter((r) => r.status === "compliant").length,
      nonCompliant: rules.filter((r) => r.status === "non_compliant").length,
      partial: rules.filter((r) => r.status === "partial").length,
      notApplicable: rules.filter((r) => r.status === "not_applicable").length,
    };

    const overallScore = Math.round((complianceStats.compliant / (rules.length - complianceStats.notApplicable)) * 100);

    return (
      <div className="space-y-6">
        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-green-600">{complianceStats.compliant}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Compliant Rules</h3>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircleIcon className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-red-600">{complianceStats.nonCompliant}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Non-Compliant Rules</h3>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-yellow-600">{complianceStats.partial}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Partially Compliant</h3>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PresentationChartBarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-blue-600">{overallScore}%</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Overall Score</h3>
          </Card>
        </div>

        {/* Compliance Rules */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Compliance Rules</h3>

            <div className="flex items-center space-x-2">
              <select
                value={filters.regulation}
                onChange={(e) => setFilters({ ...filters, regulation: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Regulations</option>
                {REGULATIONS.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {reg.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => onCreateRule({})}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Rule
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {rules
              .filter((rule) => !filters.regulation || rule.regulation === filters.regulation)
              .map((rule) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case "compliant":
                      return "bg-green-100 text-green-800";
                    case "non_compliant":
                      return "bg-red-100 text-red-800";
                    case "partial":
                      return "bg-yellow-100 text-yellow-800";
                    case "not_applicable":
                      return "bg-gray-100 text-gray-800";
                    default:
                      return "bg-gray-100 text-gray-800";
                  }
                };

                return (
                  <div
                    key={rule.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{rule.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(rule.status)}>{rule.status.replace("_", " ")}</Badge>
                        <Badge className="bg-blue-100 text-blue-800">{rule.regulation}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Category:</span>
                        <span className="ml-2 font-medium">{rule.category.replace("_", " ")}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Assessment:</span>
                        <span className="ml-2 font-medium">{rule.lastAssessment.toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Responsible:</span>
                        <span className="ml-2 font-medium">{rule.responsible}</span>
                      </div>
                    </div>

                    {rule.requirements.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
                        <div className="space-y-1">
                          {rule.requirements.slice(0, 3).map((req) => (
                            <div key={req.id} className="flex items-center space-x-2 text-sm">
                              {req.mandatory ? (
                                <ExclamationCircleIcon className="w-4 h-4 text-red-500" />
                              ) : (
                                <InformationCircleIcon className="w-4 h-4 text-blue-500" />
                              )}
                              <span className="text-gray-600">{req.description}</span>
                            </div>
                          ))}
                          {rule.requirements.length > 3 && (
                            <p className="text-xs text-gray-500">+{rule.requirements.length - 3} more requirements</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </Card>
      </div>
    );
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Audit Trail & Compliance</h2>
            <Badge className="bg-blue-100 text-blue-800">{events.length} events</Badge>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onGenerateReport({})}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Report
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
              { id: "events", name: "Audit Events", icon: ClipboardDocumentListIcon },
              { id: "compliance", name: "Compliance", icon: ShieldCheckIcon },
              { id: "reports", name: "Reports", icon: DocumentTextIcon },
              { id: "policies", name: "Retention Policies", icon: ArchiveBoxIcon },
              { id: "analytics", name: "Analytics", icon: ChartBarIcon },
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
          {activeTab === "events" && renderEventsTab()}
          {activeTab === "compliance" && renderComplianceTab()}
          {activeTab === "reports" && (
            <div className="text-center py-12">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Audit Reports</h3>
              <p className="text-gray-600">Generate and manage audit reports</p>
            </div>
          )}
          {activeTab === "policies" && (
            <div className="text-center py-12">
              <ArchiveBoxIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Retention Policies</h3>
              <p className="text-gray-600">Manage data retention and archival policies</p>
            </div>
          )}
          {activeTab === "analytics" && (
            <div className="text-center py-12">
              <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Audit Analytics</h3>
              <p className="text-gray-600">Analyze audit data and compliance trends</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
