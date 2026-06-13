"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CloudUpload, X } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileEntry {
  file: File;
  preview: string | null;
}

interface MultiFileDropInputProps {
  id?: string;
  name: string;
  label: string;
  accept?: string;
  helperText?: string;
  maxFiles?: number;
  maxBytes?: number;
  resetSignal?: number | string;
  className?: string;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;

  const tokens = accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  if (tokens.length === 0) return true;

  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  return tokens.some((token) => {
    if (token.endsWith("/*")) return fileType.startsWith(token.slice(0, -1));
    if (token.startsWith(".")) return fileName.endsWith(token);
    return fileType === token;
  });
}

export function MultiFileDropInput({
  id,
  name,
  label,
  accept,
  helperText,
  maxFiles = 10,
  maxBytes,
  resetSignal,
  className,
}: MultiFileDropInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<string[]>([]);
  const allPreviewsRef = useRef<string[]>([]);

  // Cleanup all object URLs on unmount
  useEffect(() => {
    return () => {
      allPreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Keep the hidden file input in sync with entries after every render
  useEffect(() => {
    if (!inputRef.current) return;
    const dt = new DataTransfer();
    entries.forEach((e) => dt.items.add(e.file));
    inputRef.current.files = dt.files;
  }, [entries]);

  // Reset when resetSignal changes
  useEffect(() => {
    if (resetSignal === undefined) return;
    allPreviewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    allPreviewsRef.current = [];
    setEntries([]);
    setRejectedFiles([]);
    if (inputRef.current) {
      inputRef.current.files = new DataTransfer().files;
      inputRef.current.value = "";
    }
  }, [resetSignal]);

  const addFiles = (files: FileList | File[]) => {
    const valid: File[] = [];
    const rejected: string[] = [];

    for (const file of files) {
      if (!matchesAccept(file, accept)) {
        rejected.push(`${file.name}: format tidak didukung`);
      } else if (maxBytes !== undefined && file.size > maxBytes) {
        rejected.push(`${file.name}: ukuran melebihi ${(maxBytes / 1024 / 1024).toFixed(0)}MB`);
      } else {
        valid.push(file);
      }
    }

    if (rejected.length > 0) setRejectedFiles(rejected);

    setEntries((prev) => {
      const capacity = maxFiles - prev.length;
      const toAdd = valid.slice(0, capacity);
      const newEntries = toAdd.map((file) => {
        const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
        if (preview) allPreviewsRef.current.push(preview);
        return { file, preview };
      });
      return [...prev, ...newEntries];
    });
  };

  const removeFile = (index: number) => {
    setEntries((prev) => {
      const entry = prev[index];
      if (entry.preview) {
        URL.revokeObjectURL(entry.preview);
        allPreviewsRef.current = allPreviewsRef.current.filter((u) => u !== entry.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const remaining = maxFiles - entries.length;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={inputId}>{label}</Label>
      <input
        ref={inputRef}
        id={inputId}
        name={`${name}[]`}
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
        }}
      />

      {remaining > 0 && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => {
            e.preventDefault();
            if (e.currentTarget === e.target) setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-4 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/40 hover:bg-muted/20",
          )}
        >
          <CloudUpload
            size={20}
            className={cn("transition-colors", isDragging ? "text-primary" : "text-muted-foreground")}
          />
          <p className="text-sm text-muted-foreground">
            Drop atau klik untuk upload
            {entries.length > 0 && ` (${remaining} slot tersisa)`}
          </p>
          {helperText && (
            <p className="text-xs text-muted-foreground/60">{helperText}</p>
          )}
        </div>
      )}

      {entries.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {entries.map((entry, index) => (
            <div
              key={`${entry.file.name}-${index}`}
              className="group relative overflow-hidden rounded-lg border border-border bg-muted"
            >
              {entry.preview ? (
                <img
                  src={entry.preview}
                  alt={entry.file.name}
                  className="h-20 w-full object-cover"
                />
              ) : (
                <div className="flex h-20 items-center justify-center">
                  <p className="truncate px-2 text-xs text-muted-foreground">{entry.file.name}</p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1">
                <p className="truncate text-xs text-white/80">{entry.file.name}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                aria-label={`Remove ${entry.file.name}`}
              >
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {rejectedFiles.length > 0 && (
        <div className="space-y-1">
          {rejectedFiles.map((msg) => (
            <p key={msg} className="text-xs text-destructive">{msg}</p>
          ))}
        </div>
      )}
    </div>
  );
}
