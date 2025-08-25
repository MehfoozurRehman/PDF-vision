"use client";

import React, { useState, useEffect } from "react";
import { Card, Badge } from "@/components/ui";
import {
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon,
  ShareIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  FireIcon,
  LightBulbIcon,
  CpuChipIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  overview: {
    totalDocuments: number;
    totalUsers: number;
    totalViews: number;
    totalDownloads: number;
    totalComments: number;
    totalAnnotations: number;
    averageSessionTime: number;
    activeUsers: number;
  };

  usage: {
    dailyViews: { date: string; views: number; users: number }[];
    weeklyActivity: { week: string; documents: number; collaborations: number }[];
    monthlyGrowth: { month: string; newUsers: number; newDocuments: number }[];
    hourlyDistribution: { hour: number; activity: number }[];
  };

  documents: {
    mostViewed: { id: string; title: string; views: number; lastViewed: Date }[];
    mostDownloaded: { id: string; title: string; downloads: number; size: number }[];
    mostCollaborated: { id: string; title: string; collaborators: number; comments: number }[];
    recentlyCreated: { id: string; title: string; createdAt: Date; author: string }[];
    largestDocuments: { id: string; title: string; size: number; pages: number }[];
  };

  users: {
    mostActive: { id: string; name: string; actionsCount: number; lastActive: Date }[];
    topContributors: { id: string; name: string; documentsCreated: number; commentsCount: number }[];
    recentlyJoined: { id: string; name: string; joinedAt: Date; documentsCount: number }[];
    collaborationNetwork: { user1: string; user2: string; sharedDocuments: number }[];
  };

  performance: {
    averageLoadTime: number;
    errorRate: number;
    uptime: number;
    apiResponseTime: number;
    storageUsed: number;
    storageLimit: number;
    bandwidthUsed: number;
    cacheHitRate: number;
  };

  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };

  browsers: {
    chrome: number;
    firefox: number;
    safari: number;
    edge: number;
    other: number;
  };

  geography: {
    country: string;
    users: number;
    sessions: number;
  }[];

  features: {
    annotations: { type: string; count: number; trend: number }[];
    tools: { name: string; usage: number; trend: number }[];
    exports: { format: string; count: number; percentage: number }[];
    sharing: { method: string; count: number; trend: number }[];
  };
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  dateRange: { start: Date; end: Date };
  onDateRangeChange: (range: { start: Date; end: Date }) => void;
  onRefresh: () => void;
  isLoading: boolean;
  isActive: boolean;
  onClose: () => void;
}

const CHART_COLORS = {
  primary: "#3B82F6",
  secondary: "#10B981",
  accent: "#F59E0B",
  danger: "#EF4444",
  info: "#6366F1",
  success: "#059669",
  warning: "#D97706",
};

const TREND_INDICATORS = {
  up: { icon: ArrowTrendingUpIcon, color: "text-green-600", bg: "bg-green-100" },
  down: { icon: ArrowTrendingDownIcon, color: "text-red-600", bg: "bg-red-100" },
  neutral: { icon: ArrowPathIcon, color: "text-gray-600", bg: "bg-gray-100" },
};

export default function AnalyticsDashboard({
  data,
  dateRange,
  onDateRangeChange,
  onRefresh,
  isLoading,
  isActive,
  onClose,
}: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "usage" | "documents" | "users" | "performance" | "insights">(
    "overview",
  );
  const [selectedMetric, setSelectedMetric] = useState<string>("views");
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d" | "90d">("7d");
  const [showFilters, setShowFilters] = useState(false);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatPercentage = (value: number, total: number): string => {
    return ((value / total) * 100).toFixed(1) + "%";
  };

  const getTrendIndicator = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    if (change > 5) return "up";
    if (change < -5) return "down";
    return "neutral";
  };

  const renderMetricCard = (title: string, value: number | string, icon: any, trend?: number, subtitle?: string) => {
    const IconComponent = icon;
    const trendType = trend ? (trend > 0 ? "up" : trend < 0 ? "down" : "neutral") : null;
    const TrendIcon = trendType ? TREND_INDICATORS[trendType].icon : null;

    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <IconComponent className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
          </div>
          {trend !== undefined && TrendIcon && (
            <div
              className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
                TREND_INDICATORS[trendType!].bg,
                TREND_INDICATORS[trendType!].color,
              )}
            >
              <TrendIcon className="w-3 h-3" />
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderChart = (title: string, data: any[], type: "line" | "bar" | "pie" = "line") => {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart visualization would be rendered here</p>
            <p className="text-sm text-gray-400">Using libraries like Chart.js or D3.js</p>
          </div>
        </div>
      </Card>
    );
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
            <Badge className="bg-blue-100 text-blue-800">{timeframe} view</Badge>
          </div>

          <div className="flex items-center space-x-3">
            {/* Date Range Picker */}
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>

            {/* Filters */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                showFilters ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100",
              )}
              title="Filters"
            >
              <FunnelIcon className="w-4 h-4" />
            </button>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <ArrowPathIcon className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </button>

            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <XCircleIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Metric:</label>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="views">Views</option>
                  <option value="downloads">Downloads</option>
                  <option value="comments">Comments</option>
                  <option value="annotations">Annotations</option>
                  <option value="users">Active Users</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Group by:</label>
                <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="hour">Hour</option>
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", name: "Overview", icon: ChartBarIcon },
              { id: "usage", name: "Usage", icon: ClockIcon },
              { id: "documents", name: "Documents", icon: DocumentIcon },
              { id: "users", name: "Users", icon: UserGroupIcon },
              { id: "performance", name: "Performance", icon: CpuChipIcon },
              { id: "insights", name: "Insights", icon: LightBulbIcon },
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
        <div className="p-6 max-h-[calc(90vh-250px)] overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderMetricCard("Total Documents", formatNumber(data.overview.totalDocuments), DocumentIcon, 12.5)}
                {renderMetricCard("Active Users", formatNumber(data.overview.activeUsers), UserGroupIcon, 8.3)}
                {renderMetricCard("Total Views", formatNumber(data.overview.totalViews), EyeIcon, 15.7)}
                {renderMetricCard(
                  "Avg Session Time",
                  formatDuration(data.overview.averageSessionTime),
                  ClockIcon,
                  -2.1,
                )}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderChart("Daily Activity", data.usage.dailyViews)}
                {renderChart("User Growth", data.usage.monthlyGrowth)}
              </div>

              {/* Device & Browser Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Usage</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <ComputerDesktopIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900">Desktop</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: formatPercentage(
                                data.devices.desktop,
                                data.devices.desktop + data.devices.mobile + data.devices.tablet,
                              ),
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {formatPercentage(
                            data.devices.desktop,
                            data.devices.desktop + data.devices.mobile + data.devices.tablet,
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <DevicePhoneMobileIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900">Mobile</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{
                              width: formatPercentage(
                                data.devices.mobile,
                                data.devices.desktop + data.devices.mobile + data.devices.tablet,
                              ),
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {formatPercentage(
                            data.devices.mobile,
                            data.devices.desktop + data.devices.mobile + data.devices.tablet,
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <DeviceTabletIcon className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-900">Tablet</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-600 h-2 rounded-full"
                            style={{
                              width: formatPercentage(
                                data.devices.tablet,
                                data.devices.desktop + data.devices.mobile + data.devices.tablet,
                              ),
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {formatPercentage(
                            data.devices.tablet,
                            data.devices.desktop + data.devices.mobile + data.devices.tablet,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Features</h3>
                  <div className="space-y-3">
                    {data.features.tools.slice(0, 5).map((tool, index) => {
                      const trendType = tool.trend > 0 ? "up" : tool.trend < 0 ? "down" : "neutral";
                      const TrendIcon = TREND_INDICATORS[trendType].icon;

                      return (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-900">{tool.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{formatNumber(tool.usage)}</span>
                            <div
                              className={cn(
                                "flex items-center space-x-1 px-2 py-1 rounded-full text-xs",
                                TREND_INDICATORS[trendType].bg,
                                TREND_INDICATORS[trendType].color,
                              )}
                            >
                              <TrendIcon className="w-3 h-3" />
                              <span>{Math.abs(tool.trend).toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "usage" && (
            <div className="space-y-6">
              {/* Usage Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderMetricCard("Total Views", formatNumber(data.overview.totalViews), EyeIcon, 15.7)}
                {renderMetricCard("Downloads", formatNumber(data.overview.totalDownloads), ArrowDownTrayIcon, 22.3)}
                {renderMetricCard("Comments", formatNumber(data.overview.totalComments), ChatBubbleLeftRightIcon, 8.9)}
                {renderMetricCard("Annotations", formatNumber(data.overview.totalAnnotations), PencilIcon, 18.4)}
              </div>

              {/* Usage Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderChart("Hourly Distribution", data.usage.hourlyDistribution, "bar")}
                {renderChart("Weekly Activity", data.usage.weeklyActivity)}
              </div>

              {/* Feature Usage */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Usage Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Annotation Types</h4>
                    <div className="space-y-2">
                      {data.features.annotations.map((annotation, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-700 capitalize">{annotation.type}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{formatNumber(annotation.count)}</span>
                            <div className={cn("w-16 bg-gray-200 rounded-full h-1.5")}>
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{
                                  width: `${(annotation.count / Math.max(...data.features.annotations.map((a) => a.count))) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Export Formats</h4>
                    <div className="space-y-2">
                      {data.features.exports.map((format, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-700 uppercase">{format.format}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{format.percentage}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-green-600 h-1.5 rounded-full"
                                style={{ width: `${format.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              {/* Document Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderMetricCard("Total Documents", formatNumber(data.overview.totalDocuments), DocumentIcon)}
                {renderMetricCard(
                  "Avg File Size",
                  formatBytes(
                    data.documents.largestDocuments.reduce((acc, doc) => acc + doc.size, 0) /
                      data.documents.largestDocuments.length,
                  ),
                  DocumentIcon,
                )}
                {renderMetricCard("Total Storage", formatBytes(data.performance.storageUsed), DocumentIcon)}
                {renderMetricCard(
                  "Storage Usage",
                  formatPercentage(data.performance.storageUsed, data.performance.storageLimit),
                  DocumentIcon,
                )}
              </div>

              {/* Document Lists */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Viewed Documents</h3>
                  <div className="space-y-3">
                    {data.documents.mostViewed.slice(0, 5).map((doc, index) => (
                      <div key={doc.id} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                          <p className="text-xs text-gray-500">Last viewed: {doc.lastViewed.toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <EyeIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatNumber(doc.views)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Downloaded</h3>
                  <div className="space-y-3">
                    {data.documents.mostDownloaded.slice(0, 5).map((doc, index) => (
                      <div key={doc.id} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                          <p className="text-xs text-gray-500">Size: {formatBytes(doc.size)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ArrowDownTrayIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatNumber(doc.downloads)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Collaborative</h3>
                  <div className="space-y-3">
                    {data.documents.mostCollaborated.slice(0, 5).map((doc, index) => (
                      <div key={doc.id} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                          <p className="text-xs text-gray-500">{doc.collaborators} collaborators</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatNumber(doc.comments)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Created</h3>
                  <div className="space-y-3">
                    {data.documents.recentlyCreated.slice(0, 5).map((doc, index) => (
                      <div key={doc.id} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                          <p className="text-xs text-gray-500">
                            by {doc.author} • {doc.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        <StarIcon className="w-4 h-4 text-yellow-400" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              {/* User Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderMetricCard("Total Users", formatNumber(data.overview.totalUsers), UserGroupIcon)}
                {renderMetricCard("Active Users", formatNumber(data.overview.activeUsers), UserGroupIcon, 8.3)}
                {renderMetricCard("Avg Session Time", formatDuration(data.overview.averageSessionTime), ClockIcon)}
                {renderMetricCard("New Users", formatNumber(data.users.recentlyJoined.length), UserGroupIcon, 12.7)}
              </div>

              {/* User Lists */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Active Users</h3>
                  <div className="space-y-3">
                    {data.users.mostActive.slice(0, 5).map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">Last active: {user.lastActive.toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">{formatNumber(user.actionsCount)} actions</div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
                  <div className="space-y-3">
                    {data.users.topContributors.slice(0, 5).map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-green-600">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">
                              {user.documentsCreated} docs • {user.commentsCount} comments
                            </p>
                          </div>
                        </div>
                        <StarIcon className="w-4 h-4 text-yellow-400" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Geography */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.geography.slice(0, 6).map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <GlobeAltIcon className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{location.country}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatNumber(location.users)}</p>
                        <p className="text-xs text-gray-500">{formatNumber(location.sessions)} sessions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "performance" && (
            <div className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderMetricCard("Avg Load Time", `${data.performance.averageLoadTime.toFixed(2)}s`, ClockIcon, -5.2)}
                {renderMetricCard(
                  "Error Rate",
                  `${data.performance.errorRate.toFixed(2)}%`,
                  ExclamationTriangleIcon,
                  -12.3,
                )}
                {renderMetricCard("Uptime", `${data.performance.uptime.toFixed(1)}%`, CheckCircleIcon, 0.1)}
                {renderMetricCard("Cache Hit Rate", `${data.performance.cacheHitRate.toFixed(1)}%`, CpuChipIcon, 3.7)}
              </div>

              {/* Storage and Bandwidth */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Used Storage</span>
                        <span className="text-sm text-gray-600">
                          {formatBytes(data.performance.storageUsed)} / {formatBytes(data.performance.storageLimit)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={cn(
                            "h-3 rounded-full transition-all duration-300",
                            data.performance.storageUsed / data.performance.storageLimit > 0.8
                              ? "bg-red-600"
                              : data.performance.storageUsed / data.performance.storageLimit > 0.6
                                ? "bg-yellow-600"
                                : "bg-green-600",
                          )}
                          style={{ width: `${(data.performance.storageUsed / data.performance.storageLimit) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Bandwidth Usage</h4>
                      <p className="text-2xl font-bold text-gray-900">{formatBytes(data.performance.bandwidthUsed)}</p>
                      <p className="text-sm text-gray-500">This month</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">API Response Time</span>
                      <span className="text-sm text-gray-600">{data.performance.apiResponseTime}ms</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Error Rate</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{data.performance.errorRate.toFixed(2)}%</span>
                        {data.performance.errorRate < 1 ? (
                          <CheckCircleIcon className="w-4 h-4 text-green-500" />
                        ) : data.performance.errorRate < 5 ? (
                          <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <XCircleIcon className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Uptime</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{data.performance.uptime.toFixed(1)}%</span>
                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Cache Hit Rate</span>
                      <span className="text-sm text-gray-600">{data.performance.cacheHitRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "insights" && (
            <div className="space-y-6">
              {/* AI-Generated Insights */}
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <LightBulbIcon className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Key Insights</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <ArrowTrendingUpIcon className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-900">Growing Engagement</h4>
                          <p className="text-sm text-green-700 mt-1">
                            User engagement has increased by 23% this month, with annotation usage leading the growth.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <FireIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Peak Usage Hours</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Most activity occurs between 9-11 AM and 2-4 PM. Consider scheduling maintenance outside
                            these windows.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-900">Storage Alert</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Storage usage is at 78%. Consider implementing automatic archiving for old documents.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <StarIcon className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-purple-900">Feature Opportunity</h4>
                          <p className="text-sm text-purple-700 mt-1">
                            Mobile usage has grown 45%. Consider optimizing the mobile annotation experience.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recommendations */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Optimize Load Times</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Average load time is 2.3s. Implementing image compression and CDN could reduce this by 40%.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Enhance Collaboration</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Documents with 3+ collaborators have 60% higher engagement. Promote team features more
                        prominently.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">User Onboarding</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        New users who complete the tutorial are 3x more likely to become active. Consider making it
                        mandatory.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
