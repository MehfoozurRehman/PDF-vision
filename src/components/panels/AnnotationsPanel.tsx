"use client";

import { useState } from "react";
import { usePDF } from "@/store/pdf-store";
import {
  ChatBubbleLeftIcon,
  SwatchIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function AnnotationsPanel() {
  const { state: pdfState, dispatch: pdfDispatch } = usePDF();
  const [filter, setFilter] = useState<"all" | "highlight" | "note" | "drawing" | "text">("all");
  const [sortBy, setSortBy] = useState<"page" | "date" | "author">("page");

  const currentDocument = pdfState.activeDocument;

  if (!currentDocument) {
    return (
      <div className="p-4 text-center text-gray-500">
        <ChatBubbleLeftIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p>No document open</p>
      </div>
    );
  }

  const annotations = currentDocument.annotations || [];

  // Filter annotations
  const filteredAnnotations = annotations.filter((annotation) => {
    if (filter === "all") return true;
    return annotation.type === filter;
  });

  // Sort annotations
  const sortedAnnotations = [...filteredAnnotations].sort((a, b) => {
    switch (sortBy) {
      case "page":
        return a.pageNumber - b.pageNumber;
      case "date":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "author":
        return a.author.localeCompare(b.author);
      default:
        return 0;
    }
  });

  const handleAnnotationClick = (annotation: any) => {
    // Navigate to the annotation's page
    pdfDispatch({
      type: "SET_CURRENT_PAGE",
      payload: annotation.pageNumber,
    });

    // TODO: Scroll to annotation position
    console.log("Navigate to annotation:", annotation.id);
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    pdfDispatch({
      type: "REMOVE_ANNOTATION",
      payload: annotationId,
    });
  };

  const getAnnotationIcon = (type: string) => {
    switch (type) {
      case "highlight":
        return <SwatchIcon className="w-4 h-4" />;
      case "note":
        return <ChatBubbleLeftIcon className="w-4 h-4" />;
      case "drawing":
        return <PencilIcon className="w-4 h-4" />;
      case "text":
        return <PencilIcon className="w-4 h-4" />;
      default:
        return <ChatBubbleLeftIcon className="w-4 h-4" />;
    }
  };

  const getAnnotationColor = (annotation: any) => {
    return annotation.color || "#fbbf24";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900">Comments</h3>
        <p className="text-xs text-gray-500 mt-1">
          {annotations.length} annotation{annotations.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="p-3 border-b border-gray-200 space-y-3">
        {/* Filter by type */}
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Filter by type</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All types</option>
            <option value="highlight">Highlights</option>
            <option value="note">Notes</option>
            <option value="drawing">Drawings</option>
            <option value="text">Text</option>
          </select>
        </div>

        {/* Sort by */}
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="page">Page number</option>
            <option value="date">Date created</option>
            <option value="author">Author</option>
          </select>
        </div>
      </div>

      {/* Annotations List */}
      <div className="flex-1 overflow-y-auto">
        {sortedAnnotations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <ChatBubbleLeftIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">{filter === "all" ? "No annotations yet" : `No ${filter} annotations`}</p>
            <p className="text-xs mt-1">Start annotating to see them here</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {sortedAnnotations.map((annotation) => (
              <div
                key={annotation.id}
                className="group p-3 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors"
                onClick={() => handleAnnotationClick(annotation)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1 rounded" style={{ backgroundColor: `${getAnnotationColor(annotation)}20` }}>
                      <div style={{ color: getAnnotationColor(annotation) }}>{getAnnotationIcon(annotation.type)}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-900 capitalize">{annotation.type}</div>
                      <div className="text-xs text-gray-500">Page {annotation.pageNumber}</div>
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Toggle annotation visibility
                        console.log("Toggle visibility:", annotation.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      title="Toggle visibility"
                    >
                      <EyeIcon className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAnnotation(annotation.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Delete annotation"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                {annotation.content && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-700 line-clamp-3">{annotation.content}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{annotation.author}</span>
                  <span>{new Date(annotation.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {annotations.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium text-gray-900">
                {annotations.filter((a) => a.type === "highlight").length}
              </div>
              <div className="text-gray-500">Highlights</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-900">{annotations.filter((a) => a.type === "note").length}</div>
              <div className="text-gray-500">Notes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
