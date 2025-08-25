"use client";

import { useState } from "react";
import { usePDF } from "@/store/pdf-store";
import {
  BookmarkIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

interface Bookmark {
  id: string;
  title: string;
  pageNumber: number;
  level: number;
  children?: Bookmark[];
  isExpanded?: boolean;
}

export default function BookmarksPanel() {
  const { state: pdfState, dispatch: pdfDispatch } = usePDF();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    {
      id: "1",
      title: "Introduction",
      pageNumber: 1,
      level: 0,
      isExpanded: true,
      children: [
        {
          id: "2",
          title: "Overview",
          pageNumber: 2,
          level: 1,
        },
        {
          id: "3",
          title: "Getting Started",
          pageNumber: 3,
          level: 1,
        },
      ],
    },
    {
      id: "4",
      title: "Chapter 1",
      pageNumber: 5,
      level: 0,
      isExpanded: false,
      children: [
        {
          id: "5",
          title: "Section 1.1",
          pageNumber: 6,
          level: 1,
        },
        {
          id: "6",
          title: "Section 1.2",
          pageNumber: 8,
          level: 1,
        },
      ],
    },
  ]);
  const [editingBookmark, setEditingBookmark] = useState<string | null>(null);
  const [newBookmarkTitle, setNewBookmarkTitle] = useState("");

  const currentDocument = pdfState.activeDocument;

  const handleBookmarkClick = (pageNumber: number) => {
    if (currentDocument) {
      pdfDispatch({
        type: "SET_CURRENT_PAGE",
        payload: pageNumber,
      });
    }
  };

  const toggleBookmark = (bookmarkId: string) => {
    setBookmarks((prev) =>
      prev.map((bookmark) =>
        bookmark.id === bookmarkId ? { ...bookmark, isExpanded: !bookmark.isExpanded } : bookmark,
      ),
    );
  };

  const addBookmark = () => {
    if (!currentDocument || !newBookmarkTitle.trim()) return;

    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title: newBookmarkTitle.trim(),
      pageNumber: currentDocument.currentPage,
      level: 0,
    };

    setBookmarks((prev) => [...prev, newBookmark]);
    setNewBookmarkTitle("");
  };

  const deleteBookmark = (bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== bookmarkId));
  };

  const updateBookmarkTitle = (bookmarkId: string, newTitle: string) => {
    setBookmarks((prev) =>
      prev.map((bookmark) => (bookmark.id === bookmarkId ? { ...bookmark, title: newTitle } : bookmark)),
    );
    setEditingBookmark(null);
  };

  const renderBookmark = (bookmark: Bookmark) => {
    const isEditing = editingBookmark === bookmark.id;
    const hasChildren = bookmark.children && bookmark.children.length > 0;

    return (
      <div key={bookmark.id} className="select-none">
        <div
          className={`group flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer ${
            currentDocument?.currentPage === bookmark.pageNumber ? "bg-adobe-blue/10" : ""
          }`}
          style={{ paddingLeft: `${8 + bookmark.level * 16}px` }}
        >
          {/* Expand/Collapse Icon */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(bookmark.id);
              }}
              className="p-1 hover:bg-gray-200 rounded mr-1"
            >
              {bookmark.isExpanded ? (
                <ChevronDownIcon className="w-3 h-3 text-gray-600" />
              ) : (
                <ChevronRightIcon className="w-3 h-3 text-gray-600" />
              )}
            </button>
          ) : (
            <div className="w-5 mr-1" />
          )}

          {/* Bookmark Icon */}
          <BookmarkIcon className="w-4 h-4 text-gray-600 mr-2 flex-shrink-0" />

          {/* Bookmark Title */}
          <div className="flex-1 min-w-0" onClick={() => handleBookmarkClick(bookmark.pageNumber)}>
            {isEditing ? (
              <input
                type="text"
                defaultValue={bookmark.title}
                className="w-full px-1 py-0.5 text-sm border border-gray-300 rounded"
                autoFocus
                onBlur={(e) => updateBookmarkTitle(bookmark.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateBookmarkTitle(bookmark.id, e.currentTarget.value);
                  } else if (e.key === "Escape") {
                    setEditingBookmark(null);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900 truncate">{bookmark.title}</span>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{bookmark.pageNumber}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingBookmark(bookmark.id);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Edit bookmark"
            >
              <PencilIcon className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteBookmark(bookmark.id);
              }}
              className="p-1 text-gray-400 hover:text-red-600 rounded"
              title="Delete bookmark"
            >
              <TrashIcon className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && bookmark.isExpanded && <div>{bookmark.children!.map((child) => renderBookmark(child))}</div>}
      </div>
    );
  };

  if (!currentDocument) {
    return (
      <div className="p-4 text-center text-gray-500">
        <BookmarkIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p>No document open</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Bookmarks</h3>
        <p className="text-xs text-gray-500 mt-1">
          {bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Add Bookmark */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Add bookmark..."
            value={newBookmarkTitle}
            onChange={(e) => setNewBookmarkTitle(e.target.value)}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addBookmark();
              }
            }}
          />
          <button
            onClick={addBookmark}
            disabled={!newBookmarkTitle.trim()}
            className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add bookmark"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="flex-1 overflow-y-auto">
        {bookmarks.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <BookmarkIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No bookmarks yet</p>
            <p className="text-xs mt-1">Add bookmarks to quickly navigate</p>
          </div>
        ) : (
          <div className="p-2">{bookmarks.map((bookmark) => renderBookmark(bookmark))}</div>
        )}
      </div>
    </div>
  );
}
