"use client";

import {
  ArrowDownTrayIcon,
  BookmarkIcon,
  ChatBubbleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  PhotoIcon,
  PlusIcon,
  RectangleStackIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  BookmarkIcon as BookmarkSolidIcon,
  ChatBubbleLeftIcon as ChatBubbleLeftSolidIcon,
  PaperClipIcon as PaperClipSolidIcon,
  PhotoIcon as PhotoSolidIcon,
  RectangleStackIcon as RectangleStackSolidIcon,
} from "@heroicons/react/24/solid";

import { usePDF } from "@/store/pdf-store";
import { useState } from "react";
import { useUI } from "@/store/ui-store";

export default function Sidebar() {
  const { state: uiState, dispatch: uiDispatch } = useUI();
  const { state: pdfState, dispatch: pdfDispatch } = usePDF();
  const [collapsed, setCollapsed] = useState(false);

  const tabs = [
    { id: "thumbnails", label: "Pages", icon: PhotoIcon },
    { id: "bookmarks", label: "Bookmarks", icon: BookmarkIcon },
    { id: "annotations", label: "Comments", icon: ChatBubbleLeftIcon },
    { id: "layers", label: "Layers", icon: RectangleStackIcon },
    { id: "attachments", label: "Attachments", icon: PaperClipIcon },
  ] as const;

  const handleTabChange = (tabId: typeof uiState.sidebarTab) => {
    uiDispatch({ type: "SET_SIDEBAR_TAB", payload: tabId });
  };

  const handlePageClick = (pageNumber: number) => {
    pdfDispatch({ type: "SET_CURRENT_PAGE", payload: pageNumber });
  };

  if (collapsed) {
    return (
      <div className="w-14 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col shadow-sm">
        <button
          onClick={() => setCollapsed(false)}
          className="p-3 hover:bg-blue-50 border-b border-gray-200 transition-all duration-200 group"
          title="Expand Sidebar"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
        </button>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const SolidIcon =
            tab.id === "thumbnails"
              ? PhotoSolidIcon
              : tab.id === "bookmarks"
                ? BookmarkSolidIcon
                : tab.id === "annotations"
                  ? ChatBubbleLeftSolidIcon
                  : tab.id === "layers"
                    ? RectangleStackSolidIcon
                    : PaperClipSolidIcon;
          const isActive = uiState.sidebarTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                handleTabChange(tab.id);
                setCollapsed(false);
              }}
              className={`p-3 transition-all duration-200 relative group ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
              title={tab.label}
            >
              {isActive ? <SolidIcon className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full" />}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
        <div className="flex space-x-0.5 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const SolidIcon =
              tab.id === "thumbnails"
                ? PhotoSolidIcon
                : tab.id === "bookmarks"
                  ? BookmarkSolidIcon
                  : tab.id === "annotations"
                    ? ChatBubbleLeftSolidIcon
                    : tab.id === "layers"
                      ? RectangleStackSolidIcon
                      : PaperClipSolidIcon;
            const isActive = uiState.sidebarTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-blue-700 shadow-sm border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {isActive ? <SolidIcon className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
          title="Collapse Sidebar"
        >
          <ChevronLeftIcon className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {uiState.sidebarTab === "thumbnails" && <ThumbnailsPanel />}
        {uiState.sidebarTab === "bookmarks" && <BookmarksPanel />}
        {uiState.sidebarTab === "annotations" && <AnnotationsPanel />}
        {uiState.sidebarTab === "layers" && <LayersPanel />}
        {uiState.sidebarTab === "attachments" && <AttachmentsPanel />}
      </div>
    </div>
  );
}

function ThumbnailsPanel() {
  const { state: pdfState, dispatch: pdfDispatch } = usePDF();
  const [searchTerm, setSearchTerm] = useState("");

  if (!pdfState.activeDocument) {
    return (
      <div className="p-6 text-center">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <DocumentIcon className="w-16 h-16 mx-auto mb-3 text-blue-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Open</h3>
          <p className="text-sm text-gray-600">Open a PDF to see page thumbnails</p>
        </div>
      </div>
    );
  }

  const filteredPages = pdfState.activeDocument.pages.filter(
    (page) => searchTerm === "" || page.pageNumber.toString().includes(searchTerm),
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Pages Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-3">
          {filteredPages.map((page, index) => (
            <div
              key={page.id}
              onClick={() =>
                pdfDispatch({
                  type: "SET_CURRENT_PAGE",
                  payload: page.pageNumber,
                })
              }
              className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 group ${
                pdfState.activeDocument?.currentPage === page.pageNumber
                  ? "border-blue-500 shadow-lg ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-blue-300 hover:shadow-md"
              }`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", page.pageNumber.toString());
              }}
            >
              <div className="aspect-[3/4] bg-white rounded-xl p-2">
                {/* Enhanced page thumbnail */}
                <div
                  className={`w-full h-full rounded-lg flex items-center justify-center transition-all ${
                    pdfState.activeDocument?.currentPage === page.pageNumber
                      ? "bg-gradient-to-br from-blue-50 to-indigo-50"
                      : "bg-gray-50 group-hover:bg-blue-50"
                  }`}
                >
                  <div className="text-center">
                    <DocumentIcon
                      className={`w-8 h-8 mx-auto mb-1 ${
                        pdfState.activeDocument?.currentPage === page.pageNumber
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-blue-400"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        pdfState.activeDocument?.currentPage === page.pageNumber
                          ? "text-blue-700"
                          : "text-gray-500 group-hover:text-blue-600"
                      }`}
                    >
                      Page {page.pageNumber}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`absolute bottom-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${
                  pdfState.activeDocument?.currentPage === page.pageNumber
                    ? "bg-blue-600 text-white"
                    : "bg-black bg-opacity-75 text-white"
                }`}
              >
                {page.pageNumber}
              </div>
              {pdfState.activeDocument?.currentPage === page.pageNumber && (
                <div className="absolute top-2 left-2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BookmarksPanel() {
  const { state: pdfState, dispatch: pdfDispatch } = usePDF();
  const [bookmarks] = useState([
    { id: 1, title: "Introduction", pageNumber: 1, level: 0 },
    { id: 2, title: "Chapter 1: Getting Started", pageNumber: 5, level: 0 },
    { id: 3, title: "1.1 Installation", pageNumber: 6, level: 1 },
    { id: 4, title: "1.2 Configuration", pageNumber: 8, level: 1 },
    { id: 5, title: "Chapter 2: Advanced Features", pageNumber: 15, level: 0 },
    { id: 6, title: "2.1 Custom Settings", pageNumber: 16, level: 1 },
  ]);

  const handleBookmarkClick = (pageNumber: number) => {
    pdfDispatch({ type: "SET_CURRENT_PAGE", payload: pageNumber });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Add Bookmark</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {bookmarks.length === 0 ? (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                <BookmarkSolidIcon className="w-16 h-16 mx-auto mb-3 text-amber-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookmarks</h3>
                <p className="text-sm text-gray-600 mb-4">Add bookmarks to navigate quickly through your document</p>
                <button className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium">
                  <PlusIcon className="w-4 h-4" />
                  <span>Create First Bookmark</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-1">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                onClick={() => handleBookmarkClick(bookmark.pageNumber)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                  pdfState.activeDocument?.currentPage === bookmark.pageNumber
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
                style={{ paddingLeft: `${12 + bookmark.level * 20}px` }}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <BookmarkIcon
                    className={`w-4 h-4 flex-shrink-0 ${
                      pdfState.activeDocument?.currentPage === bookmark.pageNumber
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        pdfState.activeDocument?.currentPage === bookmark.pageNumber ? "text-blue-900" : "text-gray-900"
                      }`}
                    >
                      {bookmark.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      pdfState.activeDocument?.currentPage === bookmark.pageNumber
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {bookmark.pageNumber}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle bookmark deletion
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                    title="Delete Bookmark"
                  >
                    <TrashIcon className="w-3 h-3 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AnnotationsPanel() {
  const { state: pdfState, dispatch: pdfDispatch } = usePDF();
  const [filter, setFilter] = useState("all");
  const [annotations] = useState([
    {
      id: 1,
      type: "comment",
      content: "This section needs clarification",
      author: "John Doe",
      pageNumber: 3,
      timestamp: "2024-01-15T10:30:00Z",
      color: "#3B82F6",
    },
    {
      id: 2,
      type: "highlight",
      content: "Important concept highlighted",
      author: "Jane Smith",
      pageNumber: 5,
      timestamp: "2024-01-15T14:20:00Z",
      color: "#FBBF24",
    },
    {
      id: 3,
      type: "note",
      content: "Remember to update this information in the next version",
      author: "Mike Johnson",
      pageNumber: 8,
      timestamp: "2024-01-16T09:15:00Z",
      color: "#10B981",
    },
    {
      id: 4,
      type: "comment",
      content: "Great explanation of the process",
      author: "Sarah Wilson",
      pageNumber: 12,
      timestamp: "2024-01-16T16:45:00Z",
      color: "#8B5CF6",
    },
  ]);

  const filteredAnnotations = annotations.filter((annotation) => filter === "all" || annotation.type === filter);

  const getAnnotationIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <ChatBubbleLeftIcon className="w-4 h-4" />;
      case "highlight":
        return <PhotoIcon className="w-4 h-4" />;
      case "note":
        return <DocumentIcon className="w-4 h-4" />;
      default:
        return <ChatBubbleLeftIcon className="w-4 h-4" />;
    }
  };

  const handleAnnotationClick = (pageNumber: number) => {
    pdfDispatch({ type: "SET_CURRENT_PAGE", payload: pageNumber });
  };

  const getFilterCounts = () => {
    return {
      all: annotations.length,
      comments: annotations.filter((a) => a.type === "comment").length,
      highlights: annotations.filter((a) => a.type === "highlight").length,
      notes: annotations.filter((a) => a.type === "note").length,
    };
  };

  const filterCounts = getFilterCounts();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-3">
          <PlusIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Add Comment</span>
        </button>

        {/* Filter buttons */}
        <div className="flex space-x-1">
          {[
            { id: "all", label: "All", count: filterCounts.all },
            { id: "comment", label: "Comments", count: filterCounts.comments },
            {
              id: "highlight",
              label: "Highlights",
              count: filterCounts.highlights,
            },
            { id: "note", label: "Notes", count: filterCounts.notes },
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                filter === filterOption.id
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filterOption.label}
              {filterOption.count > 0 && <span className="ml-1 text-xs">({filterOption.count})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredAnnotations.length === 0 ? (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <ChatBubbleLeftSolidIcon className="w-16 h-16 mx-auto mb-3 text-green-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Comments</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add comments and annotations to collaborate on this document
                </p>
                <button className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">
                  <PlusIcon className="w-4 h-4" />
                  <span>Add First Comment</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {filteredAnnotations.map((annotation) => (
              <div
                key={annotation.id}
                onClick={() => handleAnnotationClick(annotation.pageNumber)}
                className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-start space-x-3">
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{
                      backgroundColor: `${annotation.color}20`,
                      color: annotation.color,
                    }}
                  >
                    {getAnnotationIcon(annotation.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-gray-900 capitalize">{annotation.type}</p>
                      <span className="text-xs text-gray-500">Page {annotation.pageNumber}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 line-clamp-3">{annotation.content}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{annotation.author}</p>
                      <p className="text-xs text-gray-400">{new Date(annotation.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle annotation deletion
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                    title="Delete Annotation"
                  >
                    <TrashIcon className="w-3 h-3 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LayersPanel() {
  const [layers] = useState([
    { id: 1, name: "Background", visible: true, locked: false },
    { id: 2, name: "Text Content", visible: true, locked: false },
    { id: 3, name: "Annotations", visible: true, locked: false },
  ]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <PlusIcon className="w-4 h-4" />
          <span className="text-sm font-medium">New Layer</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {layers.length === 0 ? (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                <RectangleStackSolidIcon className="w-16 h-16 mx-auto mb-3 text-purple-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Layers</h3>
                <p className="text-sm text-gray-600 mb-4">Organize content with layers for better control</p>
                <button className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium">
                  <PlusIcon className="w-4 h-4" />
                  <span>Create First Layer</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <EyeIcon className={`w-4 h-4 ${layer.visible ? "text-blue-600" : "text-gray-400"}`} />
                    </button>
                    <span className="text-sm font-medium text-gray-900">{layer.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {layer.locked && <div className="w-3 h-3 bg-gray-400 rounded-full" title="Locked" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AttachmentsPanel() {
  const [attachments] = useState([
    {
      id: 1,
      name: "Document.pdf",
      size: "2.4 MB",
      type: "pdf",
      dateAdded: new Date("2024-01-15"),
    },
    {
      id: 2,
      name: "Image.jpg",
      size: "1.2 MB",
      type: "image",
      dateAdded: new Date("2024-01-14"),
    },
    {
      id: 3,
      name: "Spreadsheet.xlsx",
      size: "856 KB",
      type: "excel",
      dateAdded: new Date("2024-01-13"),
    },
  ]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <DocumentIcon className="w-5 h-5 text-red-500" />;
      case "image":
        return <PhotoIcon className="w-5 h-5 text-blue-500" />;
      case "excel":
        return <DocumentIcon className="w-5 h-5 text-green-500" />;
      default:
        return <PaperClipIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <PlusIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Add Attachment</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {attachments.length === 0 ? (
          <div className="flex items-center justify-center h-full p-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                <PaperClipSolidIcon className="w-16 h-16 mx-auto mb-3 text-indigo-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Attachments</h3>
                <p className="text-sm text-gray-600 mb-4">Attach files to your PDF for easy access</p>
                <button className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium">
                  <PlusIcon className="w-4 h-4" />
                  <span>Add First Attachment</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(attachment.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                      <p className="text-xs text-gray-500">{attachment.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                      <ArrowDownTrayIcon className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                      <TrashIcon className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Added {attachment.dateAdded.toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
