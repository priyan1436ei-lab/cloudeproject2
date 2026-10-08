"use client";

import React, { useState } from "react";
import { Exchange, ResourceItem } from "@/types";
import { useExchange } from "@/context/ExchangeContext";
import { X, UploadCloud, CheckCircle2 } from "lucide-react";

interface UploadResourceModalProps {
  exchange: Exchange;
  isOpen: boolean;
  onClose: () => void;
}

export function UploadResourceModal({
  exchange,
  isOpen,
  onClose,
}: UploadResourceModalProps) {
  const { currentUser, uploadResource } = useExchange();

  const [name, setName] = useState("");
  const [fileType, setFileType] = useState<ResourceItem["fileType"]>("pdf");
  const [description, setDescription] = useState("");
  const [fileSize, setFileSize] = useState("2.5 MB");
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsUploading(true);

    await uploadResource(exchange.id, {
      exchangeId: exchange.id,
      name: name.endsWith(`.${fileType}`) ? name : `${name}.${fileType}`,
      uploadedBy: {
        id: currentUser.id,
        name: currentUser.name,
      },
      fileType,
      fileSize,
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      description,
    });

    setIsUploading(false);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Upload Learning Resource
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Shared to Firebase Storage for this exchange
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Resource stored to cloud storage! Notification dispatched.</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Resource / Document Name
            </label>
            <input
              type="text"
              placeholder="e.g. Modern_Python_Async_Cheatsheet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Format / Type
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as ResourceItem["fileType"])}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
              >
                <option value="pdf">PDF Document</option>
                <option value="zip">ZIP Archive</option>
                <option value="doc">Word / DOC</option>
                <option value="ppt">PowerPoint / PPT</option>
                <option value="image">Image Diagram</option>
                <option value="code">Code Snippet</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Simulated File Size
              </label>
              <select
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
              >
                <option value="1.2 MB">1.2 MB</option>
                <option value="3.5 MB">3.5 MB</option>
                <option value="8.0 MB">8.0 MB</option>
                <option value="15.4 MB">15.4 MB</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description & Notes for Peer
            </label>
            <textarea
              rows={2}
              placeholder="What this document contains, chapters, or homework practice..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
            />
          </div>

          {/* Cloud Storage Drop Zone Visual */}
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-5 text-center bg-slate-50/50 dark:bg-slate-800/30">
            <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Drag and drop any PDF, DOC, PPT, or ZIP here
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Protected by Firebase Storage Security Rules (Max 25MB)
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 disabled:opacity-50"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              {isUploading ? "Uploading to Cloud..." : "Upload Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
