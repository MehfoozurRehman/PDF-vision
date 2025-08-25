"use client";

import { useUI } from "@/store/ui-store";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AboutModal() {
  const { state: uiState, dispatch: uiDispatch } = useUI();

  if (!uiState.modals.about) return null;

  const closeModal = () => {
    uiDispatch({ type: "CLOSE_MODAL", payload: "about" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">About PDF Vision</h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* App Logo/Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-adobe-blue rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-white">PV</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">PDF Vision</h3>
            <p className="text-sm text-gray-600">Professional PDF Editor</p>
          </div>

          {/* Version Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Version:</span>
                <p className="text-gray-600">1.0.0</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Build:</span>
                <p className="text-gray-600">2024.01.001</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Platform:</span>
                <p className="text-gray-600">Windows</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Architecture:</span>
                <p className="text-gray-600">x64</p>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Company Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium text-gray-900">MF Visions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Website:</span>
                  <a
                    href="https://MFvisions.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-adobe-blue hover:text-adobe-blue-dark transition-colors"
                  >
                    MFvisions.com
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Founder:</span>
                  <span className="font-medium text-gray-900">Mohammad Fahad Alghammas</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Complete PDF viewing and editing</li>
                <li>• Digital signature support</li>
                <li>• Annotation and markup tools</li>
                <li>• Form creation and filling</li>
                <li>• Document merging and splitting</li>
                <li>• Offline functionality</li>
              </ul>
            </div>

            {/* Copyright */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">© 2024 MF Visions. All rights reserved.</p>
              <p className="text-xs text-gray-500 text-center mt-1">Developed by Mohammad Fahad Alghammas</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-adobe-blue text-white rounded-lg hover:bg-adobe-blue-dark transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
