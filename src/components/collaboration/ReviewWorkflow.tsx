"use client";

import React, { useState, useEffect } from "react";
import { Card, Badge } from "@/components/ui";
import {
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
  BellIcon,
  ArrowPathIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  FlagIcon,
  StarIcon,
  TagIcon,
  AdjustmentsHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface ReviewStep {
  id: string;
  name: string;
  description: string;
  assignees: string[];
  requiredApprovals: number;
  deadline?: Date;
  status: "pending" | "in_progress" | "completed" | "skipped" | "blocked";
  dependencies: string[]; // IDs of steps that must be completed first
  allowParallel: boolean;
  autoAdvance: boolean;
  notifications: {
    onStart: boolean;
    onComplete: boolean;
    beforeDeadline: number; // hours before deadline
  };
}

interface ReviewWorkflow {
  id: string;
  name: string;
  description: string;
  documentId: string;
  createdBy: string;
  createdAt: Date;
  status: "draft" | "active" | "paused" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  tags: string[];
  steps: ReviewStep[];
  currentStep: number;
  settings: {
    allowSkipSteps: boolean;
    requireComments: boolean;
    trackTime: boolean;
    autoArchive: boolean;
    escalationRules: {
      enabled: boolean;
      escalateAfterHours: number;
      escalateTo: string[];
    };
  };
  metrics: {
    startedAt?: Date;
    completedAt?: Date;
    totalTimeSpent: number;
    averageStepTime: number;
    commentsCount: number;
    revisionsCount: number;
  };
}

interface ReviewWorkflowProps {
  documentId: string;
  workflows: ReviewWorkflow[];
  onCreateWorkflow: (workflow: Omit<ReviewWorkflow, "id" | "createdAt" | "metrics">) => void;
  onUpdateWorkflow: (id: string, updates: Partial<ReviewWorkflow>) => void;
  onDeleteWorkflow: (id: string) => void;
  onStartWorkflow: (id: string) => void;
  onPauseWorkflow: (id: string) => void;
  onCompleteStep: (workflowId: string, stepId: string, comments?: string) => void;
  onSkipStep: (workflowId: string, stepId: string, reason: string) => void;
  currentUser: { id: string; name: string; email: string };
  isActive: boolean;
  onClose: () => void;
}

const WORKFLOW_TEMPLATES = [
  {
    name: "Standard Document Review",
    description: "Basic review workflow for general documents",
    steps: [
      {
        name: "Initial Review",
        description: "First pass review for content and structure",
        requiredApprovals: 1,
        allowParallel: false,
        autoAdvance: false,
      },
      {
        name: "Technical Review",
        description: "Technical accuracy and compliance check",
        requiredApprovals: 1,
        allowParallel: true,
        autoAdvance: false,
      },
      {
        name: "Final Approval",
        description: "Final sign-off and approval",
        requiredApprovals: 1,
        allowParallel: false,
        autoAdvance: true,
      },
    ],
  },
  {
    name: "Legal Document Review",
    description: "Comprehensive review for legal documents",
    steps: [
      {
        name: "Legal Compliance",
        description: "Review for legal compliance and accuracy",
        requiredApprovals: 2,
        allowParallel: false,
        autoAdvance: false,
      },
      {
        name: "Risk Assessment",
        description: "Evaluate potential risks and liabilities",
        requiredApprovals: 1,
        allowParallel: true,
        autoAdvance: false,
      },
      {
        name: "Senior Partner Review",
        description: "Final review by senior partner",
        requiredApprovals: 1,
        allowParallel: false,
        autoAdvance: false,
      },
    ],
  },
  {
    name: "Financial Document Review",
    description: "Review workflow for financial documents",
    steps: [
      {
        name: "Accuracy Check",
        description: "Verify calculations and data accuracy",
        requiredApprovals: 1,
        allowParallel: false,
        autoAdvance: false,
      },
      {
        name: "Compliance Review",
        description: "Check regulatory compliance",
        requiredApprovals: 1,
        allowParallel: true,
        autoAdvance: false,
      },
      {
        name: "CFO Approval",
        description: "Final approval from CFO",
        requiredApprovals: 1,
        allowParallel: false,
        autoAdvance: true,
      },
    ],
  },
];

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-800",
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

const STEP_STATUS_COLORS = {
  pending: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  skipped: "bg-yellow-100 text-yellow-800",
  blocked: "bg-red-100 text-red-800",
};

export default function ReviewWorkflow({
  documentId,
  workflows,
  onCreateWorkflow,
  onUpdateWorkflow,
  onDeleteWorkflow,
  onStartWorkflow,
  onPauseWorkflow,
  onCompleteStep,
  onSkipStep,
  currentUser,
  isActive,
  onClose,
}: ReviewWorkflowProps) {
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "create">("active");
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [showTemplates, setShowTemplates] = useState(false);

  // Create workflow form
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
    priority: "medium" as const,
    tags: [] as string[],
    steps: [] as any[],
    allowSkipSteps: false,
    requireComments: true,
    trackTime: true,
    autoArchive: false,
    escalationEnabled: false,
    escalateAfterHours: 24,
    escalateTo: [] as string[],
  });

  const [newTag, setNewTag] = useState("");
  const [stepComments, setStepComments] = useState<Record<string, string>>({});

  const activeWorkflows = workflows.filter((w) => w.status === "active" || w.status === "paused");
  const completedWorkflows = workflows.filter((w) => w.status === "completed" || w.status === "cancelled");

  const handleCreateFromTemplate = (template: any) => {
    setNewWorkflow({
      ...newWorkflow,
      name: template.name,
      description: template.description,
      steps: template.steps.map((step: any, index: number) => ({
        id: `step-${index}`,
        name: step.name,
        description: step.description,
        assignees: [],
        requiredApprovals: step.requiredApprovals,
        status: "pending" as const,
        dependencies: index > 0 ? [`step-${index - 1}`] : [],
        allowParallel: step.allowParallel,
        autoAdvance: step.autoAdvance,
        notifications: {
          onStart: true,
          onComplete: true,
          beforeDeadline: 24,
        },
      })),
    });
    setShowTemplates(false);
    setActiveTab("create");
  };

  const handleCreateWorkflow = () => {
    if (!newWorkflow.name.trim() || newWorkflow.steps.length === 0) return;

    const workflow: Omit<ReviewWorkflow, "id" | "createdAt" | "metrics"> = {
      name: newWorkflow.name,
      description: newWorkflow.description,
      documentId,
      createdBy: currentUser.id,
      status: "draft",
      priority: newWorkflow.priority,
      tags: newWorkflow.tags,
      steps: newWorkflow.steps,
      currentStep: 0,
      settings: {
        allowSkipSteps: newWorkflow.allowSkipSteps,
        requireComments: newWorkflow.requireComments,
        trackTime: newWorkflow.trackTime,
        autoArchive: newWorkflow.autoArchive,
        escalationRules: {
          enabled: newWorkflow.escalationEnabled,
          escalateAfterHours: newWorkflow.escalateAfterHours,
          escalateTo: newWorkflow.escalateTo,
        },
      },
    };

    onCreateWorkflow(workflow);

    // Reset form
    setNewWorkflow({
      name: "",
      description: "",
      priority: "medium",
      tags: [],
      steps: [],
      allowSkipSteps: false,
      requireComments: true,
      trackTime: true,
      autoArchive: false,
      escalationEnabled: false,
      escalateAfterHours: 24,
      escalateTo: [],
    });

    setActiveTab("active");
  };

  const handleAddStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      name: "New Step",
      description: "",
      assignees: [],
      requiredApprovals: 1,
      status: "pending" as const,
      dependencies: [],
      allowParallel: false,
      autoAdvance: false,
      notifications: {
        onStart: true,
        onComplete: true,
        beforeDeadline: 24,
      },
    };

    setNewWorkflow({
      ...newWorkflow,
      steps: [...newWorkflow.steps, newStep],
    });
  };

  const handleCompleteStep = (workflowId: string, stepId: string) => {
    const comments = stepComments[stepId] || "";
    onCompleteStep(workflowId, stepId, comments);
    setStepComments((prev) => ({ ...prev, [stepId]: "" }));
  };

  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const getStepProgress = (workflow: ReviewWorkflow) => {
    const completedSteps = workflow.steps.filter((step) => step.status === "completed").length;
    return (completedSteps / workflow.steps.length) * 100;
  };

  const formatDuration = (hours: number) => {
    if (hours < 24) {
      return `${Math.round(hours)}h`;
    }
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Review Workflows</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <XCircleIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "active", name: "Active Workflows", count: activeWorkflows.length },
              { id: "completed", name: "Completed", count: completedWorkflows.length },
              { id: "create", name: "Create New", count: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                )}
              >
                {tab.name}
                {tab.count !== null && (
                  <span
                    className={cn(
                      "ml-2 py-0.5 px-2 rounded-full text-xs",
                      activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {activeTab === "active" && (
            <div className="space-y-4">
              {activeWorkflows.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardDocumentListIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Workflows</h3>
                  <p className="text-gray-500 mb-4">Create a new workflow to start the review process.</p>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Workflow
                  </button>
                </div>
              ) : (
                activeWorkflows.map((workflow) => (
                  <Card key={workflow.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                          <Badge className={PRIORITY_COLORS[workflow.priority]}>{workflow.priority}</Badge>
                          <Badge className={STATUS_COLORS[workflow.status]}>{workflow.status}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{workflow.description}</p>

                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(getStepProgress(workflow))}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getStepProgress(workflow)}%` }}
                            />
                          </div>
                        </div>

                        {/* Tags */}
                        {workflow.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {workflow.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                              >
                                <TagIcon className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {workflow.status === "active" && (
                          <button
                            onClick={() => onPauseWorkflow(workflow.id)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Pause Workflow"
                          >
                            <PauseIcon className="w-5 h-5" />
                          </button>
                        )}
                        {workflow.status === "draft" && (
                          <button
                            onClick={() => onStartWorkflow(workflow.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Start Workflow"
                          >
                            <PlayIcon className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedWorkflow(selectedWorkflow === workflow.id ? null : workflow.id)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          {selectedWorkflow === workflow.id ? (
                            <ChevronDownIcon className="w-5 h-5" />
                          ) : (
                            <ChevronRightIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Workflow Steps */}
                    {selectedWorkflow === workflow.id && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">Review Steps</h4>
                        <div className="space-y-3">
                          {workflow.steps.map((step, index) => (
                            <div
                              key={step.id}
                              className={cn(
                                "border rounded-lg p-4 transition-all",
                                step.status === "completed"
                                  ? "bg-green-50 border-green-200"
                                  : step.status === "in_progress"
                                    ? "bg-blue-50 border-blue-200"
                                    : step.status === "blocked"
                                      ? "bg-red-50 border-red-200"
                                      : "bg-gray-50 border-gray-200",
                              )}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <span className="font-medium text-gray-900">
                                      {index + 1}. {step.name}
                                    </span>
                                    <Badge className={STEP_STATUS_COLORS[step.status]}>
                                      {step.status.replace("_", " ")}
                                    </Badge>
                                    {step.deadline && (
                                      <span className="text-sm text-gray-500 flex items-center">
                                        <CalendarIcon className="w-4 h-4 mr-1" />
                                        {step.deadline.toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-sm mb-2">{step.description}</p>

                                  {step.assignees.length > 0 && (
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                      <UserGroupIcon className="w-4 h-4" />
                                      <span>Assigned to: {step.assignees.join(", ")}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2">
                                  {step.status === "in_progress" && (
                                    <>
                                      {workflow.settings.requireComments && (
                                        <input
                                          type="text"
                                          placeholder="Add comments..."
                                          value={stepComments[step.id] || ""}
                                          onChange={(e) =>
                                            setStepComments((prev) => ({
                                              ...prev,
                                              [step.id]: e.target.value,
                                            }))
                                          }
                                          className="px-3 py-1 border border-gray-300 rounded text-sm"
                                        />
                                      )}
                                      <button
                                        onClick={() => handleCompleteStep(workflow.id, step.id)}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                                      >
                                        Complete
                                      </button>
                                      {workflow.settings.allowSkipSteps && (
                                        <button
                                          onClick={() => {
                                            const reason = prompt("Reason for skipping:");
                                            if (reason) {
                                              onSkipStep(workflow.id, step.id, reason);
                                            }
                                          }}
                                          className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
                                        >
                                          Skip
                                        </button>
                                      )}
                                    </>
                                  )}

                                  <button
                                    onClick={() => toggleStepExpansion(step.id)}
                                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                  >
                                    {expandedSteps.has(step.id) ? (
                                      <ChevronDownIcon className="w-4 h-4" />
                                    ) : (
                                      <ChevronRightIcon className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Expanded Step Details */}
                              {expandedSteps.has(step.id) && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-medium text-gray-700">Required Approvals:</span>
                                      <span className="ml-2 text-gray-600">{step.requiredApprovals}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Allow Parallel:</span>
                                      <span className="ml-2 text-gray-600">{step.allowParallel ? "Yes" : "No"}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Auto Advance:</span>
                                      <span className="ml-2 text-gray-600">{step.autoAdvance ? "Yes" : "No"}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Dependencies:</span>
                                      <span className="ml-2 text-gray-600">
                                        {step.dependencies.length > 0 ? step.dependencies.length : "None"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === "completed" && (
            <div className="space-y-4">
              {completedWorkflows.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Workflows</h3>
                  <p className="text-gray-500">Completed workflows will appear here.</p>
                </div>
              ) : (
                completedWorkflows.map((workflow) => (
                  <Card key={workflow.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                          <Badge className={STATUS_COLORS[workflow.status]}>{workflow.status}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{workflow.description}</p>

                        {/* Metrics */}
                        {workflow.metrics && (
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Duration:</span>
                              <span className="ml-2 text-gray-600">
                                {workflow.metrics.completedAt && workflow.metrics.startedAt
                                  ? formatDuration(
                                      (workflow.metrics.completedAt.getTime() - workflow.metrics.startedAt.getTime()) /
                                        (1000 * 60 * 60),
                                    )
                                  : "N/A"}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Comments:</span>
                              <span className="ml-2 text-gray-600">{workflow.metrics.commentsCount}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Revisions:</span>
                              <span className="ml-2 text-gray-600">{workflow.metrics.revisionsCount}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Avg Step Time:</span>
                              <span className="ml-2 text-gray-600">
                                {formatDuration(workflow.metrics.averageStepTime)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {activeTab === "create" && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Workflow</h3>

                {/* Template Selection */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <DocumentDuplicateIcon className="w-5 h-5" />
                    <span>Use Template</span>
                    {showTemplates ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
                  </button>

                  {showTemplates && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {WORKFLOW_TEMPLATES.map((template, index) => (
                        <Card
                          key={index}
                          className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleCreateFromTemplate(template)}
                        >
                          <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                          <div className="text-xs text-gray-500">{template.steps.length} steps</div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Workflow Name *</label>
                    <input
                      type="text"
                      value={newWorkflow.name}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter workflow name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={newWorkflow.priority}
                      onChange={(e) => setNewWorkflow({ ...newWorkflow, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newWorkflow.description}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the workflow purpose and goals"
                  />
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newWorkflow.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          onClick={() =>
                            setNewWorkflow({
                              ...newWorkflow,
                              tags: newWorkflow.tags.filter((_, i) => i !== index),
                            })
                          }
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newTag.trim()) {
                          setNewWorkflow({
                            ...newWorkflow,
                            tags: [...newWorkflow.tags, newTag.trim()],
                          });
                          setNewTag("");
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add tag and press Enter"
                    />
                  </div>
                </div>

                {/* Workflow Settings */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Workflow Settings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newWorkflow.allowSkipSteps}
                        onChange={(e) => setNewWorkflow({ ...newWorkflow, allowSkipSteps: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Allow skipping steps</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newWorkflow.requireComments}
                        onChange={(e) => setNewWorkflow({ ...newWorkflow, requireComments: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Require comments</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newWorkflow.trackTime}
                        onChange={(e) => setNewWorkflow({ ...newWorkflow, trackTime: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Track time spent</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newWorkflow.autoArchive}
                        onChange={(e) => setNewWorkflow({ ...newWorkflow, autoArchive: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Auto-archive when complete</span>
                    </label>
                  </div>
                </div>

                {/* Steps */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Review Steps</h4>
                    <button
                      onClick={handleAddStep}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Add Step
                    </button>
                  </div>

                  {newWorkflow.steps.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <ClipboardDocumentListIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No steps added yet. Add your first step to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {newWorkflow.steps.map((step, index) => (
                        <Card key={step.id} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Step Name</label>
                              <input
                                type="text"
                                value={step.name}
                                onChange={(e) => {
                                  const updatedSteps = [...newWorkflow.steps];
                                  updatedSteps[index] = { ...step, name: e.target.value };
                                  setNewWorkflow({ ...newWorkflow, steps: updatedSteps });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Required Approvals</label>
                              <input
                                type="number"
                                min="1"
                                value={step.requiredApprovals}
                                onChange={(e) => {
                                  const updatedSteps = [...newWorkflow.steps];
                                  updatedSteps[index] = { ...step, requiredApprovals: parseInt(e.target.value) || 1 };
                                  setNewWorkflow({ ...newWorkflow, steps: updatedSteps });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <textarea
                                value={step.description}
                                onChange={(e) => {
                                  const updatedSteps = [...newWorkflow.steps];
                                  updatedSteps[index] = { ...step, description: e.target.value };
                                  setNewWorkflow({ ...newWorkflow, steps: updatedSteps });
                                }}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Describe what needs to be done in this step"
                              />
                            </div>

                            <div className="md:col-span-2 flex items-center justify-between">
                              <div className="flex space-x-4">
                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={step.allowParallel}
                                    onChange={(e) => {
                                      const updatedSteps = [...newWorkflow.steps];
                                      updatedSteps[index] = { ...step, allowParallel: e.target.checked };
                                      setNewWorkflow({ ...newWorkflow, steps: updatedSteps });
                                    }}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">Allow parallel execution</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={step.autoAdvance}
                                    onChange={(e) => {
                                      const updatedSteps = [...newWorkflow.steps];
                                      updatedSteps[index] = { ...step, autoAdvance: e.target.checked };
                                      setNewWorkflow({ ...newWorkflow, steps: updatedSteps });
                                    }}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">Auto-advance when complete</span>
                                </label>
                              </div>

                              <button
                                onClick={() => {
                                  const updatedSteps = newWorkflow.steps.filter((_, i) => i !== index);
                                  setNewWorkflow({ ...newWorkflow, steps: updatedSteps });
                                }}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setNewWorkflow({
                        name: "",
                        description: "",
                        priority: "medium",
                        tags: [],
                        steps: [],
                        allowSkipSteps: false,
                        requireComments: true,
                        trackTime: true,
                        autoArchive: false,
                        escalationEnabled: false,
                        escalateAfterHours: 24,
                        escalateTo: [],
                      });
                      setActiveTab("active");
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateWorkflow}
                    disabled={!newWorkflow.name.trim() || newWorkflow.steps.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Create Workflow
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
