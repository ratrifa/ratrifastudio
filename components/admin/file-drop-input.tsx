"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CloudUpload, X } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FileDropInputProps {
  id?: string;
  name: string;
  label: string;
  accept?: string;
  helperText?: string;
  className?: string;
  maxBytes?: number;
  /** Existing image URL to show as background when no new file is selected */
  currentImageUrl?: string | null;
  /** Reduces drop zone height to min-h-16 — use for logos or secondary uploads */
  compact?: boolean;
  /** CSS aspect-ratio value (e.g. "4/5") — overrides min-h; use when upload should preview at a fixed ratio */
  aspectRatio?: string;
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

export function FileDropInput({
  id,
  name,
  label,
  accept,
  helperText,
  className,
  maxBytes,
  currentImageUrl,
  compact = false,
  aspectRatio,
}: FileDropInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const prevPreviewRef = useRef<string | null>(null);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (prevPreviewRef.current) URL.revokeObjectURL(prevPreviewRef.current);
    };
  }, []);

  const setFilePreview = (file: File | null) => {
    if (prevPreviewRef.current) {
      URL.revokeObjectURL(prevPreviewRef.current);
      prevPreviewRef.current = null;
    }
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      prevPreviewRef.current = url;
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const applyFile = (file: File) => {
    if (!inputRef.current) return;

    setError(null);

    if (!matchesAccept(file, accept)) {
      setError("Format file tidak sesuai");
      return;
    }

    if (maxBytes !== undefined && file.size > maxBytes) {
      setError(`File terlalu besar (maks ${(maxBytes / 1024 / 1024).toFixed(0)}MB)`);
      return;
    }

    const dt = new DataTransfer();
    dt.items.add(file);
    inputRef.current.files = dt.files;
    inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    setSelectedFile(file);
    setFilePreview(file);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!inputRef.current) return;
    inputRef.current.value = "";
    setSelectedFile(null);
    setFilePreview(null);
    setError(null);
  };

  // Decide what preview to show in the drop zone
  const displayUrl = previewUrl ?? currentImageUrl ?? null;
  const hasFile = !!selectedFile;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={inputId}>{label}</Label>
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) { setSelectedFile(null); setFilePreview(null); return; }
          if (maxBytes !== undefined && file.size > maxBytes) {
            setError(`File terlalu besar (maks ${(maxBytes / 1024 / 1024).toFixed(0)}MB)`);
            e.target.value = "";
            return;
          }
          setError(null);
          setSelectedFile(file);
          setFilePreview(file);
        }}
      />

      <div
        className={cn(aspectRatio ? "relative w-full overflow-hidden rounded-lg" : "contents")}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
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
          const file = e.dataTransfer.files?.[0];
          if (file) applyFile(file);
        }}
        className={cn(
          "relative flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed transition-colors",
          aspectRatio ? "absolute inset-0" : compact ? "min-h-16" : "min-h-32",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border hover:border-primary/40 hover:bg-muted/20",
        )}
      >
        {displayUrl ? (
          /* Preview state */
          <>
            <img
              src={displayUrl}
              alt="Preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 flex flex-col items-center gap-1 text-center text-white px-3">
              <CloudUpload size={compact ? 14 : 18} />
              <p className={cn("font-medium", compact ? "text-[11px]" : "text-xs")}>
                {hasFile ? selectedFile!.name : "Klik atau drop untuk ganti"}
              </p>
            </div>
            {hasFile && (
              <button
                type="button"
                onClick={clearFile}
                className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                aria-label="Clear selection"
              >
                <X size={12} />
              </button>
            )}
          </>
        ) : (
          /* Empty state */
          <div className={cn("flex flex-col items-center text-center", compact ? "gap-1 px-3 py-2" : "gap-2 px-4 py-5")}>
            <CloudUpload
              size={compact ? 16 : 22}
              className={cn(
                "transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground",
              )}
            />
            <p className={cn("text-muted-foreground", compact ? "text-xs" : "text-sm")}>
              Drop atau klik untuk upload
            </p>
            {helperText && (
              <p className="text-xs text-muted-foreground/60">{helperText}</p>
            )}
          </div>
        )}
      </div>

      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
