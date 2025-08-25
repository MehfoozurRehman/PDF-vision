import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import React from "react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose?: (id: string) => void;
  className?: string;
}

const Toast: React.FC<ToastProps> = ({ id, title, message, type = "info", onClose, className }) => {
  const handleClose = () => {
    if (onClose) {
      onClose(id);
    }
  };

  const typeConfig = {
    success: {
      icon: CheckCircleIcon,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      titleColor: "text-green-900",
      messageColor: "text-green-700",
    },
    error: {
      icon: XCircleIcon,
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      titleColor: "text-red-900",
      messageColor: "text-red-700",
    },
    warning: {
      icon: ExclamationTriangleIcon,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-600",
      titleColor: "text-yellow-900",
      messageColor: "text-yellow-700",
    },
    info: {
      icon: InformationCircleIcon,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      titleColor: "text-blue-900",
      messageColor: "text-blue-700",
    },
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        "relative flex items-start p-4 border rounded-lg shadow-lg backdrop-blur-sm",
        "transform transition-all duration-300 ease-in-out",
        "animate-in slide-in-from-right-full",
        config.bgColor,
        config.borderColor,
        className,
      )}
      role="alert"
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <IconComponent className={cn("w-5 h-5", config.iconColor)} />
      </div>

      {/* Content */}
      <div className="ml-3 flex-1">
        {title && <h4 className={cn("text-sm font-medium", config.titleColor)}>{title}</h4>}
        <p className={cn("text-sm", title ? "mt-1" : "", config.messageColor)}>{message}</p>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={handleClose}
          className={cn(
            "ml-4 flex-shrink-0 p-1 rounded-md transition-colors duration-200",
            "hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
          )}
          aria-label="Close notification"
        >
          <XMarkIcon className="w-4 h-4 text-neutral-400" />
        </button>
      )}
    </div>
  );
};

export default Toast;
