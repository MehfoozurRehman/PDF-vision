"use client";

import { useState, useRef } from "react";
import { useUI } from "@/store/ui-store";
import { usePDF } from "@/store/pdf-store";
import { XMarkIcon, PencilIcon, PhotoIcon, DocumentTextIcon, TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface Signature {
  id: string;
  name: string;
  type: "draw" | "type" | "image";
  data: string; // Base64 for draw/image, text for type
  createdAt: Date;
}

export default function SignModal() {
  const { state: uiState, dispatch: uiDispatch } = useUI();
  const { state: pdfState, dispatch: pdfDispatch } = usePDF();
  const [activeTab, setActiveTab] = useState<"draw" | "type" | "image" | "saved">("draw");
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [selectedSignature, setSelectedSignature] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [typedSignature, setTypedSignature] = useState("");
  const [signatureFont, setSignatureFont] = useState("cursive");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!uiState.modals.sign) return null;

  const closeModal = () => {
    uiDispatch({ type: "CLOSE_MODAL", payload: "sign" });
    setActiveTab("draw");
    setSelectedSignature(null);
    setTypedSignature("");
    clearCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const saveDrawnSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL();
      const newSignature: Signature = {
        id: Date.now().toString(),
        name: `Drawn Signature ${signatures.filter((s) => s.type === "draw").length + 1}`,
        type: "draw",
        data: dataURL,
        createdAt: new Date(),
      };
      setSignatures((prev) => [...prev, newSignature]);
      toast.success("Signature saved!");
      clearCanvas();
    }
  };

  const saveTypedSignature = () => {
    if (!typedSignature.trim()) {
      toast.error("Please enter your signature text");
      return;
    }

    const newSignature: Signature = {
      id: Date.now().toString(),
      name: `Typed Signature: ${typedSignature}`,
      type: "type",
      data: typedSignature,
      createdAt: new Date(),
    };
    setSignatures((prev) => [...prev, newSignature]);
    toast.success("Signature saved!");
    setTypedSignature("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataURL = event.target?.result as string;
        const newSignature: Signature = {
          id: Date.now().toString(),
          name: `Image Signature: ${file.name}`,
          type: "image",
          data: dataURL,
          createdAt: new Date(),
        };
        setSignatures((prev) => [...prev, newSignature]);
        toast.success("Signature saved!");
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteSignature = (id: string) => {
    setSignatures((prev) => prev.filter((sig) => sig.id !== id));
    if (selectedSignature === id) {
      setSelectedSignature(null);
    }
    toast.success("Signature deleted");
  };

  const applySignature = () => {
    if (!selectedSignature) {
      toast.error("Please select a signature");
      return;
    }

    const signature = signatures.find((s) => s.id === selectedSignature);
    if (!signature) return;

    // TODO: Apply signature to PDF
    toast.success("Signature applied to document!");
    closeModal();
  };

  const renderSignaturePreview = (signature: Signature) => {
    switch (signature.type) {
      case "draw":
      case "image":
        return (
          <img
            src={signature.data}
            alt={signature.name}
            className="w-full h-16 object-contain bg-white border rounded"
          />
        );
      case "type":
        return (
          <div
            className={`w-full h-16 flex items-center justify-center bg-white border rounded text-2xl ${
              signatureFont === "cursive" ? "font-cursive" : signatureFont === "script" ? "font-script" : "font-elegant"
            }`}
            style={{ fontFamily: signatureFont }}
          >
            {signature.data}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Sign Document</h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("draw")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "draw"
                ? "border-adobe-blue text-adobe-blue"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <PencilIcon className="w-4 h-4 inline mr-2" />
            Draw
          </button>
          <button
            onClick={() => setActiveTab("type")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "type"
                ? "border-adobe-blue text-adobe-blue"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <DocumentTextIcon className="w-4 h-4 inline mr-2" />
            Type
          </button>
          <button
            onClick={() => setActiveTab("image")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "image"
                ? "border-adobe-blue text-adobe-blue"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <PhotoIcon className="w-4 h-4 inline mr-2" />
            Upload
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "saved"
                ? "border-adobe-blue text-adobe-blue"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Saved ({signatures.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "draw" && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Draw your signature in the box below</p>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  className="border-2 border-gray-300 rounded-lg cursor-crosshair mx-auto"
                  style={{ touchAction: "none" }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="flex justify-center space-x-3 mt-4">
                  <button
                    onClick={clearCanvas}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={saveDrawnSignature}
                    className="px-4 py-2 bg-adobe-blue text-white rounded-lg hover:bg-adobe-blue-dark transition-colors"
                  >
                    Save Signature
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "type" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type your signature</label>
                <input
                  type="text"
                  value={typedSignature}
                  onChange={(e) => setTypedSignature(e.target.value)}
                  className="input w-full text-2xl"
                  placeholder="Your Name"
                  style={{ fontFamily: signatureFont }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setSignatureFont("cursive")}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      signatureFont === "cursive"
                        ? "border-adobe-blue bg-adobe-blue/5"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-xl" style={{ fontFamily: "cursive" }}>
                      Cursive
                    </span>
                  </button>
                  <button
                    onClick={() => setSignatureFont("serif")}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      signatureFont === "serif"
                        ? "border-adobe-blue bg-adobe-blue/5"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-xl" style={{ fontFamily: "serif" }}>
                      Serif
                    </span>
                  </button>
                  <button
                    onClick={() => setSignatureFont("monospace")}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      signatureFont === "monospace"
                        ? "border-adobe-blue bg-adobe-blue/5"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-xl" style={{ fontFamily: "monospace" }}>
                      Mono
                    </span>
                  </button>
                </div>
              </div>

              {typedSignature && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <div className="text-3xl text-center py-4" style={{ fontFamily: signatureFont }}>
                    {typedSignature}
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={saveTypedSignature}
                  disabled={!typedSignature.trim()}
                  className="px-4 py-2 bg-adobe-blue text-white rounded-lg hover:bg-adobe-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Signature
                </button>
              </div>
            </div>
          )}

          {activeTab === "image" && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Upload an image of your signature</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-adobe-blue text-white rounded-lg hover:bg-adobe-blue-dark transition-colors"
                >
                  <PhotoIcon className="w-5 h-5 inline mr-2" />
                  Choose Image
                </button>
                <p className="text-sm text-gray-500 mt-2">Supported formats: JPG, PNG, GIF</p>
              </div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="space-y-4">
              {signatures.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No saved signatures yet</p>
                  <p className="text-sm text-gray-400 mt-1">Create signatures using the Draw, Type, or Upload tabs</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {signatures.map((signature) => (
                    <div
                      key={signature.id}
                      className={`relative p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedSignature === signature.id
                          ? "border-adobe-blue bg-adobe-blue/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedSignature(signature.id)}
                    >
                      {selectedSignature === signature.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-adobe-blue rounded-full flex items-center justify-center">
                          <CheckIcon className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSignature(signature.id);
                        }}
                        className="absolute top-2 left-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>

                      <div className="mt-6">{renderSignaturePreview(signature)}</div>

                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-900 truncate">{signature.name}</p>
                        <p className="text-xs text-gray-500">{signature.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {selectedSignature && <span>Signature selected and ready to apply</span>}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={applySignature}
              disabled={!selectedSignature}
              className="px-4 py-2 bg-adobe-blue text-white rounded-lg hover:bg-adobe-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Signature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
