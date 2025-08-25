"use client";

import React, { useState } from "react";
import { Modal, Card, Badge, Switch, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import {
  LinkIcon,
  EnvelopeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  PencilIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  documentId: string;
}

interface ShareSettings {
  allowDownload: boolean;
  allowPrint: boolean;
  allowCopy: boolean;
  requirePassword: boolean;
  password: string;
  expirationDate: string;
  accessLevel: "view" | "comment" | "edit";
  trackViews: boolean;
  watermark: boolean;
}

interface Collaborator {
  id: string;
  email: string;
  name: string;
  accessLevel: "view" | "comment" | "edit";
  status: "pending" | "accepted" | "declined";
  addedAt: Date;
}

export default function ShareModal({ isOpen, onClose, documentName, documentId }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState("link");
  const [shareSettings, setShareSettings] = useState<ShareSettings>({
    allowDownload: true,
    allowPrint: true,
    allowCopy: false,
    requirePassword: false,
    password: "",
    expirationDate: "",
    accessLevel: "view",
    trackViews: true,
    watermark: false,
  });
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [newCollaboratorEmail, setNewCollaboratorEmail] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      doc: documentId,
      access: shareSettings.accessLevel,
      ...(shareSettings.requirePassword && { protected: "true" }),
      ...(shareSettings.expirationDate && { expires: shareSettings.expirationDate }),
    });
    return `${baseUrl}/shared?${params.toString()}`;
  };

  const handleCopyLink = async () => {
    const link = generateShareLink();
    setShareLink(link);

    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleAddCollaborator = () => {
    if (!newCollaboratorEmail.trim()) return;

    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      email: newCollaboratorEmail,
      name: newCollaboratorEmail.split("@")[0],
      accessLevel: shareSettings.accessLevel,
      status: "pending",
      addedAt: new Date(),
    };

    setCollaborators([...collaborators, newCollaborator]);
    setNewCollaboratorEmail("");
  };

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators(collaborators.filter((c) => c.id !== id));
  };

  const handleUpdateCollaboratorAccess = (id: string, accessLevel: "view" | "comment" | "edit") => {
    setCollaborators(collaborators.map((c) => (c.id === id ? { ...c, accessLevel } : c)));
  };

  const accessLevelIcons = {
    view: EyeIcon,
    comment: ChatBubbleLeftRightIcon,
    edit: PencilIcon,
  };

  const accessLevelColors = {
    view: "bg-blue-100 text-blue-800",
    comment: "bg-yellow-100 text-yellow-800",
    edit: "bg-green-100 text-green-800",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Document"
      description={`Share "${documentName}" with others`}
      size="lg"
    >
      <div className="space-y-6">
        <Tabs defaultValue="link">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link" className="flex items-center space-x-2">
              <LinkIcon className="w-4 h-4" />
              <span>Share Link</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <EnvelopeIcon className="w-4 h-4" />
              <span>Email Invite</span>
            </TabsTrigger>
            <TabsTrigger value="collaborators" className="flex items-center space-x-2">
              <UserGroupIcon className="w-4 h-4" />
              <span>Collaborators</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <Card padding="lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Shareable Link</h3>
                  <Badge variant="primary" size="sm">
                    <ShieldCheckIcon className="w-3 h-3 mr-1" />
                    Secure
                  </Badge>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={shareLink || generateShareLink()}
                    readOnly
                    className="input flex-1"
                    placeholder="Click 'Copy Link' to generate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={cn(
                      "btn px-4 py-2 transition-all duration-200",
                      linkCopied ? "btn-success" : "btn-primary",
                    )}
                  >
                    {linkCopied ? (
                      <>
                        <CheckIcon className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <Card padding="lg">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Invite by Email</h3>

                <div className="flex space-x-2">
                  <input
                    type="email"
                    value={newCollaboratorEmail}
                    onChange={(e) => setNewCollaboratorEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="input flex-1"
                    onKeyPress={(e) => e.key === "Enter" && handleAddCollaborator()}
                  />
                  <button
                    onClick={handleAddCollaborator}
                    className="btn btn-primary"
                    disabled={!newCollaboratorEmail.trim()}
                  >
                    <EnvelopeIcon className="w-4 h-4 mr-2" />
                    Send Invite
                  </button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="collaborators" className="space-y-4">
            <Card padding="lg">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Collaborators ({collaborators.length})</h3>

                {collaborators.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
                    <p>No collaborators yet</p>
                    <p className="text-sm">Use the Email tab to invite people</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {collaborators.map((collaborator) => {
                      const AccessIcon = accessLevelIcons[collaborator.accessLevel];
                      return (
                        <div
                          key={collaborator.id}
                          className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-700">
                                {collaborator.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900">{collaborator.name}</p>
                              <p className="text-sm text-neutral-500">{collaborator.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Badge variant={collaborator.status === "accepted" ? "success" : "warning"} size="sm">
                              {collaborator.status}
                            </Badge>

                            <select
                              value={collaborator.accessLevel}
                              onChange={(e) =>
                                handleUpdateCollaboratorAccess(
                                  collaborator.id,
                                  e.target.value as "view" | "comment" | "edit",
                                )
                              }
                              className="input input-sm w-24"
                            >
                              <option value="view">View</option>
                              <option value="comment">Comment</option>
                              <option value="edit">Edit</option>
                            </select>

                            <button
                              onClick={() => handleRemoveCollaborator(collaborator.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Share Settings */}
        <Card padding="lg">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <ShieldCheckIcon className="w-5 h-5 mr-2" />
              Security & Permissions
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Switch
                  checked={shareSettings.allowDownload}
                  onChange={(checked) => setShareSettings({ ...shareSettings, allowDownload: checked })}
                  label="Allow Download"
                  description="Recipients can download the PDF"
                />

                <Switch
                  checked={shareSettings.allowPrint}
                  onChange={(checked) => setShareSettings({ ...shareSettings, allowPrint: checked })}
                  label="Allow Printing"
                  description="Recipients can print the document"
                />

                <Switch
                  checked={shareSettings.allowCopy}
                  onChange={(checked) => setShareSettings({ ...shareSettings, allowCopy: checked })}
                  label="Allow Text Copy"
                  description="Recipients can copy text content"
                />
              </div>

              <div className="space-y-3">
                <Switch
                  checked={shareSettings.requirePassword}
                  onChange={(checked) => setShareSettings({ ...shareSettings, requirePassword: checked })}
                  label="Password Protection"
                  description="Require password to access"
                />

                {shareSettings.requirePassword && (
                  <input
                    type="password"
                    value={shareSettings.password}
                    onChange={(e) => setShareSettings({ ...shareSettings, password: e.target.value })}
                    placeholder="Enter password"
                    className="input"
                  />
                )}

                <Switch
                  checked={shareSettings.trackViews}
                  onChange={(checked) => setShareSettings({ ...shareSettings, trackViews: checked })}
                  label="Track Views"
                  description="Monitor who views the document"
                />

                <Switch
                  checked={shareSettings.watermark}
                  onChange={(checked) => setShareSettings({ ...shareSettings, watermark: checked })}
                  label="Add Watermark"
                  description="Add watermark to shared document"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <ClockIcon className="w-4 h-4 inline mr-1" />
                Link Expiration (Optional)
              </label>
              <input
                type="datetime-local"
                value={shareSettings.expirationDate}
                onChange={(e) => setShareSettings({ ...shareSettings, expirationDate: e.target.value })}
                className="input"
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onClose} className="btn btn-primary">
            Share Document
          </button>
        </div>
      </div>
    </Modal>
  );
}
