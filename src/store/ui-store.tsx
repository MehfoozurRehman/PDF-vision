"use client";

import { ReactNode, createContext, useContext, useReducer } from "react";

// Types
export interface UIState {
  sidebarOpen: boolean;
  sidebarTab: "thumbnails" | "bookmarks" | "annotations" | "layers" | "attachments";
  toolbarVisible: boolean;
  activeTool:
    | "select"
    | "hand"
    | "text"
    | "highlight"
    | "note"
    | "drawing"
    | "signature"
    | "image"
    | "link"
    | "fit"
    | "pen";
  showGrid: boolean;
  showRulers: boolean;
  showAllToolsMenu: boolean;
  viewMode: "minimal" | "hover" | "expanded";
  theme: "light" | "dark" | "auto";
  language: string;
  recentColors: string[];
  shortcuts: Record<string, string>;
  preferences: {
    autoSave: boolean;
    autoBackup: boolean;
    defaultZoom: number;
    pageLayout: "single" | "continuous" | "facing";
    scrollDirection: "vertical" | "horizontal";
    showToolbarLabels: boolean;
    compactSidebar: boolean;
    uiScale: number;
    defaultHighlightColor: string;
  };
  modals: {
    about: boolean;
    settings: boolean;
    help: boolean;
    merge: boolean;
    split: boolean;
    sign: boolean;
    export: boolean;
    search: boolean;
    bates: boolean;
    create: boolean;
    stickyNotes: boolean;
    textMarkup: boolean;
    drawingTools: boolean;
    stamps: boolean;
    sharedReview: boolean;
    certificates: boolean;
    passwordProtection: boolean;
    redaction: boolean;
    ocr: boolean;
    optimize: boolean;
    compare: boolean;
    multimedia: boolean;
    measurement: boolean;
    javascript: boolean;
    aiAssist: boolean;
    cloudStorage: boolean;
    pageOrganization: boolean;
  };
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: "primary" | "secondary";
}

// Actions
type UIAction =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_SIDEBAR_OPEN"; payload: boolean }
  | { type: "SET_SIDEBAR_TAB"; payload: UIState["sidebarTab"] }
  | { type: "SET_TOOLBAR_VISIBLE"; payload: boolean }
  | { type: "SET_ACTIVE_TOOL"; payload: UIState["activeTool"] }
  | { type: "TOGGLE_GRID" }
  | { type: "TOGGLE_RULERS" }
  | { type: "SET_ALL_TOOLS_MENU"; payload: boolean }
  | { type: "SET_VIEW_MODE"; payload: UIState["viewMode"] }
  | { type: "TOGGLE_VIEW_MODE" }
  | { type: "SET_THEME"; payload: UIState["theme"] }
  | { type: "SET_LANGUAGE"; payload: string }
  | { type: "ADD_RECENT_COLOR"; payload: string }
  | { type: "UPDATE_PREFERENCES"; payload: Partial<UIState["preferences"]> }
  | { type: "OPEN_MODAL"; payload: keyof UIState["modals"] }
  | { type: "CLOSE_MODAL"; payload: keyof UIState["modals"] }
  | { type: "CLOSE_ALL_MODALS" }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "CLEAR_NOTIFICATIONS" };

// Initial state
const initialState: UIState = {
  sidebarOpen: true,
  sidebarTab: "thumbnails",
  toolbarVisible: true,
  activeTool: "select",
  showGrid: false,
  showRulers: false,
  showAllToolsMenu: false,
  viewMode: "minimal",
  theme: "light",
  language: "en",
  recentColors: ["#ffeb3b", "#4caf50", "#2196f3", "#f44336", "#9c27b0"],
  shortcuts: {
    "ctrl+o": "open",
    "ctrl+s": "save",
    "ctrl+n": "new",
    "ctrl+z": "undo",
    "ctrl+y": "redo",
    "ctrl+c": "copy",
    "ctrl+v": "paste",
    "ctrl+a": "selectAll",
    "ctrl+f": "find",
    "ctrl+g": "findNext",
    escape: "deselect",
  },
  preferences: {
    autoSave: true,
    autoBackup: true,
    defaultZoom: 100,
    pageLayout: "continuous",
    scrollDirection: "vertical",
    showToolbarLabels: true,
    compactSidebar: false,
    uiScale: 100,
    defaultHighlightColor: "#fbbf24",
  },
  modals: {
    about: false,
    settings: false,
    help: false,
    merge: false,
    split: false,
    sign: false,
    export: false,
    search: false,
    bates: false,
    create: false,
    stickyNotes: false,
    textMarkup: false,
    drawingTools: false,
    stamps: false,
    sharedReview: false,
    certificates: false,
    passwordProtection: false,
    redaction: false,
    ocr: false,
    optimize: false,
    compare: false,
    multimedia: false,
    measurement: false,
    javascript: false,
    aiAssist: false,
    cloudStorage: false,
    pageOrganization: false,
  },
  notifications: [],
};

// Reducer
function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };

    case "SET_SIDEBAR_OPEN":
      return { ...state, sidebarOpen: action.payload };

    case "SET_SIDEBAR_TAB":
      return { ...state, sidebarTab: action.payload };

    case "SET_TOOLBAR_VISIBLE":
      return { ...state, toolbarVisible: action.payload };

    case "SET_ACTIVE_TOOL":
      return { ...state, activeTool: action.payload };

    case "TOGGLE_GRID":
      return { ...state, showGrid: !state.showGrid };

    case "TOGGLE_RULERS":
      return { ...state, showRulers: !state.showRulers };

    case "SET_ALL_TOOLS_MENU":
      return { ...state, showAllToolsMenu: action.payload };

    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };

    case "TOGGLE_VIEW_MODE":
      const viewModes: UIState["viewMode"][] = ["minimal", "hover", "expanded"];
      const currentIndex = viewModes.indexOf(state.viewMode);
      const nextIndex = (currentIndex + 1) % viewModes.length;
      return { ...state, viewMode: viewModes[nextIndex] };

    case "SET_THEME":
      return { ...state, theme: action.payload };

    case "SET_LANGUAGE":
      return { ...state, language: action.payload };

    case "ADD_RECENT_COLOR":
      const newColors = [action.payload, ...state.recentColors.filter((c) => c !== action.payload)].slice(0, 10);
      return { ...state, recentColors: newColors };

    case "UPDATE_PREFERENCES":
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };

    case "OPEN_MODAL":
      return {
        ...state,
        modals: { ...state.modals, [action.payload]: true },
      };

    case "CLOSE_MODAL":
      return {
        ...state,
        modals: { ...state.modals, [action.payload]: false },
      };

    case "CLOSE_ALL_MODALS":
      return {
        ...state,
        modals: Object.keys(state.modals).reduce((acc, key) => ({ ...acc, [key]: false }), {} as UIState["modals"]),
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };

    case "CLEAR_NOTIFICATIONS":
      return { ...state, notifications: [] };

    default:
      return state;
  }
}

// Context
const UIContext = createContext<{
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
} | null>(null);

// Provider
export function UIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  return <UIContext.Provider value={{ state, dispatch }}>{children}</UIContext.Provider>;
}

// Hook
export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }

  const { state, dispatch } = context;

  return {
    state,
    dispatch,
    // Helper functions
    showAllToolsMenu: state.showAllToolsMenu,
    setShowAllToolsMenu: (show: boolean) => dispatch({ type: "SET_ALL_TOOLS_MENU", payload: show }),
  };
}
