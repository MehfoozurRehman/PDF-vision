// Translation system for the PDF Vision application

export interface Translations {
  // Navigation and UI
  welcome: string;
  openFile: string;
  newFile: string;
  recentFiles: string;
  home: string;
  about: string;
  general: string;
  display: string;
  security: string;
  advanced: string;

  // Toolbar
  file: string;
  edit: string;
  view: string;
  tools: string;
  help: string;

  // PDF Viewer
  page: string;
  of: string;
  zoom: string;
  tool: string;
  annotations: string;
  modified: string;

  // Tools
  select: string;
  hand: string;
  text: string;
  highlight: string;
  note: string;
  drawing: string;
  signature: string;

  // Settings
  settings: string;
  theme: string;
  light: string;
  dark: string;
  auto: string;
  language: string;
  application: string;
  defaultSettings: string;
  interface: string;
  editing: string;

  // Settings Options
  autoSave: string;
  autoBackup: string;
  defaultZoom: string;
  defaultPageLayout: string;
  showToolbarLabels: string;
  compactSidebar: string;
  uiScale: string;
  defaultHighlightColor: string;

  // Actions
  save: string;
  cancel: string;
  apply: string;
  close: string;
  print: string;
  share: string;
  export: string;
  delete: string;
  open: string;

  // PDF related
  openPDF: string;
  newDocument: string;

  // UI elements
  darkMode: string;
  lightMode: string;
  selectLanguage: string;
  chooseLanguage: string;
  autoSaveDescription: string;
  autoBackupDescription: string;
  checkUpdates: string;
  checkUpdatesDescription: string;

  // Messages
  noDocumentSelected: string;
  documentLoaded: string;
  documentSaved: string;
  errorLoadingDocument: string;
  noDocuments: string;
  loading: string;
  error: string;

  // Additional UI
  welcomeDescription: string;
  dropPDFHere: string;
  releaseToOpen: string;
  dragDropDescription: string;
  browseFiles: string;
  createNewDescription: string;
  recent: string;
}

export const translations: Record<string, Translations> = {
  en: {
    // Navigation and UI
    welcome: "Welcome to PDF Vision",
    openFile: "Open File",
    newFile: "New File",
    recentFiles: "Recent Files",
    home: "Home",
    about: "About",
    general: "General",
    display: "Display",
    security: "Security",
    advanced: "Advanced",

    // Toolbar
    file: "File",
    edit: "Edit",
    view: "View",
    tools: "Tools",
    help: "Help",

    // PDF Viewer
    page: "Page",
    of: "of",
    zoom: "Zoom",
    tool: "Tool",
    annotations: "Annotations",
    modified: "Modified",

    // Tools
    select: "Select",
    hand: "Hand",
    text: "Text",
    highlight: "Highlight",
    note: "Note",
    drawing: "Drawing",
    signature: "Signature",

    // Settings
    settings: "Settings",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    auto: "Auto",
    language: "Language",
    application: "Application",
    defaultSettings: "Default Settings",
    interface: "Interface",
    editing: "Editing",

    // Settings Options
    autoSave: "Auto-save documents",
    autoBackup: "Auto-backup documents",
    defaultZoom: "Default zoom level",
    defaultPageLayout: "Default page layout",
    showToolbarLabels: "Show toolbar labels",
    compactSidebar: "Compact sidebar",
    uiScale: "UI scale",
    defaultHighlightColor: "Default highlight color",

    // Actions
    save: "Save",
    cancel: "Cancel",
    apply: "Apply",
    close: "Close",
    print: "Print",
    share: "Share",
    export: "Export",
    delete: "Delete",
    open: "Open",

    // PDF related
    openPDF: "Open PDF",
    newDocument: "New Document",

    // UI elements
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    selectLanguage: "Select Language",
    chooseLanguage: "Choose your preferred language",
    autoSaveDescription: "Automatically save changes every 5 minutes",
    autoBackupDescription: "Create automatic backups of documents",
    checkUpdates: "Check for updates",
    checkUpdatesDescription: "Automatically check for application updates",

    // Messages
    noDocumentSelected: "No document selected",
    documentLoaded: "Document loaded",
    documentSaved: "Document saved",
    errorLoadingDocument: "Error loading document",
    noDocuments: "No documents",
    loading: "Loading",
    error: "Error",

    // Additional UI
    welcomeDescription:
      "Professional PDF editing made simple. Create, edit, annotate, and manage your documents with ease.",
    dropPDFHere: "Drop PDF here",
    releaseToOpen: "Release to open the file",
    dragDropDescription: "Drag and drop a PDF file here, or click to browse",
    browseFiles: "Browse Files",
    createNewDescription: "Start with a blank document and build your PDF from scratch",
    recent: "Recent",
  },

  ar: {
    // Navigation and UI
    welcome: "مرحباً بك في رؤية PDF",
    openFile: "فتح ملف",
    newFile: "ملف جديد",
    recentFiles: "الملفات الحديثة",
    home: "الرئيسية",
    about: "حول",
    general: "عام",
    display: "العرض",
    security: "الأمان",
    advanced: "متقدم",

    // Toolbar
    file: "ملف",
    edit: "تحرير",
    view: "عرض",
    tools: "أدوات",
    help: "مساعدة",

    // PDF Viewer
    page: "صفحة",
    of: "من",
    zoom: "تكبير",
    tool: "أداة",
    annotations: "التعليقات التوضيحية",
    modified: "معدل",

    // Tools
    select: "تحديد",
    hand: "يد",
    text: "نص",
    highlight: "تمييز",
    note: "ملاحظة",
    drawing: "رسم",
    signature: "توقيع",

    // Settings
    settings: "الإعدادات",
    theme: "المظهر",
    light: "فاتح",
    dark: "داكن",
    auto: "تلقائي",
    language: "اللغة",
    application: "التطبيق",
    defaultSettings: "الإعدادات الافتراضية",
    interface: "الواجهة",
    editing: "التحرير",

    // Settings Options
    autoSave: "حفظ تلقائي للمستندات",
    autoBackup: "نسخ احتياطي تلقائي للمستندات",
    defaultZoom: "مستوى التكبير الافتراضي",
    defaultPageLayout: "تخطيط الصفحة الافتراضي",
    showToolbarLabels: "إظهار تسميات شريط الأدوات",
    compactSidebar: "شريط جانبي مضغوط",
    uiScale: "مقياس الواجهة",
    defaultHighlightColor: "لون التمييز الافتراضي",

    // Actions
    save: "حفظ",
    cancel: "إلغاء",
    apply: "تطبيق",
    close: "إغلاق",
    print: "طباعة",
    share: "مشاركة",
    export: "تصدير",
    delete: "حذف",
    open: "فتح",

    // PDF related
    openPDF: "فتح PDF",
    newDocument: "مستند جديد",

    // UI elements
    darkMode: "الوضع الداكن",
    lightMode: "الوضع الفاتح",
    selectLanguage: "اختيار اللغة",
    chooseLanguage: "اختر لغتك المفضلة",
    autoSaveDescription: "حفظ التغييرات تلقائياً كل 5 دقائق",
    autoBackupDescription: "إنشاء نسخ احتياطية تلقائية للمستندات",
    checkUpdates: "فحص التحديثات",
    checkUpdatesDescription: "فحص تحديثات التطبيق تلقائياً",

    // Messages
    noDocumentSelected: "لم يتم تحديد مستند",
    documentLoaded: "تم تحميل المستند",
    documentSaved: "تم حفظ المستند",
    errorLoadingDocument: "خطأ في تحميل المستند",
    noDocuments: "لا توجد مستندات",
    loading: "جاري التحميل",
    error: "خطأ",

    // Additional UI
    welcomeDescription: "تحرير ملفات PDF الاحترافي أصبح بسيطاً. أنشئ وحرر وأضف التعليقات وأدر مستنداتك بسهولة.",
    dropPDFHere: "اسقط ملف PDF هنا",
    releaseToOpen: "اتركه لفتح الملف",
    dragDropDescription: "اسحب وأسقط ملف PDF هنا، أو انقر للتصفح",
    browseFiles: "تصفح الملفات",
    createNewDescription: "ابدأ بمستند فارغ وأنشئ ملف PDF من الصفر",
    recent: "حديث",
  },
};

export function getTranslation(language: string): Translations {
  return translations[language] || translations.en;
}

export function t(key: keyof Translations, language: string): string {
  const translation = getTranslation(language);
  return translation[key] || translations.en[key] || key;
}
