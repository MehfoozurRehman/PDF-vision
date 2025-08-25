"use client";

import React, { useState } from "react";
import { Card, Modal, Badge } from "@/components/ui";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface DocumentProtectionProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyProtection: (settings: ProtectionSettings) => void;
  currentProtection?: ProtectionSettings;
}

interface ProtectionSettings {
  passwordProtection: {
    enabled: boolean;
    openPassword?: string;
    editPassword?: string;
    printPassword?: string;
  };
  permissions: {
    allowPrinting: boolean;
    allowCopying: boolean;
    allowEditing: boolean;
    allowAnnotations: boolean;
    allowFormFilling: boolean;
    allowScreenReaders: boolean;
  };
  watermark: {
    enabled: boolean;
    text?: string;
    opacity: number;
    fontSize: number;
    rotation: number;
    position: "center" | "diagonal" | "header" | "footer";
    color: string;
  };
  expiration: {
    enabled: boolean;
    expiryDate?: Date;
    maxViews?: number;
    currentViews?: number;
  };
  accessControl: {
    enabled: boolean;
    allowedUsers: string[];
    allowedDomains: string[];
    ipRestrictions: string[];
  };
}

const defaultSettings: ProtectionSettings = {
  passwordProtection: {
    enabled: false,
  },
  permissions: {
    allowPrinting: true,
    allowCopying: true,
    allowEditing: true,
    allowAnnotations: true,
    allowFormFilling: true,
    allowScreenReaders: true,
  },
  watermark: {
    enabled: false,
    opacity: 0.3,
    fontSize: 48,
    rotation: 45,
    position: "diagonal",
    color: "#666666",
  },
  expiration: {
    enabled: false,
  },
  accessControl: {
    enabled: false,
    allowedUsers: [],
    allowedDomains: [],
    ipRestrictions: [],
  },
};

export default function DocumentProtection({
  isVisible,
  onClose,
  onApplyProtection,
  currentProtection,
}: DocumentProtectionProps) {
  const [settings, setSettings] = useState<ProtectionSettings>(currentProtection || defaultSettings);
  const [activeTab, setActiveTab] = useState<"password" | "permissions" | "watermark" | "expiration" | "access">(
    "password",
  );
  const [showPasswords, setShowPasswords] = useState({
    open: false,
    edit: false,
    print: false,
  });

  const handleApply = () => {
    onApplyProtection(settings);
    onClose();
  };

  const updateSettings = (section: keyof ProtectionSettings, updates: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates,
      },
    }));
  };

  const PasswordSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Password Protection</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.passwordProtection.enabled}
            onChange={(e) => updateSettings("passwordProtection", { enabled: e.target.checked })}
            className="rounded"
          />
          <span>Enable</span>
        </label>
      </div>

      {settings.passwordProtection.enabled && (
        <div className="space-y-4 pl-4 border-l-2 border-primary-200">
          <div>
            <label className="block text-sm font-medium mb-2">Document Open Password</label>
            <div className="relative">
              <input
                type={showPasswords.open ? "text" : "password"}
                value={settings.passwordProtection.openPassword || ""}
                onChange={(e) => updateSettings("passwordProtection", { openPassword: e.target.value })}
                placeholder="Enter password to open document"
                className="input w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, open: !prev.open }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPasswords.open ? (
                  <EyeSlashIcon className="w-4 h-4 text-neutral-500" />
                ) : (
                  <EyeIcon className="w-4 h-4 text-neutral-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Permissions Password</label>
            <div className="relative">
              <input
                type={showPasswords.edit ? "text" : "password"}
                value={settings.passwordProtection.editPassword || ""}
                onChange={(e) => updateSettings("passwordProtection", { editPassword: e.target.value })}
                placeholder="Enter password to modify permissions"
                className="input w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((prev) => ({ ...prev, edit: !prev.edit }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPasswords.edit ? (
                  <EyeSlashIcon className="w-4 h-4 text-neutral-500" />
                ) : (
                  <EyeIcon className="w-4 h-4 text-neutral-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const PermissionsSection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Document Permissions</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries({
          allowPrinting: "Allow Printing",
          allowCopying: "Allow Copying",
          allowEditing: "Allow Editing",
          allowAnnotations: "Allow Annotations",
          allowFormFilling: "Allow Form Filling",
          allowScreenReaders: "Allow Screen Readers",
        }).map(([key, label]) => (
          <label key={key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.permissions[key as keyof typeof settings.permissions]}
              onChange={(e) => updateSettings("permissions", { [key]: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const WatermarkSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Watermark</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.watermark.enabled}
            onChange={(e) => updateSettings("watermark", { enabled: e.target.checked })}
            className="rounded"
          />
          <span>Enable</span>
        </label>
      </div>

      {settings.watermark.enabled && (
        <div className="space-y-4 pl-4 border-l-2 border-primary-200">
          <div>
            <label className="block text-sm font-medium mb-2">Watermark Text</label>
            <input
              type="text"
              value={settings.watermark.text || ""}
              onChange={(e) => updateSettings("watermark", { text: e.target.value })}
              placeholder="Enter watermark text"
              className="input w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Opacity</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={settings.watermark.opacity}
                onChange={(e) => updateSettings("watermark", { opacity: parseFloat(e.target.value) })}
                className="w-full"
              />
              <span className="text-xs text-neutral-500">{Math.round(settings.watermark.opacity * 100)}%</span>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Font Size</label>
              <input
                type="number"
                min="12"
                max="72"
                value={settings.watermark.fontSize}
                onChange={(e) => updateSettings("watermark", { fontSize: parseInt(e.target.value) })}
                className="input w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Position</label>
              <select
                value={settings.watermark.position}
                onChange={(e) => updateSettings("watermark", { position: e.target.value })}
                className="input w-full"
              >
                <option value="center">Center</option>
                <option value="diagonal">Diagonal</option>
                <option value="header">Header</option>
                <option value="footer">Footer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <input
                type="color"
                value={settings.watermark.color}
                onChange={(e) => updateSettings("watermark", { color: e.target.value })}
                className="w-full h-10 rounded border"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ExpirationSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Document Expiration</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.expiration.enabled}
            onChange={(e) => updateSettings("expiration", { enabled: e.target.checked })}
            className="rounded"
          />
          <span>Enable</span>
        </label>
      </div>

      {settings.expiration.enabled && (
        <div className="space-y-4 pl-4 border-l-2 border-primary-200">
          <div>
            <label className="block text-sm font-medium mb-2">Expiry Date</label>
            <input
              type="datetime-local"
              value={settings.expiration.expiryDate ? settings.expiration.expiryDate.toISOString().slice(0, 16) : ""}
              onChange={(e) => updateSettings("expiration", { expiryDate: new Date(e.target.value) })}
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Maximum Views</label>
            <input
              type="number"
              min="1"
              value={settings.expiration.maxViews || ""}
              onChange={(e) => updateSettings("expiration", { maxViews: parseInt(e.target.value) || undefined })}
              placeholder="Unlimited"
              className="input w-full"
            />
            {settings.expiration.currentViews !== undefined && (
              <p className="text-xs text-neutral-500 mt-1">Current views: {settings.expiration.currentViews}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const AccessControlSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Access Control</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={settings.accessControl.enabled}
            onChange={(e) => updateSettings("accessControl", { enabled: e.target.checked })}
            className="rounded"
          />
          <span>Enable</span>
        </label>
      </div>

      {settings.accessControl.enabled && (
        <div className="space-y-4 pl-4 border-l-2 border-primary-200">
          <div>
            <label className="block text-sm font-medium mb-2">Allowed Users (Email addresses)</label>
            <textarea
              value={settings.accessControl.allowedUsers.join("\n")}
              onChange={(e) =>
                updateSettings("accessControl", { allowedUsers: e.target.value.split("\n").filter(Boolean) })
              }
              placeholder="user1@example.com\nuser2@example.com"
              className="input w-full h-20 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Allowed Domains</label>
            <textarea
              value={settings.accessControl.allowedDomains.join("\n")}
              onChange={(e) =>
                updateSettings("accessControl", { allowedDomains: e.target.value.split("\n").filter(Boolean) })
              }
              placeholder="example.com\ncompany.org"
              className="input w-full h-20 resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: "password", label: "Password", icon: LockClosedIcon },
    { id: "permissions", label: "Permissions", icon: ShieldCheckIcon },
    { id: "watermark", label: "Watermark", icon: DocumentDuplicateIcon },
    { id: "expiration", label: "Expiration", icon: ClockIcon },
    { id: "access", label: "Access Control", icon: UserGroupIcon },
  ] as const;

  return (
    <Modal isOpen={isVisible} onClose={onClose} size="xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <ShieldCheckIcon className="w-6 h-6 mr-2" />
            Document Protection
          </h2>
          {currentProtection && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircleIcon className="w-3 h-3 mr-1" />
              Protected
            </Badge>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-neutral-100 p-1 rounded-lg">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                activeTab === id ? "bg-white text-primary-600 shadow-sm" : "text-neutral-600 hover:text-neutral-900",
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "password" && <PasswordSection />}
          {activeTab === "permissions" && <PermissionsSection />}
          {activeTab === "watermark" && <WatermarkSection />}
          {activeTab === "expiration" && <ExpirationSection />}
          {activeTab === "access" && <AccessControlSection />}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t border-neutral-200">
          <button onClick={() => setSettings(defaultSettings)} className="btn btn-secondary">
            Reset to Default
          </button>

          <div className="flex space-x-3">
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleApply} className="btn btn-primary">
              Apply Protection
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
