"use client";

import {
  Bars3BottomLeftIcon,
  Bars3BottomRightIcon,
  Bars3Icon,
  BoldIcon,
  CheckIcon,
  ItalicIcon,
  ListBulletIcon,
  NumberedListIcon,
  StrikethroughIcon,
  UnderlineIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

interface TextEditorProps {
  initialText?: string;
  onSave?: (text: string, formatting: TextFormatting) => void;
  onCancel?: () => void;
  position?: { x: number; y: number };
  className?: string;
}

interface TextFormatting {
  fontFamily: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  textDecoration: "none" | "underline" | "line-through";
  textAlign: "left" | "center" | "right" | "justify";
  color: string;
  backgroundColor: string;
  lineHeight: number;
  letterSpacing: number;
}

const DEFAULT_FORMATTING: TextFormatting = {
  fontFamily: "Arial",
  fontSize: 14,
  fontWeight: "normal",
  fontStyle: "normal",
  textDecoration: "none",
  textAlign: "left",
  color: "#000000",
  backgroundColor: "transparent",
  lineHeight: 1.4,
  letterSpacing: 0,
};

export default function TextEditor({ initialText = "", onSave, onCancel, position, className = "" }: TextEditorProps) {
  const [text, setText] = useState(initialText);
  const [formatting, setFormatting] = useState<TextFormatting>(DEFAULT_FORMATTING);
  const [showFormatting, setShowFormatting] = useState(false);
  const [isListMode, setIsListMode] = useState(false);
  const [listType, setListType] = useState<"bullet" | "numbered">("bullet");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Auto-resize textarea
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const fontFamilies = ["Arial", "Times New Roman", "Helvetica", "Georgia", "Verdana", "Courier New", "Comic Sans MS"];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

  const handleFormatChange = (key: keyof TextFormatting, value: any) => {
    setFormatting((prev) => ({ ...prev, [key]: value }));
  };

  const toggleBold = () => {
    handleFormatChange("fontWeight", formatting.fontWeight === "bold" ? "normal" : "bold");
  };

  const toggleItalic = () => {
    handleFormatChange("fontStyle", formatting.fontStyle === "italic" ? "normal" : "italic");
  };

  const toggleUnderline = () => {
    handleFormatChange("textDecoration", formatting.textDecoration === "underline" ? "none" : "underline");
  };

  const toggleStrikethrough = () => {
    handleFormatChange("textDecoration", formatting.textDecoration === "line-through" ? "none" : "line-through");
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(text, formatting);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const insertList = () => {
    const lines = text.split("\n");
    const newLines = lines.map((line, index) => {
      if (line.trim() === "") return line;
      const prefix = listType === "bullet" ? "• " : `${index + 1}. `;
      return line.startsWith("• ") || /^\d+\. /.test(line) ? line : prefix + line;
    });
    setText(newLines.join("\n"));
    setIsListMode(true);
  };

  const removeList = () => {
    const lines = text.split("\n");
    const newLines = lines.map((line) => {
      return line.replace(/^(• |\d+\. )/, "");
    });
    setText(newLines.join("\n"));
    setIsListMode(false);
  };

  const editorStyle = {
    fontFamily: formatting.fontFamily,
    fontSize: `${formatting.fontSize}px`,
    fontWeight: formatting.fontWeight,
    fontStyle: formatting.fontStyle,
    textDecoration: formatting.textDecoration,
    textAlign: formatting.textAlign as any,
    color: formatting.color,
    backgroundColor: formatting.backgroundColor,
    lineHeight: formatting.lineHeight,
    letterSpacing: `${formatting.letterSpacing}px`,
  };

  return (
    <div
      ref={editorRef}
      className={`bg-white border border-gray-300 rounded-lg shadow-lg ${className}`}
      style={position ? { position: "absolute", left: position.x, top: position.y } : {}}
    >
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Text Editor</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFormatting(!showFormatting)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Format
            </button>
            <button onClick={handleCancel} className="p-1 hover:bg-gray-100 rounded transition-colors" title="Cancel">
              <XMarkIcon className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Quick formatting buttons */}
        <div className="flex items-center space-x-1 mb-3">
          <button
            onClick={toggleBold}
            className={`p-2 rounded transition-colors ${
              formatting.fontWeight === "bold" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"
            }`}
            title="Bold"
          >
            <BoldIcon className="w-4 h-4" />
          </button>
          <button
            onClick={toggleItalic}
            className={`p-2 rounded transition-colors ${
              formatting.fontStyle === "italic" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"
            }`}
            title="Italic"
          >
            <ItalicIcon className="w-4 h-4" />
          </button>
          <button
            onClick={toggleUnderline}
            className={`p-2 rounded transition-colors ${
              formatting.textDecoration === "underline"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            onClick={toggleStrikethrough}
            className={`p-2 rounded transition-colors ${
              formatting.textDecoration === "line-through"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            title="Strikethrough"
          >
            <StrikethroughIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Alignment buttons */}
          <button
            onClick={() => handleFormatChange("textAlign", "left")}
            className={`p-2 rounded transition-colors ${
              formatting.textAlign === "left" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"
            }`}
            title="Align Left"
          >
            <Bars3BottomLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormatChange("textAlign", "center")}
            className={`p-2 rounded transition-colors ${
              formatting.textAlign === "center" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"
            }`}
            title="Align Center"
          >
            <Bars3Icon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFormatChange("textAlign", "right")}
            className={`p-2 rounded transition-colors ${
              formatting.textAlign === "right" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"
            }`}
            title="Align Right"
          >
            <Bars3BottomRightIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* List buttons */}
          <button
            onClick={() => {
              setListType("bullet");
              isListMode ? removeList() : insertList();
            }}
            className={`p-2 rounded transition-colors ${
              isListMode && listType === "bullet" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"
            }`}
            title="Bullet List"
          >
            <ListBulletIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setListType("numbered");
              isListMode ? removeList() : insertList();
            }}
            className={`p-2 rounded transition-colors ${
              isListMode && listType === "numbered" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"
            }`}
            title="Numbered List"
          >
            <NumberedListIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Advanced formatting panel */}
        {showFormatting && (
          <div className="border-t border-gray-200 pt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Font Family</label>
                <select
                  value={formatting.fontFamily}
                  onChange={(e) => handleFormatChange("fontFamily", e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {fontFamilies.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
                <select
                  value={formatting.fontSize}
                  onChange={(e) => handleFormatChange("fontSize", Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {fontSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}px
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Text Color</label>
                <input
                  type="color"
                  value={formatting.color}
                  onChange={(e) => handleFormatChange("color", e.target.value)}
                  className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Background</label>
                <input
                  type="color"
                  value={formatting.backgroundColor === "transparent" ? "#ffffff" : formatting.backgroundColor}
                  onChange={(e) => handleFormatChange("backgroundColor", e.target.value)}
                  className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Line Height: {formatting.lineHeight}
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={formatting.lineHeight}
                  onChange={(e) => handleFormatChange("lineHeight", Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Letter Spacing: {formatting.letterSpacing}px
                </label>
                <input
                  type="range"
                  min="-2"
                  max="5"
                  step="0.5"
                  value={formatting.letterSpacing}
                  onChange={(e) => handleFormatChange("letterSpacing", Number(e.target.value))}
                  className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Text area */}
      <div className="p-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder="Start typing..."
          className="w-full min-h-[120px] resize-none border-none outline-none"
          style={editorStyle}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-3 flex items-center justify-between">
        <div className="text-xs text-gray-500">{text.length} characters</div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center space-x-1"
          >
            <CheckIcon className="w-3 h-3" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for managing text editing state
export function useTextEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const [editPosition, setEditPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [editText, setEditText] = useState("");

  const startEditing = (text: string, position: { x: number; y: number }) => {
    setEditText(text);
    setEditPosition(position);
    setIsEditing(true);
  };

  const stopEditing = () => {
    setIsEditing(false);
    setEditPosition(null);
    setEditText("");
  };

  return {
    isEditing,
    editPosition,
    editText,
    startEditing,
    stopEditing,
  };
}
