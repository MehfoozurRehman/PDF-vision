"use client";

import React, { useState, useRef } from "react";
import { Card, Modal, Badge, Dropdown } from "@/components/ui";
import {
  FolderIcon,
  FolderOpenIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  StarIcon,
  ClockIcon,
  TagIcon,
  TrashIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  EyeIcon,
  FolderPlusIcon,
  ArrowUpTrayIcon,
  Squares2X2Icon,
  ListBulletIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  createdAt: Date;
  modifiedAt: Date;
  path: string;
  parentId?: string;
  tags: string[];
  isFavorite: boolean;
  isProtected: boolean;
  thumbnail?: string;
  description?: string;
}

interface FileManagerProps {
  isVisible: boolean;
  onClose: () => void;
  onOpenFile: (file: FileItem) => void;
  onCreateFolder: (name: string, parentId?: string) => void;
  onUploadFiles: (files: File[], parentId?: string) => void;
  onDeleteItems: (itemIds: string[]) => void;
  onRenameItem: (itemId: string, newName: string) => void;
  onMoveItems: (itemIds: string[], targetFolderId: string) => void;
  onToggleFavorite: (itemId: string) => void;
  onAddTags: (itemId: string, tags: string[]) => void;
  files: FileItem[];
  currentFolderId?: string;
}

export default function FileManager({
  isVisible,
  onClose,
  onOpenFile,
  onCreateFolder,
  onUploadFiles,
  onDeleteItems,
  onRenameItem,
  onMoveItems,
  onToggleFavorite,
  onAddTags,
  files,
  currentFolderId,
}: FileManagerProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size" | "type">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterBy, setFilterBy] = useState<"all" | "favorites" | "recent" | "protected">("all");
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [currentPath, setCurrentPath] = useState<string[]>(["Home"]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and sort files
  const currentFolderFiles = files.filter((file) => file.parentId === currentFolderId);

  const filteredFiles = currentFolderFiles.filter((file) => {
    // Search filter
    if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    switch (filterBy) {
      case "favorites":
        return file.isFavorite;
      case "recent":
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        return file.modifiedAt > threeDaysAgo;
      case "protected":
        return file.isProtected;
      default:
        return true;
    }
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "date":
        comparison = a.modifiedAt.getTime() - b.modifiedAt.getTime();
        break;
      case "size":
        comparison = (a.size || 0) - (b.size || 0);
        break;
      case "type":
        comparison = a.type.localeCompare(b.type);
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      onUploadFiles(files, currentFolderId);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), currentFolderId);
      setNewFolderName("");
      setShowNewFolderModal(false);
    }
  };

  const handleRename = (itemId: string) => {
    if (editingName.trim() && editingName !== files.find((f) => f.id === itemId)?.name) {
      onRenameItem(itemId, editingName.trim());
    }
    setEditingItem(null);
    setEditingName("");
  };

  const handleSelectItem = (itemId: string, isCtrlClick = false) => {
    if (isCtrlClick) {
      setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]));
    } else {
      setSelectedItems([itemId]);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const FileCard = ({ file }: { file: FileItem }) => {
    const isSelected = selectedItems.includes(file.id);
    const isEditing = editingItem === file.id;

    return (
      <Card
        className={cn(
          "transition-all duration-200 cursor-pointer hover:shadow-md",
          isSelected && "ring-2 ring-primary-500 shadow-lg",
          viewMode === "grid" ? "p-4" : "p-3",
        )}
        onClick={(e) => {
          if (!isEditing) {
            handleSelectItem(file.id, e.ctrlKey || e.metaKey);
          }
        }}
        onDoubleClick={() => {
          if (file.type === "file") {
            onOpenFile(file);
          }
        }}
      >
        {viewMode === "grid" ? (
          <div className="text-center space-y-3">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              {file.type === "folder" ? (
                <FolderIcon className="w-16 h-16 text-blue-500" />
              ) : (
                <div className="relative">
                  {file.thumbnail ? (
                    <img src={file.thumbnail} alt={file.name} className="w-16 h-16 object-cover rounded border" />
                  ) : (
                    <DocumentIcon className="w-16 h-16 text-red-500" />
                  )}
                  {file.isProtected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">🔒</span>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(file.id);
                }}
                className="absolute -top-1 -left-1"
              >
                {file.isFavorite ? (
                  <StarSolidIcon className="w-4 h-4 text-yellow-500" />
                ) : (
                  <StarIcon className="w-4 h-4 text-neutral-300 hover:text-yellow-500" />
                )}
              </button>
            </div>

            <div className="space-y-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleRename(file.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(file.id);
                    if (e.key === "Escape") {
                      setEditingItem(null);
                      setEditingName("");
                    }
                  }}
                  className="input input-sm w-full text-center"
                  autoFocus
                />
              ) : (
                <p className="text-sm font-medium text-neutral-900 truncate" title={file.name}>
                  {file.name}
                </p>
              )}

              <div className="flex items-center justify-center space-x-2 text-xs text-neutral-500">
                {file.size && <span>{formatFileSize(file.size)}</span>}
                <span>{formatDate(file.modifiedAt)}</span>
              </div>

              {file.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center">
                  {file.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} size="sm" className="bg-neutral-100 text-neutral-600">
                      {tag}
                    </Badge>
                  ))}
                  {file.tags.length > 2 && (
                    <Badge size="sm" className="bg-neutral-100 text-neutral-600">
                      +{file.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {file.type === "folder" ? (
                <FolderIcon className="w-8 h-8 text-blue-500" />
              ) : (
                <div className="relative">
                  <DocumentIcon className="w-8 h-8 text-red-500" />
                  {file.isProtected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">🔒</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              {isEditing ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleRename(file.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(file.id);
                    if (e.key === "Escape") {
                      setEditingItem(null);
                      setEditingName("");
                    }
                  }}
                  className="input input-sm w-full"
                  autoFocus
                />
              ) : (
                <p className="text-sm font-medium text-neutral-900 truncate" title={file.name}>
                  {file.name}
                </p>
              )}

              <div className="flex items-center space-x-4 text-xs text-neutral-500">
                {file.size && <span>{formatFileSize(file.size)}</span>}
                <span>{formatDate(file.modifiedAt)}</span>
                {file.tags.length > 0 && (
                  <div className="flex space-x-1">
                    {file.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} size="sm" className="bg-neutral-100 text-neutral-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(file.id);
                }}
              >
                {file.isFavorite ? (
                  <StarSolidIcon className="w-4 h-4 text-yellow-500" />
                ) : (
                  <StarIcon className="w-4 h-4 text-neutral-300 hover:text-yellow-500" />
                )}
              </button>

              <Dropdown
                trigger={
                  <button className="p-1 hover:bg-neutral-100 rounded">
                    <EllipsisVerticalIcon className="w-4 h-4" />
                  </button>
                }
                items={[
                  {
                    id: "open",
                    label: "Open",
                    icon: <EyeIcon className="w-4 h-4" />,
                    onClick: () => onOpenFile(file),
                  },
                  {
                    id: "rename",
                    label: "Rename",
                    icon: <PencilIcon className="w-4 h-4" />,
                    onClick: () => {
                      setEditingItem(file.id);
                      setEditingName(file.name);
                    },
                  },
                  {
                    id: "duplicate",
                    label: "Duplicate",
                    icon: <DocumentDuplicateIcon className="w-4 h-4" />,
                    onClick: () => {},
                  },
                  {
                    id: "download",
                    label: "Download",
                    icon: <ArrowDownTrayIcon className="w-4 h-4" />,
                    onClick: () => {},
                  },
                  {
                    id: "share",
                    label: "Share",
                    icon: <ShareIcon className="w-4 h-4" />,
                    onClick: () => {},
                  },
                  {
                    id: "separator",
                    label: "",
                    divider: true,
                  },
                  {
                    id: "delete",
                    label: "Delete",
                    icon: <TrashIcon className="w-4 h-4" />,
                    onClick: () => onDeleteItems([file.id]),
                  },
                ]}
              />
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <Modal isOpen={isVisible} onClose={onClose} size="full">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FolderOpenIcon className="w-6 h-6 mr-2" />
              File Manager
            </h2>

            <div className="flex items-center space-x-2">
              <button onClick={() => setShowNewFolderModal(true)} className="btn btn-secondary btn-sm">
                <FolderPlusIcon className="w-4 h-4 mr-1" />
                New Folder
              </button>

              <button onClick={() => fileInputRef.current?.click()} className="btn btn-primary btn-sm">
                <ArrowUpTrayIcon className="w-4 h-4 mr-1" />
                Upload Files
              </button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-neutral-600 mb-4">
            {currentPath.map((path, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span>/</span>}
                <button className="hover:text-primary-600">{path}</button>
              </React.Fragment>
            ))}
          </nav>

          {/* Search and Controls */}
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files and folders..."
                  className="input pl-10 w-full"
                />
              </div>

              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
                className="input w-auto"
              >
                <option value="all">All Files</option>
                <option value="favorites">Favorites</option>
                <option value="recent">Recent</option>
                <option value="protected">Protected</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="input w-auto"
              >
                <option value="name">Name</option>
                <option value="date">Date</option>
                <option value="size">Size</option>
                <option value="type">Type</option>
              </select>

              <button
                onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="btn btn-secondary btn-sm"
              >
                <ArrowsUpDownIcon className="w-4 h-4" />
              </button>

              <div className="flex border border-neutral-300 rounded">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "grid" ? "bg-primary-500 text-white" : "hover:bg-neutral-100",
                  )}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "list" ? "bg-primary-500 text-white" : "hover:bg-neutral-100",
                  )}
                >
                  <ListBulletIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* File Grid/List */}
        <div className="flex-1 p-6 overflow-auto">
          {sortedFiles.length === 0 ? (
            <div className="text-center py-12">
              <FolderIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">
                {searchQuery ? "No files found matching your search." : "This folder is empty."}
              </p>
            </div>
          ) : (
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                  : "space-y-2",
              )}
            >
              {sortedFiles.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          )}
        </div>

        {/* Selection Actions */}
        {selectedItems.length > 0 && (
          <div className="p-4 border-t border-neutral-200 bg-neutral-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">
                {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} selected
              </span>

              <div className="flex items-center space-x-2">
                <button onClick={() => onDeleteItems(selectedItems)} className="btn btn-secondary btn-sm text-red-600">
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Delete
                </button>

                <button onClick={() => setSelectedItems([])} className="btn btn-secondary btn-sm">
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <Modal isOpen={showNewFolderModal} onClose={() => setShowNewFolderModal(false)} size="sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>

            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="input w-full mb-4"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateFolder();
                if (e.key === "Escape") setShowNewFolderModal(false);
              }}
              autoFocus
            />

            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowNewFolderModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleCreateFolder} disabled={!newFolderName.trim()} className="btn btn-primary">
                Create
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
}
